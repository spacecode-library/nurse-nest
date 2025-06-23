
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EinApplicationsContent from "@/components/ein-applications/EinApplicationsContent";
import EinApplicationsSidebar from "@/components/ein-applications/EinApplicationsSidebar";

export default function EinApplications() {
  return (
    <div className="min-h-screen bg-white flex flex-col text-[#1e293b] font-sans">
      <Navbar />
      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <section className="py-16 md:py-20 bg-gradient-to-br from-slate-100 via-blue-50 to-blue-100">
          <div className="container max-w-4xl mx-auto px-4 flex flex-col gap-8">
            <h1 className="font-extrabold text-4xl md:text-5xl lg:text-6xl tracking-tight text-[#1e293b] leading-tight mb-3 md:mb-6 text-center font-sans">
              EIN Applications for Independent Contract Nurses
              <span className="block text-2xl md:text-3xl font-medium mt-2 text-blue-700">
                Complete Guide to Obtaining Your EIN Number
              </span>
            </h1>
            <div className="flex justify-center items-center text-gray-500 gap-4 text-sm md:text-base">
              <span>June 12, 2025</span>
              <span>•</span>
              <span>10 min read</span>
            </div>
          </div>
        </section>
        {/* Content Section */}
        <section className="py-12 md:py-16">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-12 items-start">
              <EinApplicationsContent />
              <EinApplicationsSidebar />
            </div>
          </div>
        </section>
        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-[#9bcbff] to-[#3b82f6] text-white text-center">
          <div className="container max-w-3xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-4">Ready to Launch Your Nursing Business?</h2>
            <p className="mb-7 text-lg">Get connected to top opportunities and resources for independent contract nurses.</p>
            <a href="/sign-in" className="inline-block px-8 py-4 bg-white text-[#3b82f6] rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow">Explore Opportunities</a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
