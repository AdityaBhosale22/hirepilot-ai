import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket } from 'lucide-react';

export default function AuthCard({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-[#030712] flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-[#4F46E5] selection:text-white relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#4F46E5] rounded-full blur-[150px] opacity-10 pointer-events-none"></div>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link to="/" className="flex justify-center items-center gap-2 mb-8 group">
          <div className="bg-gradient-to-tr from-[#4F46E5] to-[#06B6D4] p-2 rounded-xl group-hover:shadow-[0_0_15px_rgba(79,70,229,0.5)] transition-all">
            <Rocket className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">
            HirePilot<span className="text-[#06B6D4]">.ai</span>
          </span>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          {title}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          {subtitle}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-[#0a0a0a] py-8 px-4 shadow-2xl border border-gray-800 sm:rounded-2xl sm:px-10 transition-all">
          {children}
        </div>
      </div>
    </div>
  );
}