import React from 'react';
import { MoreVertical, ExternalLink, Sparkles } from 'lucide-react';

export default function ApplicantsTable({ applicants }) {
  const getStatusStyle = (status) => {
    switch (status) {
      case 'New': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Screening': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'Interview': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'Offered': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Rejected': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-gray-800 text-gray-400 border-gray-700';
    }
  };

  return (
    <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-[#111] border-b border-gray-800 text-xs font-medium text-gray-400 uppercase tracking-wider">
              <th className="py-3 px-4">Candidate</th>
              <th className="py-3 px-4">Applied Role</th>
              <th className="py-3 px-4">AI Score</th>
              <th className="py-3 px-4">Applied Date</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60">
            {applicants.map((app, idx) => (
              <tr key={idx} className="hover:bg-gray-900/40 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-xs font-bold text-white">
                      {app.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-white">{app.name}</p>
                      <p className="text-[10px] text-gray-500">{app.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-300 text-xs">{app.role}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#06B6D4]" />
                    <span className="text-xs font-bold text-white">{app.score}%</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-xs text-gray-500">{app.date}</td>
                <td className="py-3 px-4">
                  <span className={`px-2.5 py-1 text-[10px] font-medium rounded-full border ${getStatusStyle(app.status)}`}>
                    {app.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button className="text-gray-500 hover:text-white p-1">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}