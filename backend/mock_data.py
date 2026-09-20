import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Initial verified official bulletins focusing across India
INITIAL_BULLETINS = [
    {
        "id": "india-official-001",
        "text": "OFFICIAL ADVISORY: National Disaster Management Authority (NDMA) issues heavy rainfall and flash flood advisories across multiple Indian states.",
        "metadata": {
            "source": "official", 
            "text": "NDMA issuing live severe weather alerts across India."
        }
    },
    {
        "id": "india-official-002",
        "text": "OFFICIAL BULLETIN: Indian Meteorological Department (IMD) issues orange alerts for heavy precipitation and potential landslides in critical transport corridors.",
        "metadata": {
            "source": "official", 
            "text": "IMD orange alert active for severe weather and road risks."
        }
    }
]


def load_bulletins_into_pinecone():
    """
    Populates vector database with baseline national emergency advisories.
    """
    # Moved import inside the function to break circular dependency
    from evidence import store_report

    print("[Mock Data] Seeding initial nationwide bulletins into vector storage...")
    for b in INITIAL_BULLETINS:
        try:
            store_report(b["id"], b["text"], b["metadata"])
        except Exception as e:
            print(f"[Mock Data] Failed to index bulletin {b['id']}: {e}")
    print("[Mock Data] Completed seeding.")


if __name__ == "__main__":
    load_bulletins_into_pinecone()