import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import RecruiterLayout from "../../components/recruiter/RecruiterLayout";
import InterviewCalendar from "../../components/recruiter/InterviewCalendar";
import Pagination from "../../components/shared/Pagination";
import ErrorState from "../../components/shared/ErrorState";
import { Video, X, Loader2, CalendarPlus } from "lucide-react";
import interviewApi from "../../api/interview.api";
import jobApi from "../../api/job.api";
import applicationApi from "../../api/application.api";
import { QUERY_KEYS, DEFAULT_QUERY_OPTIONS } from "../../config/constants";

const TABS = [
  { key: "all", label: "All", status: "" },
  { key: "scheduled", label: "Scheduled", status: "SCHEDULED" },
  { key: "rescheduled", label: "Rescheduled", status: "RESCHEDULED" },
  { key: "completed", label: "Completed", status: "COMPLETED" },
  { key: "cancelled", label: "Cancelled", status: "CANCELLED" },
];

const INTERVIEW_TYPES = [
  { value: "ONLINE", label: "Online" },
  { value: "ONSITE", label: "Onsite" },
  { value: "PHONE", label: "Phone" },
];

const EMPTY_FORM = {
  interviewType: "ONLINE",
  scheduledAt: "",
  durationMinutes: "30",
  timezone: "UTC",
  meetingLink: "",
  notes: "",
};

