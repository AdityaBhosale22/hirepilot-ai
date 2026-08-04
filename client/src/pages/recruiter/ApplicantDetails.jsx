import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  CalendarPlus,
  Check,
  CheckCircle2,
  Clock,
  Code2,
  Copy,
  Download,
  ExternalLink,
  FileText,
  Globe,
  GraduationCap,
  Link2,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Save,
  Sparkles,
  Star,
  StickyNote,
  ThumbsDown,
  ThumbsUp,
  User,
  Video,
  X,
  XCircle,
} from "lucide-react";
import RecruiterLayout from "../../components/recruiter/RecruiterLayout";
import Skeleton from "../../components/shared/Skeleton";
import ErrorState from "../../components/shared/ErrorState";
import StatusBadge from "../../components/shared/StatusBadge";
import applicationApi from "../../api/application.api";
import interviewApi from "../../api/interview.api";
import { QUERY_KEYS, DEFAULT_QUERY_OPTIONS } from "../../config/constants";
import { getApplicationStatusConfig, getInterviewStatusConfig, getInterviewTypeLabel } from "../../utils/status";
import { formatDate, formatDateTime, getInitials } from "../../utils/format";

const STATUS_STEPS = [
  { key: "APPLIED", label: "Applied" },
  { key: "REVIEWING", label: "Reviewing" },
  { key: "SHORTLISTED", label: "Shortlisted" },
  { key: "INTERVIEW_SCHEDULED", label: "Interview Scheduled" },
  { key: "HIRED", label: "Hired" },
];

const EMPTY_SCHEDULE_FORM = {
  date: "",
  time: "",
  duration: "30",
  interviewer: "",
  meetingLink: "",
  notes: "",
};

const getRecommendation = (score) => {
  if (score == null) return null;
  if (score >= 80) return { stars: 5, label: "Strong Match", color: "text-emerald-400" };
  if (score >= 60) return { stars: 4, label: "Good Match", color: "text-cyan-400" };
  if (score >= 40) return { stars: 3, label: "Average Match", color: "text-amber-400" };
  if (score >= 20) return { stars: 2, label: "Below Average Match", color: "text-orange-400" };
  return { stars: 1, label: "Weak Match", color: "text-red-400" };
};

const renderStars = (stars) => "★".repeat(stars) + "☆".repeat(5 - stars);

function Field({ icon: Icon, label, value, href }) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] uppercase tracking-wider text-gray-500 flex items-center gap-1">
        {Icon && <Icon className="w-3 h-3" />} {label}
      </p>
      {href && value ? (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-[#4F46E5] hover:text-[#06B6D4] mt-1 inline-flex items-center gap-1 max-w-full truncate"
        >
          {value}
          <ExternalLink className="w-3 h-3 flex-shrink-0" />
        </a>
      ) : (
        <p className="text-sm text-white mt-1 truncate">{value || "—"}</p>
      )}
    </div>
  );
}

function ScoreCard({ label, value, suffix = "%" }) {
  return (
    <div className="p-4 bg-[#111] border border-gray-800 rounded-lg text-center">
      <p className="text-[10px] uppercase tracking-wider text-gray-500">{label}</p>
      <p className={`text-2xl font-black mt-1.5 ${value != null ? "text-white" : "text-gray-600"}`}>
        {value != null ? `${Math.round(value)}${suffix}` : "—"}
      </p>
    </div>
  );
}

