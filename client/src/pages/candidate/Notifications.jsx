import React from 'react';
import CandidateLayout from '../../components/candidate/CandidateLayout';
import NotificationList from '../../components/candidate/NotificationList';

export default function Notifications() {
  const mockNotifications = [
    {
      id: 1,
      title: 'Interview Scheduled with Supabase',
      message: 'Technical Round 2 is confirmed for tomorrow at 2:00 PM EST.',
      time: '10m ago',
      type: 'interview',
      read: false
    },
    {
      id: 2,
      title: 'AI Resume Score Increased',
      message: 'Your resume score jumped from 82 to 88 following your latest update.',
      time: '2h ago',
      type: 'ai',
      read: false
    },
    {
      id: 3,
      title: 'Application Viewed by Vercel',
      message: 'A recruiter at Vercel reviewed your Senior React Engineer submission.',
      time: '1d ago',
      type: 'general',
      read: true
    }
  ];

  return (
    <CandidateLayout title="Notifications">
      <div className="max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold text-white">Recent Alerts</h2>
          <button className="text-xs text-[#06B6D4] hover:underline">Mark all as read</button>
        </div>
        <NotificationList notifications={mockNotifications} />
      </div>
    </CandidateLayout>
  );
}