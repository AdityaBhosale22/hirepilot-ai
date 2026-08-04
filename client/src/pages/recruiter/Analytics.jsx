import { useQuery } from "@tanstack/react-query";
import RecruiterLayout from "../../components/recruiter/RecruiterLayout";
import AnalyticsCards from "../../components/recruiter/AnalyticsCards";
import Skeleton from "../../components/shared/Skeleton";
import ErrorState from "../../components/shared/ErrorState";
import dashboardApi from "../../api/dashboard.api";
import { QUERY_KEYS, DEFAULT_QUERY_OPTIONS } from "../../config/constants";

function MetricRow({ label, value, loading }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-800/60 last:border-0">
      <span className="text-xs text-gray-400">{label}</span>
      {loading ? (
        <Skeleton className="h-4 w-10" />
      ) : (
        <span className="text-sm font-semibold text-white">{value ?? 0}</span>
      )}
    </div>
  );
}

export default function Analytics() {
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
    <RecruiterLayout title="Hiring Analytics">
      {isError && (
        <div className="mb-6">
          <ErrorState title="Could not load analytics" message={error?.message} onRetry={refetch} />
        </div>
      )}

      <AnalyticsCards stats={stats} loading={isLoading} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-white mb-4">Application Metrics</h3>
          <MetricRow label="Total Applications" value={stats.totalApplications} loading={isLoading} />
          <MetricRow label="Applications Today" value={stats.applicationsToday} loading={isLoading} />
          <MetricRow label="Applications This Week" value={stats.applicationsThisWeek} loading={isLoading} />
        </div>

        <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-white mb-4">Interviews & Jobs</h3>
          <MetricRow label="Interviews Today" value={stats.interviewsToday} loading={isLoading} />
          <MetricRow label="Interviews This Week" value={stats.interviewsThisWeek} loading={isLoading} />
          <MetricRow label="Active Jobs" value={stats.activeJobs} loading={isLoading} />
          <MetricRow label="Closed Jobs" value={stats.closedJobs} loading={isLoading} />
        </div>
      </div>
    </RecruiterLayout>
  );
}
