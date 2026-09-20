# extraction.py
import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

FALLBACK_CLAIM = {
    "claim": None,
    "location": "unknown",
    "hazard_type": "other",
    "urgency": "medium",
}


def extract_claim(message_text: str) -> dict:
    """Sends the raw message text to the LLM and asks it to return
    structured JSON: claim, location, hazard_type, urgency."""
    if not message_text or not message_text.strip():
        return FALLBACK_CLAIM

    prompt = f"""
You are an emergency information extraction system.
Read the message below and extract ONLY the following fields as JSON:
- claim: a short summary of what is being claimed
- location: the specific place mentioned (or "unknown" if none)
- hazard_type: one of [flood, fire, accident, other]
- urgency: one of [low, medium, high]

Message: \"{message_text}\"

Respond with ONLY valid JSON, no extra text, no markdown code fences.
"""

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",  # FIXED MODEL NAME
            messages=[{"role": "user", "content": prompt}],
            temperature=0.1,
        )

        raw_text = response.choices[0].message.content.strip()

        # Clean markdown code block formatting if present
        if raw_text.startswith("```"):
            raw_text = raw_text.strip("`").replace("json\n", "", 1)

        return json.loads(raw_text)

    except (json.JSONDecodeError, Exception) as e:
        print(f"[extract_claim] Falling back to default - model output could not be parsed: {e}")
        return FALLBACK_CLAIM