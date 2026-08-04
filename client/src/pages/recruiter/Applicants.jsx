import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import RecruiterLayout from "../../components/recruiter/RecruiterLayout";
import ApplicantsTable from "../../components/recruiter/ApplicantsTable";
import Pagination from "../../components/shared/Pagination";
import EmptyState from "../../components/shared/EmptyState";
import { Download, Briefcase } from "lucide-react";
import jobApi from "../../api/job.api";
import applicationApi from "../../api/application.api";
import { QUERY_KEYS, DEFAULT_QUERY_OPTIONS } from "../../config/constants";
import { getApplicationStatusConfig } from "../../utils/status";
import { formatDate } from "../../utils/format";

const STATUS_FILTERS = [
  { key: "", label: "All Statuses" },
  { key: "APPLIED", label: "Applied" },
  { key: "REVIEWING", label: "In Review" },
  { key: "SHORTLISTED", label: "Shortlisted" },
  { key: "INTERVIEW_SCHEDULED", label: "Interview Scheduled" },
  { key: "HIRED", label: "Hired" },
  { key: "REJECTED", label: "Rejected" },
];

export default function Applicants() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [feedback, setFeedback] = useState(null);
  const queryClient = useQueryClient();

  const { data: jobsData, isLoading: jobsLoading } = useQuery({
    queryKey: QUERY_KEYS.MY_JOBS,
    queryFn: () => jobApi.getMyJobs({ page: 1, limit: 100 }),
    ...DEFAULT_QUERY_OPTIONS,
  });

  const jobs = jobsData?.jobs ?? [];
  const selectedJobId = searchParams.get("jobId") || jobs[0]?.id || "";

  const queryParams = { page, limit: 10 };
  if (status) queryParams.status = status;

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: [QUERY_KEYS.JOB_APPLICATIONS[0], selectedJobId, queryParams],
    queryFn: () => applicationApi.getJobApplications(selectedJobId, queryParams),
    enabled: !!selectedJobId,
    ...DEFAULT_QUERY_OPTIONS,
  });

  const applications = data?.applications ?? [];
  const pagination = data?.pagination ?? {};

  const statusMutation = useMutation({
    mutationFn: ({ applicationId, nextStatus }) =>
      applicationApi.updateApplicationStatus(applicationId, nextStatus),
    onSuccess: (result, variables) => {
      setFeedback({
        type: "success",
        message: `Application moved to "${getApplicationStatusConfig(variables.nextStatus).label}".`,
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.JOB_APPLICATIONS });
    },
    onError: (err) =>
      setFeedback({ type: "error", message: err?.message || "Could not update application status." }),
  });

  const handleJobChange = (jobId) => {
    setSearchParams(jobId ? { jobId } : {});
    setPage(1);
    setStatus("");
    setFeedback(null);
  };

  const handleExportCsv = () => {
    if (applications.length === 0) return;
    const rows = [
      ["Candidate", "Email", "Role", "AI Score", "Applied Date", "Status"],
      ...applications.map((app) => [
        app.candidate?.user?.fullName ?? "",
        app.candidate?.user?.email ?? "",
        app.job?.title ?? "",
        app.resume?.aiScore != null ? app.resume.aiScore : "",
        formatDate(app.appliedAt),
        getApplicationStatusConfig(app.status).label,
      ]),
    ];
    const csv = rows
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${data?.job?.title || "applicants"}-applicants.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <RecruiterLayout title="Applicant Tracking">
      {feedback && (
        <div className={`mb-6 px-4 py-3 rounded-lg border text-xs ${
          feedback.type === "error"
            ? "bg-red-500/10 border-red-500/20 text-red-400"
            : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
        }`}>
          {feedback.message}
        </div>
      )}

      <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
        <div className="flex gap-2">
          <select
            value={selectedJobId}
            onChange={(e) => handleJobChange(e.target.value)}
            disabled={jobsLoading}
            className="bg-[#0a0a0a] border border-gray-800 rounded-lg px-3 py-1.5 text-xs text-white outline-none disabled:opacity-50"
          >
            {jobsLoading ? (
              <option>Loading jobs...</option>
            ) : jobs.length === 0 ? (
              <option>No jobs yet</option>
            ) : (
              jobs.map((job) => (
                <option key={job.id} value={job.id}>{job.title}</option>
              ))
            )}
          </select>
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            disabled={!selectedJobId}
            className="bg-[#0a0a0a] border border-gray-800 rounded-lg px-3 py-1.5 text-xs text-white outline-none disabled:opacity-50"
          >
            {STATUS_FILTERS.map((filter) => (
              <option key={filter.key} value={filter.key}>{filter.label}</option>
            ))}
          </select>
        </div>
        <button
          onClick={handleExportCsv}
          disabled={applications.length === 0}
          className="px-3 py-1.5 bg-gray-900 border border-gray-700 text-xs text-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-800 disabled:opacity-40 disabled:pointer-events-none"
        >
          <Download className="w-3.5 h-3.5" /> Export CSV
        </button>
      </div>

      {!jobsLoading && jobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No jobs to track"
          description="Create a job posting first so you can start tracking applicants."
        />
      ) : (
        <>
          <ApplicantsTable
            applications={applications}
            loading={isLoading}
            error={isError ? error?.message : null}
            onRetry={refetch}
            onStatusChange={(applicationId, nextStatus) =>
              statusMutation.mutate({ applicationId, nextStatus })
            }
          />
          <div className="mt-6">
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={(nextPage) => {
                setPage(nextPage);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </div>
        </>
      )}
    </RecruiterLayout>
  );
}