export default function Interviews() {
  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(1);
  const [showSchedule, setShowSchedule] = useState(false);
  const [scheduleJobId, setScheduleJobId] = useState("");
  const [scheduleAppId, setScheduleAppId] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);
  const [scheduleError, setScheduleError] = useState(null);
  const queryClient = useQueryClient();

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

  const { data: jobsData, isLoading: jobsLoading } = useQuery({
    queryKey: QUERY_KEYS.MY_JOBS,
    queryFn: () => jobApi.getMyJobs({ page: 1, limit: 100 }),
    ...DEFAULT_QUERY_OPTIONS,
  });

  const { data: shortlistData, isLoading: shortlistLoading } = useQuery({
    queryKey: [QUERY_KEYS.JOB_APPLICATIONS[0], scheduleJobId, { page: 1, limit: 100, status: "SHORTLISTED" }],
    queryFn: () =>
      applicationApi.getJobApplications(scheduleJobId, { page: 1, limit: 100, status: "SHORTLISTED" }),
    enabled: showSchedule && !!scheduleJobId,
    ...DEFAULT_QUERY_OPTIONS,
  });

  const jobs = jobsData?.jobs ?? [];
  const shortlisted = shortlistData?.applications ?? [];

  const statusMutation = useMutation({
    mutationFn: ({ interviewId, nextStatus }) =>
      interviewApi.updateInterviewStatus(interviewId, { status: nextStatus }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INTERVIEWS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RECRUITER_DASHBOARD });
    },
  });

  const scheduleMutation = useMutation({
    mutationFn: (payload) => interviewApi.scheduleInterview(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INTERVIEWS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.JOB_APPLICATIONS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RECRUITER_DASHBOARD });
      setShowSchedule(false);
      setScheduleJobId("");
      setScheduleAppId("");
      setForm(EMPTY_FORM);
      setScheduleError(null);
    },
    onError: (err) =>
      setScheduleError(err?.message || "Could not schedule the interview."),
  });

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    setPage(1);
  };

  const handleOpenSchedule = () => {
    setScheduleError(null);
    setScheduleAppId("");
    setForm(EMPTY_FORM);
    setScheduleJobId(jobs[0]?.id || "");
    setShowSchedule(true);
  };

  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    if (!scheduleAppId) {
      setScheduleError("Select a shortlisted candidate.");
      return;
    }
    if (!form.scheduledAt) {
      setScheduleError("Pick a date and time for the interview.");
      return;
    }
    const payload = {
      applicationId: scheduleAppId,
      interviewType: form.interviewType,
      scheduledAt: new Date(form.scheduledAt).toISOString(),
      durationMinutes: Number(form.durationMinutes),
      timezone: form.timezone.trim() || "UTC",
      meetingLink: form.meetingLink.trim() || "",
      notes: form.notes.trim() || "",
    };
    setScheduleError(null);
    scheduleMutation.mutate(payload);
  };

  return (
    <RecruiterLayout title="Interviews & Scheduling">
      <div className="max-w-4xl">
        <div className="mb-6 flex justify-between items-end border-b border-gray-800 pb-4">
          <div>
            <h2 className="text-base font-semibold text-white">
              {activeTab === "all" ? "All Interviews" : `${active.label} Interviews`}
            </h2>
            <p className="text-xs text-gray-400">
              {isLoading ? "Loading..." : `${pagination.totalInterviews ?? interviews.length} interview${(pagination.totalInterviews ?? interviews.length) === 1 ? "" : "s"}.`}
            </p>
          </div>
          <button
            onClick={handleOpenSchedule}
            className="px-4 py-2 bg-[#4F46E5] text-white text-xs font-semibold rounded-lg hover:bg-[#4338ca] flex items-center gap-1.5"
          >
            <CalendarPlus className="w-3.5 h-3.5" /> Schedule New
          </button>
        </div>

        <div className="flex flex-wrap gap-2 text-xs font-medium mb-6">
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

        {isError ? (
          <ErrorState title="Could not load interviews" message={error?.message} onRetry={refetch} />
        ) : (
          <InterviewCalendar
            interviews={interviews}
            loading={isLoading}
            error={null}
            onRetry={refetch}
            onStatusChange={(interviewId, nextStatus) =>
              statusMutation.mutate({ interviewId, nextStatus })
            }
          />
        )}

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
      </div>

      {showSchedule && (
        <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => !scheduleMutation.isPending && setShowSchedule(false)}>
          <div className="w-full max-w-lg bg-[#0a0a0a] border border-gray-800 rounded-xl p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Video className="w-4 h-4 text-[#4F46E5]" /> Schedule Interview
              </h3>
              <button onClick={() => !scheduleMutation.isPending && setShowSchedule(false)} className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Job</label>
                <select
                  value={scheduleJobId}
                  onChange={(e) => {
                    setScheduleJobId(e.target.value);
                    setScheduleAppId("");
                  }}
                  disabled={jobsLoading}
                  className="w-full bg-[#111] border border-gray-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#4F46E5] disabled:opacity-50"
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
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Shortlisted Candidate</label>
                <select
                  value={scheduleAppId}
                  onChange={(e) => setScheduleAppId(e.target.value)}
                  disabled={!scheduleJobId || shortlistLoading}
                  className="w-full bg-[#111] border border-gray-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#4F46E5] disabled:opacity-50"
                >
                  {!scheduleJobId ? (
                    <option>Select a job first</option>
                  ) : shortlistLoading ? (
                    <option>Loading candidates...</option>
                  ) : shortlisted.length === 0 ? (
                    <option>No shortlisted candidates yet</option>
                  ) : (
                    shortlisted.map((app) => (
                      <option key={app.id} value={app.id}>
                        {app.candidate?.user?.fullName || "Candidate"}
                        {app.resume?.aiScore != null ? ` (AI ${app.resume.aiScore}%)` : ""}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Interview Type</label>
                <select
                  value={form.interviewType}
                  onChange={(e) => setForm((prev) => ({ ...prev, interviewType: e.target.value }))}
                  className="w-full bg-[#111] border border-gray-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#4F46E5]"
                >
                  {INTERVIEW_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Date & Time</label>
                <input
                  type="datetime-local"
                  value={form.scheduledAt}
                  onChange={(e) => setForm((prev) => ({ ...prev, scheduledAt: e.target.value }))}
                  className="w-full bg-[#111] border border-gray-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#4F46E5]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Duration (minutes)</label>
                  <input
                    type="number"
                    min="15"
                    max="480"
                    value={form.durationMinutes}
                    onChange={(e) => setForm((prev) => ({ ...prev, durationMinutes: e.target.value }))}
                    className="w-full bg-[#111] border border-gray-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#4F46E5]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Timezone</label>
                  <input
                    type="text"
                    value={form.timezone}
                    onChange={(e) => setForm((prev) => ({ ...prev, timezone: e.target.value }))}
                    className="w-full bg-[#111] border border-gray-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#4F46E5]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Meeting Link</label>
                <input
                  type="url"
                  value={form.meetingLink}
                  onChange={(e) => setForm((prev) => ({ ...prev, meetingLink: e.target.value }))}
                  placeholder="https://meet.example.com/..."
                  className="w-full bg-[#111] border border-gray-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#4F46E5]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Notes</label>
                <textarea
                  rows="2"
                  value={form.notes}
                  onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
                  className="w-full bg-[#111] border border-gray-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#4F46E5]"
                />
              </div>

              {scheduleError && (
                <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  {scheduleError}
                </p>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => !scheduleMutation.isPending && setShowSchedule(false)}
                  className="px-4 py-2 bg-gray-900 border border-gray-700 text-white text-xs font-medium rounded-lg hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={scheduleMutation.isPending}
                  className="px-4 py-2 bg-[#4F46E5] hover:bg-[#4338ca] text-white text-xs font-medium rounded-lg flex items-center gap-2 disabled:opacity-50"
                >
                  {scheduleMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Video className="w-3.5 h-3.5" />} Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </RecruiterLayout>
  );
}
