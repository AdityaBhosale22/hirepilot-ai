import React from 'react';
import CandidateLayout from '../../components/candidate/CandidateLayout';
import StatsCards from '../../components/candidate/StatsCards';
import RecentApplications from '../../components/candidate/RecentApplications';
import RecommendedJobs from '../../components/candidate/RecommendedJobs';
import ResumeScoreCard from '../../components/candidate/ResumeScoreCard';
import InterviewTimeline from '../../components/candidate/InterviewTimeline';

export default function Dashboard() {
  return (
    <CandidateLayout title="Candidate Dashboard">
      {/* Welcome Banner */}
      <div className="mb-8 bg-gradient-to-r from-gray-900 via-[#0a0a0a] to-gray-900 border border-gray-800 p-6 rounded-xl relative overflow-hidden">
        <div className="max-w-2xl">
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">
            Welcome back, John! 👋
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
            Your profile is being actively recommended to 12 tech companies. You have 2 upcoming interviews this week.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 space-y-8">
          <RecentApplications />
          <RecommendedJobs />
        </div>

        <div className="space-y-8">
          <ResumeScoreCard />
          <InterviewTimeline />
        </div>
      </div>
    </CandidateLayout>
  );
}