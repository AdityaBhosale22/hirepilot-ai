import React from 'react';
import { motion } from 'framer-motion';
import { FileSearch, Activity, BrainCircuit, PenTool } from 'lucide-react';

export default function AiFeatures() {
  const features = [
    {
      icon: <FileSearch className="w-6 h-6 text-[#06B6D4]" />,
      title: "Deep Resume Analysis",
      description: "Our AI reads between the lines, extracting hard skills, soft skills, and context from unstructured resume data."
    },
    {
      icon: <Activity className="w-6 h-6 text-[#4F46E5]" />,
      title: "Predictive ATS Scoring",
      description: "Instantly grade every applicant against your job description with an accuracy rate that rivals human recruiters."
    },
    {
      icon: <BrainCircuit className="w-6 h-6 text-[#06B6D4]" />,
      title: "AI Job Matching",
      description: "Discover hidden gems in your talent pool. HirePilot surfaces past applicants perfectly suited for new roles."
    },
    {
      icon: <PenTool className="w-6 h-6 text-[#4F46E5]" />,
      title: "Automated Outreach",
      description: "Generate highly personalized cover letters and outreach emails tailored to the candidate's unique background."
    }
  ];

  return (
    <section id="ai-tools" className="py-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#06B6D4]/5 rounded-full blur-[100px]"></div>
      
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-sm font-semibold text-[#06B6D4] uppercase tracking-wider mb-2">Native Intelligence</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">Recruitment on Autopilot</h3>
          <p className="text-gray-400">
            Eliminate bias and accelerate your hiring pipeline with purpose-built AI models trained exclusively on top-tier hiring data.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="group relative p-8 rounded-2xl bg-[#0a0a0a] border border-gray-800 hover:border-[#4F46E5]/50 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#4F46E5]/0 to-[#06B6D4]/0 group-hover:from-[#4F46E5]/5 group-hover:to-[#06B6D4]/5 rounded-2xl transition-all duration-300"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-gray-900 border border-gray-800 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h4 className="text-xl font-semibold text-white mb-3">{feature.title}</h4>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}