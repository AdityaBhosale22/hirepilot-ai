import React from 'react';
import RecruiterLayout from '../../components/recruiter/RecruiterLayout';
import { Upload } from 'lucide-react';

export default function Company() {
  return (
    <RecruiterLayout title="Company Profile">
      <div className="max-w-3xl bg-[#0a0a0a] border border-gray-800 rounded-xl p-6">
        <div className="flex items-center gap-6 mb-8 border-b border-gray-800 pb-6">
          <div className="w-20 h-20 bg-gray-900 border-2 border-dashed border-gray-700 rounded-xl flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:border-[#4F46E5] transition-colors">
            <Upload className="w-5 h-5 mb-1" />
            <span className="text-[10px]">Logo</span>
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Brand Assets</h2>
            <p className="text-xs text-gray-400 mt-1">Upload your company logo and header image for the public careers page.</p>
          </div>
        </div>

        <form className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Company Name</label>
            <input type="text" defaultValue="Acme Corp" className="w-full bg-[#111] border border-gray-800 rounded-lg px-4 py-2 text-sm text-white focus:border-[#4F46E5] outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Website</label>
            <input type="url" defaultValue="https://acmecorp.com" className="w-full bg-[#111] border border-gray-800 rounded-lg px-4 py-2 text-sm text-white focus:border-[#4F46E5] outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">About Company</label>
            <textarea rows="4" className="w-full bg-[#111] border border-gray-800 rounded-lg px-4 py-3 text-sm text-white focus:border-[#4F46E5] outline-none">We build innovative tools for the future of work.</textarea>
          </div>
          <button type="button" className="px-5 py-2.5 bg-[#4F46E5] hover:bg-[#4338ca] text-white text-xs font-medium rounded-lg">
            Save Changes
          </button>
        </form>
      </div>
    </RecruiterLayout>
  );
}