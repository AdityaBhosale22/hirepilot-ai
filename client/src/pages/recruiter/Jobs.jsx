import React from 'react';
import RecruiterLayout from '../../components/recruiter/RecruiterLayout';
import JobCard from '../../components/recruiter/JobCard';
import { Search, Filter } from 'lucide-react';

export default function Jobs() {
  const jobs = [
    { id: 1, title: 'Senior React Engineer', location: 'Remote', type: 'Full-time', applicants: 142, views: 890, status: 'Active', aiMatch: 12 },
    { id: 2, title: 'Product Designer', location: 'San Francisco, CA', type: 'Hybrid', applicants: 85, views: 420, status: 'Active', aiMatch: 5 },
    { id: 3, title: 'Backend Developer (Node.js)', location: 'Remote', type: 'Full-time', applicants: 210, views: 1100, status: 'Active', aiMatch: 24 },
    { id: 4, title: 'Marketing Director', location: 'New York, NY', type: 'Full-time', applicants: 45, views: 300, status: 'Draft', aiMatch: null },
  ];

  return (
    <RecruiterLayout title="Job Postings">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
        <div className="relative w-full md:w-1/3">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search jobs..."
            className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#4F46E5]"
          />
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-2 bg-[#0a0a0a] border border-gray-800 rounded-lg text-xs text-gray-300 flex items-center gap-2 hover:bg-gray-800">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.map((job) => <JobCard key={job.id} {...job} />)}
      </div>
    </RecruiterLayout>
  );
}