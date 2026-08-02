import React from 'react';
import RecruiterLayout from '../../components/recruiter/RecruiterLayout';
import AnalyticsCards from '../../components/recruiter/AnalyticsCards';

export default function Analytics() {
  return (
    <RecruiterLayout title="Hiring Analytics">
      <AnalyticsCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-white mb-6">Hiring Pipeline Conversion</h3>
          <div className="space-y-4">
            {[
              { label: 'Applied', percent: '100%', width: '100%', color: 'bg-blue-500' },
              { label: 'Screened', percent: '45%', width: '45%', color: 'bg-yellow-500' },
              { label: 'Interviewed', percent: '15%', width: '15%', color: 'bg-purple-500' },
              { label: 'Offered', percent: '3%', width: '3%', color: 'bg-emerald-500' },
            ].map((bar, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>{bar.label}</span>
                  <span>{bar.percent}</span>
                </div>
                <div className="w-full bg-gray-900 rounded-full h-2">
                  <div className={`${bar.color} h-2 rounded-full`} style={{ width: bar.width }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-white mb-6">Candidates by Source</h3>
          <div className="flex h-32 items-end gap-4 justify-center mt-8">
            {[
              { source: 'LinkedIn', height: 'h-full', value: '45%' },
              { source: 'Direct', height: 'h-2/3', value: '25%' },
              { source: 'Referral', height: 'h-1/2', value: '20%' },
              { source: 'Indeed', height: 'h-1/4', value: '10%' },
            ].map((col, i) => (
              <div key={i} className="flex flex-col items-center gap-2 flex-1">
                <span className="text-[10px] text-gray-400">{col.value}</span>
                <div className={`w-full bg-[#4F46E5]/80 rounded-t-sm ${col.height}`}></div>
                <span className="text-[10px] font-medium text-gray-500">{col.source}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </RecruiterLayout>
  );
}