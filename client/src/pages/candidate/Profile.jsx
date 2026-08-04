import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import CandidateLayout from '../../components/candidate/CandidateLayout';
import Skeleton from '../../components/shared/Skeleton';
import ErrorState from '../../components/shared/ErrorState';
import {
  Mail,
  MapPin,
  GitBranch,
  Link2,
  Globe,
  Phone,
  Briefcase,
  Star,
  X,
  Loader2,
  CheckCircle2,
  Pencil,
} from 'lucide-react';
import authApi from '../../api/auth.api';
import candidateProfileApi from '../../api/candidateProfile.api';
import { useAuth } from '../../contexts/AuthContext';
import { QUERY_KEYS, DEFAULT_QUERY_OPTIONS } from '../../config/constants';
import { getInitials } from '../../utils/format';

const EMPTY_FORM = {
  phone: '',
  bio: '',
  location: '',
  currentPosition: '',
  yearsOfExperience: '',
  expectedSalary: '',
  githubUrl: '',
  linkedinUrl: '',
  portfolioUrl: '',
};

function DetailItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-[#111] border border-gray-800 rounded-lg text-xs">
      <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wider text-gray-500">{label}</p>
        <p className="text-gray-300 mt-0.5 truncate">{value || 'Not set'}</p>
      </div>
    </div>
  );
}

function LinkItem({ icon: Icon, label, href }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-[#111] border border-gray-800 rounded-lg text-xs min-w-0">
      <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wider text-gray-500">{label}</p>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="text-[#4F46E5] hover:text-[#06B6D4] mt-0.5 inline-flex items-center gap-1 max-w-full truncate"
          >
            {href}
          </a>
        ) : (
          <p className="text-gray-300 mt-0.5">Not linked</p>
        )}
      </div>
    </div>
  );
}

