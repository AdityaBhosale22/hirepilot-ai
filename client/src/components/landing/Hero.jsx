import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, PlayCircle } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      {/* Animated Background Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#4F46E5] rounded-full blur-[120px] opacity-20 animate-pulse"></div>
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-[#06B6D4] rounded-full blur-[120px] opacity-15"></div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-900/50 border border-gray-800 text-sm text-gray-300 mb-8"
        >
          <Sparkles className="w-4 h-4 text-[#06B6D4]" />
          <span>Introducing HirePilot AI 2.0</span>
          <div className="w-px h-4 bg-gray-700 mx-1"></div>
          <Link to="/changelog" className="text-[#4F46E5] hover:text-[#06B6D4] transition-colors flex items-center gap-1">
            Read announcement <ArrowRight className="w-3 h-3" />
          </Link>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400"
        >
          AI-Powered Recruitment <br className="hidden md:block" />
          Platform for Modern Teams
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-10"
        >
          Stop drowning in resumes. HirePilot uses advanced artificial intelligence to source, screen, and match top candidates to your open roles in seconds, not weeks.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link
            to="/register"
            className="w-full sm:w-auto px-8 py-3.5 rounded-lg text-white font-medium bg-[#4F46E5] hover:bg-[#4338ca] transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)] flex items-center justify-center gap-2"
          >
            Start Free Trial <ArrowRight className="w-4 h-4" />
          </Link>
          <button className="w-full sm:w-auto px-8 py-3.5 rounded-lg text-white font-medium bg-gray-900 border border-gray-800 hover:bg-gray-800 hover:border-gray-700 transition-all flex items-center justify-center gap-2">
            <PlayCircle className="w-4 h-4 text-gray-400" /> Book a Demo
          </button>
        </motion.div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="relative mx-auto max-w-5xl rounded-xl border border-gray-800 bg-[#0a0a0a] p-2 shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent z-10 bottom-0 top-1/2"></div>
          <div className="rounded-lg overflow-hidden border border-gray-800/50 bg-[#111]">
            {/* Mock Header */}
            <div className="h-10 bg-[#1a1a1a] border-b border-gray-800 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            {/* Mock App Body */}
            <div className="h-[400px] md:h-[600px] w-full bg-gradient-to-br from-[#111] to-[#0a0a0a] flex">
               <div className="w-64 border-r border-gray-800 hidden md:block p-4">
                 <div className="w-full h-8 bg-gray-800/50 rounded mb-4"></div>
                 <div className="w-3/4 h-4 bg-gray-800/30 rounded mb-2"></div>
                 <div className="w-1/2 h-4 bg-gray-800/30 rounded mb-8"></div>
                 <div className="w-full h-24 bg-gray-800/20 rounded border border-gray-800/50"></div>
               </div>
               <div className="flex-1 p-6">
                 <div className="flex justify-between mb-8">
                   <div className="w-1/3 h-10 bg-gray-800/50 rounded"></div>
                   <div className="w-32 h-10 bg-[#4F46E5]/20 border border-[#4F46E5]/30 rounded"></div>
                 </div>
                 <div className="grid grid-cols-3 gap-4 mb-6">
                   <div className="h-32 bg-gray-800/30 rounded border border-gray-800/50"></div>
                   <div className="h-32 bg-gray-800/30 rounded border border-gray-800/50"></div>
                   <div className="h-32 bg-gray-800/30 rounded border border-gray-800/50"></div>
                 </div>
                 <div className="h-64 bg-gray-800/20 rounded border border-gray-800/50 w-full"></div>
               </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}