function ListBlock({ title, items, icon: Icon, accent }) {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <h4 className="text-xs font-semibold text-white flex items-center gap-1.5 mb-2">
        {Icon && <Icon className="w-3.5 h-3.5" />} {title}
      </h4>
      <ul className="space-y-2">
        {items.map((item, idx) => (
          <li key={idx} className={`p-3 bg-[#111] border rounded-lg text-xs text-gray-400 leading-relaxed ${accent}`}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function TagList({ title, items, accent }) {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <h4 className="text-xs font-semibold text-white mb-2">{title}</h4>
      <div className="flex flex-wrap gap-2">
        {items.map((item, idx) => (
          <span key={idx} className={`px-2.5 py-1 rounded text-xs border ${accent}`}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function StatusTimeline({ status }) {
  if (status === "REJECTED") {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3">
        <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-red-400">Rejected</p>
          <p className="text-[10px] text-gray-500 mt-0.5">This application was rejected by the recruiter.</p>
        </div>
      </div>
    );
  }

  const currentIndex = STATUS_STEPS.findIndex((step) => step.key === status);

  return (
    <div className="flex items-start overflow-x-auto pb-1">
      {STATUS_STEPS.map((step, idx) => {
        const reached = idx <= currentIndex;
        const isCurrent = idx === currentIndex;
        return (
          <div key={step.key} className="flex items-start flex-shrink-0">
            <div className="flex flex-col items-center w-24">
              <div
                className={`w-7 h-7 rounded-full border flex items-center justify-center ${
                  reached ? "bg-[#4F46E5] border-[#4F46E5]" : "bg-[#111] border-gray-800"
                }`}
              >
                {reached ? (
                  <Check className="w-3.5 h-3.5 text-white" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-600" />
                )}
              </div>
              <p
                className={`text-[10px] mt-2 text-center leading-tight ${
                  isCurrent ? "text-white font-semibold" : reached ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {step.label}
              </p>
            </div>
            {idx < STATUS_STEPS.length - 1 && (
              <div className={`mt-3 h-px w-6 ${idx < currentIndex ? "bg-[#4F46E5]" : "bg-gray-800"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function InterviewCard({ interview, onMarkCompleted, completing }) {
  const status = getInterviewStatusConfig(interview.status);
  const isActionable = interview.status === "SCHEDULED" || interview.status === "RESCHEDULED";

  return (
    <div className="p-4 bg-[#111] border border-gray-800 rounded-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2.5 bg-[#4F46E5]/10 rounded-lg text-[#4F46E5] flex-shrink-0">
            <Video className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white">
              {getInterviewTypeLabel(interview.interviewType)} Interview
            </p>
            <p className="text-[11px] text-gray-500 mt-0.5">
              {formatDateTime(interview.scheduledAt)} • {interview.durationMinutes} min •{" "}
              {interview.timezone || "UTC"}
            </p>
          </div>
        </div>
        <StatusBadge label={status.label} className={status.className} />
      </div>

      {interview.meetingLink && (
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
          <a
            href={interview.meetingLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-[#4F46E5] hover:text-[#06B6D4] font-medium truncate max-w-full"
          >
            <Video className="w-3.5 h-3.5 flex-shrink-0" /> {interview.meetingLink}
          </a>
          {isActionable && (
            <a
              href={interview.meetingLink}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 bg-[#4F46E5] hover:bg-[#4338ca] text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Join Call
            </a>
          )}
        </div>
      )}

      {interview.notes && (
        <p className="mt-3 text-[11px] text-gray-500 bg-[#0a0a0a] border border-gray-800 rounded-lg p-3 leading-relaxed whitespace-pre-line">
          {interview.notes}
        </p>
      )}

      {interview.status === "COMPLETED" && (interview.feedback || interview.score != null) && (
        <div className="mt-3 p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
          {interview.score != null && (
            <p className="text-xs font-semibold text-emerald-400">
              Score: {Math.round(interview.score)}/100
            </p>
          )}
          {interview.feedback && (
            <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">{interview.feedback}</p>
          )}
        </div>
      )}

      {interview.status === "CANCELLED" && interview.cancelReason && (
        <p className="mt-3 text-[11px] text-red-400/80 bg-red-500/5 border border-red-500/20 rounded-lg p-3">
          {interview.cancelReason}
        </p>
      )}

      {onMarkCompleted && isActionable && (
        <button
          type="button"
          onClick={onMarkCompleted}
          disabled={completing}
          className="mt-3 px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:bg-emerald-500/20 disabled:opacity-50 disabled:pointer-events-none transition-colors"
        >
          {completing ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <CheckCircle2 className="w-3.5 h-3.5" />
          )}
          Mark Interview Completed
        </button>
      )}
    </div>
  );
}

function NotesEditor({ initialValue = "", onSave, saving }) {
  const [draft, setDraft] = useState(initialValue);
  const isDirty = draft !== (initialValue || "");

  return (
    <div>
      <textarea
        rows="5"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="Add private notes about this candidate..."
        className="w-full bg-[#111] border border-gray-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#4F46E5] resize-y"
      />
      <div className="flex items-center justify-end gap-3 mt-3">
        {isDirty && <span className="text-[10px] text-gray-500">Unsaved changes</span>}
        <button
          type="button"
          onClick={() => onSave(draft)}
          disabled={!isDirty || saving}
          className="px-4 py-2 bg-[#4F46E5] hover:bg-[#4338ca] text-white text-xs font-medium rounded-lg flex items-center gap-1.5 disabled:opacity-50 disabled:pointer-events-none"
        >
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          {saving ? "Saving..." : "Save Notes"}
        </button>
      </div>
    </div>
  );
}

function ResumePreview({ fileUrl, resumeName }) {
  const [status, setStatus] = useState(fileUrl ? "checking" : "unavailable");

  useEffect(() => {
    if (!fileUrl) return undefined;

    let cancelled = false;

    const verify = async () => {
      try {
        const res = await fetch(fileUrl, { method: "HEAD", mode: "cors" });
        if (cancelled) return;
        setStatus(res.ok ? "ready" : "unavailable");
      } catch {
        // Cross-origin checks are not always permitted; if the URL cannot be
        // verified, optimistically attempt to render it.
        if (cancelled) return;
        setStatus("ready");
      }
    };

    verify();
    return () => {
      cancelled = true;
    };
  }, [fileUrl]);

  if (status === "checking") {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 className="w-6 h-6 text-gray-600 animate-spin mb-3" />
        <p className="text-xs text-gray-500">Loading preview...</p>
      </div>
    );
  }

  if (status === "unavailable") {
    return (
      <div className="p-8 text-center">
        <FileText className="w-8 h-8 text-gray-600 mx-auto mb-3" />
        <p className="text-sm font-semibold text-gray-300">Preview unavailable</p>
        <p className="text-xs text-gray-500 mt-1">
          The resume file could not be loaded. Use the Download Resume button above to view it.
        </p>
      </div>
    );
  }

  return (
    <iframe
      src={fileUrl}
      title={`${resumeName} Preview`}
      className="w-full h-[75vh] bg-white"
      onError={() => setStatus("unavailable")}
    />
  );
}

export default function ApplicantDetails() {
  const { applicationId } = useParams();
  const queryClient = useQueryClient();

  const [toast, setToast] = useState(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleForm, setScheduleForm] = useState(EMPTY_SCHEDULE_FORM);
  const [scheduleError, setScheduleError] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ type, message });
    window.setTimeout(() => setToast(null), 3500);
  };

  const invalidateApplication = () => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.APPLICATION_DETAIL, applicationId] });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.JOB_APPLICATIONS });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RECRUITER_DASHBOARD });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INTERVIEWS });
  };

  const {
    data: application,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: [QUERY_KEYS.APPLICATION_DETAIL, applicationId],
    queryFn: () => applicationApi.getApplicationById(applicationId),
    enabled: !!applicationId,
    ...DEFAULT_QUERY_OPTIONS,
  });

  const statusMutation = useMutation({
    mutationFn: (nextStatus) => applicationApi.updateApplicationStatus(applicationId, nextStatus),
    onSuccess: (result, nextStatus) => {
      invalidateApplication();
      const message =
        nextStatus === "SHORTLISTED"
          ? "Candidate shortlisted successfully."
          : nextStatus === "HIRED"
          ? "Candidate hired. Congratulations!"
          : "Candidate rejected.";
      showToast(message);
    },
    onError: (err) => showToast(err?.message || "Could not update application status.", "error"),
  });

  const interviewStatusMutation = useMutation({
    mutationFn: ({ interviewId, status }) =>
      interviewApi.updateInterviewStatus(interviewId, { status }),
    onSuccess: (result, { status }) => {
      invalidateApplication();
      showToast(status === "COMPLETED" ? "Interview marked as completed." : "Interview updated.");
    },
    onError: (err) => showToast(err?.message || "Could not update interview.", "error"),
  });

  const notesMutation = useMutation({
    mutationFn: (notes) => applicationApi.updateApplicationNotes(applicationId, notes),
    onSuccess: () => {
      invalidateApplication();
      showToast("Recruiter notes saved.");
    },
    onError: (err) => showToast(err?.message || "Could not save notes.", "error"),
  });

  const scheduleMutation = useMutation({
    mutationFn: (payload) => interviewApi.scheduleInterview(payload),
    onSuccess: () => {
      invalidateApplication();
      setShowScheduleModal(false);
      setScheduleForm(EMPTY_SCHEDULE_FORM);
      setScheduleError(null);
      showToast("Interview scheduled successfully.");
    },
    onError: (err) => setScheduleError(err?.message || "Could not schedule the interview."),
  });

  const handleShortlist = () => {
    if (statusMutation.isPending) return;
    statusMutation.mutate("SHORTLISTED");
  };

  const handleReject = () => {
    if (statusMutation.isPending) return;
    if (!window.confirm("Reject this candidate? This action cannot be undone.")) return;
    statusMutation.mutate("REJECTED");
  };

  const handleHire = () => {
    if (statusMutation.isPending) return;
    if (!window.confirm(`Hire ${application?.candidate?.user?.fullName || "this candidate"} for ${application?.job?.title || "this role"}? This action cannot be undone.`)) return;
    statusMutation.mutate("HIRED");
  };

  const handleOpenSchedule = () => {
    setScheduleError(null);
    setScheduleForm(EMPTY_SCHEDULE_FORM);
    setShowScheduleModal(true);
  };

  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    if (!scheduleForm.date || !scheduleForm.time) {
      setScheduleError("Pick a date and time for the interview.");
      return;
    }
    const scheduledAt = new Date(`${scheduleForm.date}T${scheduleForm.time}`);
    if (Number.isNaN(scheduledAt.getTime()) || scheduledAt <= new Date()) {
      setScheduleError("Scheduled interview time must be in the future.");
      return;
    }
    const notesParts = [];
    if (scheduleForm.interviewer.trim()) notesParts.push(`Interviewer: ${scheduleForm.interviewer.trim()}`);
    if (scheduleForm.notes.trim()) notesParts.push(scheduleForm.notes.trim());
    const payload = {
      applicationId,
      interviewType: "ONLINE",
      scheduledAt: scheduledAt.toISOString(),
      durationMinutes: Number(scheduleForm.duration) || 30,
      timezone: "UTC",
      meetingLink: scheduleForm.meetingLink.trim() || "",
      notes: notesParts.join("\n"),
    };
    setScheduleError(null);
    scheduleMutation.mutate(payload);
  };

  const handleCopyEmail = async () => {
    if (!application?.candidate?.user?.email) return;
    try {
      await navigator.clipboard.writeText(application.candidate.user.email);
      setCopiedEmail(true);
      window.setTimeout(() => setCopiedEmail(false), 2000);
      showToast("Email copied to clipboard.");
    } catch {
      showToast("Could not copy email.", "error");
    }
  };

  if (isLoading) {
    return (
      <RecruiterLayout title="Applicant Details">
        <div className="space-y-6">
          <Skeleton className="h-20" variant="card" />
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
            <div className="xl:col-span-3 space-y-6">
              <Skeleton className="h-64" variant="card" />
              <Skeleton className="h-80" variant="card" />
            </div>
            <div className="xl:col-span-2 space-y-6">
              <Skeleton className="h-[70vh]" variant="card" />
            </div>
          </div>
        </div>
      </RecruiterLayout>
    );
  }

  if (isError) {
    return (
      <RecruiterLayout title="Applicant Details">
        <ErrorState title="Could not load applicant details" message={error?.message} onRetry={refetch} />
      </RecruiterLayout>
    );
  }

  if (!application) {
    return (
      <RecruiterLayout title="Applicant Details">
        <ErrorState title="Applicant not found" message="This application may have been removed." />
      </RecruiterLayout>
    );
  }

  const candidate = application.candidate ?? {};
  const user = candidate.user ?? {};
  const job = application.job ?? {};
  const resume = application.resume ?? {};
  const statusConfig = getApplicationStatusConfig(application.status);
  const reportAvailable = resume.analysisStatus === "COMPLETED";
  const recommendation = getRecommendation(resume.aiScore);

  const canShortlist = !["SHORTLISTED", "INTERVIEW_SCHEDULED", "REJECTED", "HIRED"].includes(application.status);
  const canReject = !["REJECTED", "HIRED"].includes(application.status);
  const canSchedule = application.status === "SHORTLISTED";
  const canHire = application.status === "INTERVIEW_SCHEDULED";

  const candidateFields = [
    { icon: Mail, label: "Email", value: user.email },
    { icon: Phone, label: "Phone", value: candidate.phone },
    { icon: MapPin, label: "Location", value: candidate.location },
    { icon: Briefcase, label: "Current Position", value: candidate.currentPosition },
    {
      icon: Star,
      label: "Experience",
      value: candidate.yearsOfExperience != null ? `${candidate.yearsOfExperience} year${candidate.yearsOfExperience === 1 ? "" : "s"}` : null,
    },
    { icon: GraduationCap, label: "Education", value: null },
  ];

  const linkFields = [
    { icon: Code2, label: "GitHub", value: candidate.githubUrl, href: candidate.githubUrl },
    { icon: Link2, label: "LinkedIn", value: candidate.linkedinUrl, href: candidate.linkedinUrl },
    { icon: Globe, label: "Portfolio", value: candidate.portfolioUrl, href: candidate.portfolioUrl },
  ];

  const quickActions = [
    { label: "Copy Email", icon: copiedEmail ? Check : Copy, onClick: handleCopyEmail, disabled: !user.email, href: null },
    { label: "Open LinkedIn", icon: Link2, href: candidate.linkedinUrl, disabled: !candidate.linkedinUrl, onClick: null },
    { label: "Open GitHub", icon: Code2, href: candidate.githubUrl, disabled: !candidate.githubUrl, onClick: null },
    { label: "Open Portfolio", icon: Globe, href: candidate.portfolioUrl, disabled: !candidate.portfolioUrl, onClick: null },
  ];

  const scoreCards = [
    { label: "ATS Score", value: resume.aiScore, suffix: "%" },
    { label: "Grammar Score", value: resume.grammarScore, suffix: "/100" },
    { label: "Formatting Score", value: resume.formatScore, suffix: "/100" },
    { label: "Keyword Density", value: resume.keywordScore, suffix: "%" },
    { label: "Job Readiness", value: resume.jobReadinessScore, suffix: "/100" },
  ];

  const resumeName = resume.title || resume.originalFileName || "Resume";

  return (
    <RecruiterLayout title="Applicant Details">
      <Link
        to="/recruiter/applicants"
        className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to applicants
      </Link>

      {toast && (
        <div
          className={`fixed top-5 right-5 z-[70] px-4 py-3 rounded-lg border text-xs flex items-center gap-2 shadow-lg ${
            toast.type === "error"
              ? "bg-red-500/10 border-red-500/20 text-red-400"
              : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
          }`}
        >
          {toast.type === "error" ? (
            <XCircle className="w-4 h-4 flex-shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          )}
          {toast.message}
        </div>
      )}

      <div className="p-6 bg-gradient-to-r from-[#4F46E5]/15 via-[#0a0a0a] to-[#06B6D4]/15 border border-gray-800 rounded-xl mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#4F46E5] to-[#06B6D4] flex items-center justify-center font-bold text-white text-sm flex-shrink-0">
              {getInitials(user.fullName) || "?"}
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-bold text-white truncate">{user.fullName || "Unknown Candidate"}</h1>
              <p className="text-xs text-gray-400 mt-0.5 truncate">
                {job.title ? `Applied for ${job.title}` : "Applied role unavailable"}
                {job.company?.name ? ` at ${job.company.name}` : ""}
              </p>
            </div>
          </div>
          <StatusBadge label={statusConfig.label} className={statusConfig.className} />
        </div>
        <div className="mt-5 pt-5 border-t border-white/10 flex flex-wrap gap-2">
          {quickActions.map((action) => {
            const Icon = action.icon;
            const base =
              "px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors disabled:opacity-40 disabled:pointer-events-none";
            if (action.href) {
              return (
                <a
                  key={action.label}
                  href={action.href}
                  target="_blank"
                  rel="noreferrer"
                  className={`${base} bg-gray-900 border border-gray-800 text-gray-300 hover:text-white hover:border-gray-700 ${
                    action.disabled ? "pointer-events-none opacity-40" : ""
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" /> {action.label}
                </a>
              );
            }
            return (
              <button
                key={action.label}
                type="button"
                onClick={action.onClick}
                disabled={action.disabled}
                className={`${base} bg-gray-900 border border-gray-800 text-gray-300 hover:text-white hover:border-gray-700`}
              >
                <Icon className={`w-3.5 h-3.5 ${copiedEmail ? "text-emerald-400" : ""}`} /> {action.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <div className="xl:col-span-3 space-y-6">
          <div className="p-6 bg-[#0a0a0a] border border-gray-800 rounded-xl">
            <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-[#06B6D4]" /> Candidate Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {candidateFields.map((field) => (
                <Field key={field.label} icon={field.icon} label={field.label} value={field.value} />
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-5 pt-5 border-t border-gray-800">
              {linkFields.map((field) => (
                <Field key={field.label} icon={field.icon} label={field.label} value={field.value} href={field.href} />
              ))}
            </div>
          </div>

          <div className="p-6 bg-[#0a0a0a] border border-gray-800 rounded-xl">
            <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#06B6D4]" /> Application Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <Field icon={Briefcase} label="Applied Role" value={job.title} />
              <Field icon={Calendar} label="Application Date" value={formatDate(application.appliedAt)} />
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-wider text-gray-500 flex items-center gap-1">
                  <FileText className="w-3 h-3" /> Current Status
                </p>
                <div className="mt-1.5">
                  <StatusBadge label={statusConfig.label} className={statusConfig.className} />
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-[#0a0a0a] border border-gray-800 rounded-xl">
            <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#06B6D4]" /> Application Status
            </h2>
            <StatusTimeline status={application.status} />
          </div>

          <div className="p-6 bg-[#0a0a0a] border border-gray-800 rounded-xl">
            <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Video className="w-4 h-4 text-[#06B6D4]" /> Interviews
            </h2>
            {application.interviews?.length > 0 ? (
              <div className="space-y-3">
                {application.interviews.map((interview) => (
                  <InterviewCard
                    key={interview.id}
                    interview={interview}
                    onMarkCompleted={
                      interview.status === "SCHEDULED" || interview.status === "RESCHEDULED"
                        ? () =>
                            interviewStatusMutation.mutate({
                              interviewId: interview.id,
                              status: "COMPLETED",
                            })
                        : null
                    }
                    completing={interviewStatusMutation.isPending}
                  />
                ))}
              </div>
            ) : (
              <div className="p-6 text-center">
                <Video className="w-7 h-7 text-gray-600 mx-auto mb-2" />
                <p className="text-xs text-gray-500">No interviews have been scheduled for this candidate yet.</p>
              </div>
            )}
          </div>

          <div className="p-6 bg-[#0a0a0a] border border-gray-800 rounded-xl">
            <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#06B6D4]" /> Resume AI Analysis
            </h2>
            {reportAvailable ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {scoreCards.map((card) => (
                    <ScoreCard key={card.label} label={card.label} value={card.value} suffix={card.suffix} />
                  ))}
                </div>

                {resume.experienceLevel && (
                  <div>
                    <h4 className="text-xs font-semibold text-white mb-2">Experience Summary</h4>
                    <p className="p-3 bg-[#111] border border-gray-800 rounded-lg text-xs text-gray-400 leading-relaxed">
                      {resume.experienceLevel}
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  <ListBlock
                    title="Strengths"
                    items={resume.strengths}
                    icon={CheckCircle2}
                    accent="border-emerald-500/20"
                  />
                  <ListBlock
                    title="Weaknesses"
                    items={resume.weaknesses}
                    icon={FileText}
                    accent="border-amber-500/20"
                  />
                  <TagList
                    title="Missing Skills"
                    items={resume.missingSkills}
                    accent="bg-amber-500/10 border-amber-500/20 text-amber-400"
                  />
                  <TagList
                    title="Recommendations"
                    items={resume.recommendedSkills}
                    accent="bg-[#4F46E5]/10 border-[#4F46E5]/20 text-[#4F46E5]"
                  />
                </div>
              </div>
            ) : (
              <div className="p-8 text-center">
                <Sparkles className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                <p className="text-sm font-semibold text-gray-300">Analysis not available</p>
                <p className="text-xs text-gray-500 mt-1">
                  The candidate has not run an AI resume audit for this resume yet.
                </p>
              </div>
            )}
          </div>

          <div className="p-6 bg-[#0a0a0a] border border-gray-800 rounded-xl">
            <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400" /> AI Recommendation
            </h2>
            {recommendation ? (
              <div className="space-y-6">
                <div className="p-4 bg-[#111] border border-gray-800 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-gray-500">Based on stored ATS score ({Math.round(resume.aiScore)}/100)</p>
                    <p className={`text-lg font-bold mt-1 ${recommendation.color}`}>{recommendation.label}</p>
                  </div>
                  <span className={`text-2xl tracking-widest ${recommendation.color}`}>
                    {renderStars(recommendation.stars)}
                  </span>
                </div>

                <div className="space-y-4">
                  <ListBlock
                    title="Strengths"
                    items={resume.strengths}
                    icon={CheckCircle2}
                    accent="border-emerald-500/20"
                  />
                  <ListBlock
                    title="Skill Gaps"
                    items={resume.weaknesses}
                    icon={FileText}
                    accent="border-amber-500/20"
                  />
                  <TagList
                    title="Missing Technologies"
                    items={resume.missingSkills}
                    accent="bg-red-500/10 border-red-500/20 text-red-400"
                  />
                </div>
              </div>
            ) : (
              <div className="p-8 text-center">
                <Star className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                <p className="text-sm font-semibold text-gray-300">Analysis not available</p>
                <p className="text-xs text-gray-500 mt-1">
                  A recommendation is generated once the candidate's resume has been scored by Resume AI.
                </p>
              </div>
            )}
          </div>

          <div className="p-6 bg-[#0a0a0a] border border-gray-800 rounded-xl">
            <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <ThumbsUp className="w-4 h-4 text-[#06B6D4]" /> Recruiter Actions
            </h2>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleShortlist}
                disabled={!canShortlist || statusMutation.isPending}
                title={!canShortlist ? "Candidate cannot be shortlisted in the current status." : "Shortlist this candidate"}
                className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:bg-indigo-500/20 disabled:opacity-40 disabled:pointer-events-none transition-colors"
              >
                {statusMutation.isPending ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <ThumbsUp className="w-3.5 h-3.5" />
                )}
                Shortlist Candidate
              </button>
              <button
                type="button"
                onClick={handleReject}
                disabled={!canReject || statusMutation.isPending}
                title={!canReject ? "Candidate cannot be rejected in the current status." : "Reject this candidate"}
                className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:bg-red-500/20 disabled:opacity-40 disabled:pointer-events-none transition-colors"
              >
                <ThumbsDown className="w-3.5 h-3.5" />
                Reject Candidate
              </button>
              <button
                type="button"
                onClick={handleOpenSchedule}
                disabled={!canSchedule}
                title={!canSchedule ? "Shortlist the candidate before scheduling an interview." : "Schedule an interview"}
                className="px-4 py-2 bg-[#4F46E5]/10 border border-[#4F46E5]/20 text-[#4F46E5] rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:bg-[#4F46E5]/20 disabled:opacity-40 disabled:pointer-events-none transition-colors"
              >
                <CalendarPlus className="w-3.5 h-3.5" />
                Schedule Interview
              </button>
              <button
                type="button"
                onClick={handleHire}
                disabled={!canHire}
                title={!canHire ? "Hire after the candidate reaches the interview stage." : "Hire this candidate"}
                className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:bg-emerald-500/20 disabled:opacity-40 disabled:pointer-events-none transition-colors"
              >
                {statusMutation.isPending ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                )}
                Hire Candidate
              </button>
            </div>
          </div>

          <div className="p-6 bg-[#0a0a0a] border border-gray-800 rounded-xl">
            <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <StickyNote className="w-4 h-4 text-[#06B6D4]" /> Recruiter Notes
            </h2>
            <NotesEditor
              initialValue={application.recruiterNotes || ""}
              onSave={(notes) => notesMutation.mutate(notes)}
              saving={notesMutation.isPending}
            />
          </div>
        </div>

        <div className="xl:col-span-2">
          <div className="xl:sticky xl:top-6 bg-[#0a0a0a] border border-gray-800 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between gap-3 p-4 border-b border-gray-800">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="w-4 h-4 text-[#06B6D4] flex-shrink-0" />
                <p className="text-xs font-semibold text-white truncate">{resumeName}</p>
              </div>
              {resume.fileUrl && (
                <a
                  href={resume.fileUrl}
                  download
                  className="px-3 py-2 bg-gray-900 border border-gray-800 text-xs text-gray-300 rounded-lg flex items-center gap-1.5 hover:text-white hover:border-gray-700 transition-colors flex-shrink-0"
                >
                  <Download className="w-3.5 h-3.5" /> Download Resume
                </a>
              )}
            </div>
            {resume.fileUrl ? (
              <ResumePreview
                key={resume.fileUrl}
                fileUrl={resume.fileUrl}
                resumeName={resumeName}
              />
            ) : (
              <div className="p-8 text-center">
                <FileText className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                <p className="text-sm font-semibold text-gray-300">Resume not available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showScheduleModal && (
        <div
          className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => !scheduleMutation.isPending && setShowScheduleModal(false)}
        >
          <div
            className="w-full max-w-lg bg-[#0a0a0a] border border-gray-800 rounded-xl p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Video className="w-4 h-4 text-[#4F46E5]" /> Schedule Interview
              </h3>
              <button
                onClick={() => !scheduleMutation.isPending && setShowScheduleModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Date</label>
                  <input
                    type="date"
                    value={scheduleForm.date}
                    onChange={(e) => setScheduleForm((prev) => ({ ...prev, date: e.target.value }))}
                    className="w-full bg-[#111] border border-gray-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#4F46E5]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Time</label>
                  <input
                    type="time"
                    value={scheduleForm.time}
                    onChange={(e) => setScheduleForm((prev) => ({ ...prev, time: e.target.value }))}
                    className="w-full bg-[#111] border border-gray-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#4F46E5]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Duration (minutes)</label>
                  <input
                    type="number"
                    min="15"
                    max="480"
                    value={scheduleForm.duration}
                    onChange={(e) => setScheduleForm((prev) => ({ ...prev, duration: e.target.value }))}
                    className="w-full bg-[#111] border border-gray-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#4F46E5]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Interviewer</label>
                  <input
                    type="text"
                    value={scheduleForm.interviewer}
                    onChange={(e) => setScheduleForm((prev) => ({ ...prev, interviewer: e.target.value }))}
                    placeholder="Interviewer name"
                    className="w-full bg-[#111] border border-gray-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#4F46E5]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Meeting Link</label>
                <input
                  type="url"
                  value={scheduleForm.meetingLink}
                  onChange={(e) => setScheduleForm((prev) => ({ ...prev, meetingLink: e.target.value }))}
                  placeholder="https://meet.example.com/..."
                  className="w-full bg-[#111] border border-gray-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#4F46E5]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Notes</label>
                <textarea
                  rows="2"
                  value={scheduleForm.notes}
                  onChange={(e) => setScheduleForm((prev) => ({ ...prev, notes: e.target.value }))}
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
                  onClick={() => !scheduleMutation.isPending && setShowScheduleModal(false)}
                  className="px-4 py-2 bg-gray-900 border border-gray-700 text-white text-xs font-medium rounded-lg hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={scheduleMutation.isPending}
                  className="px-4 py-2 bg-[#4F46E5] hover:bg-[#4338ca] text-white text-xs font-medium rounded-lg flex items-center gap-2 disabled:opacity-50"
                >
                  {scheduleMutation.isPending ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Video className="w-3.5 h-3.5" />
                  )}{" "}
                  Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </RecruiterLayout>
  );
}
