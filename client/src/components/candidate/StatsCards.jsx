import React from 'react';
import { Briefcase, Send, Video, Sparkles, ArrowUpRight } from 'lucide-react';

export default function StatsCards() {
  const stats = [
    { 
      label: 'Applied Jobs', 
      value: '24', 
      change: '+4 this week', 
      icon: Send, 
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10'
    },
    { 
      label: 'Interviews Scheduled', 
      value: '3', 
      change: 'Next: Tomorrow', 
      icon: Video, 
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10'
    },
    { 
      label: 'Profile Views', 
      value: '142', 
      change: '+18% vs last month', 
      icon: Briefcase, 
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10'
    },
    { 
      label: 'AI Resume Score', 
      value: '88/100', 
      change: 'Top 10% candidate', 
      icon: Sparkles, 
      color: 'text-purple-400',
      bg: 'bg-purple-500/10'
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div 
            key={idx}
            className="p-5 rounded-xl bg-[#0a0a0a] border border-gray-800 hover:border-gray-700 transition-all shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-gray-400">{stat.label}</span>
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <h3 className="text-2xl font-bold text-white tracking-tight">{stat.value}</h3>
              <span className="text-xs text-gray-500 flex items-center gap-0.5">
                {stat.change} <ArrowUpRight className="w-3 h-3 text-gray-600" />
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}