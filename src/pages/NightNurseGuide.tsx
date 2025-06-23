
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogSidebar from "@/components/blog/BlogSidebar";
import BlogArticle from "@/components/blog/BlogArticle";
import NightNurseGuideArticleContent from "@/components/night-nurse-guide/NightNurseGuideArticleContent";

const quickNavLinks = [
  { href: "#what-is-a-night-nurse", text: "What Is a Night Nurse?" },
  { href: "#qualifications", text: "Qualifications" },
  { href: "#services", text: "Services" },
  { href: "#benefits", text: "Benefits" },
  { href: "#how-to-hire", text: "How to Hire" },
  { href: "#cost", text: "Costs" },
  { href: "#conclusion", text: "Conclusion" },
];

const relatedResources = [
  { href: "/nurse-llc-setup-guide", text: "Business Setup Guide" },
  { href: "/malpractice-insurance", text: "Insurance Requirements" },
  { href: "/elderly-care-nurse-services", text: "Elderly Care Services" },
  { href: "/newborn-nurse-support-guide", text: "Newborn Care Guide" },
];

export default function NightNurseGuide() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-[#1e293b] font-sans">
      <Navbar />
      <main className="flex-grow pt-24">
        <section className="py-16 md:py-20 bg-gradient-to-br from-slate-100 via-blue-50 to-blue-100">
          <div className="container max-w-4xl mx-auto px-4 flex flex-col gap-8 text-center">
            <h1 className="font-extrabold text-4xl md:text-5xl lg:text-6xl tracking-tight text-[#1e293b] leading-tight mb-3 md:mb-6 font-sans">
              Night Nurses for Newborn Care
              <span className="block text-2xl md:text-3xl font-medium mt-2 text-blue-700">
                A Complete Guide to Professional Overnight Baby Support
              </span>
            </h1>
            <div className="flex justify-center items-center text-gray-500 gap-4 text-sm md:text-base">
              <span>June 15, 2025</span>
              <span>•</span>
              <span>15 min read</span>
            </div>
          </div>
        </section>

        <section className="py-10 px-4">
          <div className="container mx-auto flex flex-col lg:flex-row gap-10 justify-between max-w-6xl">
            <BlogArticle>
              <NightNurseGuideArticleContent />
            </BlogArticle>
            <BlogSidebar quickNavLinks={quickNavLinks} relatedResources={relatedResources} />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
