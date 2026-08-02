import React, { useState } from 'react';
import CandidateLayout from '../../components/candidate/CandidateLayout';
import RecentApplications from '../../components/candidate/RecentApplications';
import { FileText, Search } from 'lucide-react';

export default function Applications() {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <CandidateLayout title="My Applications">
      {/* Tabs Filter */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-gray-800 pb-4">
        <div className="flex gap-2 text-xs font-medium">
          {['all', 'in-review', 'interviews', 'archived'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                activeTab === tab 
                  ? 'bg-[#4F46E5] text-white' 
                  : 'text-gray-400 hover:bg-gray-900'
              }`}
            >
              {tab.replace('-', ' ')}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input 
            type="text" 
            placeholder="Filter applications..." 
            className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#4F46E5]"
          />
        </div>
      </div>

      {/* Main Table Card */}
      <RecentApplications />
    </CandidateLayout>
  );
}