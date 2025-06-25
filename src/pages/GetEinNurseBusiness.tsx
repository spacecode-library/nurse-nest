import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function GetEinNurseBusiness() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 pt-24">
        <section className="bg-gradient-to-br from-[#f0f9ff] to-[#e0f2fe] py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-light text-[#1e293b] mb-6">
                EIN Number for Nurse Businesses - Application Guide
              </h1>
              <p className="text-xl text-[#475569] mb-8 leading-relaxed">
                This page has been updated! For a comprehensive and up-to-date step-by-step EIN guide for nurses, please see our new article:&nbsp;
                <a href="/blog/ein-applications-independent-contract-nurses" className="underline text-blue-700 font-semibold hover:text-blue-900">
                  EIN Applications for Independent Contract Nurses: Complete Guide →
                </a>
              </p>
            </div>
          </div>
        </section>
        {/* What is an EIN and Why Nurses Need One (Card Section) */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-normal text-[#1e293b] mb-8 text-center" id="what-is-ein">
                What is an EIN and Why Do Nurses Need One?
              </h2>
              <div className="border border-[#e2e8f0] shadow-lg mb-12 rounded-lg overflow-hidden">
                <div className="p-8 bg-[#f0f9ff] rounded-t-lg">
                  <p className="text-lg text-[#475569] leading-relaxed mb-6">
                    An Employer Identification Number (EIN), also called a Federal Tax ID, is a unique nine-digit number assigned by the IRS to identify your business for tax purposes. Think of it as a Social Security number for your nursing business.
                  </p>
                  <div className="bg-[#f0f9ff] p-6 rounded-lg border border-[#9bcbff]">
                    <h3 className="text-xl font-semibold text-[#1e293b] mb-3">Format: XX-XXXXXXX</h3>
                    <p className="text-[#475569]">
                      Example: 12-3456789
                    </p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-8 p-8 bg-white">
                  <div className="border border-[#e2e8f0] rounded-lg p-5 bg-[#f0f9ff] flex flex-col h-full">
                    <span className="text-lg font-semibold text-[#1e293b] mb-2">Privacy Protection</span>
                    <span className="text-[#475569]">Use your EIN instead of your Social Security Number on contracts, invoices, and tax forms. This protects your personal information from identity theft.</span>
                  </div>
                  <div className="border border-[#e2e8f0] rounded-lg p-5 bg-[#f0f9ff] flex flex-col h-full">
                    <span className="text-lg font-semibold text-[#1e293b] mb-2">Business Banking</span>
                    <span className="text-[#475569]">Required to open business bank accounts, apply for business credit cards, and establish business credit separate from your personal credit.</span>
                  </div>
                  <div className="border border-[#e2e8f0] rounded-lg p-5 bg-[#f0f9ff] flex flex-col h-full">
                    <span className="text-lg font-semibold text-[#1e293b] mb-2">Professional Image</span>
                    <span className="text-[#475569]">Clients and healthcare facilities view businesses with EINs as more professional and established, potentially leading to better contracts.</span>
                  </div>
                  <div className="border border-[#e2e8f0] rounded-lg p-5 bg-[#f0f9ff] flex flex-col h-full">
                    <span className="text-lg font-semibold text-[#1e293b] mb-2">Tax Benefits</span>
                    <span className="text-[#475569]">Simplifies tax filing and allows for better organization of business expenses and income separate from personal finances.</span>
                  </div>
                </div>
              </div>
              <div className="text-center text-lg">
                Ready for a step-by-step guide?&nbsp;
                <a href="/blog/ein-applications-independent-contract-nurses" className="underline text-blue-700 font-semibold hover:text-blue-900">
                  Read our EIN Applications for Independent Contract Nurses Guide →
                </a>
              </div>
            </div>
          </div>
        </section>
        <section className="related-articles">
          <h2>Related Articles</h2>
          <div className="article-grid">
            <div className="article-card">
              <h3>
                <a href="/business-bank-account-for-nurses">
                  Business Banking Setup Guide for Nurses: Complete Step-by-Step Process
                </a>
              </h3>
              <p>
                Learn how to set up business banking after obtaining your EIN, including choosing banks and account types.
              </p>
              <span className="read-time">11 min read</span>
            </div>
            <div className="article-card">
              <h3>
                <a href="/blog/ein-applications-independent-contract-nurses">
                  EIN Applications for Independent Contract Nurses: Complete Guide
                </a>
              </h3>
              <p>
                Step-by-step guide to applying for an EIN as an independent contract nurse, including application methods and requirements.
              </p>
              <span className="read-time">10 min read</span>
            </div>
            {/* Other existing articles */}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
