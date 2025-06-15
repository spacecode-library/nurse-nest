
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnimatedSection from '@/components/AnimatedSection';
import { useStaggeredReveal } from '@/hooks/use-staggered-reveal';
import { LuxIcon } from '@/components/post-surgical-care/LuxIcon';
import { Building, CreditCard, DollarSign, Shield, AlertCircle, CheckCircle } from 'lucide-react';

export default function BusinessBankingSetupGuideNurses() {
  const [titleRevealed, subtitleRevealed, metaRevealed] = useStaggeredReveal(3, {
    initialDelay: 300,
    step: 120
  });

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#1e293b] font-sans">
      <Navbar />
      
      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <section className="py-16 md:py-20 bg-gradient-to-br from-slate-100 via-blue-50 to-blue-100">
          <div className="container max-w-4xl mx-auto px-4 flex flex-col gap-8 text-center">
            <h1 className={`font-extrabold text-4xl md:text-5xl lg:text-6xl tracking-tight text-[#1e293b] leading-tight mb-3 md:mb-6 font-sans transition-all duration-700 ease-out ${
              titleRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              Business Banking Setup for Independent Nurses
              <span className={`block text-2xl md:text-3xl font-medium mt-2 text-blue-700 transition-all duration-700 ease-out delay-100 ${
                subtitleRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                Essential Guide to Financial Organization and Tax Compliance
              </span>
            </h1>
            <div className={`flex justify-center items-center text-gray-500 gap-4 text-sm md:text-base transition-all duration-700 ease-out delay-200 ${
              metaRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <span>June 15, 2025</span>
              <span>•</span>
              <span>10 min read</span>
            </div>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 py-12">
          <AnimatedSection animation="fade-up" delay={400}>
            <div className="lux-floating-insight bg-blue-50 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-bold mb-2 text-blue-800 flex items-center">
                <LuxIcon><Building className="w-6 h-6 mr-2" /></LuxIcon>
                Why Separate Business Banking Matters
              </h2>
              <p className="text-gray-700">
                Separating business and personal finances isn't just good practice—it's essential for tax compliance, liability protection, and professional credibility. The IRS requires clear separation for legitimate business deductions, and mixing funds can jeopardize your LLC protection.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={500}>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
              <div className="flex items-start">
                <LuxIcon><AlertCircle className="w-6 h-6 text-red-600 mr-3 mt-1" /></LuxIcon>
                <div>
                  <h3 className="font-semibold text-red-900 mb-2">Critical Compliance Alert</h3>
                  <p className="text-red-800 text-sm">
                    <strong>Commingling funds is a red flag for IRS audits.</strong> Business bank accounts provide the paper trail needed to substantiate business expenses and protect your entity status. Without proper separation, you risk losing business deductions and LLC liability protection.
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={600}>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg p-6 shadow-sm border hover-lux-scale">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <LuxIcon><CreditCard className="w-5 h-5 mr-2 text-blue-500" /></LuxIcon>
                  Business Checking Account
                </h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Minimum opening deposit: $25-$100</li>
                  <li>• Monthly fees: $0-$15 (often waived)</li>
                  <li>• Transaction limits: 100-500/month</li>
                  <li>• Mobile deposit and online banking</li>
                  <li>• Debit card and check writing</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm border hover-lux-scale">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <LuxIcon><DollarSign className="w-5 h-5 mr-2 text-green-500" /></LuxIcon>
                  Business Savings Account
                </h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Emergency fund for 3-6 months expenses</li>
                  <li>• Tax payment reserves (25-35% of income)</li>
                  <li>• Equipment replacement fund</li>
                  <li>• Higher interest rates than checking</li>
                  <li>• FDIC insured up to $250,000</li>
                </ul>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={700}>
            <div className="bg-white rounded-lg p-8 shadow-lg mb-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <LuxIcon><CheckCircle className="w-6 h-6 mr-2 text-green-500" /></LuxIcon>
                Required Documentation
              </h2>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold">For Sole Proprietors</h4>
                  <p className="text-gray-600">SSN or EIN, government ID, business license (if required), and DBA certificate if using a business name.</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold">For LLCs</h4>
                  <p className="text-gray-600">EIN, Articles of Organization, Operating Agreement, and government ID of authorized signers.</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-semibold">Additional Items</h4>
                  <p className="text-gray-600">Professional nursing license, business insurance documents, and initial deposit funds.</p>
                </div>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={800}>
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <LuxIcon><Shield className="w-6 h-6 mr-2 text-green-600" /></LuxIcon>
                Best Practices for Business Banking
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <ul className="space-y-2 text-gray-700">
                  <li>• Set up automatic tax savings transfers</li>
                  <li>• Use business accounts exclusively for business</li>
                  <li>• Reconcile accounts monthly</li>
                  <li>• Keep digital records of all transactions</li>
                </ul>
                <ul className="space-y-2 text-gray-700">
                  <li>• Consider business credit cards for expenses</li>
                  <li>• Establish business credit history</li>
                  <li>• Review account fees quarterly</li>
                  <li>• Maintain adequate cash flow reserves</li>
                </ul>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </main>
      <Footer />
    </div>
  );
}
