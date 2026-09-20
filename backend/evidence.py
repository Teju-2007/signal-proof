# evidence.py
import sys
import os

# Internal storage list initialized dynamically
STORED_REPORTS = []


def store_report(report_id: str, text: str, metadata: dict = None):
    """
    Stores a report into the backend database/memory store.
    Accepts 3 arguments from main.py and live_ingest.py.
    """
    global STORED_REPORTS
    
    meta = metadata or {}
    source = meta.get("source", "citizen")
    
    # Store normalized report structure
    STORED_REPORTS.append({
        "id": report_id,
        "text": text,
        "source": source,
        "metadata": {
            "source": source,
            "text": text,
            "url": meta.get("url", "")
        }
    })


def get_all_bulletins() -> list:
    """
    Safely retrieves stored reports and dynamically incorporates
    INITIAL_BULLETINS from mock_data without causing top-level circular imports.
    """
    combined = list(STORED_REPORTS)
    try:
        from mock_data import INITIAL_BULLETINS
        for b in INITIAL_BULLETINS:
            # Avoid adding duplicates if already loaded
            if not any(item.get("id") == b.get("id") for item in combined):
                combined.append({
                    "id": b.get("id", ""),
                    "text": b.get("text", ""),
                    "source": b.get("metadata", {}).get("source", "official"),
                    "metadata": b.get("metadata", {"source": "official", "text": b.get("text", "")})
                })
    except ImportError:
        pass
        
    return combined


def find_similar_reports(extracted_claim) -> list:
    """
    Finds related reports across India and assigns stance badges based on generalized matching rules.
    """
    evidence_items = []

    # Handle both dict and plain string inputs
    if isinstance(extracted_claim, dict):
        claim_location = (extracted_claim.get("location") or "").lower()
        claim_text = (extracted_claim.get("claim") or extracted_claim.get("summary") or "").lower()
    else:
        claim_location = ""
        claim_text = str(extracted_claim).lower()

    bulletins = get_all_bulletins()
    
    # Extract key hazard keywords for dynamic matching across India
    keywords = [w for w in claim_text.split() if len(w) > 3]

    for item in bulletins:
        item_text = item.get("text", "").lower()
        item_meta = item.get("metadata", {})
        item_source = item_meta.get("source", item.get("source", "citizen"))

        # Check keyword match overlap or location relevance
        keyword_overlap = sum(1 for kw in keywords if kw in item_text)
        location_match = claim_location and claim_location in item_text

        if location_match or keyword_overlap >= 2:
            # Determine stance based on emergency contextual words
            negative_indicators = ["clear", "open", "usable", "normal", "false", "safe"]
            hazard_indicators = ["collapsed", "impassable", "flood", "closed", "blocked", "warning", "rain", "landslide"]

            if any(word in item_text for word in hazard_indicators):
                if any(word in claim_text for word in negative_indicators):
                    stance = "contradicts"
                else:
                    stance = "supports"
            elif any(word in claim_text for word in hazard_indicators) and any(word in item_text for word in negative_indicators):
                stance = "contradicts"
            else:
                stance = "supports"

            evidence_items.append({
                "id": item.get("id", ""),
                "source": item_source,
                "text": item.get("text", ""),
                "stance": stance,
                "metadata": item_meta
            })
        else:
            evidence_items.append({
                "id": item.get("id", ""),
                "source": item_source,
                "text": item.get("text", ""),
                "stance": "unrelated",
                "metadata": item_meta
            })

    return evidence_items


def get_related_evidence(extracted_claim) -> list:
    """Alias to preserve backwards compatibility."""
    return find_similar_reports(extracted_claim)