import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function CTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-[#1e1b4b] to-[#082f49] border border-gray-700 rounded-3xl p-10 md:p-16 text-center relative overflow-hidden"
        >
          {/* Decorative background flare */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#4F46E5] rounded-full blur-[100px] opacity-40"></div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 relative z-10">
            Ready to hire your next top performer?
          </h2>
          <p className="text-gray-300 mb-10 max-w-2xl mx-auto text-lg relative z-10">
            Join thousands of modern companies using HirePilot to scale their teams faster, smarter, and without the administrative headache.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
            <Link
              to="/register"
              className="px-8 py-3.5 rounded-lg text-white font-medium bg-[#4F46E5] hover:bg-[#4338ca] transition-all shadow-lg flex items-center justify-center gap-2"
            >
              Start Your Free Trial <ArrowRight className="w-4 h-4" />
            </Link>
            <button className="px-8 py-3.5 rounded-lg text-white font-medium bg-white/10 hover:bg-white/20 border border-white/10 transition-all">
              Talk to Sales
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}