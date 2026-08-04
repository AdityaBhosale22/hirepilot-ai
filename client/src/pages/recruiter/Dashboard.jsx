import { useQuery } from "@tanstack/react-query";
import RecruiterLayout from "../../components/recruiter/RecruiterLayout";
import AnalyticsCards from "../../components/recruiter/AnalyticsCards";
import ApplicantsTable from "../../components/recruiter/ApplicantsTable";
import InterviewCalendar from "../../components/recruiter/InterviewCalendar";
import Skeleton from "../../components/shared/Skeleton";
import ErrorState from "../../components/shared/ErrorState";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import dashboardApi from "../../api/dashboard.api";
import { QUERY_KEYS, DEFAULT_QUERY_OPTIONS } from "../../config/constants";

export default function Dashboard() {
  const { user } = useAuth();

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: QUERY_KEYS.RECRUITER_DASHBOARD,
    queryFn: () => dashboardApi.getRecruiterDashboard(),
    ...DEFAULT_QUERY_OPTIONS,
  });

  const stats = data?.stats ?? {};

  return (
    <RecruiterLayout title="Overview">
      <div className="mb-8 bg-gradient-to-r from-gray-900 via-[#0a0a0a] to-gray-900 border border-gray-800 p-6 rounded-xl relative overflow-hidden">
        <div className="max-w-2xl">
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">
            {isLoading ? (
              <Skeleton className="h-7 w-64" variant="title" />
            ) : (
              <>Welcome back, {user?.fullName?.split(" ")[0] || "Recruiter"}!</>
            )}
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
            {isLoading ? (
              <Skeleton className="h-4 w-96 mt-2" />
            ) : (
              `You have ${stats.activeJobs ?? 0} active jobs with ${stats.totalApplications ?? 0} total applications, and ${stats.interviewsToday ?? 0} interview${stats.interviewsToday === 1 ? "" : "s"} scheduled for today.`
            )}
          </p>
        </div>
      </div>

      {isError && (
        <ErrorState
          title="Could not load your dashboard"
          message={error?.message}
          onRetry={refetch}
        />
      )}

      <AnalyticsCards stats={stats} loading={isLoading} />

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-white">Top AI Matches</h2>
          <Link to="/recruiter/applicants" className="text-xs font-medium text-[#4F46E5] hover:text-[#06B6D4] flex items-center gap-1">
            View all applicants <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <ApplicantsTable
          applications={data?.topCandidates}
          loading={isLoading}
          error={isError ? error?.message : null}
          onRetry={refetch}
        />
      </div>

      <div className="mt-8">
        <h2 className="text-base font-semibold text-white mb-4">Upcoming Interviews</h2>
        <InterviewCalendar
          interviews={data?.upcomingInterviews}
          loading={isLoading}
          error={isError ? error?.message : null}
          onRetry={refetch}
        />
      </div>
    </RecruiterLayout>
  );
}
