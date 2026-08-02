import React from 'react';
import { Users, Eye, MoreHorizontal, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function JobCard({ title, location, type, applicants, views, status, aiMatch }) {
  return (
    <div className="p-5 bg-[#0a0a0a] border border-gray-800 rounded-xl hover:border-gray-700 transition-all flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-white">{title}</h3>
          <p className="text-xs text-gray-500 mt-1">{location} • {type}</p>
        </div>
        <button className="text-gray-500 hover:text-white p-1">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="flex flex-col">
          <span className="text-xs text-gray-500">Applicants</span>
          <span className="text-sm font-semibold text-white flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-gray-400" /> {applicants}
          </span>
        </div>
        <div className="w-px h-8 bg-gray-800"></div>
        <div className="flex flex-col">
          <span className="text-xs text-gray-500">Views</span>
          <span className="text-sm font-semibold text-white flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-gray-400" /> {views}
          </span>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-800">
        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
          status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-gray-800 text-gray-400'
        }`}>
          {status}
        </span>
        
        {aiMatch && (
          <span className="flex items-center gap-1 text-[10px] text-[#06B6D4] font-medium bg-[#06B6D4]/10 px-2 py-1 rounded border border-[#06B6D4]/20">
            <Sparkles className="w-3 h-3" /> {aiMatch} Top Matches
          </span>
        )}
      </div>
    </div>
  );
}