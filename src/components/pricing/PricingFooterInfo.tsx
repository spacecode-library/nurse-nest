
import React from "react";
import AnimatedSection from "@/components/AnimatedSection";

export default function PricingFooterInfo() {
  return (
    <section className="w-full py-16 bg-gradient-to-br from-slate-50 to-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          
          {/* Payment Security Info */}
          <AnimatedSection animation="fade-up" className="space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Stripe: The Choice of Industry Leaders Worldwide</h3>
                  <p className="text-slate-600 text-sm">Stripe processes billions in payments every year for the world's most trusted brands.</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-slate-700 text-sm">Bank-level security with end-to-end encryption</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-slate-700 text-sm">PCI DSS Level 1 certified payment processing</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-slate-700 text-sm">Fraud protection with machine learning detection</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-slate-700 text-sm">Zero storage of your payment information on our servers</span>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Transparent Pricing Info */}
          <AnimatedSection animation="fade-up" delay={150} className="space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">No Hidden Fees</h3>
                  <p className="text-slate-600 text-sm">Simple, transparent pricing you can trust</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-slate-700 text-sm">Pay only for the services you select</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-slate-700 text-sm">No monthly subscriptions or ongoing commitments</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-slate-700 text-sm">Refund guarantee if we cannot provide a match</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-slate-700 text-sm">All prices listed include applicable taxes and fees</span>
                </div>
              </div>
            </div>
          </AnimatedSection>

        </div>
      </div>
    </section>
  );
}
