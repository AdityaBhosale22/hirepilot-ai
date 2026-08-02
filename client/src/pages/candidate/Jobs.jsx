import React, { useState } from 'react';
import CandidateLayout from '../../components/candidate/CandidateLayout';
import { Search, Filter, MapPin, DollarSign, Bookmark, Sparkles, Building2 } from 'lucide-react';

export default function Jobs() {
  const [loading, setLoading] = useState(false);

  const jobsList = [
    {
      id: 1,
      title: 'Senior Frontend Engineer',
      company: 'Vercel',
      location: 'Remote',
      type: 'Full-time',
      salary: '$150,000 - $190,000',
      matchScore: '95%',
      description: 'We are looking for an expert React engineer to build next-generation developer tooling.',
      tags: ['React 19', 'Next.js', 'Tailwind CSS']
    },
    {
      id: 2,
      title: 'Full Stack Engineer (Node & React)',
      company: 'Supabase',
      location: 'San Francisco, CA',
      type: 'Full-time',
      salary: '$140,000 - $180,000',
      matchScore: '90%',
      description: 'Help scale open-source Postgres infrastructure and real-time backend tooling.',
      tags: ['React', 'PostgreSQL', 'TypeScript']
    },
    {
      id: 3,
      title: 'UI/UX Design Systems Engineer',
      company: 'Linear',
      location: 'Remote',
      type: 'Contract',
      salary: '$120/hr',
      matchScore: '87%',
      description: 'Craft beautiful, fast, and accessible user interfaces for our desktop and web apps.',
      tags: ['Framer Motion', 'Tailwind CSS', 'Design Systems']
    }
  ];

  return (
    <CandidateLayout title="Browse Jobs">
      {/* Search Header */}
      <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-1/2">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search title, skills, or keywords..."
            className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#4F46E5]"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="px-4 py-2.5 bg-[#0a0a0a] border border-gray-800 rounded-lg text-xs font-medium text-gray-300 flex items-center gap-2 hover:bg-gray-800">
            <Filter className="w-4 h-4" /> Filters
          </button>
          <select className="px-4 py-2.5 bg-[#0a0a0a] border border-gray-800 rounded-lg text-xs font-medium text-gray-300 focus:outline-none">
            <option>Sort by: AI Recommended</option>
            <option>Newest First</option>
            <option>Highest Salary</option>
          </select>
        </div>
      </div>

      {/* Loading Skeletons State demo */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="p-6 bg-[#0a0a0a] border border-gray-800 rounded-xl animate-pulse space-y-3">
              <div className="h-4 bg-gray-800 rounded w-1/3"></div>
              <div className="h-3 bg-gray-800/60 rounded w-1/4"></div>
              <div className="h-12 bg-gray-800/40 rounded w-full"></div>
            </div>
          ))}
        </div>
      ) : (
        /* Jobs List */
        <div className="space-y-4">
          {jobsList.map((job) => (
            <div 
              key={job.id}
              className="p-6 bg-[#0a0a0a] border border-gray-800 hover:border-gray-700 rounded-xl transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-bold text-white">{job.title}</h2>
                    <span className="px-2.5 py-0.5 text-xs font-bold rounded bg-[#06B6D4]/10 text-[#06B6D4] border border-[#06B6D4]/20 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> {job.matchScore} Match
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-400 mt-2">
                    <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" /> {job.company}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                    <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" /> {job.salary}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button className="p-2.5 rounded-lg border border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800">
                    <Bookmark className="w-4 h-4" />
                  </button>
                  <button className="px-5 py-2.5 bg-[#4F46E5] hover:bg-[#4338ca] text-white text-xs font-semibold rounded-lg transition-colors">
                    Apply Now
                  </button>
                </div>
              </div>

              <p className="text-xs text-gray-400 leading-relaxed mb-4">{job.description}</p>

              <div className="flex flex-wrap gap-2">
                {job.tags.map((tag, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-[#111] border border-gray-800 text-gray-300 rounded-md text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </CandidateLayout>
  );
}