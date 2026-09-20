from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uuid
from extraction import extract_claim
from evidence import store_report, find_similar_reports
from scoring import calculate_confidence, generate_explanation
from mock_data import load_bulletins_into_pinecone
from live_ingest import fetch_live_emergency_alerts

app = FastAPI()

# CORS setup: allows our Next.js frontend (running on a different address) to call this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for the hackathon demo only — restrict this in a real production app
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup_event():
    """Runs once when the backend starts — loads the official bulletins so they
    are searchable before any user report ever comes in."""
    load_bulletins_into_pinecone()
    print("Official bulletins loaded into Pinecone.")
    fetch_live_emergency_alerts("emergency flood road closure bridge")


class ReportInput(BaseModel):
    text: str
    previous_score: int = 20  # the frontend sends back the current score so the
    # explanation can say exactly how much it changed


# main.py
@app.post("/submit-report")
def submit_report(report: ReportInput):
    # Step 1: Extract structured facts (Location, Hazard)
    claim_data = extract_claim(report.text)
    extracted_location = claim_data.get("location")

    # Step 2: Fetch fresh live news specifically for the extracted location
    if extracted_location and extracted_location.lower() != "unknown":
        fetch_live_emergency_alerts(f"{extracted_location} emergency rain road flood")
    else:
        fetch_live_emergency_alerts("Vijayawada Mangalagiri emergency road flood")

    # Step 3: Match against freshly updated vector store
    matches = find_similar_reports(report.text)

    # Step 4: Calculate score & generate LLM natural conversation guidance
    new_score, contributions, recommended_action = calculate_confidence(report.text, matches)
    explanation = generate_explanation(report.previous_score, new_score, contributions)

    store_report(str(uuid.uuid4()), report.text)

    return {
        "claim": claim_data,
        "confidence": new_score,
        "explanation": explanation,
        "recommended_action": recommended_action,
        "evidence": contributions,
    }