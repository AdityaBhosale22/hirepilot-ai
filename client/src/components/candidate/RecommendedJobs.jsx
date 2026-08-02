import React from 'react';
import { Bookmark, MapPin, DollarSign, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RecommendedJobs() {
  const jobs = [
    {
      id: 101,
      title: 'Principal Design Engineer',
      company: 'Cursor AI',
      location: 'Remote',
      salary: '$160k - $210k',
      matchScore: '96%',
      tags: ['React', 'TypeScript', 'Tailwind']
    },
    {
      id: 102,
      title: 'Senior Frontend Developer',
      company: 'Raycast',
      location: 'San Francisco, CA (Hybrid)',
      salary: '$150k - $185k',
      matchScore: '92%',
      tags: ['React 19', 'Next.js', 'Framer']
    }
  ];

  return (
    <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-semibold text-white">Recommended AI Matches</h2>
          <p className="text-xs text-gray-400">Personalized based on your skills & ATS scan</p>
        </div>
        <Link to="/candidate/job-matching" className="text-xs font-medium text-[#06B6D4] hover:underline">
          Smart Match Engine →
        </Link>
      </div>

      <div className="space-y-4">
        {jobs.map((job) => (
          <div 
            key={job.id}
            className="p-4 rounded-lg bg-[#111] border border-gray-800 hover:border-[#4F46E5]/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-white text-sm">{job.title}</h3>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-[#06B6D4]/10 text-[#06B6D4] border border-[#06B6D4]/20 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> {job.matchScore} Match
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">{job.company}</p>
              
              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-gray-600" /> {job.location}
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3 text-gray-600" /> {job.salary}
                </span>
              </div>

              <div className="flex gap-2 mt-3">
                {job.tags.map((tag, i) => (
                  <span key={i} className="px-2 py-0.5 bg-gray-800 text-gray-300 rounded text-[10px]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center">
              <button className="p-2 rounded-lg border border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800">
                <Bookmark className="w-4 h-4" />
              </button>
              <button className="px-4 py-2 bg-[#4F46E5] hover:bg-[#4338ca] text-white text-xs font-medium rounded-lg transition-colors">
                Quick Apply
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}