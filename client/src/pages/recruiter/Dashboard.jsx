import React from 'react';
import RecruiterLayout from '../../components/recruiter/RecruiterLayout';
import AnalyticsCards from '../../components/recruiter/AnalyticsCards';
import ApplicantsTable from '../../components/recruiter/ApplicantsTable';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const recentApplicants = [
    { name: 'Sarah Jenkins', email: 'sarah@example.com', role: 'Senior React Engineer', score: 96, date: '2 hours ago', status: 'New' },
    { name: 'Michael Chen', email: 'm.chen@example.com', role: 'Product Designer', score: 88, date: '5 hours ago', status: 'Screening' },
    { name: 'Emily Davis', email: 'emily.d@example.com', role: 'Senior React Engineer', score: 92, date: '1 day ago', status: 'Interview' },
  ];

  return (
    <RecruiterLayout title="Overview">
      <AnalyticsCards />
      
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-white">Action Required: Top AI Matches</h2>
          <Link to="/recruiter/applicants" className="text-xs font-medium text-[#4F46E5] hover:text-[#06B6D4] flex items-center gap-1">
            View all applicants <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <ApplicantsTable applicants={recentApplicants} />
      </div>
    </RecruiterLayout>
  );
}