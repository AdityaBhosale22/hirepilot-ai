import React from 'react';
import RecruiterLayout from '../../components/recruiter/RecruiterLayout';
import ApplicantsTable from '../../components/recruiter/ApplicantsTable';
import { Download } from 'lucide-react';

export default function Applicants() {
  const applicants = [
    { name: 'Sarah Jenkins', email: 'sarah@example.com', role: 'Senior React Engineer', score: 96, date: '2026-08-02', status: 'New' },
    { name: 'Michael Chen', email: 'm.chen@example.com', role: 'Product Designer', score: 88, date: '2026-08-01', status: 'Screening' },
    { name: 'Emily Davis', email: 'emily.d@example.com', role: 'Senior React Engineer', score: 92, date: '2026-07-30', status: 'Interview' },
    { name: 'James Wilson', email: 'j.wilson@example.com', role: 'Backend Developer', score: 75, date: '2026-07-28', status: 'Rejected' },
    { name: 'Anna Lee', email: 'anna.lee@example.com', role: 'Product Designer', score: 95, date: '2026-07-25', status: 'Offered' },
  ];

  return (
    <RecruiterLayout title="Applicant Tracking">
      <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
        <div className="flex gap-2">
          <select className="bg-[#0a0a0a] border border-gray-800 rounded-lg px-3 py-1.5 text-xs text-white outline-none">
            <option>All Jobs</option>
            <option>Senior React Engineer</option>
            <option>Product Designer</option>
          </select>
          <select className="bg-[#0a0a0a] border border-gray-800 rounded-lg px-3 py-1.5 text-xs text-white outline-none">
            <option>All Statuses</option>
            <option>New</option>
            <option>Interviewing</option>
          </select>
        </div>
        <button className="px-3 py-1.5 bg-gray-900 border border-gray-700 text-xs text-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-800">
          <Download className="w-3.5 h-3.5" /> Export CSV
        </button>
      </div>

      <ApplicantsTable applicants={applicants} />
    </RecruiterLayout>
  );
}