import { Sparkles, ExternalLink, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import Skeleton from "../shared/Skeleton";
import ErrorState from "../shared/ErrorState";
import EmptyState from "../shared/EmptyState";
import { getApplicationStatusConfig, getApplicationNextStates } from "../../utils/status";
import { formatDate, getInitials } from "../../utils/format";

export default function ApplicantsTable({
  applications = [],
  loading = false,
  error = null,
  onRetry,
  onStatusChange,
}) {
  if (loading) {
    return (
      <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl overflow-hidden">
        {[1, 2, 3].map((n) => (
          <div key={n} className="p-4 flex items-center gap-4 border-b border-gray-800/60">
            <Skeleton className="h-8 w-8" variant="circle" />
            <div className="flex-1 space-y-2">
              <Skeleton className="w-1/3" />
              <Skeleton className="w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <ErrorState title="Could not load applicants" message={error} onRetry={onRetry} />;
  }

  if (!applications || applications.length === 0) {
    return (
      <EmptyState
        icon={ExternalLink}
        title="No applicants yet"
        description="When candidates apply to your jobs, their profiles will appear here."
      />
    );
  }

  return (
    <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-[#111] border-b border-gray-800 text-xs font-medium text-gray-400 uppercase tracking-wider">
              <th className="py-3 px-4">Candidate</th>
              <th className="py-3 px-4">Applied Role</th>
              <th className="py-3 px-4">AI Score</th>
              <th className="py-3 px-4">Applied Date</th>
              <th className="py-3 px-4">Status</th>
              {onStatusChange && <th className="py-3 px-4">Update</th>}
              <th className="py-3 px-4">View</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60">
            {applications.map((app) => {
              const status = getApplicationStatusConfig(app.status);
              const nextStates = getApplicationNextStates(app.status);
              const candidate = app.candidate?.user ?? {};
              return (
                <tr key={app.id} className="hover:bg-gray-900/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-xs font-bold text-white">
                        {getInitials(candidate.fullName) || candidate.fullName?.charAt(0) || "?"}
                      </div>
                      <div>
                        <p className="font-medium text-white">{candidate.fullName || "Unknown"}</p>
                        <p className="text-[10px] text-gray-500">{candidate.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-300 text-xs">{app.job?.title || "—"}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#06B6D4]" />
                      <span className="text-xs font-bold text-white">
                        {app.resume?.aiScore != null ? `${app.resume.aiScore}%` : "—"}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-xs text-gray-500">{formatDate(app.appliedAt)}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-1 text-[10px] font-medium rounded-full border ${status.className}`}>
                      {status.label}
                    </span>
                  </td>
                  {onStatusChange && (
                    <td className="py-3 px-4">
                      {nextStates.length > 0 ? (
                        <select
                          value=""
                          onChange={(e) => {
                            if (e.target.value) onStatusChange(app.id, e.target.value);
                          }}
                          className="bg-[#111] border border-gray-800 rounded-lg px-2 py-1 text-xs text-white outline-none focus:border-[#4F46E5]"
                        >
                          <option value="">Update status</option>
                          {nextStates.map((state) => (
                            <option key={state} value={state}>
                              {getApplicationStatusConfig(state).label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-[10px] text-gray-600">Final</span>
                      )}
                    </td>
                  )}
                  <td className="py-3 px-4">
                    <Link
                      to={`/recruiter/applicants/${app.id}`}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-900 border border-gray-800 text-xs text-gray-300 rounded-lg hover:text-white hover:border-gray-700 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" /> View
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
