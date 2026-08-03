import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import CandidateLayout from "../../components/candidate/CandidateLayout";
import Skeleton from "../../components/shared/Skeleton";
import EmptyState from "../../components/shared/EmptyState";
import ErrorState from "../../components/shared/ErrorState";
import StatusBadge from "../../components/shared/StatusBadge";
import {
  Target,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  ArrowRight,
  Building2,
} from "lucide-react";
import jobMatchingApi from "../../api/jobMatching.api";
import jobApi from "../../api/job.api";
import resumeApi from "../../api/resume.api";
import { QUERY_KEYS, DEFAULT_QUERY_OPTIONS } from "../../config/constants";
import { getMatchRecommendationConfig, getAnalysisStatusConfig } from "../../utils/status";
import { formatDateTime } from "../../utils/format";

const IN_PROGRESS = ["QUEUED", "PROCESSING"];

export default function JobMatching() {
  const queryClient = useQueryClient();
  const [selectedJobId, setSelectedJobId] = useState("");
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [feedback, setFeedback] = useState(null);

  const {
    data: matches = [],
    isLoading: matchesLoading,
    isError: matchesError,
    error: matchesErrorMsg,
    refetch: refetchMatches,
  } = useQuery({
    queryKey: QUERY_KEYS.MY_MATCHES,
    queryFn: () => jobMatchingApi.getMyMatches(),
    refetchInterval: (query) => {
      const list = query?.state?.data ?? [];
      if (list.some((match) => IN_PROGRESS.includes(match.analysisStatus))) return 5000;
      return false;
    },
    ...DEFAULT_QUERY_OPTIONS,
  });

  const { data: jobs = [] } = useQuery({
    queryKey: [QUERY_KEYS.PUBLIC_JOBS[0], { page: 1, limit: 50, sort: "latest" }],
    queryFn: () => jobApi.getPublicJobs({ page: 1, limit: 50, sort: "latest" }),
    select: (result) => result.jobs,
    ...DEFAULT_QUERY_OPTIONS,
  });

  const { data: resumes = [], isLoading: resumesLoading } = useQuery({
    queryKey: QUERY_KEYS.RESUMES,
    queryFn: () => resumeApi.getMyResumes(),
    ...DEFAULT_QUERY_OPTIONS,
  });

  const analyzableResumes = resumes.filter((resume) => resume.analysisStatus === "COMPLETED");

  const analyzeMutation = useMutation({
    mutationFn: ({ jobId, resumeId }) => jobMatchingApi.analyzeJob({ jobId, resumeId }),
    onSuccess: () => {
      setFeedback({ type: "success", message: "Match analysis queued. Results will appear below." });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MY_MATCHES });
      refetchMatches();
    },
    onError: (err) => {
      setFeedback({ type: "error", message: err?.message || "Could not start match analysis." });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (matchId) => jobMatchingApi.deleteMatch(matchId),
    onSuccess: () => {
      setFeedback({ type: "success", message: "Match removed." });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MY_MATCHES });
    },
    onError: (err) => {
      setFeedback({ type: "error", message: err?.message || "Could not remove match." });
    },
  });

  const handleAnalyze = () => {
    if (!selectedJobId || !selectedResumeId) {
      setFeedback({ type: "error", message: "Select both a job and a resume to analyze." });
      return;
    }
    setFeedback(null);
    analyzeMutation.mutate({ jobId: selectedJobId, resumeId: selectedResumeId });
  };

  const handleDelete = (match) => {
    if (window.confirm("Remove this job match from your list?")) {
      deleteMutation.mutate(match.id);
    }
  };

  const hasInProgress = matches.some((match) => IN_PROGRESS.includes(match.analysisStatus));

  return (
    <CandidateLayout title="AI Job Matching Engine">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="mb-6 p-6 bg-[#0a0a0a] border border-gray-800 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#06B6D4]/10 rounded-xl text-[#06B6D4]">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Semantic AI Matcher</h2>
              <p className="text-xs text-gray-400">
                Compare your resume against open roles to see fit, skill gaps, and recommendations.
              </p>
            </div>
          </div>
          {hasInProgress && (
            <span className="inline-flex px-3 py-1 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-full text-xs font-semibold items-center gap-1.5">
              <Loader2 className="w-3 h-3 animate-spin" /> Analyzing...
            </span>
          )}
        </div>

        <div className="p-6 bg-[#0a0a0a] border border-gray-800 rounded-xl">
          <h3 className="text-sm font-semibold text-white mb-4">Run a New Match Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Select Job</label>
              <select
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                className="w-full bg-[#111] border border-gray-800 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#4F46E5]"
              >
                <option value="">Choose an open job...</option>
                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title} — {job.company?.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                Select Analyzed Resume
              </label>
              <select
                value={selectedResumeId}
                onChange={(e) => setSelectedResumeId(e.target.value)}
                disabled={resumesLoading}
                className="w-full bg-[#111] border border-gray-800 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#4F46E5]"
              >
                <option value="">Choose a resume...</option>
                {analyzableResumes.map((resume) => (
                  <option key={resume.id} value={resume.id}>
                    {resume.title || resume.originalFileName}
                  </option>
                ))}
              </select>
              {analyzableResumes.length === 0 && !resumesLoading && (
                <p className="text-[10px] text-gray-500 mt-1.5">
                  You need a resume with a completed AI audit (see AI Resume Audit) to run matching.
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 mt-4">
            <button
              onClick={handleAnalyze}
              disabled={analyzeMutation.isPending || !selectedJobId || !selectedResumeId}
              className="px-5 py-2.5 bg-[#4F46E5] hover:bg-[#4338ca] text-white text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              {analyzeMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Analyzing...
                </>
              ) : (
                <>
                  Run Match Analysis <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {feedback && (
          <div
            className={`px-4 py-3 rounded-lg border text-xs flex items-center gap-2 ${
              feedback.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}
          >
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            )}
            {feedback.message}
          </div>
        )}

        <div>
          <h2 className="text-base font-semibold text-white mb-4">My Matches</h2>

          {matchesLoading ? (
            <div className="space-y-4">
              {[1, 2].map((n) => (
                <Skeleton key={n} className="h-40 w-full" variant="card" />
              ))}
            </div>
          ) : matchesError ? (
            <ErrorState title="Could not load matches" message={matchesErrorMsg?.message} onRetry={refetchMatches} />
          ) : matches.length === 0 ? (
            <EmptyState
              icon={Target}
              title="No matches yet"
              description="Run a match analysis above to compare your resume against a job."
            />
          ) : (
            <div className="space-y-4">
              {matches.map((match) => {
                const statusConfig = getAnalysisStatusConfig(match.analysisStatus);
                const recommendationConfig = getMatchRecommendationConfig(match.recommendation);
                return (
                  <div key={match.id} className="p-6 bg-[#0a0a0a] border border-gray-800 rounded-xl">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-[#06B6D4]/10 rounded-xl text-[#06B6D4] flex-shrink-0">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-white">{match.job?.title}</h3>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {match.job?.company?.name}
                            {match.job?.location ? ` • ${match.job.location}` : ""}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <StatusBadge label={statusConfig.label} className={statusConfig.className} />
                        {match.analysisStatus === "COMPLETED" && match.recommendation && (
                          <StatusBadge label={recommendationConfig.label} className={recommendationConfig.className} />
                        )}
                        {match.analysisStatus === "COMPLETED" && match.overallScore != null && (
                          <span className="px-2.5 py-1 text-xs font-bold rounded-full border border-[#4F46E5]/20 bg-[#4F46E5]/10 text-[#4F46E5]">
                            {Math.round(match.overallScore)}% Match
                          </span>
                        )}
                      </div>
                    </div>

                    {match.analysisStatus === "COMPLETED" ? (
                      <>
                        {match.summary && (
                          <p className="text-xs text-gray-400 leading-relaxed mt-4">{match.summary}</p>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                          <div>
                            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400 mb-2">
                              Matched Skills
                            </h4>
                            {match.matchedSkills?.length > 0 ? (
                              <div className="flex flex-wrap gap-1.5">
                                {match.matchedSkills.map((skill, idx) => (
                                  <span key={idx} className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded text-[10px]">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-gray-500">No skills matched.</p>
                            )}
                          </div>
                          <div>
                            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-amber-400 mb-2">
                              Missing Skills
                            </h4>
                            {match.missingSkills?.length > 0 ? (
                              <div className="flex flex-wrap gap-1.5">
                                {match.missingSkills.map((skill, idx) => (
                                  <span key={idx} className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded text-[10px]">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-gray-500">No missing skills.</p>
                            )}
                          </div>
                        </div>

                        {match.analysisCompletedAt && (
                          <p className="text-[10px] text-gray-500 mt-4">
                            Analyzed {formatDateTime(match.analysisCompletedAt)}
                          </p>
                        )}
                      </>
                    ) : (
                      <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#4F46E5]" />
                        {match.analysisStatus === "QUEUED" ? "Queued for analysis..." : "Analyzing — this may take a moment..."}
                      </div>
                    )}

                    {match.analysisStatus === "COMPLETED" && (
                      <div className="mt-4 pt-4 border-t border-gray-800/80 flex justify-end">
                        <button
                          onClick={() => handleDelete(match)}
                          disabled={deleteMutation.isPending}
                          className="px-3 py-1.5 text-[10px] font-medium text-gray-400 hover:text-red-400 border border-gray-800 rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="w-3 h-3" /> Remove
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </CandidateLayout>
  );
}
