// EvidenceTimeline.jsx
import { CheckCircle2, AlertTriangle, HelpCircle, User, Building2 } from "lucide-react";

export default function EvidenceTimeline({ evidence }) {
  const getStanceBadge = (stance) => {
    if (stance === "supports") {
      return (
        <span className="flex items-center space-x-1 text-[11px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
          <CheckCircle2 className="w-3 h-3" />
          <span>Supports</span>
        </span>
      );
    }
    if (stance === "contradicts") {
      return (
        <span className="flex items-center space-x-1 text-[11px] px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20 font-medium">
          <AlertTriangle className="w-3 h-3" />
          <span>Contradicts</span>
        </span>
      );
    }
    return (
      <span className="flex items-center space-x-1 text-[11px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700/50 font-medium">
        <HelpCircle className="w-3 h-3" />
        <span>Unrelated</span>
      </span>
    );
  };

  const getSourceBadge = (source) => {
    const isOfficial = source === "official";
    return (
      <span className={`flex items-center space-x-1 text-[11px] px-2 py-0.5 rounded-md border font-medium ${
        isOfficial 
          ? "bg-blue-500/10 text-blue-400 border-blue-500/20" 
          : "bg-purple-500/10 text-purple-400 border-purple-500/20"
      }`}>
        {isOfficial ? <Building2 className="w-3 h-3" /> : <User className="w-3 h-3" />}
        <span className="capitalize">{source}</span>
      </span>
    );
  };

  if (!evidence || evidence.length === 0) {
    return (
      <div className="p-6 border border-dashed border-slate-800 rounded-xl text-center">
        <p className="text-xs text-slate-500">
          No correlated reports yet. Submit an emergency claim to analyze evidence matches.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {evidence.map((item, i) => (
        <div 
          key={i} 
          className="p-3.5 bg-slate-950/50 border border-slate-800/80 rounded-xl hover:border-slate-700/80 transition space-y-2"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getSourceBadge(item.source)}
              {getStanceBadge(item.stance)}
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-normal">
            {item.text}
          </p>
        </div>
      ))}
    </div>
  );
}