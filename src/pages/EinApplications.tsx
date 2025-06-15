
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EinApplicationsContent from "@/components/ein-applications/EinApplicationsContent";
import EinApplicationsSidebar from "@/components/ein-applications/EinApplicationsSidebar";
import AnimatedSection from "@/components/AnimatedSection";
import { useStaggeredReveal } from "@/hooks/use-staggered-reveal";

export default function EinApplications() {
  const prefersReducedMotion = typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const heroReveal = useStaggeredReveal(3, { step: 200, initialDelay: 300, disabled: prefersReducedMotion });

  return (
    <div className="min-h-screen bg-white flex flex-col text-[#1e293b] font-sans">
      <Navbar />
      <main className="flex-grow pt-24">
        {/* Hero Section with staggered animations */}
        <section className="py-16 md:py-20 bg-gradient-to-br from-slate-100 via-blue-50 to-blue-100">
          <div className="container max-w-4xl mx-auto px-4 flex flex-col gap-8">
            <h1 className={`font-extrabold text-4xl md:text-5xl lg:text-6xl tracking-tight text-[#1e293b] leading-tight mb-3 md:mb-6 text-center font-sans transition-all duration-700 ease-[cubic-bezier(.32,2,.55,.98)]
              ${heroReveal[0] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
              EIN Applications for Independent Contract Nurses
              <span className={`block text-2xl md:text-3xl font-medium mt-2 text-blue-700 transition-all duration-700 ease-[cubic-bezier(.32,2,.55,.98)]
                ${heroReveal[1] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                Complete Guide to Obtaining Your EIN Number
              </span>
            </h1>
            <div className={`flex justify-center items-center text-gray-500 gap-4 text-sm md:text-base transition-all duration-700 ease-[cubic-bezier(.32,2,.55,.98)]
              ${heroReveal[2] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              <span>June 12, 2025</span>
              <span>•</span>
              <span>10 min read</span>
            </div>
          </div>
        </section>
        
        {/* Content Section with smooth reveal */}
        <AnimatedSection animation="fade-up" delay={600}>
          <section className="py-12 md:py-16">
            <div className="container max-w-6xl mx-auto px-4">
              <div className="flex flex-col lg:flex-row gap-12 items-start">
                <EinApplicationsContent />
                <EinApplicationsSidebar />
              </div>
            </div>
          </section>
        </AnimatedSection>
        
        {/* CTA Section with fade-in */}
        <AnimatedSection animation="fade-up" delay={800}>
          <section className="py-16 bg-gradient-to-br from-[#9bcbff] to-[#3b82f6] text-white text-center">
            <div className="container max-w-3xl mx-auto px-4">
              <h2 className="text-3xl font-bold mb-4">Ready to Launch Your Nursing Business?</h2>
              <p className="mb-7 text-lg">Get connected to top opportunities and resources for independent contract nurses.</p>
              <a href="/sign-in" className="inline-block px-8 py-4 bg-white text-[#3b82f6] rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow hover-lux-scale shine-on-hover">Explore Opportunities</a>
            </div>
          </section>
        </AnimatedSection>
      </main>
      <Footer />
    </div>
  );
}
