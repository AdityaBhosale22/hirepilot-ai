import React from 'react';
import RecruiterLayout from '../../components/recruiter/RecruiterLayout';
import { Users, Sparkles, AlertCircle } from 'lucide-react';

export default function Notifications() {
  const notifications = [
    { id: 1, title: 'Top AI Match Detected', msg: 'A 96% match applied for Senior React Engineer.', icon: Sparkles, color: 'text-[#06B6D4]', bg: 'bg-[#06B6D4]/10', time: '10m ago' },
    { id: 2, title: 'New Application', msg: '5 new candidates applied to Product Designer.', icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-500/10', time: '2h ago' },
    { id: 3, title: 'Interview Conflict', msg: 'Candidate Emily Davis requested a reschedule.', icon: AlertCircle, color: 'text-amber-400', bg: 'bg-amber-500/10', time: '5h ago' },
  ];

  return (
    <RecruiterLayout title="Notifications">
      <div className="max-w-3xl divide-y divide-gray-800 border border-gray-800 bg-[#0a0a0a] rounded-xl overflow-hidden">
        {notifications.map(n => (
          <div key={n.id} className="p-4 flex gap-4 hover:bg-gray-900/40">
            <div className={`p-2 rounded-lg h-fit border border-transparent ${n.bg}`}>
              <n.icon className={`w-4 h-4 ${n.color}`} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <h4 className="text-sm font-medium text-white">{n.title}</h4>
                <span className="text-[10px] text-gray-500">{n.time}</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">{n.msg}</p>
            </div>
          </div>
        ))}
      </div>
    </RecruiterLayout>
  );
}