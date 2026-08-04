import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import RecruiterLayout from "../../components/recruiter/RecruiterLayout";
import Skeleton from "../../components/shared/Skeleton";
import ErrorState from "../../components/shared/ErrorState";
import { Building2, Loader2 } from "lucide-react";
import companyApi from "../../api/company.api";
import { QUERY_KEYS, DEFAULT_QUERY_OPTIONS } from "../../config/constants";

function CompanyForm({ company, onSaved }) {
  const [form, setForm] = useState(() => ({
    name: company?.name ?? "",
    description: company?.description ?? "",
    website: company?.website ?? "",
    logo: company?.logo ?? "",
    industry: company?.industry ?? "",
    companySize: company?.companySize != null ? String(company.companySize) : "",
    location: company?.location ?? "",
  }));
  const [feedback, setFeedback] = useState(null);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const saveMutation = useMutation({
    mutationFn: () => {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        website: form.website.trim() || undefined,
        logo: form.logo.trim() || undefined,
        industry: form.industry.trim() || undefined,
        companySize: form.companySize !== "" ? Number(form.companySize) : undefined,
        location: form.location.trim() || undefined,
      };
      return company
        ? companyApi.updateCompany(company.id, payload)
        : companyApi.createCompany(payload);
    },
    onSuccess: () => {
      onSaved();
      setFeedback({ type: "success", message: company ? "Company details saved." : "Company profile created." });
    },
    onError: (err) =>
      setFeedback({ type: "error", message: err?.message || "Could not save company details." }),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || form.name.trim().length < 2) {
      setFeedback({ type: "error", message: "Company name must be at least 2 characters." });
      return;
    }
    setFeedback(null);
    saveMutation.mutate();
  };

  return (
    <div className="max-w-3xl bg-[#0a0a0a] border border-gray-800 rounded-xl p-6">
      <div className="flex items-center gap-6 mb-8 border-b border-gray-800 pb-6">
        <div className="w-20 h-20 bg-gray-900 border border-gray-700 rounded-xl flex items-center justify-center overflow-hidden">
          {form.logo ? (
            <img src={form.logo} alt="Company logo" className="w-full h-full object-contain" />
          ) : (
            <Building2 className="w-8 h-8 text-gray-500" />
          )}
        </div>
        <div>
          <h2 className="text-base font-semibold text-white">
            {company ? "Brand & Company Profile" : "Create Your Company Profile"}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            {company
              ? "Update your company details shown on the public careers page."
              : "Set up your company so you can post jobs."}
          </p>
        </div>
      </div>

      {feedback && (
        <div className={`mb-5 px-4 py-3 rounded-lg border text-xs ${
          feedback.type === "error"
            ? "bg-red-500/10 border-red-500/20 text-red-400"
            : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
        }`}>
          {feedback.message}
        </div>
      )}

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Company Name</label>
          <input
            type="text"
            value={form.name}
            onChange={handleChange("name")}
            className="w-full bg-[#111] border border-gray-800 rounded-lg px-4 py-2 text-sm text-white focus:border-[#4F46E5] outline-none"
            placeholder="e.g. Acme Corp"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Website</label>
          <input
            type="url"
            value={form.website}
            onChange={handleChange("website")}
            className="w-full bg-[#111] border border-gray-800 rounded-lg px-4 py-2 text-sm text-white focus:border-[#4F46E5] outline-none"
            placeholder="https://example.com"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Industry</label>
            <input
              type="text"
              value={form.industry}
              onChange={handleChange("industry")}
              className="w-full bg-[#111] border border-gray-800 rounded-lg px-4 py-2 text-sm text-white focus:border-[#4F46E5] outline-none"
              placeholder="e.g. Software"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Company Size</label>
            <input
              type="number"
              min="1"
              value={form.companySize}
              onChange={handleChange("companySize")}
              className="w-full bg-[#111] border border-gray-800 rounded-lg px-4 py-2 text-sm text-white focus:border-[#4F46E5] outline-none"
              placeholder="e.g. 50"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Location</label>
          <input
            type="text"
            value={form.location}
            onChange={handleChange("location")}
            className="w-full bg-[#111] border border-gray-800 rounded-lg px-4 py-2 text-sm text-white focus:border-[#4F46E5] outline-none"
            placeholder="e.g. San Francisco, CA"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Logo URL</label>
          <input
            type="url"
            value={form.logo}
            onChange={handleChange("logo")}
            className="w-full bg-[#111] border border-gray-800 rounded-lg px-4 py-2 text-sm text-white focus:border-[#4F46E5] outline-none"
            placeholder="https://example.com/logo.png"
          />
          <p className="text-[10px] text-gray-500 mt-1">File uploads are not supported; provide a public image URL instead.</p>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">About Company</label>
          <textarea
            rows="4"
            value={form.description}
            onChange={handleChange("description")}
            className="w-full bg-[#111] border border-gray-800 rounded-lg px-4 py-3 text-sm text-white focus:border-[#4F46E5] outline-none"
            placeholder="Tell candidates about your company."
          ></textarea>
        </div>
        <button
          type="submit"
          disabled={saveMutation.isPending}
          className="px-5 py-2.5 bg-[#4F46E5] hover:bg-[#4338ca] text-white text-xs font-medium rounded-lg flex items-center gap-2 disabled:opacity-50"
        >
          {saveMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default function Company() {
  const queryClient = useQueryClient();

  const {
    data: company,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: QUERY_KEYS.COMPANY,
    queryFn: () => companyApi.getMyCompany(),
    ...DEFAULT_QUERY_OPTIONS,
  });

  const isNewCompany = isError && error?.status === 404;

  const handleSaved = () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COMPANY });
  };

  return (
    <RecruiterLayout title="Company Profile">
      {isLoading ? (
        <div className="max-w-3xl space-y-4">
          <Skeleton className="h-24 w-full" variant="card" />
          <Skeleton className="h-64 w-full" variant="card" />
        </div>
      ) : isError && !isNewCompany ? (
        <ErrorState title="Could not load your company" message={error?.message} onRetry={refetch} />
      ) : (
        <CompanyForm key={company?.id ?? "new"} company={company ?? null} onSaved={handleSaved} />
      )}
    </RecruiterLayout>
  );
}
