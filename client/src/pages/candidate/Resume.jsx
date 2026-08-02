import React from 'react';
import CandidateLayout from '../../components/candidate/CandidateLayout';
import { Upload, Download, FileText, CheckCircle2, Edit3 } from 'lucide-react';

export default function Resume() {
  return (
    <CandidateLayout title="Resume Builder">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload & Current File */}
        <div className="space-y-6">
          <div className="p-6 bg-[#0a0a0a] border border-gray-800 rounded-xl">
            <h2 className="text-base font-semibold text-white mb-4">Active Resume</h2>
            <div className="p-4 bg-[#111] border border-gray-800 rounded-lg flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-[#4F46E5]" />
                <div>
                  <p className="text-xs font-medium text-white">John_Doe_Resume_2026.pdf</p>
                  <p className="text-[10px] text-gray-500">Updated 3 days ago • 142 KB</p>
                </div>
              </div>
              <button className="p-2 text-gray-400 hover:text-white">
                <Download className="w-4 h-4" />
              </button>
            </div>

            {/* Dropzone */}
            <div className="border-2 border-dashed border-gray-800 hover:border-[#4F46E5] rounded-xl p-8 text-center cursor-pointer transition-colors bg-[#050505]">
              <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
              <p className="text-xs font-medium text-gray-300">Click or drag PDF to replace</p>
              <p className="text-[10px] text-gray-500 mt-1">Supports PDF, DOCX up to 10MB</p>
            </div>
          </div>
        </div>

        {/* Live Resume Editor Preview */}
        <div className="lg:col-span-2 p-8 bg-[#0a0a0a] border border-gray-800 rounded-xl space-y-6">
          <div className="flex items-center justify-between border-b border-gray-800 pb-4">
            <h2 className="text-base font-semibold text-white">Parsed Profile Content</h2>
            <button className="px-3 py-1.5 bg-gray-900 border border-gray-800 text-xs text-gray-300 rounded-lg flex items-center gap-1.5 hover:text-white">
              <Edit3 className="w-3.5 h-3.5" /> Edit Section
            </button>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[#06B6D4] mb-2">Professional Summary</h3>
            <p className="text-xs text-gray-400 leading-relaxed bg-[#111] p-4 rounded-lg border border-gray-800">
              Senior Frontend Engineer with 5+ years of experience specializing in React 19, TypeScript, and modern design systems. Passionate about building high-performance, accessible, dark-themed SaaS dashboards.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[#06B6D4] mb-2">Key Skills Detected</h3>
            <div className="flex flex-wrap gap-2">
              {['React 19', 'Tailwind CSS', 'Vite', 'TypeScript', 'Framer Motion', 'State Management', 'REST APIs', 'Node.js'].map((skill, i) => (
                <span key={i} className="px-3 py-1 bg-[#111] border border-gray-800 text-xs text-gray-300 rounded-lg flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </CandidateLayout>
  );
}