// UploadPanel.jsx
import { useState } from "react";
import axios from "axios";
import { Send, Loader2, FileText, Mic, Image as ImageIcon } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function UploadPanel({ currentScore, onNewReport }) {
  const [activeTab, setActiveTab] = useState("text");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setErrorMsg("");
  };

  const handleSubmit = async () => {
    if (!text.trim()) {
      setErrorMsg("Please enter or record a report before submitting.");
      return;
    }
    
    setLoading(true);
    setErrorMsg("");

    try {
      const response = await axios.post(`${API_URL}/submit-report`, {
        text: text,
        previous_score: currentScore,
      });
      onNewReport(response.data);
      setText("");
    } catch (error) {
      console.error("Failed to submit report:", error);
      setErrorMsg("Could not reach backend server. Check connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Input Mode Selector */}
      <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-medium text-slate-400">
        <button
          onClick={() => handleTabChange("text")}
          className={`flex-1 flex items-center justify-center space-x-1.5 py-1.5 rounded-md transition ${
            activeTab === "text" ? "bg-slate-800 text-slate-100 shadow" : "hover:text-slate-200"
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Text</span>
        </button>
        <button
          onClick={() => handleTabChange("voice")}
          className={`flex-1 flex items-center justify-center space-x-1.5 py-1.5 rounded-md transition ${
            activeTab === "voice" ? "bg-slate-800 text-slate-100 shadow" : "hover:text-slate-200"
          }`}
        >
          <Mic className="w-3.5 h-3.5" />
          <span>Voice Note</span>
        </button>
        <button
          onClick={() => handleTabChange("image")}
          className={`flex-1 flex items-center justify-center space-x-1.5 py-1.5 rounded-md transition ${
            activeTab === "image" ? "bg-slate-800 text-slate-100 shadow" : "hover:text-slate-200"
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Screenshot</span>
        </button>
      </div>

      {/* Input Area */}
      <textarea
        className="w-full h-28 bg-slate-950/60 border border-slate-800 text-slate-100 placeholder-slate-500 rounded-xl p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition resize-none"
        placeholder={
          activeTab === "text"
            ? "Paste message (e.g., 'East Bridge has collapsed due to heavy flooding')..."
            : activeTab === "voice"
              ? "Transcribe or paste voice note message..."
              : "Paste image OCR text content..."
        }
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="flex justify-between items-center">
        {errorMsg ? (
          <p className="text-rose-400 text-xs font-medium">{errorMsg}</p>
        ) : (
          <span className="text-xs text-slate-500">Press submit to analyze stance</span>
        )}
        <button
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition shadow-md shadow-blue-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSubmit}
          disabled={loading || !text.trim()}
        >
          {loading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              <span>Submit Report</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}