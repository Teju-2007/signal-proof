import re
import feedparser
from evidence import store_report

def clean_text(raw_html: str) -> str:
    """Strips HTML tags & extra whitespace."""
    text = re.sub(r'<[^>]+>', '', raw_html)
    return text.strip()

def fetch_live_emergency_alerts(query: str = "India emergency flood rain alert collapse landslide disaster"):
    """
    Fetches real-time RSS news items strictly across India 
    and indexes them directly into Pinecone as official sources.
    """
    formatted_query = query.replace(" ", "%20")
    # Forces India regional feed (gl=IN&hl=en-IN&ceid=IN:en)
    rss_url = f"https://news.google.com/rss/search?q={formatted_query}&hl=en-IN&gl=IN&ceid=IN:en"
    
    print(f"[Live Ingest] Fetching India nationwide RSS feed for query: '{query}'...")
    
    try:
        feed = feedparser.parse(rss_url)
        count = 0
        
        for entry in feed.entries[:15]:  # Fetch top 15 reports across India
            title = entry.title
            raw_summary = entry.get("summary", title)
            clean_summary = clean_text(raw_summary)
            
            news_id = f"live-news-{hash(title)}"
            text_payload = f"OFFICIAL NEWS BULLETIN: {title}. Details: {clean_summary}"
            
            store_report(
                report_id=news_id,
                text=text_payload,
                metadata={
                    "source": "official",
                    "text": f"{title} - {clean_summary}",
                    "url": getattr(entry, "link", "")
                }
            )
            count += 1

        print(f"[Live Ingest] Indexed {count} nationwide India emergency news reports.")
        return count

    except Exception as e:
        print(f"[Live Ingest] Error fetching RSS feeds: {e}")
        return 0