import React from 'react';
import RecruiterLayout from '../../components/recruiter/RecruiterLayout';
import { Sparkles, Save } from 'lucide-react';

export default function CreateJob() {
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
          <button className="px-4 py-2 bg-[#4F46E5]/20 border border-[#4F46E5]/50 text-white text-xs font-semibold rounded-lg hover:bg-[#4F46E5]/30">
            Generate Draft
          </button>
        </div>

        <form className="space-y-6 bg-[#0a0a0a] border border-gray-800 rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Job Title</label>
              <input type="text" className="w-full bg-[#111] border border-gray-800 rounded-lg px-4 py-2 text-sm text-white focus:border-[#4F46E5] outline-none" placeholder="e.g. Senior Frontend Engineer" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Location</label>
              <input type="text" className="w-full bg-[#111] border border-gray-800 rounded-lg px-4 py-2 text-sm text-white focus:border-[#4F46E5] outline-none" placeholder="e.g. Remote, San Francisco" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Employment Type</label>
              <select className="w-full bg-[#111] border border-gray-800 rounded-lg px-4 py-2 text-sm text-white focus:border-[#4F46E5] outline-none appearance-none">
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Salary Range</label>
              <input type="text" className="w-full bg-[#111] border border-gray-800 rounded-lg px-4 py-2 text-sm text-white focus:border-[#4F46E5] outline-none" placeholder="e.g. $120k - $150k" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Job Description</label>
            <textarea rows="6" className="w-full bg-[#111] border border-gray-800 rounded-lg px-4 py-3 text-sm text-white focus:border-[#4F46E5] outline-none" placeholder="Describe the role, responsibilities, and ideal candidate..."></textarea>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Required Skills (Comma separated)</label>
            <input type="text" className="w-full bg-[#111] border border-gray-800 rounded-lg px-4 py-2 text-sm text-white focus:border-[#4F46E5] outline-none" placeholder="React, TypeScript, Node.js..." />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
            <button type="button" className="px-5 py-2.5 bg-gray-900 border border-gray-700 hover:bg-gray-800 text-white text-xs font-medium rounded-lg transition-colors">
              Save Draft
            </button>
            <button type="button" className="px-5 py-2.5 bg-[#4F46E5] hover:bg-[#4338ca] text-white text-xs font-medium rounded-lg flex items-center gap-2 transition-colors">
              <Save className="w-4 h-4" /> Publish Job
            </button>
          </div>
        </form>
      </div>
    </RecruiterLayout>
  );
}