import React from 'react';
import CandidateLayout from '../../components/candidate/CandidateLayout';
import RecommendedJobs from '../../components/candidate/RecommendedJobs';
import { Target, Sparkles } from 'lucide-react';

export default function JobMatching() {
  return (
    <CandidateLayout title="AI Job Matching Engine">
      <div className="mb-6 p-6 bg-[#0a0a0a] border border-gray-800 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#06B6D4]/10 rounded-xl text-[#06B6D4]">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Semantic AI Matcher Active</h2>
            <p className="text-xs text-gray-400">Comparing your skill vector against 1,200 open engineering roles.</p>
          </div>
        </div>

        <span className="hidden sm:inline-flex px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-semibold items-center gap-1">
          <Sparkles className="w-3 h-3" /> Auto-Updating
        </span>
      </div>

      <RecommendedJobs />
    </CandidateLayout>
  );
}