import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import CandidateLayout from "../../components/candidate/CandidateLayout";
import Skeleton from "../../components/shared/Skeleton";
import EmptyState from "../../components/shared/EmptyState";
import ErrorState from "../../components/shared/ErrorState";
import Pagination from "../../components/shared/Pagination";
import StatusBadge from "../../components/shared/StatusBadge";
import { Calendar, Video, Clock, Globe, VideoOff } from "lucide-react";
import interviewApi from "../../api/interview.api";
import { QUERY_KEYS, DEFAULT_QUERY_OPTIONS } from "../../config/constants";
import { getInterviewStatusConfig, getInterviewTypeLabel } from "../../utils/status";
import { formatDateTime } from "../../utils/format";

const TABS = [
  { key: "all", label: "All", status: "" },
  { key: "scheduled", label: "Scheduled", status: "SCHEDULED" },
  { key: "rescheduled", label: "Rescheduled", status: "RESCHEDULED" },
  { key: "completed", label: "Completed", status: "COMPLETED" },
  { key: "cancelled", label: "Cancelled", status: "CANCELLED" },
];

export default function Interviews() {
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
    queryKey: [QUERY_KEYS.INTERVIEWS[0], queryParams],
    queryFn: () => interviewApi.getInterviews(queryParams),
    ...DEFAULT_QUERY_OPTIONS,
  });

  const interviews = data?.interviews ?? [];
  const pagination = data?.pagination ?? {};

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    setPage(1);
  };

  const handlePageChange = (nextPage) => {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <CandidateLayout title="Scheduled Interviews">
      <div className="max-w-4xl">
        <div className="flex flex-wrap gap-2 text-xs font-medium mb-6 border-b border-gray-800 pb-4">
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

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((n) => (
              <Skeleton key={n} className="h-40 w-full" variant="card" />
            ))}
          </div>
        ) : isError ? (
          <ErrorState title="Could not load interviews" message={error?.message} onRetry={refetch} />
        ) : interviews.length === 0 ? (
          <EmptyState
            icon={Video}
            title="No interviews found"
            description={
              activeTab === "all"
                ? "When recruiters schedule interviews with you, they will appear here."
                : `No interviews in the "${active.label}" category.`
            }
          />
        ) : (
          <>
            <div className="space-y-4">
              {interviews.map((interview) => {
                const status = getInterviewStatusConfig(interview.status);
                const isJoinable =
                  interview.meetingLink &&
                  (interview.status === "SCHEDULED" || interview.status === "RESCHEDULED");
                return (
                  <div key={interview.id} className="p-6 bg-[#0a0a0a] border border-gray-800 rounded-xl">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 flex-shrink-0">
                          <Video className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-base font-bold text-white">
                              {interview.application?.job?.title}
                            </h3>
                            <StatusBadge label={status.label} className={status.className} />
                          </div>
                          <p className="text-xs text-gray-400 mt-1">
                            {interview.application?.job?.company?.name} •{" "}
                            {getInterviewTypeLabel(interview.interviewType)} Interview
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-800/80 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gray-500" /> {formatDateTime(interview.scheduledAt)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-gray-500" /> {interview.durationMinutes} min
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5 text-gray-500" /> {interview.timezone}
                        </span>
                      </div>

                      {isJoinable ? (
                        <a
                          href={interview.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 bg-[#4F46E5] hover:bg-[#4338ca] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                        >
                          <Video className="w-3.5 h-3.5" /> Join Call
                        </a>
                      ) : (
                        <span className="text-[10px] text-gray-500 flex items-center gap-1.5">
                          <VideoOff className="w-3.5 h-3.5" />
                          {interview.meetingLink ? "Meeting link unavailable" : "Link will be shared soon"}
                        </span>
                      )}
                    </div>

                    {interview.notes && (
                      <p className="mt-3 text-[11px] text-gray-500 bg-[#111] border border-gray-800 rounded-lg p-3 leading-relaxed">
                        {interview.notes}
                      </p>
                    )}
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
      </div>
    </CandidateLayout>
  );
}
