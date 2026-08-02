import React from 'react';
import { Calendar as CalIcon, Clock, Video, User } from 'lucide-react';

export default function InterviewCalendar({ interviews }) {
  return (
    <div className="space-y-4">
      {interviews.map((interview, idx) => (
        <div key={idx} className="p-4 bg-[#0a0a0a] border border-gray-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex flex-col items-center justify-center flex-shrink-0 text-indigo-400">
              <span className="text-[10px] font-bold uppercase">{interview.month}</span>
              <span className="text-lg font-black leading-none">{interview.day}</span>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">{interview.candidate}</h4>
              <p className="text-xs text-gray-400 mt-0.5">{interview.role} • {interview.type}</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-gray-400">
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {interview.time}</span>
            <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {interview.interviewer}</span>
          </div>

          <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2">
            <Video className="w-4 h-4" /> Join
          </button>
        </div>
      ))}
    </div>
  );
}