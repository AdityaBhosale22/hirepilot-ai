import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import CandidateLayout from "../../components/candidate/CandidateLayout";
import Skeleton from "../../components/shared/Skeleton";
import EmptyState from "../../components/shared/EmptyState";
import ErrorState from "../../components/shared/ErrorState";
import StatusBadge from "../../components/shared/StatusBadge";
import {
  Upload,
  Download,
  FileText,
  CheckCircle2,
  Edit3,
  Star,
  Trash2,
  Loader2,
  Check,
  X,
} from "lucide-react";
import resumeApi from "../../api/resume.api";
import { QUERY_KEYS, DEFAULT_QUERY_OPTIONS } from "../../config/constants";
import { timeAgo } from "../../utils/format";
import { getAnalysisStatusConfig } from "../../utils/status";

export default function Resume() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);
  const [selectedId, setSelectedId] = useState(null);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState("");
  const [feedback, setFeedback] = useState(null);

  const {
    data: resumes = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: QUERY_KEYS.RESUMES,
    queryFn: () => resumeApi.getMyResumes(),
    ...DEFAULT_QUERY_OPTIONS,
  });

  const selected = resumes.find((resume) => resume.id === selectedId) ?? resumes.find((resume) => resume.isDefault) ?? resumes[0];

  const invalidate = () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RESUMES });

  const uploadMutation = useMutation({
    mutationFn: ({ file, title }) => resumeApi.uploadResume({ file, title }),
    onSuccess: (resume) => {
      if (resume?.id) setSelectedId(resume.id);
      setFeedback({ type: "success", message: "Resume uploaded successfully." });
      invalidate();
    },
    onError: (err) => {
      setFeedback({ type: "error", message: err?.message || "Upload failed. Please try again." });
    },
  });

  const renameMutation = useMutation({
    mutationFn: ({ resumeId, title }) => resumeApi.updateResume(resumeId, { title }),
    onSuccess: () => {
      setEditingTitle(false);
      setFeedback({ type: "success", message: "Resume renamed successfully." });
      invalidate();
    },
    onError: (err) => {
      setFeedback({ type: "error", message: err?.message || "Could not rename resume." });
    },
  });

  const defaultMutation = useMutation({
    mutationFn: (resumeId) => resumeApi.setDefaultResume(resumeId),
    onSuccess: () => {
      setFeedback({ type: "success", message: "Default resume updated." });
      invalidate();
    },
    onError: (err) => {
      setFeedback({ type: "error", message: err?.message || "Could not update default resume." });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (resumeId) => resumeApi.deleteResume(resumeId),
    onSuccess: () => {
      setSelectedId(null);
      setFeedback({ type: "success", message: "Resume deleted." });
      invalidate();
    },
    onError: (err) => {
      setFeedback({ type: "error", message: err?.message || "Could not delete resume." });
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setFeedback({ type: "error", message: "Only PDF files are supported." });
      e.target.value = "";
      return;
    }

    setFeedback(null);
    const title = file.name.replace(/\.pdf$/i, "");
    uploadMutation.mutate({ file, title });
    e.target.value = "";
  };

  const handleStartRename = () => {
    if (!selected) return;
    setTitleDraft(selected.title);
    setEditingTitle(true);
  };

  const handleSaveRename = () => {
    if (!selected || !titleDraft.trim()) return;
    renameMutation.mutate({ resumeId: selected.id, title: titleDraft.trim() });
  };

  const handleDelete = (resume) => {
    if (window.confirm(`Delete resume "${resume.title}"? This cannot be undone.`)) {
      deleteMutation.mutate(resume.id);
    }
  };

  const analysisStatus = selected ? getAnalysisStatusConfig(selected.analysisStatus) : null;

  return (
    <CandidateLayout title="Resume Builder">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="p-6 bg-[#0a0a0a] border border-gray-800 rounded-xl">
            <h2 className="text-base font-semibold text-white mb-4">My Resumes</h2>

            {feedback && (
              <div
                className={`mb-4 px-3 py-2.5 rounded-lg border text-xs flex items-center gap-2 ${
                  feedback.type === "success"
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                    : "bg-red-500/10 border-red-500/20 text-red-400"
                }`}
              >
                {feedback.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <X className="w-4 h-4 flex-shrink-0" />
                )}
                {feedback.message}
              </div>
            )}

            {isLoading ? (
              <div className="space-y-3">
                {[1, 2].map((n) => (
                  <Skeleton key={n} className="h-16 w-full" />
                ))}
              </div>
            ) : isError ? (
              <ErrorState title="Could not load resumes" message={error?.message} onRetry={refetch} />
            ) : resumes.length === 0 ? (
              <EmptyState
                icon={FileText}
                title="No resumes yet"
                description="Upload your first PDF resume to get started."
              />
            ) : (
              <div className="space-y-3">
                {resumes.map((resume) => (
                  <div
                    key={resume.id}
                    onClick={() => setSelectedId(resume.id)}
                    className={`p-4 bg-[#111] border rounded-lg flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                      selected?.id === resume.id
                        ? "border-[#4F46E5]"
                        : "border-gray-800 hover:border-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText className="w-8 h-8 text-[#4F46E5] flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-white truncate">
                          {resume.title || resume.originalFileName}
                        </p>
                        <p className="text-[10px] text-gray-500">
                          Updated {timeAgo(resume.updatedAt || resume.createdAt)} •{" "}
                          {resume.aiScore != null ? `${Math.round(resume.aiScore)} AI score` : "No AI score"}
                        </p>
                      </div>
                    </div>
                    {resume.isDefault && <Star className="w-4 h-4 text-amber-400 flex-shrink-0" />}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-800 hover:border-[#4F46E5] rounded-xl p-8 text-center cursor-pointer transition-colors bg-[#050505]"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleFileChange}
            />
            {uploadMutation.isPending ? (
              <div className="flex flex-col items-center">
                <Loader2 className="w-8 h-8 text-[#4F46E5] animate-spin mx-auto mb-2" />
                <p className="text-xs font-medium text-gray-300">Uploading...</p>
              </div>
            ) : (
              <>
                <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                <p className="text-xs font-medium text-gray-300">Click to upload a PDF resume</p>
                <p className="text-[10px] text-gray-500 mt-1">Supports PDF up to 5MB</p>
              </>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 p-8 bg-[#0a0a0a] border border-gray-800 rounded-xl space-y-6">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="w-1/3" variant="title" />
              <Skeleton className="w-2/3" />
              <Skeleton className="w-full h-32" />
            </div>
          ) : !selected ? (
            <EmptyState
              icon={FileText}
              title="Select a resume"
              description="Upload or choose a resume to see its AI analysis and parsed details."
            />
          ) : (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-4">
                <div className="flex items-center gap-2 min-w-0">
                  {editingTitle ? (
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        value={titleDraft}
                        onChange={(e) => setTitleDraft(e.target.value)}
                        autoFocus
                        className="w-full sm:w-72 bg-[#111] border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#4F46E5]"
                      />
                      <button
                        onClick={handleSaveRename}
                        disabled={renameMutation.isPending || !titleDraft.trim()}
                        className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/20 disabled:opacity-50"
                        aria-label="Save title"
                      >
                        {renameMutation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => setEditingTitle(false)}
                        className="p-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700"
                        aria-label="Cancel editing"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="min-w-0">
                      <h2 className="text-base font-semibold text-white truncate">
                        {selected.title || selected.originalFileName}
                      </h2>
                      <div className="flex items-center gap-2 mt-1.5">
                        {analysisStatus && (
                          <StatusBadge label={analysisStatus.label} className={analysisStatus.className} />
                        )}
                        {selected.isDefault && (
                          <span className="px-2 py-1 text-xs font-medium rounded-full border bg-amber-500/10 text-amber-400 border-amber-500/20 inline-flex items-center gap-1">
                            <Star className="w-3 h-3" /> Default
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {!editingTitle && (
                    <button
                      onClick={handleStartRename}
                      className="px-3 py-2 bg-gray-900 border border-gray-800 text-xs text-gray-300 rounded-lg flex items-center gap-1.5 hover:text-white transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Rename
                    </button>
                  )}
                  <a
                    href={selected.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2 bg-gray-900 border border-gray-800 text-xs text-gray-300 rounded-lg flex items-center gap-1.5 hover:text-white transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" /> Download
                  </a>
                  {!selected.isDefault && (
                    <button
                      onClick={() => defaultMutation.mutate(selected.id)}
                      disabled={defaultMutation.isPending}
                      className="px-3 py-2 bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400 rounded-lg flex items-center gap-1.5 hover:bg-amber-500/20 disabled:opacity-50 transition-colors"
                    >
                      <Star className="w-3.5 h-3.5" /> Set Default
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(selected)}
                    disabled={deleteMutation.isPending}
                    className="p-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg hover:bg-red-500/20 disabled:opacity-50 transition-colors"
                    aria-label="Delete resume"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {selected.aiScore != null && (
                <div className="p-4 bg-[#111] border border-gray-800 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-white">AI Resume Score</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">Last analyzed {timeAgo(selected.updatedAt)}</p>
                  </div>
                  <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#06B6D4]">
                    {Math.round(selected.aiScore)}/100
                  </span>
                </div>
              )}

              <div>
                <h3 className="text-sm font-semibold text-[#06B6D4] mb-2">Key Skills Detected</h3>
                {selected.extractedSkills?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selected.extractedSkills.map((skill, i) => (
                      <span
                        key={`${skill}-${i}`}
                        className="px-3 py-1 bg-[#111] border border-gray-800 text-xs text-gray-300 rounded-lg flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" /> {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">
                    No skills extracted yet. Run the AI audit to parse skills from this resume.
                  </p>
                )}
              </div>

              {selected.analysisStatus === "FAILED" && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-xs text-red-400">
                    The AI analysis for this resume failed. Re-run the audit from the AI Resume Audit page.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </CandidateLayout>
  );
}
