import React from 'react';
import { Sparkles, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ResumeScoreCard() {
  return (
    <div className="bg-gradient-to-br from-[#0a0a0a] to-[#111827] border border-gray-800 rounded-xl p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#4F46E5]/10 rounded-full blur-2xl"></div>

      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#06B6D4]" />
          <h2 className="text-base font-semibold text-white">AI ATS Resume Audit</h2>
        </div>
        <span className="text-2xl font-black text-white bg-clip-text text-transparent bg-gradient-to-r from-[#4F46E5] to-[#06B6D4]">
          88/100
        </span>
      </div>

      <p className="text-xs text-gray-400 mb-4 relative z-10">
        Your resume parses smoothly across 95% of standard ATS systems. Strong keyword density in React & Frontend Engineering.
      </p>

      <div className="space-y-2 mb-6 text-xs relative z-10">
        <div className="flex items-center gap-2 text-emerald-400">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>Clear structural headings & standard typography detected</span>
        </div>
        <div className="flex items-center gap-2 text-amber-400">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>Add 2 more quantified achievements (e.g. "improved speed by 30%")</span>
        </div>
      </div>

      <Link
        to="/candidate/resume-ai"
        className="w-full py-2.5 bg-[#4F46E5]/20 border border-[#4F46E5]/40 hover:bg-[#4F46E5]/30 text-white text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 relative z-10"
      >
        Run Detailed AI Scan <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}