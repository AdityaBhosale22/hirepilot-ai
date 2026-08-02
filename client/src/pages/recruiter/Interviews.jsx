import React from 'react';
import RecruiterLayout from '../../components/recruiter/RecruiterLayout';
import InterviewCalendar from '../../components/recruiter/InterviewCalendar';

export default function Interviews() {
  const upcoming = [
    { month: 'Aug', day: '03', candidate: 'Emily Davis', role: 'Senior React Engineer', type: 'Technical Panel', time: '10:00 AM EST', interviewer: 'Alex R.' },
    { month: 'Aug', day: '04', candidate: 'Michael Chen', role: 'Product Designer', type: 'Portfolio Review', time: '2:30 PM EST', interviewer: 'Sarah J.' },
    { month: 'Aug', day: '06', candidate: 'David Smith', role: 'Backend Dev', type: 'System Design', time: '11:00 AM EST', interviewer: 'Alex R.' },
  ];

  return (
    <RecruiterLayout title="Interviews & Scheduling">
      <div className="max-w-4xl">
        <div className="mb-6 flex justify-between items-end border-b border-gray-800 pb-4">
          <div>
            <h2 className="text-base font-semibold text-white">Upcoming This Week</h2>
            <p className="text-xs text-gray-400">3 Interviews scheduled.</p>
          </div>
          <button className="px-4 py-2 bg-[#4F46E5] text-white text-xs font-semibold rounded-lg hover:bg-[#4338ca]">
            Schedule New
          </button>
        </div>
        <InterviewCalendar interviews={upcoming} />
      </div>
    </RecruiterLayout>
  );
}