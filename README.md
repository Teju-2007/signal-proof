Here is the clean, single-block `README.md` formatted for easy copying:

```markdown
# 🛡️ SignalProof — Real-Time Emergency Intelligence & Verification Engine

SignalProof is an AI-powered emergency verification and intelligence system designed for citizens in India. By cross-referencing citizen incident reports against nationwide official RSS bulletins (NDMA, IMD, local authorities), SignalProof provides real-time hazard verification scores, dynamic location mapping, and empathetic, actionable safety guidance.

---

## 🚀 Features

- **Live Intelligence Feed Ingestion**: Ingests real-time national emergency bulletins across India directly via regional RSS channels.
- **Dynamic Stance & Confidence Scoring**: Uses LLM-backed stance evaluation (`supports`, `contradicts`, `unrelated`) paired with deterministic fallbacks to compute clamped incident verification confidence (0–100%).
- **Empathetic Citizen Reassurance**: Generates clear, direct, and authoritative safety guidance for citizens during active crises.
- **Client-Side Map Integration**: Interactive geolocation and hazard visualization built with MapLibre GL.

---

## 🏗️ Architecture & Tech Stack

- **Frontend**: Next.js (App Router), React, MapLibre GL, Tailwind CSS
- **Backend**: FastAPI (Python), Uvicorn
- **AI & NLP Integration**: Groq API (`llama-3.1-8b-instant`), Feedparser
- **Region Focus**: India nationwide (`gl=IN&hl=en-IN&ceid=IN:en`)

---

## 📂 Project Structure

```text
Signal_Proof/
├── backend/
│   ├── main.py            # FastAPI entry point & API routes
│   ├── scoring.py         # Confidence scoring & Groq LLM integration
│   ├── live_ingest.py     # Live RSS feed ingestion for India
│   ├── evidence.py        # Report storage & stance matching engine
│   ├── mock_data.py       # Baseline nationwide bulletins
│   ├── requirements.txt   # Python dependencies
│   └── .env               # Backend environment keys
└── frontend/
    ├── src/app/           # Next.js app pages & components
    ├── package.json       # Frontend dependencies
    └── public/

```

---

## 🛠️ Setup & Local Installation

### 1. Prerequisites

* Node.js (v18+)
* Python (v3.10+)
* Groq API Key

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Create & activate environment (optional but recommended)
conda create -n signal_proof python=3.10 -y
conda activate signal_proof

# Install dependencies
pip install -r requirements.txt

# Configure .env file
# Create a .env file inside backend/ directory:
GROQ_API_KEY=your_groq_api_key_here
PINECONE_API_KEY=your_pinecone_api_key_here  # optional if vector store enabled

# Run the FastAPI server
uvicorn main:app --reload

```

The backend server will run on `http://localhost:8000`.

### 3. Frontend Setup

```bash
# Open a new terminal and navigate to frontend
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev

```

The frontend application will run on `http://localhost:3000`.

---

## 🔑 Environment Variables

Inside `backend/.env`:

```env
GROQ_API_KEY=gsk_your_groq_api_key_here

```

---

## 📜 License

Distributed under the MIT License.

```

---

### **Git Push Commands**

Run these in your terminal to commit and publish live:

```bash
# From Signal_Proof root directory
git add .
git commit -m "feat: complete SignalProof India emergency verification engine"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/SignalProof.git
git push -u origin main

```