import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import CandidateLayout from "../../components/candidate/CandidateLayout";
import Skeleton from "../../components/shared/Skeleton";
import EmptyState from "../../components/shared/EmptyState";
import ErrorState from "../../components/shared/ErrorState";
import StatusBadge from "../../components/shared/StatusBadge";
import { Sparkles, CheckCircle2, AlertTriangle, ArrowRight, RefreshCw, FileText } from "lucide-react";
import resumeApi from "../../api/resume.api";
import resumeAIApi from "../../api/resumeAI.api";
import { QUERY_KEYS, DEFAULT_QUERY_OPTIONS } from "../../config/constants";
import { getAnalysisStatusConfig } from "../../utils/status";
import { formatDateTime } from "../../utils/format";

const isTerminal = (status) => status === "COMPLETED" || status === "FAILED";

export default function ResumeAI() {
  const queryClient = useQueryClient();
  const [activeResumeId, setActiveResumeId] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const {
    data: resumes = [],
    isLoading: resumesLoading,
  } = useQuery({
    queryKey: QUERY_KEYS.RESUMES,
    queryFn: () => resumeApi.getMyResumes(),
    ...DEFAULT_QUERY_OPTIONS,
  });

  const defaultResume = resumes.find((resume) => resume.isDefault);
  const effectiveResumeId = activeResumeId ?? defaultResume?.id ?? resumes[0]?.id ?? null;

  const {
    data: report,
    isLoading: reportLoading,
    isError: reportError,
    error,
    refetch: refetchReport,
  } = useQuery({
    queryKey: [QUERY_KEYS.RESUME_ANALYSIS[0], effectiveResumeId],
    queryFn: () => resumeAIApi.getAnalysis(effectiveResumeId),
    enabled: !!effectiveResumeId,
    refetchInterval: (query) => {
      const status = query?.state?.data?.analysisStatus;
      if (status === "QUEUED" || status === "PROCESSING") return 3000;
      return false;
    },
    ...DEFAULT_QUERY_OPTIONS,
  });

  const activeResume = resumes.find((resume) => resume.id === effectiveResumeId);

  const reportIsTerminal = report ? isTerminal(report.analysisStatus) : false;

  useEffect(() => {
    if (reportIsTerminal) {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RESUMES });
    }
  }, [reportIsTerminal, queryClient]);

  const isRunning =
    report?.analysisStatus === "QUEUED" || report?.analysisStatus === "PROCESSING";

  const startMutation = useMutation({
    mutationFn: (resumeId) => resumeAIApi.startAnalysis(resumeId),
    onSuccess: () => {
      setFeedback({ type: "success", message: "Analysis queued. This may take a few moments..." });
      refetchReport();
    },
    onError: (err) => {
      setFeedback({ type: "error", message: err?.message || "Could not start analysis." });
    },
  });

  const handleAudit = () => {
    if (!effectiveResumeId) {
      setFeedback({ type: "error", message: "Upload a resume before running an audit." });
      return;
    }
    setFeedback(null);
    startMutation.mutate(effectiveResumeId);
  };

  const statusConfig = report ? getAnalysisStatusConfig(report.analysisStatus) : null;
  const score = report?.aiScore ?? report?.analysisScore;

  const scoreCards = report
    ? [
        { label: "ATS Pass Rate", value: score != null ? `${Math.round(score)}%` : null, color: "text-emerald-400" },
        { label: "Grammar Score", value: report.grammarScore != null ? `${Math.round(report.grammarScore)}/100` : null, color: "text-amber-400" },
        { label: "Formatting Score", value: report.formatScore != null ? `${Math.round(report.formatScore)}/100` : null, color: "text-cyan-400" },
        { label: "Keyword Density", value: report.keywordScore != null ? `${Math.round(report.keywordScore)}%` : null, color: "text-emerald-400" },
        { label: "Job Readiness", value: report.jobReadinessScore != null ? `${Math.round(report.jobReadinessScore)}/100` : null, color: "text-[#4F46E5]" },
      ]
    : [];

  return (
    <CandidateLayout title="AI Resume Audit & Optimizer">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="p-6 bg-gradient-to-r from-[#4F46E5]/20 via-[#0a0a0a] to-[#06B6D4]/20 border border-gray-800 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#06B6D4]" /> Real-time ATS Scanner Engine
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Scans your resume and scores it across formatting, grammar, and keyword compatibility.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-shrink-0 w-full sm:w-auto">
            <select
              value={effectiveResumeId ?? ""}
              onChange={(e) => setActiveResumeId(e.target.value)}
              disabled={resumesLoading}
              className="px-4 py-3 bg-[#0a0a0a] border border-gray-800 rounded-lg text-xs font-medium text-gray-300 focus:outline-none focus:border-[#4F46E5]"
            >
              {resumesLoading ? (
                <option value="">Loading resumes...</option>
              ) : resumes.length === 0 ? (
                <option value="">No resumes uploaded</option>
              ) : (
                resumes.map((resume) => (
                  <option key={resume.id} value={resume.id}>
                    {resume.title || resume.originalFileName}
                  </option>
                ))
              )}
            </select>

            <button
              onClick={handleAudit}
              disabled={!effectiveResumeId || isRunning}
              className="px-6 py-3 bg-[#4F46E5] hover:bg-[#4338ca] text-white text-xs font-semibold rounded-lg flex items-center gap-2 transition-all shadow-lg flex-shrink-0 disabled:opacity-50"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Analyzing...
                </>
              ) : (
                <>
                  Run New Audit <ArrowRight className="w-4 h-4" />
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

        {!effectiveResumeId && !resumesLoading ? (
          <EmptyState
            icon={FileText}
            title="No resume to audit"
            description="Upload a resume from the Resume Builder to run an AI audit."
            action={
              <a
                href="/candidate/resume"
                className="px-4 py-2 bg-[#4F46E5] hover:bg-[#4338ca] text-white text-xs font-semibold rounded-lg transition-colors inline-block"
              >
                Go to Resume Builder
              </a>
            }
          />
        ) : reportLoading && !report ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <Skeleton key={n} className="h-32" variant="card" />
            ))}
          </div>
        ) : reportError ? (
          <ErrorState title="Could not load analysis" message={error?.message} onRetry={refetchReport} />
        ) : report && !isTerminal(report.analysisStatus) && report.analysisStatus !== "IDLE" ? (
          <div className="p-6 bg-[#0a0a0a] border border-gray-800 rounded-xl flex flex-col items-center justify-center gap-3 py-12">
            <RefreshCw className="w-8 h-8 text-[#4F46E5] animate-spin" />
            <p className="text-sm font-semibold text-white">Analysis in progress...</p>
            <p className="text-xs text-gray-500">
              {report.analysisStatus === "QUEUED" ? "Queued — waiting for worker" : "Processing your resume"}.
              This page updates automatically.
            </p>
          </div>
        ) : report && report.analysisStatus !== "IDLE" ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                {statusConfig && <StatusBadge label={statusConfig.label} className={statusConfig.className} />}
                {report.lastAnalyzedAt && (
                  <span className="text-[10px] text-gray-500">
                    Last analyzed {formatDateTime(report.lastAnalyzedAt)}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {scoreCards.map((card) => (
                <div key={card.label} className="p-6 bg-[#0a0a0a] border border-gray-800 rounded-xl text-center">
                  <span className="text-xs text-gray-400">{card.label}</span>
                  <div className={`text-3xl font-black my-2 ${card.value != null ? card.color : "text-gray-600"}`}>
                    {card.value != null ? card.value : "--"}
                  </div>
                </div>
              ))}
            </div>

            {report.experienceLevel && (
              <div className="p-6 bg-[#0a0a0a] border border-gray-800 rounded-xl">
                <h3 className="text-sm font-semibold text-white mb-2">Experience Summary</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{report.experienceLevel}</p>
              </div>
            )}

            {report.summary && (
              <div className="p-6 bg-[#0a0a0a] border border-gray-800 rounded-xl">
                <h3 className="text-sm font-semibold text-white mb-2">AI Summary</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{report.summary}</p>
              </div>
            )}

            <div className="p-6 bg-[#0a0a0a] border border-gray-800 rounded-xl space-y-4">
              <h3 className="text-sm font-semibold text-white">AI Recommended Action Items</h3>

              {(report.weaknesses || []).length > 0 && (
                <div className="space-y-3">
                  {report.weaknesses.map((item, idx) => (
                    <div key={idx} className="p-4 bg-[#111] border border-amber-500/20 rounded-lg flex gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-semibold text-amber-300">Improve</h4>
                        <p className="text-xs text-gray-400 mt-1 leading-relaxed">{item}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {(report.missingSkills || []).length > 0 && (
                <div className="p-4 bg-[#111] border border-gray-800 rounded-lg flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-semibold text-amber-300">Missing Skills to Add</h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {report.missingSkills.map((skill, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-gray-800 text-gray-300 rounded text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {(report.strengths || []).length > 0 && (
                <div className="space-y-3">
                  {report.strengths.map((item, idx) => (
                    <div key={idx} className="p-4 bg-[#111] border border-emerald-500/20 rounded-lg flex gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-semibold text-emerald-300">Strength</h4>
                        <p className="text-xs text-gray-400 mt-1 leading-relaxed">{item}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {(report.recommendedSkills || []).length > 0 && (
                <div className="p-4 bg-[#111] border border-[#4F46E5]/20 rounded-lg">
                  <h4 className="text-xs font-semibold text-[#4F46E5]">Recommended Skills</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {report.recommendedSkills.map((skill, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-[#4F46E5]/10 border border-[#4F46E5]/20 text-[#4F46E5] rounded text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="p-12 text-center bg-[#0a0a0a] border border-gray-800 rounded-xl">
            <Sparkles className="w-10 h-10 text-[#4F46E5] mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-white">No analysis yet</h3>
            <p className="text-xs text-gray-500 mt-1">
              Click "Run New Audit" to analyze {activeResume?.title || "your resume"} and get actionable feedback.
            </p>
          </div>
        )}
      </div>
    </CandidateLayout>
  );
}
