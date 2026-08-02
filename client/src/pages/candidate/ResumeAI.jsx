import React, { useState } from 'react';
import CandidateLayout from '../../components/candidate/CandidateLayout';
import { Sparkles, CheckCircle2, AlertTriangle, ArrowRight, RefreshCw } from 'lucide-react';

export default function ResumeAI() {
  const [analyzing, setAnalyzing] = useState(false);

  const handleAudit = () => {
    setAnalyzing(true);
    setTimeout(() => setAnalyzing(false), 2000);
  };

  return (
    <CandidateLayout title="AI Resume Audit & Optimizer">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Action Banner */}
        <div className="p-6 bg-gradient-to-r from-[#4F46E5]/20 via-[#0a0a0a] to-[#06B6D4]/20 border border-gray-800 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#06B6D4]" /> Real-time ATS Scanner Engine
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Scans your resume against 50,000+ tech job descriptions to maximize interview callbacks.
            </p>
          </div>

          <button 
            onClick={handleAudit}
            disabled={analyzing}
            className="px-6 py-3 bg-[#4F46E5] hover:bg-[#4338ca] text-white text-xs font-semibold rounded-lg flex items-center gap-2 transition-all shadow-lg flex-shrink-0 disabled:opacity-50"
          >
            {analyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Analyzing Resume...
              </>
            ) : (
              <>
                Run New Audit <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Score Breakdowns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-[#0a0a0a] border border-gray-800 rounded-xl text-center">
            <span className="text-xs text-gray-400">ATS Pass Rate</span>
            <div className="text-3xl font-black text-emerald-400 my-2">94%</div>
            <p className="text-[10px] text-gray-500">Bypasses main applicant filters</p>
          </div>

          <div className="p-6 bg-[#0a0a0a] border border-gray-800 rounded-xl text-center">
            <span className="text-xs text-gray-400">Impact Score</span>
            <div className="text-3xl font-black text-amber-400 my-2">78/100</div>
            <p className="text-[10px] text-gray-500">Needs more quantified metrics</p>
          </div>

          <div className="p-6 bg-[#0a0a0a] border border-gray-800 rounded-xl text-center">
            <span className="text-xs text-gray-400">Keyword Density</span>
            <div className="text-3xl font-black text-cyan-400 my-2">91%</div>
            <p className="text-[10px] text-gray-500">Matches modern Frontend roles</p>
          </div>
        </div>

        {/* Suggestions List */}
        <div className="p-6 bg-[#0a0a0a] border border-gray-800 rounded-xl space-y-4">
          <h3 className="text-sm font-semibold text-white mb-2">AI Recommended Action Items</h3>
          
          <div className="p-4 bg-[#111] border border-amber-500/20 rounded-lg flex gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-semibold text-amber-300">Quantify bullet points in Work History</h4>
              <p className="text-xs text-gray-400 mt-1">
                Change "Built responsive UI components" to "Built 20+ responsive UI components improving load speeds by 35%."
              </p>
            </div>
          </div>

          <div className="p-4 bg-[#111] border border-emerald-500/20 rounded-lg flex gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-semibold text-emerald-300">Strong Tech Stack Match</h4>
              <p className="text-xs text-gray-400 mt-1">
                Your mention of React 19, Tailwind CSS, and Vite matches 92% of active senior roles in your location.
              </p>
            </div>
          </div>
        </div>
      </div>
    </CandidateLayout>
  );
}