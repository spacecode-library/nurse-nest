
import React from "react";
import NurseNestNavbar from "@/components/NurseNestNavbar";
import { Baby } from "lucide-react";
import BlogHero from "@/components/blog/BlogHero";
import BlogArticle from "@/components/blog/BlogArticle";
import BlogSidebar from "@/components/blog/BlogSidebar";
import NewbornNurseSupportArticleContent from "@/components/newborn-nurse-support/NewbornNurseSupportArticleContent";

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
  return (
    <>
      <NurseNestNavbar isHomePage={false} />
      <div className="bg-white min-h-screen pt-24">
        <BlogHero
          Icon={Baby}
          title="Complete Newborn Care Guide for Nurses: Essential Skills and Best Practices"
          date="June 15, 2025"
          readTime="12 min read"
          description="Ultimate, evidence-based newborn care resource for nurses: from APGAR assessment, feeding, and hygiene to sleep safety and advanced parent guidance."
        />

        <section className="py-10 px-4">
          <div className="container mx-auto flex flex-col lg:flex-row gap-10 justify-between max-w-6xl">
            <BlogArticle>
              <NewbornNurseSupportArticleContent />
            </BlogArticle>
            <BlogSidebar quickNavLinks={quickNavLinks} relatedResources={relatedResources} />
          </div>
        </section>
      </div>
    </>
  );
}
