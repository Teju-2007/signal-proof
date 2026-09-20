// ConfidenceScore.jsx
export default function ConfidenceScore({ score, explanation }) {
  const getBadgeStyle = () => {
    if (score >= 70) return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
    if (score >= 40) return "bg-amber-500/10 text-amber-400 border-amber-500/30";
    return "bg-rose-500/10 text-rose-400 border-rose-500/30";
  };

  const getProgressColor = () => {
    if (score >= 70) return "from-emerald-500 to-teal-400";
    if (score >= 40) return "from-amber-500 to-yellow-400";
    return "from-rose-500 to-red-400";
  };

  const getLabel = () => {
    if (score >= 70) return "High Confidence (Corroborated)";
    if (score >= 40) return "Moderate Confidence (Uncertain)";
    return "Low Confidence (Unverified)";
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${getBadgeStyle()}`}>
          {getLabel()}
        </span>
        <span className="text-2xl font-bold tracking-tight text-white">{score}%</span>
      </div>

      <div className="w-full bg-slate-950 rounded-full h-2.5 p-0.5 border border-slate-800">
        <div
          className={`h-1.5 rounded-full bg-gradient-to-r transition-all duration-700 ease-out ${getProgressColor()}`}
          style={{ width: `${score}%` }}
        />
      </div>

      {explanation && (
        <p className="text-xs text-slate-400 bg-slate-950/40 border border-slate-800/60 p-3 rounded-lg leading-relaxed">
          {explanation}
        </p>
      )}
    </div>
  );
}