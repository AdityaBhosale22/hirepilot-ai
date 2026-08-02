import React from 'react';
import RecruiterLayout from '../../components/recruiter/RecruiterLayout';

export default function Settings() {
  return (
    <RecruiterLayout title="Settings & Billing">
      <div className="max-w-3xl space-y-6">
        <div className="p-6 bg-[#0a0a0a] border border-gray-800 rounded-xl">
          <h2 className="text-sm font-semibold text-white border-b border-gray-800 pb-3 mb-4">Account Preferences</h2>
          <div className="space-y-4">
            <label className="flex items-center justify-between text-xs text-gray-300">
              <span>Receive Daily Digest emails</span>
              <input type="checkbox" defaultChecked className="h-4 w-4 rounded bg-[#111] border-gray-800 text-[#4F46E5]" />
            </label>
            <label className="flex items-center justify-between text-xs text-gray-300">
              <span>Enable AI Auto-Rejection for Low Matches</span>
              <input type="checkbox" className="h-4 w-4 rounded bg-[#111] border-gray-800 text-[#4F46E5]" />
            </label>
          </div>
        </div>

        <div className="p-6 bg-[#0a0a0a] border border-gray-800 rounded-xl">
          <div className="flex justify-between items-center border-b border-gray-800 pb-3 mb-4">
            <h2 className="text-sm font-semibold text-white">Current Plan</h2>
            <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold rounded">PRO</span>
          </div>
          <p className="text-xs text-gray-400 mb-4">You are currently on the Pro Tier. Next billing date is Sept 1, 2026.</p>
          <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-xs font-medium rounded-lg">
            Manage Billing
          </button>
        </div>
      </div>
    </RecruiterLayout>
  );
}