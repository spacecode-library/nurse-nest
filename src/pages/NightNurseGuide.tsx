
import React from "react";
import NurseNestNavbar from "@/components/NurseNestNavbar";
import { Baby } from "lucide-react";
import BlogHero from "@/components/blog/BlogHero";
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
    <>
      <NurseNestNavbar isHomePage={false} />
      <div className="bg-white min-h-screen pt-24">
        <BlogHero
          Icon={Baby}
          title="Night Nurses for Newborn Care: A Complete Guide to Professional Overnight Baby Support"
          date="June 15, 2025"
          readTime="15 min read"
          description="This comprehensive guide explores everything you need to know about hiring night nurses, their qualifications, services, costs, and how to make the best decision for your family's unique needs."
        />

        <section className="py-10 px-4">
          <div className="container mx-auto flex flex-col lg:flex-row gap-10 justify-between max-w-6xl">
            <BlogArticle>
              <NightNurseGuideArticleContent />
            </BlogArticle>
            <BlogSidebar quickNavLinks={quickNavLinks} relatedResources={relatedResources} />
          </div>
        </section>
      </div>
    </>
  );
}
