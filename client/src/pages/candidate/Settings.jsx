import React from 'react';
import CandidateLayout from '../../components/candidate/CandidateLayout';
import { Shield, Bell, Lock } from 'lucide-react';

export default function Settings() {
  return (
    <CandidateLayout title="Settings">
      <div className="max-w-3xl space-y-6">
        <div className="p-6 bg-[#0a0a0a] border border-gray-800 rounded-xl space-y-6">
          <h2 className="text-sm font-semibold text-white border-b border-gray-800 pb-3 flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#4F46E5]" /> Notification Preferences
          </h2>
          
          <div className="space-y-4">
            <label className="flex items-center justify-between text-xs text-gray-300 cursor-pointer">
              <span>Email alerts for new AI job matches</span>
              <input type="checkbox" defaultChecked className="h-4 w-4 rounded bg-[#111] border-gray-800 text-[#4F46E5]" />
            </label>
            <label className="flex items-center justify-between text-xs text-gray-300 cursor-pointer">
              <span>Interview reminder SMS notifications</span>
              <input type="checkbox" defaultChecked className="h-4 w-4 rounded bg-[#111] border-gray-800 text-[#4F46E5]" />
            </label>
          </div>
        </div>

        <div className="p-6 bg-[#0a0a0a] border border-gray-800 rounded-xl space-y-4">
          <h2 className="text-sm font-semibold text-white border-b border-gray-800 pb-3 flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#06B6D4]" /> Security
          </h2>
          <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-white rounded-lg">
            Change Password
          </button>
        </div>
      </div>
    </CandidateLayout>
  );
}