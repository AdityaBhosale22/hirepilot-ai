import React from 'react';
import { ExternalLink, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RecentApplications() {
  const applications = [
    {
      id: 1,
      role: 'Senior React Engineer',
      company: 'Vercel',
      location: 'Remote',
      appliedDate: '2 days ago',
      status: 'In Review',
      statusColor: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      matchScore: '94%'
    },
    {
      id: 2,
      role: 'Full Stack Developer',
      company: 'Supabase',
      location: 'San Francisco, CA',
      appliedDate: '4 days ago',
      status: 'Interview Scheduled',
      statusColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      matchScore: '89%'
    },
    {
      id: 3,
      role: 'Frontend Architect',
      company: 'Linear',
      location: 'Remote',
      appliedDate: '1 week ago',
      status: 'Assessment Sent',
      statusColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      matchScore: '91%'
    },
    {
      id: 4,
      role: 'UI/UX React Engineer',
      company: 'Clerk',
      location: 'New York, NY',
      appliedDate: '2 weeks ago',
      status: 'Rejected',
      statusColor: 'bg-red-500/10 text-red-400 border-red-500/20',
      matchScore: '78%'
    },
  ];

  return (
    <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-semibold text-white">Recent Applications</h2>
          <p className="text-xs text-gray-400">Track real-time updates on your submitted roles</p>
        </div>
        <Link 
          to="/candidate/applications" 
          className="text-xs font-medium text-[#4F46E5] hover:text-[#06B6D4] transition-colors flex items-center gap-1"
        >
          View all <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-xs font-medium text-gray-400 uppercase tracking-wider">
              <th className="pb-3 px-2">Job & Company</th>
              <th className="pb-3 px-2">Applied</th>
              <th className="pb-3 px-2">AI Match</th>
              <th className="pb-3 px-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60">
            {applications.map((app) => (
              <tr key={app.id} className="hover:bg-gray-900/40 transition-colors">
                <td className="py-3 px-2">
                  <div className="font-medium text-white">{app.role}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                    <Building2 className="w-3 h-3 text-gray-600" />
                    {app.company} • {app.location}
                  </div>
                </td>
                <td className="py-3 px-2 text-xs text-gray-400">{app.appliedDate}</td>
                <td className="py-3 px-2">
                  <span className="px-2 py-0.5 text-xs font-semibold rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {app.matchScore}
                  </span>
                </td>
                <td className="py-3 px-2">
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${app.statusColor}`}>
                    {app.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}