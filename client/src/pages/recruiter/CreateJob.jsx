import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import RecruiterLayout from "../../components/recruiter/RecruiterLayout";
import { Sparkles, Save, Loader2 } from "lucide-react";
import jobApi from "../../api/job.api";

const EMPLOYMENT_TYPES = [
  { value: "FULL_TIME", label: "Full-time" },
  { value: "PART_TIME", label: "Part-time" },
  { value: "INTERNSHIP", label: "Internship" },
  { value: "CONTRACT", label: "Contract" },
];

const initialForm = {
  title: "",
  location: "",
  description: "",
  salaryMin: "",
  salaryMax: "",
  yearsOfExperience: "",
  employmentType: "FULL_TIME",
  requiredSkills: "",
};

export default function CreateJob() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [feedback, setFeedback] = useState(null);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const buildPayload = () => ({
    title: form.title.trim(),
    location: form.location.trim(),
    description: form.description.trim(),
    salaryMin: Number(form.salaryMin),
    salaryMax: Number(form.salaryMax),
    yearsOfExperience: Number(form.yearsOfExperience || 0),
    employmentType: form.employmentType,
    requiredSkills: form.requiredSkills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean),
  });

  const validate = () => {
    const payload = buildPayload();
    if (!payload.title || payload.title.length < 3) return "Job title must be at least 3 characters.";
    if (!payload.location || payload.location.length < 2) return "Location is required.";
    if (!payload.description || payload.description.length < 20) return "Description must be at least 20 characters.";
    if (Number.isNaN(payload.salaryMin) || payload.salaryMin < 0) return "Please provide a valid minimum salary.";
    if (Number.isNaN(payload.salaryMax) || payload.salaryMax < 0) return "Please provide a valid maximum salary.";
    if (payload.salaryMin > payload.salaryMax) return "Maximum salary must be greater than or equal to minimum salary.";
    if (payload.requiredSkills.length === 0) return "At least one skill is required.";
    return null;
  };

  const publishMutation = useMutation({
    mutationFn: async () => {
      const job = await jobApi.createJob(buildPayload());
      return jobApi.updateJobStatus(job.id, "OPEN");
    },
    onSuccess: () => navigate("/recruiter/jobs"),
    onError: (err) =>
      setFeedback({ type: "error", message: err?.message || "Could not publish the job. Please try again." }),
  });

  const draftMutation = useMutation({
    mutationFn: () => jobApi.createJob(buildPayload()),
    onSuccess: () => navigate("/recruiter/jobs"),
    onError: (err) =>
      setFeedback({ type: "error", message: err?.message || "Could not save the draft. Please try again." }),
  });

  const handlePublish = (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setFeedback({ type: "error", message: validationError });
      return;
    }
    setFeedback(null);
    publishMutation.mutate();
  };

  const handleSaveDraft = (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setFeedback({ type: "error", message: validationError });
      return;
    }
    setFeedback(null);
    draftMutation.mutate();
  };

  const isPending = publishMutation.isPending || draftMutation.isPending;

  return (
    <RecruiterLayout title="Post New Job">
      <div className="max-w-4xl">
        <div className="p-6 bg-[#0a0a0a] border border-gray-800 rounded-xl mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#06B6D4]" /> Auto-Generate with AI
            </h2>
            <p className="text-xs text-gray-400 mt-1">Paste a brief description and let our AI format the perfect job post.</p>
          </div>
          <button
            disabled
            title="AI draft generation endpoint is not available yet"
            className="px-4 py-2 bg-[#4F46E5]/20 border border-[#4F46E5]/50 text-white text-xs font-semibold rounded-lg opacity-50 cursor-not-allowed"
          >
            Generate Draft
          </button>
        </div>

        {feedback && (
          <div className={`mb-6 px-4 py-3 rounded-lg border text-xs ${
            feedback.type === "error"
              ? "bg-red-500/10 border-red-500/20 text-red-400"
              : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
          }`}>
            {feedback.message}
          </div>
        )}

        <form className="space-y-6 bg-[#0a0a0a] border border-gray-800 rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Job Title</label>
              <input
                type="text"
                value={form.title}
                onChange={handleChange("title")}
                className="w-full bg-[#111] border border-gray-800 rounded-lg px-4 py-2 text-sm text-white focus:border-[#4F46E5] outline-none"
                placeholder="e.g. Senior Frontend Engineer"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Location</label>
              <input
                type="text"
                value={form.location}
                onChange={handleChange("location")}
                className="w-full bg-[#111] border border-gray-800 rounded-lg px-4 py-2 text-sm text-white focus:border-[#4F46E5] outline-none"
                placeholder="e.g. Remote, San Francisco"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Employment Type</label>
              <select
                value={form.employmentType}
                onChange={handleChange("employmentType")}
                className="w-full bg-[#111] border border-gray-800 rounded-lg px-4 py-2 text-sm text-white focus:border-[#4F46E5] outline-none appearance-none"
              >
                {EMPLOYMENT_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Minimum Salary (USD)</label>
              <input
                type="number"
                value={form.salaryMin}
                onChange={handleChange("salaryMin")}
                className="w-full bg-[#111] border border-gray-800 rounded-lg px-4 py-2 text-sm text-white focus:border-[#4F46E5] outline-none"
                placeholder="e.g. 120000"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Maximum Salary (USD)</label>
              <input
                type="number"
                value={form.salaryMax}
                onChange={handleChange("salaryMax")}
                className="w-full bg-[#111] border border-gray-800 rounded-lg px-4 py-2 text-sm text-white focus:border-[#4F46E5] outline-none"
                placeholder="e.g. 150000"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Years of Experience Required</label>
              <input
                type="number"
                value={form.yearsOfExperience}
                onChange={handleChange("yearsOfExperience")}
                className="w-full bg-[#111] border border-gray-800 rounded-lg px-4 py-2 text-sm text-white focus:border-[#4F46E5] outline-none"
                placeholder="e.g. 3"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Job Description</label>
            <textarea
              rows="6"
              value={form.description}
              onChange={handleChange("description")}
              className="w-full bg-[#111] border border-gray-800 rounded-lg px-4 py-3 text-sm text-white focus:border-[#4F46E5] outline-none"
              placeholder="Describe the role, responsibilities, and ideal candidate..."
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Required Skills (Comma separated)</label>
            <input
              type="text"
              value={form.requiredSkills}
              onChange={handleChange("requiredSkills")}
              className="w-full bg-[#111] border border-gray-800 rounded-lg px-4 py-2 text-sm text-white focus:border-[#4F46E5] outline-none"
              placeholder="React, TypeScript, Node.js..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={isPending}
              className="px-5 py-2.5 bg-gray-900 border border-gray-700 hover:bg-gray-800 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {draftMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Draft"}
            </button>
            <button
              type="button"
              onClick={handlePublish}
              disabled={isPending}
              className="px-5 py-2.5 bg-[#4F46E5] hover:bg-[#4338ca] text-white text-xs font-medium rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              {publishMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Publish Job
            </button>
          </div>
        </form>
      </div>
    </RecruiterLayout>
  );
}
