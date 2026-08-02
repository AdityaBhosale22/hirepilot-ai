import React from 'react';
import { Users, Briefcase, Clock, Video, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function AnalyticsCards() {
  const stats = [
    { label: 'Active Jobs', value: '12', change: '+2 this week', icon: Briefcase, color: 'text-indigo-400', bg: 'bg-indigo-500/10', trend: 'up' },
    { label: 'Total Applicants', value: '842', change: '+15% vs last month', icon: Users, color: 'text-cyan-400', bg: 'bg-cyan-500/10', trend: 'up' },
    { label: 'Avg Time to Hire', value: '18 Days', change: '-3 days vs avg', icon: Clock, color: 'text-emerald-400', bg: 'bg-emerald-500/10', trend: 'up' },
    { label: 'Upcoming Interviews', value: '24', change: '8 this week', icon: Video, color: 'text-purple-400', bg: 'bg-purple-500/10', trend: 'up' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div key={idx} className="p-5 rounded-xl bg-[#0a0a0a] border border-gray-800 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-gray-400">{stat.label}</span>
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
              <span className={`text-xs flex items-center gap-0.5 ${stat.trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                {stat.change} {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}