import React from 'react';
import { motion } from 'framer-motion';
import { Users, Workflow, BarChart3, ShieldCheck, Zap, Globe } from 'lucide-react';

export default function Features() {
  const features = [
    { icon: <Users />, title: "Collaborative Hiring", desc: "Invite managers, collect feedback, and make decisions together in real-time." },
    { icon: <Workflow />, title: "Custom Workflows", desc: "Design interview pipelines that match your exact company processes." },
    { icon: <BarChart3 />, title: "Advanced Analytics", desc: "Track time-to-hire, source quality, and bottleneck metrics effortlessly." },
    { icon: <ShieldCheck />, title: "Compliance Ready", desc: "Built-in GDPR, CCPA, and EEOC compliance tools to keep your hiring legal." },
    { icon: <Zap />, title: "Instant Integrations", desc: "Connects flawlessly with Slack, Zoom, Google Calendar, and your HRIS." },
    { icon: <Globe />, title: "Global Talent Pool", desc: "Post to 100+ job boards worldwide with a single click." },
  ];

  return (
    <section id="features" className="py-24 bg-[#050505] border-y border-gray-900">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Everything you need to scale</h2>
          <p className="text-gray-400 max-w-2xl text-lg">
            Beyond AI, HirePilot delivers a robust, enterprise-grade Applicant Tracking System built for speed and collaboration.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="flex gap-4"
            >
              <div className="flex-shrink-0 mt-1 text-[#4F46E5]">
                {React.cloneElement(feature.icon, { className: 'w-6 h-6' })}
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">{feature.title}</h4>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}