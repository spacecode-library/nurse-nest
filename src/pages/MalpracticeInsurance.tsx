
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnimatedSection from '@/components/AnimatedSection';
import { useStaggeredReveal } from '@/hooks/use-staggered-reveal';
import { LuxIcon } from '@/components/post-surgical-care/LuxIcon';
import { Shield, DollarSign, FileText, AlertTriangle, CheckCircle } from 'lucide-react';

export default function MalpracticeInsurance() {
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
              Malpractice Insurance for Nurses
              <span className={`block text-2xl md:text-3xl font-medium mt-2 text-blue-700 transition-all duration-700 ease-out delay-100 ${
                subtitleRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                Complete Guide to Professional Liability Protection
              </span>
            </h1>
            <div className={`flex justify-center items-center text-gray-500 gap-4 text-sm md:text-base transition-all duration-700 ease-out delay-200 ${
              metaRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <span>June 15, 2025</span>
              <span>•</span>
              <span>8 min read</span>
            </div>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 py-12">
          <AnimatedSection animation="fade-up" delay={400}>
            <div className="lux-floating-insight bg-blue-50 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-bold mb-2 text-blue-800 flex items-center">
                <LuxIcon><Shield className="w-6 h-6 mr-2" /></LuxIcon>
                Why Malpractice Insurance is Essential for Nurses
              </h2>
              <p className="text-gray-700">
                Professional liability insurance protects nurses from financial devastation in case of lawsuits, providing legal defense and coverage for damages. Even the most careful nurse can face unexpected claims, making this coverage a critical investment in your career protection.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={500}>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg p-6 shadow-sm border hover-lux-scale">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <LuxIcon><DollarSign className="w-5 h-5 mr-2 text-green-500" /></LuxIcon>
                  Coverage Amounts
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• RNs: $1M-$6M per incident</li>
                  <li>• NPs: $1M-$6M per incident</li>
                  <li>• Aggregate limits: $3M-$6M annually</li>
                  <li>• Legal defense costs separate</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm border hover-lux-scale">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <LuxIcon><FileText className="w-5 h-5 mr-2 text-blue-500" /></LuxIcon>
                  Annual Premiums
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Staff RNs: $80-$300</li>
                  <li>• Travel nurses: $150-$400</li>
                  <li>• Nurse practitioners: $500-$2,000</li>
                  <li>• Specialty nurses: $200-$600</li>
                </ul>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={600}>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
              <div className="flex items-start">
                <LuxIcon><AlertTriangle className="w-6 h-6 text-amber-600 mr-3 mt-1" /></LuxIcon>
                <div>
                  <h3 className="font-semibold text-amber-800 mb-2">Common Misconceptions</h3>
                  <ul className="list-disc ml-4 text-amber-700 space-y-1">
                    <li>"My employer's insurance covers me" - Usually only covers you while employed</li>
                    <li>"I'm too careful to need it" - Claims can arise from patient outcomes, not just errors</li>
                    <li>"It's too expensive" - Costs less than $1 per day for most nurses</li>
                    <li>"Good nurses don't get sued" - Any nurse can face unexpected litigation</li>
                  </ul>
                </div>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={700}>
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <LuxIcon><CheckCircle className="w-6 h-6 mr-2 text-green-500" /></LuxIcon>
                Key Features to Look For
              </h2>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold">Occurrence vs. Claims-Made Coverage</h4>
                  <p className="text-gray-600">Occurrence coverage protects you forever for incidents during the policy period, even if claims are filed years later.</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold">License Protection</h4>
                  <p className="text-gray-600">Coverage for nursing board investigations and license defense proceedings.</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-semibold">Supplementary Benefits</h4>
                  <p className="text-gray-600">Personal injury protection, assault coverage, and privacy breach protection.</p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </main>
      <Footer />
    </div>
  );
}
