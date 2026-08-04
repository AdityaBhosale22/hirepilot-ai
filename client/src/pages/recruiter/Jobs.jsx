import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import RecruiterLayout from "../../components/recruiter/RecruiterLayout";
import JobCard from "../../components/recruiter/JobCard";
import Skeleton from "../../components/shared/Skeleton";
import EmptyState from "../../components/shared/EmptyState";
import ErrorState from "../../components/shared/ErrorState";
import Pagination from "../../components/shared/Pagination";
import { Search, Briefcase } from "lucide-react";
import jobApi from "../../api/job.api";
import { QUERY_KEYS, DEFAULT_QUERY_OPTIONS } from "../../config/constants";

const PAGE_SIZE = 9;

const STATUS_TABS = [
  { key: "ALL", label: "All" },
  { key: "OPEN", label: "Active" },
  { key: "DRAFT", label: "Draft" },
  { key: "CLOSED", label: "Closed" },
];

export default function Jobs() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [page, setPage] = useState(1);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: QUERY_KEYS.MY_JOBS,
    queryFn: () => jobApi.getMyJobs({ page: 1, limit: 100 }),
    ...DEFAULT_QUERY_OPTIONS,
  });

  const filtered = useMemo(() => {
    const jobs = data?.jobs ?? [];
    const q = search.trim().toLowerCase();
    return jobs.filter((job) => {
      if (status !== "ALL" && job.status !== status) return false;
      if (!q) return true;
      const haystack = [
        job.title,
        job.location,
        job.employmentType,
        ...(job.requiredSkills ?? []),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [data, search, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentJobs = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleStatusChange = (key) => {
    setStatus(key);
    setPage(1);
  };

  return (
    <RecruiterLayout title="Job Postings">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
        <div className="relative w-full md:w-1/3">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search jobs..."
            className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#4F46E5]"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleStatusChange(tab.key)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                status === tab.key
                  ? "bg-[#4F46E5] text-white"
                  : "bg-[#0a0a0a] border border-gray-800 text-gray-300 hover:bg-gray-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <Skeleton key={n} className="h-56 w-full" variant="card" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState title="Could not load your jobs" message={error?.message} onRetry={refetch} />
      ) : currentJobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title={search || status !== "ALL" ? "No jobs match your filters" : "No jobs yet"}
          description={
            search || status !== "ALL"
              ? "Try adjusting your search or filters."
              : "Post your first job to start receiving applications."
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
          <div className="mt-6">
            <Pagination
              page={page}
              totalPages={totalPages}
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
