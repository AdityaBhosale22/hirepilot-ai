import React from 'react';
import { motion } from 'framer-motion';

export default function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Connect Your Pipeline",
      desc: "Integrate your existing job boards or post a new role. Candidates flow directly into HirePilot."
    },
    {
      num: "02",
      title: "AI Analyzes & Ranks",
      desc: "Our engine scans every application, extracts key data points, and surfaces the top 10% immediately."
    },
    {
      num: "03",
      title: "Interview & Hire",
      desc: "Use automated scheduling and AI-generated interview questions to close the best candidates faster."
    }
  ];

  return (
    <section id="how-it-works" className="py-24">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">From open role to offer in days</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>

          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.2 }}
              className="relative text-center"
            >
              <div className="w-24 h-24 mx-auto bg-[#0a0a0a] border border-gray-800 rounded-full flex items-center justify-center text-2xl font-bold text-[#06B6D4] mb-6 shadow-[0_0_20px_rgba(6,182,212,0.1)] relative z-10">
                {step.num}
              </div>
              <h4 className="text-xl font-semibold text-white mb-3">{step.title}</h4>
              <p className="text-gray-400">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}