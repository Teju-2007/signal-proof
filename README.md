🌐 **Live Demo (Frontend)**: https://signal-proof-five.vercel.app  
⚙️ **API Endpoint (Backend)**: https://signal-proof-backend.onrender.com
# 🛡️ SignalProof — Real-Time Emergency Intelligence & Verification Engine

SignalProof is an AI-powered emergency verification and intelligence system designed for citizens in India. By cross-referencing citizen incident reports against nationwide official RSS bulletins (NDMA, IMD, local authorities), SignalProof provides real-time hazard verification scores, dynamic location mapping, and empathetic, actionable safety guidance.

## 🚀 Features

- **Live Intelligence Feed Ingestion** — Ingests real-time national emergency bulletins across India directly via regional RSS channels.
- **Dynamic Stance & Confidence Scoring** — Uses LLM-backed stance evaluation (supports, contradicts, unrelated) paired with deterministic fallbacks to compute a clamped incident verification confidence score (0–100%).
- **Empathetic Citizen Reassurance** — Generates clear, direct, and authoritative safety guidance for citizens during active crises.
- **Client-Side Map Integration** — Interactive geolocation and hazard visualization built with MapLibre GL.

## 🏗️ Architecture & Tech Stack

- **Frontend:** Next.js (App Router), React, MapLibre GL, Tailwind CSS
- **Backend:** FastAPI (Python), Uvicorn
- **AI & NLP Integration:** Groq API (`llama-3.1-8b-instant`), Feedparser
- **Region Focus:** India nationwide (`gl=IN&hl=en-IN&ceid=IN:en`)

## 📂 Project Structure

Signal_Proof/
├── backend/
│ ├── main.py # FastAPI entry point & API routes
│ ├── scoring.py # Confidence scoring & Groq LLM integration
│ ├── live_ingest.py # Live RSS feed ingestion for India
│ ├── evidence.py # Report storage & stance matching engine
│ ├── mock_data.py # Baseline nationwide bulletins
│ ├── requirements.txt # Python dependencies
│ └── .env # Backend environment keys
└── frontend/
├── src/app/ # Next.js app pages & components
├── package.json # Frontend dependencies
└── public/


## 🛠️ Setup & Local Installation

### 1. Prerequisites

- Node.js (v18+)
- Python (v3.10+)
- Groq API Key

### 2. Backend Setup

```bash
cd backend
conda create -n signal_proof python=3.10 -y && conda activate signal_proof
pip install -r requirements.txt
uvicorn main:app --reload
```

Configure `.env` inside the `backend/` directory:

GROQ_API_KEY=your_groq_api_key_here


### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## 📜 License

Distributed under the MIT License.
