import CandidateLayout from '../../components/candidate/CandidateLayout';
import { Mail, MapPin, GitBranch, Link2 } from 'lucide-react';

export default function Profile() {
  return (
    <CandidateLayout title="My Profile">
      <div className="max-w-4xl space-y-8">
        {/* Profile Card Header */}
        <div className="p-6 bg-[#0a0a0a] border border-gray-800 rounded-xl flex flex-col sm:flex-row items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#4F46E5] to-[#06B6D4] flex items-center justify-center font-bold text-white text-2xl flex-shrink-0">
            JD
          </div>
          <div className="text-center sm:text-left flex-1">
            <h2 className="text-xl font-bold text-white">John Doe</h2>
            <p className="text-xs text-gray-400 mt-1">Senior Frontend Engineer & UI Specialist</p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-3 text-xs text-gray-400">
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> San Francisco, CA</span>
              <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> john.doe@example.com</span>
            </div>
          </div>
          <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold rounded-lg">
            Edit Profile
          </button>
        </div>

        {/* Links & Details */}
        <div className="p-6 bg-[#0a0a0a] border border-gray-800 rounded-xl space-y-4">
          <h3 className="text-sm font-semibold text-white border-b border-gray-800 pb-3">Online Presence</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="flex items-center gap-3 p-3 bg-[#111] border border-gray-800 rounded-lg text-gray-300">
              <GitBranch className="w-4 h-4 text-gray-400" /> github.com/johndoe
            </div>
            <div className="flex items-center gap-3 p-3 bg-[#111] border border-gray-800 rounded-lg text-gray-300">
              <Link2 className="w-4 h-4 text-gray-400" /> linkedin.com/in/johndoe
            </div>
          </div>
        </div>
      </div>
    </CandidateLayout>
  );
}