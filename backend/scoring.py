import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

SOURCE_WEIGHT = {"official": 40, "citizen": 15}
BASELINE_SCORE = 20  # An unverified single report starts with baseline confidence


def classify_stance(new_text: str, existing_text: str) -> str:
    """
    Classifies whether an existing report SUPPORTS, CONTRADICTS, or is
    UNRELATED to the new report. Falls back gracefully to heuristic matching
    if text generation models are unavailable.
    """
    # Deterministic fallback heuristics
    new_words = set(new_text.lower().split())
    existing_words = set(existing_text.lower().split())
    overlap = new_words.intersection(existing_words)

    # Fast word-overlap heuristic check
    if len(overlap) >= 3:
        if any(neg in existing_text.lower() for neg in ["no", "clear", "open", "fake", "denies", "safe"]):
            return "contradicts"
        return "supports"

    prompt = f"""
Compare these two statements about a possible emergency.
Statement A (new): \"{new_text}\"
Statement B (existing): \"{existing_text}\"

Does Statement B support, contradict, or is unrelated to Statement A?
Respond with ONLY one word: supports, contradicts, or unrelated.
"""
    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            temperature=0,
        )
        answer = response.choices[0].message.content.strip().lower()
        if "contradict" in answer:
            return "contradicts"
        if "support" in answer:
            return "supports"
        return "unrelated"
    except Exception as e:
        # Graceful fallback: return heuristic classification without failing
        return "supports" if len(overlap) >= 2 else "unrelated"


def calculate_confidence(new_text: str, matches: list) -> tuple:
    """
    Returns (new_score, contributions, recommended_action).
    contributions is a list of dicts the frontend displays directly in the
    evidence timeline, tagged with its source and stance.
    """
    score = BASELINE_SCORE
    contributions = []

    for match in matches:
        source = match["metadata"].get("source", "citizen")
        existing_text = match["metadata"].get("text", "")
        stance = classify_stance(new_text, existing_text)
        weight = SOURCE_WEIGHT.get(source, 15)

        if stance == "supports":
            delta = weight
        elif stance == "contradicts":
            delta = -weight
        else:
            delta = 0

        score += delta
        contributions.append({
            "text": existing_text,
            "source": source,
            "stance": stance,
            "delta": delta,
        })

    # Clamp the final confidence score between 0% and 100%
    new_score = max(0, min(100, score))

    # Derive recommended action based on clamped score
    if new_score >= 70:
        recommended_action = "High Risk Area. Avoid route immediately and move to designated safe zone."
    elif new_score >= 40:
        recommended_action = "Moderate Risk. Proceed with caution and verify conditions via official channels."
    else:
        recommended_action = "Unverified Report. Maintain current route and monitor live emergency updates."

    return new_score, contributions, recommended_action


def generate_explanation(previous_score: int, new_score: int, contributions: list) -> str:
    """
    Generates direct, reassuring guidance for the citizen.
    Uses Groq LLM if generation models are active, otherwise delivers
    an instant, high-reliability dynamic guidance report.
    """
    supports = [c for c in contributions if c["stance"] == "supports"]
    contradicts = [c for c in contributions if c["stance"] == "contradicts"]

    evidence_summary_lines = []
    if supports:
        evidence_summary_lines.append(f"{len(supports)} independent bulletin(s) corroborate this report")
    if contradicts:
        evidence_summary_lines.append(f"{len(contradicts)} report(s) dispute this claim")

    evidence_str = " and ".join(evidence_summary_lines) if evidence_summary_lines else "no official bulletins have confirmed this exact hazard yet"

    # Dynamic fallback report addressing the user directly
    fallback_message = (
        f"Your report confidence is currently evaluated at {new_score}% because {evidence_str}. "
        "Please remain calm, follow NDMA and local safety advisories, and monitor live official updates before travelling."
    )

    prompt = f"""
You are SignalProof, an AI emergency intelligence engine speaking directly to a citizen in India.
Previous Confidence Score: {previous_score}%
Updated Confidence Score: {new_score}%
Corroborating Evidence Summary: {evidence_str}

In 2 to 3 direct, empathetic, and clear sentences:
1. Explain to the user whether their report is confirmed by official national or regional bulletins in India.
2. Provide immediate, clear safety guidance so they feel secure and know what action to take right now.

Instructions:
- Speak directly to the user (use 'you').
- Do NOT use bullet points, bold headers, or introductory setups.
- Keep the tone calm, reassuring, authoritative, and helpful.
"""

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        # Secure fallback output for live demo reliability
        return fallback_message