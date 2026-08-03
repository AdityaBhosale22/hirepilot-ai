import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import CandidateLayout from "../../components/candidate/CandidateLayout";
import Skeleton from "../../components/shared/Skeleton";
import EmptyState from "../../components/shared/EmptyState";
import ErrorState from "../../components/shared/ErrorState";
import Pagination from "../../components/shared/Pagination";
import {
  Search,
  Filter,
  MapPin,
  DollarSign,
  Building2,
  Sparkles,
  CheckCircle2,
  Loader2,
  Briefcase,
} from "lucide-react";
import jobApi from "../../api/job.api";
import resumeApi from "../../api/resume.api";
import applicationApi from "../../api/application.api";
import { QUERY_KEYS, DEFAULT_QUERY_OPTIONS } from "../../config/constants";
import { formatSalary } from "../../utils/format";
import { getEmploymentTypeLabel } from "../../utils/status";

export default function Jobs() {
  const [search, setSearch] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({
    search: "",
    location: "",
    employmentType: "",
    experience: "",
    minSalary: "",
  });
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [draftFilters, setDraftFilters] = useState({ location: "", employmentType: "", experience: "", minSalary: "" });
  const [feedback, setFeedback] = useState(null);

  const queryParams = {
    page,
    limit: 10,
    sort,
  };

  if (appliedFilters.search) queryParams.search = appliedFilters.search;
  if (appliedFilters.location) queryParams.location = appliedFilters.location;
  if (appliedFilters.employmentType) queryParams.employmentType = appliedFilters.employmentType;
  if (appliedFilters.experience) queryParams.experience = appliedFilters.experience;
  if (appliedFilters.minSalary) queryParams.minSalary = appliedFilters.minSalary;

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: [QUERY_KEYS.PUBLIC_JOBS[0], queryParams],
    queryFn: () => jobApi.getPublicJobs(queryParams),
    ...DEFAULT_QUERY_OPTIONS,
  });

  const { data: resumes } = useQuery({
    queryKey: QUERY_KEYS.RESUMES,
    queryFn: () => resumeApi.getMyResumes(),
    ...DEFAULT_QUERY_OPTIONS,
  });

  const defaultResume =
    resumes?.find((resume) => resume.isDefault) ?? resumes?.[0] ?? null;

  const applyMutation = useMutation({
    mutationFn: ({ jobId, resumeId }) =>
      applicationApi.applyToJob({ jobId, resumeId }),
    onSuccess: (result, variables) => {
      setFeedback({ type: "success", message: `Applied to "${variables.jobTitle}". Good luck!` });
    },
    onError: (err) => {
      setFeedback({ type: "error", message: err?.message || "Could not apply. Please try again." });
    },
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setAppliedFilters((prev) => ({ ...prev, search }));
    setPage(1);
  };

  const handleApplyFilters = () => {
    setAppliedFilters((prev) => ({ ...prev, ...draftFilters }));
    setPage(1);
    setShowFilters(false);
  };

  const handleResetFilters = () => {
    setDraftFilters({ location: "", employmentType: "", experience: "", minSalary: "" });
    setAppliedFilters({ search, location: "", employmentType: "", experience: "", minSalary: "" });
    setPage(1);
  };

  const handlePageChange = (nextPage) => {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleApply = (job) => {
    if (!defaultResume) {
      setFeedback({ type: "error", message: "Upload a resume before applying for jobs." });
      return;
    }
    setFeedback(null);
    applyMutation.mutate({ jobId: job.id, resumeId: defaultResume.id, jobTitle: job.title });
  };

  const jobs = data?.jobs ?? [];
  const pagination = data?.pagination ?? {};
  const hasActiveFilters =
    appliedFilters.search ||
    appliedFilters.location ||
    appliedFilters.employmentType ||
    appliedFilters.experience ||
    appliedFilters.minSalary;

  return (
    <CandidateLayout title="Browse Jobs">
      <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        <form onSubmit={handleSearch} className="relative w-full md:w-1/2">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title, skills, or keywords..."
            className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#4F46E5]"
          />
        </form>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => setShowFilters((prev) => !prev)}
            className={`px-4 py-2.5 bg-[#0a0a0a] border rounded-lg text-xs font-medium text-gray-300 flex items-center gap-2 hover:bg-gray-800 ${
              showFilters || hasActiveFilters ? "border-[#4F46E5] text-[#4F46E5]" : "border-gray-800"
            }`}
          >
            <Filter className="w-4 h-4" /> Filters
            {hasActiveFilters && <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5]" />}
          </button>
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2.5 bg-[#0a0a0a] border border-gray-800 rounded-lg text-xs font-medium text-gray-300 focus:outline-none"
          >
            <option value="latest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="salaryDesc">Highest Salary</option>
            <option value="salaryAsc">Lowest Salary</option>
          </select>
        </div>
      </div>

      {showFilters && (
        <div className="mb-6 p-5 bg-[#0a0a0a] border border-gray-800 rounded-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Location</label>
            <input
              type="text"
              value={draftFilters.location}
              onChange={(e) => setDraftFilters((prev) => ({ ...prev, location: e.target.value }))}
              placeholder="e.g. Remote, Mumbai"
              className="w-full bg-[#111] border border-gray-800 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#4F46E5]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Employment Type</label>
            <select
              value={draftFilters.employmentType}
              onChange={(e) => setDraftFilters((prev) => ({ ...prev, employmentType: e.target.value }))}
              className="w-full bg-[#111] border border-gray-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
            >
              <option value="">All Types</option>
              <option value="FULL_TIME">Full-time</option>
              <option value="PART_TIME">Part-time</option>
              <option value="INTERNSHIP">Internship</option>
              <option value="CONTRACT">Contract</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Min Experience (years)</label>
            <input
              type="number"
              min="0"
              value={draftFilters.experience}
              onChange={(e) => setDraftFilters((prev) => ({ ...prev, experience: e.target.value }))}
              placeholder="e.g. 2"
              className="w-full bg-[#111] border border-gray-800 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#4F46E5]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Min Salary (USD)</label>
            <input
              type="number"
              min="0"
              value={draftFilters.minSalary}
              onChange={(e) => setDraftFilters((prev) => ({ ...prev, minSalary: e.target.value }))}
              placeholder="e.g. 80000"
              className="w-full bg-[#111] border border-gray-800 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#4F46E5]"
            />
          </div>
          <div className="sm:col-span-2 lg:col-span-4 flex items-center justify-end gap-3">
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 text-xs font-medium text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              Reset
            </button>
            <button
              onClick={handleApplyFilters}
              className="px-4 py-2 bg-[#4F46E5] hover:bg-[#4338ca] text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {feedback && (
        <div
          className={`mb-6 px-4 py-3 rounded-lg border text-xs flex items-center gap-2 ${
            feedback.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              : "bg-red-500/10 border-red-500/20 text-red-400"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          ) : (
            <Sparkles className="w-4 h-4 flex-shrink-0" />
          )}
          {feedback.message}
        </div>
      )}

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="p-6 bg-[#0a0a0a] border border-gray-800 rounded-xl space-y-3">
              <Skeleton className="w-1/3" variant="title" />
              <Skeleton className="w-1/4" />
              <Skeleton className="w-full" />
              <div className="flex gap-2">
                <Skeleton className="w-16" />
                <Skeleton className="w-16" />
                <Skeleton className="w-16" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <ErrorState title="Could not load jobs" message={error?.message} onRetry={refetch} />
      ) : jobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title={hasActiveFilters ? "No jobs match your filters" : "No open jobs right now"}
          description={
            hasActiveFilters
              ? "Try adjusting your filters or search terms."
              : "New job postings will appear here as recruiters publish them."
          }
          action={
            hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-[#4F46E5] hover:bg-[#4338ca] text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            )
          }
        />
      ) : (
        <>
          <div className="space-y-4">
            {jobs.map((job) => {
              const isApplying = applyMutation.isPending && applyMutation.variables?.jobId === job.id;
              return (
                <div
                  key={job.id}
                  className="p-6 bg-[#0a0a0a] border border-gray-800 hover:border-gray-700 rounded-xl transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <h2 className="text-lg font-bold text-white">{job.title}</h2>
                        <span className="px-2.5 py-0.5 text-xs font-bold rounded bg-[#06B6D4]/10 text-[#06B6D4] border border-[#06B6D4]/20 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> {getEmploymentTypeLabel(job.employmentType)}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-400 mt-2 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5" /> {job.company?.name}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" /> {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3.5 h-3.5" /> {formatSalary(job.salaryMin, job.salaryMax)}
                        </span>
                        {job.yearsOfExperience != null && (
                          <span className="text-gray-500">Exp: {job.yearsOfExperience}+ yrs</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <button
                        onClick={() => handleApply(job)}
                        disabled={isApplying}
                        className="px-5 py-2.5 bg-[#4F46E5] hover:bg-[#4338ca] text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:pointer-events-none flex items-center gap-1.5"
                      >
                        {isApplying ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Applying...
                          </>
                        ) : (
                          "Apply Now"
                        )}
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 leading-relaxed mb-4 line-clamp-2">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {(job.requiredSkills || []).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-[#111] border border-gray-800 text-gray-300 rounded-md text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6">
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}
    </CandidateLayout>
  );
}
