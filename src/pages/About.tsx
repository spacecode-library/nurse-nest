
import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24">
        <section className="section-padding">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold mb-8">About Us</h1>
              
              <div className="prose prose-lg max-w-none">
                <p className="mb-6">
                  Nurse Nest is a nurse-owned small business with deep expertise in the travel nursing industry. As a leading third-party nurse marketplace, we specialize in sourcing highly qualified independent nurse contractors for personalized care needs. Our streamlined onboarding process ensures a stress-free experience for clients seeking full-time, part-time, or as-needed nursing services.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
