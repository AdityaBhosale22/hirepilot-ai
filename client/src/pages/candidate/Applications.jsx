import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import CandidateLayout from "../../components/candidate/CandidateLayout";
import RecentApplications from "../../components/candidate/RecentApplications";
import Pagination from "../../components/shared/Pagination";
import ErrorState from "../../components/shared/ErrorState";
import applicationApi from "../../api/application.api";
import { QUERY_KEYS, DEFAULT_QUERY_OPTIONS } from "../../config/constants";

const TABS = [
  { key: "all", label: "All", status: "" },
  { key: "applied", label: "Applied", status: "APPLIED" },
  { key: "reviewing", label: "In Review", status: "REVIEWING" },
  { key: "shortlisted", label: "Shortlisted", status: "SHORTLISTED" },
  { key: "interview-scheduled", label: "Interviews", status: "INTERVIEW_SCHEDULED" },
  { key: "rejected", label: "Rejected", status: "REJECTED" },
  { key: "hired", label: "Hired", status: "HIRED" },
];

export default function Applications() {
  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(1);

  const active = TABS.find((tab) => tab.key === activeTab) ?? TABS[0];

  const queryParams = { page, limit: 10 };
  if (active.status) queryParams.status = active.status;

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: [QUERY_KEYS.MY_APPLICATIONS[0], queryParams],
    queryFn: () => applicationApi.getMyApplications(queryParams),
    ...DEFAULT_QUERY_OPTIONS,
  });

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    setPage(1);
  };

  const handlePageChange = (nextPage) => {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <CandidateLayout title="My Applications">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-gray-800 pb-4">
        <div className="flex gap-2 text-xs font-medium flex-wrap">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.key ? "bg-[#4F46E5] text-white" : "text-gray-400 hover:bg-gray-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {isError && (
        <ErrorState title="Could not load applications" message={error?.message} onRetry={refetch} />
      )}

      <RecentApplications
        applications={data?.applications}
        loading={isLoading}
        error={isError ? error?.message : null}
        onRetry={refetch}
        title="My Applications"
        description={active.status ? `Showing ${active.label.toLowerCase()} applications` : "All your submitted applications"}
        showViewAll={false}
      />

      <div className="mt-2">
        <Pagination
          page={data?.pagination?.page}
          totalPages={data?.pagination?.totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </CandidateLayout>
  );
}