export default function Profile() {
  const { user: authUser } = useAuth();
  const queryClient = useQueryClient();

  const [showEditModal, setShowEditModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ type, message });
    window.setTimeout(() => setToast(null), 3500);
  };

  const {
    data: user = authUser,
    isLoading: isUserLoading,
    isError: isUserError,
    error: userError,
    refetch: refetchUser,
  } = useQuery({
    queryKey: QUERY_KEYS.AUTH_ME,
    queryFn: () => authApi.getCurrentUser(),
    ...DEFAULT_QUERY_OPTIONS,
  });

  const {
    data: profile,
    isLoading: isProfileLoading,
    isError: isProfileError,
    error: profileError,
    refetch: refetchProfile,
  } = useQuery({
    queryKey: QUERY_KEYS.CANDIDATE_PROFILE,
    queryFn: () => candidateProfileApi.getMyCandidateProfile(),
    ...DEFAULT_QUERY_OPTIONS,
  });

  const invalidateProfileCache = () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CANDIDATE_PROFILE });
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.APPLICATION_DETAIL] });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.JOB_APPLICATIONS });
  };

  const updateMutation = useMutation({
    mutationFn: (payload) => candidateProfileApi.updateMyCandidateProfile(payload),
    onSuccess: () => {
      invalidateProfileCache();
      setShowEditModal(false);
      setFormError(null);
      showToast('Profile updated successfully.');
    },
    onError: (err) => {
      setFormError(err?.message || 'Could not update your profile. Please try again.');
    },
  });

  const displayName = user?.fullName || 'Candidate';
  const email = user?.email || 'Email not set';
  const isLoading = isUserLoading || isProfileLoading;
  const isError = isUserError || isProfileError;
  const loadError = userError || profileError;

  const currentPosition = profile?.currentPosition || null;
  const location = profile?.location || null;
  const bio = profile?.bio || null;
  const phone = profile?.phone || null;
  const yearsOfExperience = profile?.yearsOfExperience ?? null;
  const expectedSalary = profile?.expectedSalary ?? null;
  const githubUrl = profile?.githubUrl || null;
  const linkedinUrl = profile?.linkedinUrl || null;
  const portfolioUrl = profile?.portfolioUrl || null;

  const openEditModal = () => {
    setForm({
      phone: profile?.phone ?? '',
      bio: profile?.bio ?? '',
      location: profile?.location ?? '',
      currentPosition: profile?.currentPosition ?? '',
      yearsOfExperience: profile?.yearsOfExperience != null ? String(profile.yearsOfExperience) : '',
      expectedSalary: profile?.expectedSalary != null ? String(profile.expectedSalary) : '',
      githubUrl: profile?.githubUrl ?? '',
      linkedinUrl: profile?.linkedinUrl ?? '',
      portfolioUrl: profile?.portfolioUrl ?? '',
    });
    setFormError(null);
    setShowEditModal(true);
  };

  const handleFieldChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError(null);

    const normalizeNumber = (raw) => {
      if (raw === '' || raw == null) return { ok: true, value: null };
      const value = Number(raw);
      if (!Number.isFinite(value) || !Number.isInteger(value) || value < 0) {
        return { ok: false, value: null };
      }
      return { ok: true, value };
    };

    const years = normalizeNumber(form.yearsOfExperience);
    if (!years.ok) {
      setFormError('Years of experience must be a non-negative whole number.');
      return;
    }

    const salary = normalizeNumber(form.expectedSalary);
    if (!salary.ok) {
      setFormError('Expected salary must be a non-negative whole number.');
      return;
    }

    const payload = {
      phone: form.phone.trim() ? form.phone.trim() : null,
      bio: form.bio.trim() ? form.bio.trim() : null,
      location: form.location.trim() ? form.location.trim() : null,
      currentPosition: form.currentPosition.trim() ? form.currentPosition.trim() : null,
      yearsOfExperience: years.value,
      expectedSalary: salary.value,
      githubUrl: form.githubUrl.trim() ? form.githubUrl.trim() : null,
      linkedinUrl: form.linkedinUrl.trim() ? form.linkedinUrl.trim() : null,
      portfolioUrl: form.portfolioUrl.trim() ? form.portfolioUrl.trim() : null,
    };

    updateMutation.mutate(payload);
  };

  return (
    <CandidateLayout title="My Profile">
      <div className="max-w-4xl space-y-8">
        {toast && (
          <div
            className={`fixed top-5 right-5 z-[70] px-4 py-3 rounded-lg border text-xs flex items-center gap-2 shadow-lg ${
              toast.type === 'error'
                ? 'bg-red-500/10 border-red-500/20 text-red-400'
                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            }`}
          >
            {toast.type === 'error' ? (
              <X className="w-4 h-4 flex-shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            )}
            {toast.message}
          </div>
        )}

        {isError && (
          <ErrorState
            title="Could not load your profile"
            message={loadError?.message}
            onRetry={() => {
              refetchUser();
              refetchProfile();
            }}
          />
        )}

        {/* Profile Card Header */}
        <div className="p-6 bg-[#0a0a0a] border border-gray-800 rounded-xl flex flex-col sm:flex-row items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#4F46E5] to-[#06B6D4] flex items-center justify-center font-bold text-white text-2xl flex-shrink-0">
            {isLoading ? (
              <Skeleton className="h-10 w-10 rounded-full" variant="circle" />
            ) : (
              getInitials(displayName) || 'U'
            )}
          </div>
          <div className="text-center sm:text-left flex-1 min-w-0">
            <h2 className="text-xl font-bold text-white">
              {isLoading ? (
                <Skeleton className="h-6 w-48" variant="title" />
              ) : (
                displayName
              )}
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              {currentPosition || 'Add your current role to showcase it here'}
            </p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-3 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> {location || 'Location not set'}
              </span>
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" /> {email}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={openEditModal}
            disabled={isLoading || isError}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 disabled:opacity-50 disabled:pointer-events-none"
          >
            <Pencil className="w-3.5 h-3.5" /> Edit Profile
          </button>
        </div>

        {/* Bio */}
        <div className="p-6 bg-[#0a0a0a] border border-gray-800 rounded-xl space-y-4">
          <h3 className="text-sm font-semibold text-white border-b border-gray-800 pb-3">
            About
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            {bio || 'Tell recruiters about yourself. Add a short bio from Edit Profile to make your profile stand out.'}
          </p>
        </div>

        {/* Professional Details */}
        <div className="p-6 bg-[#0a0a0a] border border-gray-800 rounded-xl space-y-4">
          <h3 className="text-sm font-semibold text-white border-b border-gray-800 pb-3">
            Professional Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <DetailItem icon={Briefcase} label="Current Position" value={currentPosition} />
            <DetailItem
              icon={Star}
              label="Years of Experience"
              value={yearsOfExperience != null ? `${yearsOfExperience} year${yearsOfExperience === 1 ? '' : 's'}` : null}
            />
            <DetailItem
              icon={Mail}
              label="Expected Salary"
              value={expectedSalary != null ? `$${expectedSalary.toLocaleString()} / year` : null}
            />
            <DetailItem icon={Phone} label="Phone" value={phone} />
            <DetailItem icon={MapPin} label="Location" value={location} />
          </div>
        </div>

        {/* Links & Details */}
        <div className="p-6 bg-[#0a0a0a] border border-gray-800 rounded-xl space-y-4">
          <h3 className="text-sm font-semibold text-white border-b border-gray-800 pb-3">
            Online Presence
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <LinkItem icon={GitBranch} label="GitHub" href={githubUrl} />
            <LinkItem icon={Link2} label="LinkedIn" href={linkedinUrl} />
            <LinkItem icon={Globe} label="Portfolio" href={portfolioUrl} />
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div
          className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => !updateMutation.isPending && setShowEditModal(false)}
        >
          <div
            className="w-full max-w-lg bg-[#0a0a0a] border border-gray-800 rounded-xl p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Pencil className="w-4 h-4 text-[#4F46E5]" /> Edit Profile
              </h3>
              <button
                type="button"
                onClick={() => !updateMutation.isPending && setShowEditModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Current Position</label>
                <input
                  type="text"
                  value={form.currentPosition}
                  onChange={handleFieldChange('currentPosition')}
                  placeholder="e.g. Senior Frontend Developer"
                  className="w-full bg-[#111] border border-gray-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#4F46E5]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Bio</label>
                <textarea
                  rows="4"
                  value={form.bio}
                  onChange={handleFieldChange('bio')}
                  placeholder="Tell recruiters about your experience, skills, and goals..."
                  className="w-full bg-[#111] border border-gray-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#4F46E5] resize-y"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Phone</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={handleFieldChange('phone')}
                    placeholder="+1 555 000 0000"
                    className="w-full bg-[#111] border border-gray-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#4F46E5]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Location</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={handleFieldChange('location')}
                    placeholder="City, Country"
                    className="w-full bg-[#111] border border-gray-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#4F46E5]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Years of Experience</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={form.yearsOfExperience}
                    onChange={handleFieldChange('yearsOfExperience')}
                    placeholder="e.g. 5"
                    className="w-full bg-[#111] border border-gray-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#4F46E5]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Expected Salary (USD/yr)</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={form.expectedSalary}
                    onChange={handleFieldChange('expectedSalary')}
                    placeholder="e.g. 120000"
                    className="w-full bg-[#111] border border-gray-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#4F46E5]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">GitHub URL</label>
                <input
                  type="url"
                  value={form.githubUrl}
                  onChange={handleFieldChange('githubUrl')}
                  placeholder="https://github.com/username"
                  className="w-full bg-[#111] border border-gray-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#4F46E5]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">LinkedIn URL</label>
                <input
                  type="url"
                  value={form.linkedinUrl}
                  onChange={handleFieldChange('linkedinUrl')}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full bg-[#111] border border-gray-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#4F46E5]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Portfolio URL</label>
                <input
                  type="url"
                  value={form.portfolioUrl}
                  onChange={handleFieldChange('portfolioUrl')}
                  placeholder="https://yourportfolio.com"
                  className="w-full bg-[#111] border border-gray-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#4F46E5]"
                />
              </div>

              {formError && (
                <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  {formError}
                </p>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => !updateMutation.isPending && setShowEditModal(false)}
                  className="px-4 py-2 bg-gray-900 border border-gray-700 text-white text-xs font-medium rounded-lg hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="px-4 py-2 bg-[#4F46E5] hover:bg-[#4338ca] text-white text-xs font-medium rounded-lg flex items-center gap-2 disabled:opacity-50"
                >
                  {updateMutation.isPending ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  )}{' '}
                  {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </CandidateLayout>
  );
}
