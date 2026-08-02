import React from 'react';
import Navbar from '../../components/landing/Navbar';
import Hero from '../../components/landing/Hero';
import TrustedCompanies from '../../components/landing/TrustedCompanies';
import Features from '../../components/landing/Features';
import AiFeatures from '../../components/landing/AiFeatures';
import HowItWorks from '../../components/landing/HowItWorks';
import Testimonials from '../../components/landing/Testimonials';
import FAQ from '../../components/landing/FAQ';
import CTA from '../../components/landing/CTA';
import Footer from '../../components/landing/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-50 font-sans selection:bg-[#4F46E5] selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <TrustedCompanies />
        <AiFeatures />
        <Features />
        <HowItWorks />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}