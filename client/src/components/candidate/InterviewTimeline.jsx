import React from 'react';
import { Calendar, Video, Clock } from 'lucide-react';

export default function InterviewTimeline() {
  const upcomingInterviews = [
    {
      id: 1,
      company: 'Supabase',
      role: 'Full Stack Engineer',
      type: 'Technical Round 2',
      date: 'Tomorrow, Aug 3',
      time: '2:00 PM EST',
      interviewer: 'Alex Rivera (Tech Lead)'
    },
    {
      id: 2,
      company: 'Linear',
      role: 'Frontend Architect',
      type: 'System Design',
      date: 'Aug 6, 2026',
      time: '11:00 AM EST',
      interviewer: 'Sarah Jenkins (VP Eng)'
    }
  ];

  return (
    <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-semibold text-white">Upcoming Interviews</h2>
        <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-medium">
          2 Scheduled
        </span>
      </div>

      <div className="space-y-4">
        {upcomingInterviews.map((item) => (
          <div key={item.id} className="p-4 rounded-lg bg-[#111] border border-gray-800">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">{item.company}</h3>
                <p className="text-xs text-gray-400">{item.role} • <span className="text-gray-300">{item.type}</span></p>
              </div>
              <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                <Video className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-800/80 flex flex-wrap justify-between items-center text-xs text-gray-400 gap-2">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-gray-300">
                  <Calendar className="w-3.5 h-3.5 text-gray-500" /> {item.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-gray-500" /> {item.time}
                </span>
              </div>
              <button className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-white rounded text-xs font-medium">
                Join Call
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}