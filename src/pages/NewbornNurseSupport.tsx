
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogArticle from "@/components/blog/BlogArticle";
import BlogSidebar from "@/components/blog/BlogSidebar";
import NewbornNurseSupportArticleContent from "@/components/newborn-nurse-support/NewbornNurseSupportArticleContent";
import AnimatedSection from "@/components/AnimatedSection";
import { useStaggeredReveal } from "@/hooks/use-staggered-reveal";

const quickNavLinks = [
  { href: "#initial-assessment", text: "Initial Assessment" },
  { href: "#vital-signs", text: "Vital Signs" },
  { href: "#feeding-support", text: "Feeding Support" },
  { href: "#hygiene-care", text: "Hygiene" },
  { href: "#safety-measures", text: "Safety" },
  { href: "#parent-education", text: "Parent Education" },
  { href: "#warning-signs", text: "Warning Signs" },
  { href: "#best-practices", text: "Best Practices" },
];

const relatedResources = [
  { href: "/nurse-llc-setup-guide", text: "Business Setup Guide" },
  { href: "/malpractice-insurance", text: "Insurance Requirements" },
  { href: "/elderly-care-nurse-services", text: "Elderly Care Services" },
  { href: "/wound-care-nursing-guide", text: "Wound Care Guide" },
];

export default function NewbornNurseSupport() {
  const prefersReducedMotion = typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const heroReveal = useStaggeredReveal(3, { step: 200, initialDelay: 300, disabled: prefersReducedMotion });

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#1e293b] font-sans">
      <Navbar />
      <main className="flex-grow pt-24">
        {/* Hero Section with staggered animations */}
        <section className="py-16 md:py-20 bg-gradient-to-br from-slate-100 via-blue-50 to-blue-100">
          <div className="container max-w-4xl mx-auto px-4 flex flex-col gap-8 text-center">
            <h1 className={`font-extrabold text-4xl md:text-5xl lg:text-6xl tracking-tight text-[#1e293b] leading-tight mb-3 md:mb-6 font-sans transition-all duration-700 ease-[cubic-bezier(.32,2,.55,.98)]
              ${heroReveal[0] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
              Complete Newborn Care Guide for Nurses
              <span className={`block text-2xl md:text-3xl font-medium mt-2 text-blue-700 transition-all duration-700 ease-[cubic-bezier(.32,2,.55,.98)]
                ${heroReveal[1] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                Essential Skills and Best Practices
              </span>
            </h1>
            <div className={`flex justify-center items-center text-gray-500 gap-4 text-sm md:text-base transition-all duration-700 ease-[cubic-bezier(.32,2,.55,.98)]
              ${heroReveal[2] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              <span>June 15, 2025</span>
              <span>•</span>
              <span>12 min read</span>
            </div>
          </div>
        </section>

        {/* Content Section with smooth reveal */}
        <AnimatedSection animation="fade-up" delay={600}>
          <section className="py-10 px-4">
            <div className="container mx-auto flex flex-col lg:flex-row gap-10 justify-between max-w-6xl">
              <BlogArticle>
                <NewbornNurseSupportArticleContent />
              </BlogArticle>
              <BlogSidebar quickNavLinks={quickNavLinks} relatedResources={relatedResources} />
            </div>
          </section>
        </AnimatedSection>
      </main>
      <Footer />
    </div>
  );
}
