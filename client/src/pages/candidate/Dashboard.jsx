import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import CandidateLayout from "../../components/candidate/CandidateLayout";
import StatsCards from "../../components/candidate/StatsCards";
import RecentApplications from "../../components/candidate/RecentApplications";
import RecommendedJobs from "../../components/candidate/RecommendedJobs";
import ResumeScoreCard from "../../components/candidate/ResumeScoreCard";
import InterviewTimeline from "../../components/candidate/InterviewTimeline";
import Skeleton from "../../components/shared/Skeleton";
import ErrorState from "../../components/shared/ErrorState";
import { useAuth } from "../../contexts/AuthContext";
import dashboardApi from "../../api/dashboard.api";
import applicationApi from "../../api/application.api";
import { QUERY_KEYS, DEFAULT_QUERY_OPTIONS } from "../../config/constants";

export default function Dashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: QUERY_KEYS.DASHBOARD,
    queryFn: () => dashboardApi.getCandidateDashboard(),
    ...DEFAULT_QUERY_OPTIONS,
  });

  const applyMutation = useMutation({
    mutationFn: ({ jobId, resumeId }) =>
      applicationApi.applyToJob({ jobId, resumeId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD });
    },
  });

  const handleApply = (job) => {
    const resumeId = data?.defaultResume?.id;
    if (!resumeId) return;
    applyMutation.mutate({ jobId: job.id, resumeId });
  };

  return (
    <CandidateLayout title="Candidate Dashboard">
      <div className="mb-8 bg-gradient-to-r from-gray-900 via-[#0a0a0a] to-gray-900 border border-gray-800 p-6 rounded-xl relative overflow-hidden">
        <div className="max-w-2xl">
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">
            {isLoading ? (
              <Skeleton className="h-7 w-64" variant="title" />
            ) : (
              <>Welcome back, {user?.fullName?.split(" ")[0] || "Candidate"}! 👋</>
            )}
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
            {isLoading ? (
              <Skeleton className="h-4 w-96 mt-2" />
            ) : (
              `You have applied to ${data?.stats?.applications ?? 0} jobs with ${data?.upcomingInterviews?.length ?? 0} upcoming interview${data?.upcomingInterviews?.length === 1 ? "" : "s"}. Your profile is ${data?.profileCompletion ?? 0}% complete.`
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

      <StatsCards stats={data?.stats} loading={isLoading} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 space-y-8">
          <RecentApplications
            applications={data?.recentApplications}
            loading={isLoading}
            error={isError ? error?.message : null}
            onRetry={refetch}
          />
          <RecommendedJobs
            jobs={data?.recommendedJobs}
            loading={isLoading}
            error={isError ? error?.message : null}
            onRetry={refetch}
            onApply={handleApply}
            applyingId={applyMutation.isPending ? applyMutation.variables?.jobId : null}
            defaultResumeId={data?.defaultResume?.id}
          />
        </div>

        <div className="space-y-8">
          <ResumeScoreCard resume={data?.defaultResume} loading={isLoading} />
          <InterviewTimeline
            interviews={data?.upcomingInterviews}
            loading={isLoading}
            error={isError ? error?.message : null}
            onRetry={refetch}
          />
        </div>
      </div>
    </CandidateLayout>
  );
}
