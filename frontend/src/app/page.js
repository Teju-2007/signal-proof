// page.js
"use client";

import { useState } from "react";
import UploadPanel from "./components/UploadPanel";
import ConfidenceScore from "./components/ConfidenceScore";
import EvidenceTimeline from "./components/EvidenceTimeline";
import MapView from "./components/MapView";
import { ShieldAlert, Activity, MapPin, Layers, AlertOctagon, Info } from "lucide-react";

export default function Home() {
  const [score, setScore] = useState(20);
  const [explanation, setExplanation] = useState("");
  const [evidence, setEvidence] = useState([]);
  const [claim, setClaim] = useState(null);
  const [action, setAction] = useState("Awaiting report submission for situational analysis.");

  const handleNewReport = (data) => {
    setScore(data.confidence);
    setExplanation(data.explanation);
    setEvidence(data.evidence);
    setClaim(data.claim);
    if (data.recommended_action) {
      setAction(data.recommended_action);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">
      {/* Top Header Bar */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600/20 text-blue-400 rounded-lg border border-blue-500/30">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">SignalProof</h1>
              <p className="text-xs text-slate-400">Emergency Intelligence & Verification System</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 bg-slate-800/60 border border-slate-700/50 px-3 py-1.5 rounded-full text-xs font-medium text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live Analysis Engine</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Input & Claim Analysis (5 Cols) */}
        <section className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center space-x-2 text-slate-300 font-semibold">
              <Activity className="w-5 h-5 text-blue-400" />
              <h2>Submit Emergency Report</h2>
            </div>
            <p className="text-sm text-slate-400">
              Paste forwarded messages, citizen alerts, or broadcast text to evaluate truthfulness against verified feeds.
            </p>
            <UploadPanel currentScore={score} onNewReport={handleNewReport} />
          </div>

          {/* Winning Feature 1: Explicit Actionable Guidance Banner */}
          <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 border border-amber-500/30 rounded-2xl p-5 shadow-lg space-y-2">
            <div className="flex items-center space-x-2 text-amber-400 font-semibold text-xs uppercase tracking-wider">
              <AlertOctagon className="w-4 h-4" />
              <span>Recommended Action Right Now</span>
            </div>
            <p className="text-slate-100 font-semibold text-base leading-snug">
              {action}
            </p>
          </div>

          {claim && (
            <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 shadow-lg space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                Extracted Intelligence
              </span>
              <p className="text-slate-200 font-medium text-sm leading-relaxed">
                "{claim.claim}"
              </p>
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-xs">
                <div>
                  <span className="block text-slate-500">Location</span>
                  <span className="font-semibold text-slate-300 capitalize">{claim.location || "Unknown"}</span>
                </div>
                <div>
                  <span className="block text-slate-500">Hazard</span>
                  <span className="font-semibold text-slate-300 capitalize">{claim.hazard_type || "N/A"}</span>
                </div>
                <div>
                  <span className="block text-slate-500">Urgency</span>
                  <span className="font-semibold text-slate-300 capitalize">{claim.urgency || "Low"}</span>
                </div>
              </div>
            </div>
          )}

          {/* Verification Score Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Verification Score & Status
            </h2>
            <ConfidenceScore score={score} explanation={explanation} />

            {/* Winning Feature 5: Trust & Safety Disclosure */}
            <div className="flex items-start space-x-2 pt-3 border-t border-slate-800/60 text-[11px] text-slate-500">
              <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Scores represent situational probability based on available feeds, given evidence available now.
              </span>
            </div>
          </div>
        </section>

        {/* Right Column: Spatial Map & Evidence Timeline (7 Cols) */}
        <section className="lg:col-span-7 space-y-6">
          {/* Map Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-slate-300 font-semibold">
                <MapPin className="w-5 h-5 text-emerald-400" />
                <h2>Incident Area Route Status</h2>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden border border-slate-800 shadow-inner">
              <MapView score={score} />
            </div>
          </div>

          {/* Timeline Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center space-x-2 text-slate-300 font-semibold">
              <Layers className="w-5 h-5 text-purple-400" />
              <h2>Evidence Graph Correlation</h2>
            </div>
            <EvidenceTimeline evidence={evidence} />
          </div>
        </section>

      </main>
    </div>
  );
}