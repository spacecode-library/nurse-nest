
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { Helmet } from 'react-helmet';

export default function MalpracticeInsurance() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Helmet>
        <title>Malpractice Insurance for Independent Nurses</title>
        <meta name="description" content="Discover top malpractice insurance options for RNs and NPs. Learn how to stay protected and compliant as an independent nurse contractor." />
        <meta name="keywords" content="nurse malpractice insurance, RN liability coverage, Berxi vs NSO, malpractice insurance cost for nurses" />
      </Helmet>
      
      <Navbar />
      
      <main className="flex-1 pt-24">
        <div className="container mx-auto px-4 py-12">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Protect Your Practice with <span className="text-primary-500">Nurse-Specific Coverage</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Independent nurses need protection. Here's how to get covered and stay compliant.
            </p>
            
            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <span className="bg-green-50 text-green-700 text-xs px-3 py-1 rounded-full border border-green-200 flex items-center">
                <svg className="w-3 h-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Nurse-Verified
              </span>
              <span className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full border border-blue-200 flex items-center">
                <svg className="w-3 h-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                Updated for 2025
              </span>
              <span className="bg-purple-50 text-purple-700 text-xs px-3 py-1 rounded-full border border-purple-200 flex items-center">
                <svg className="w-3 h-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
                Resource Guide
              </span>
            </div>
          </div>
          
          {/* Disclaimer */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-10 max-w-3xl mx-auto">
            <div className="flex items-start">
              <div className="mr-4 text-xl">💡</div>
              <div>
                <h3 className="font-semibold text-amber-800 mb-1">Disclaimer</h3>
                <p className="text-amber-700 text-sm">
                  This guide is for informational purposes only. Consult a licensed provider or legal professional.
                </p>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
            <div className="prose max-w-none">
              <p className="mb-6">
                Malpractice insurance protects against negligence or malpractice claims. This coverage is <strong>essential</strong> for independent nurses because you won't receive employer coverage when working on your own.
              </p>
              
              <h2 className="text-2xl font-semibold mb-4" id="why-you-need-coverage">Why You Need Coverage</h2>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Independent contractors don't receive employer coverage</li>
                <li>Protects your personal assets from lawsuits</li>
                <li>Often required by clients or facilities</li>
                <li>Provides legal defense costs even for unfounded claims</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mb-4" id="cost-overview">Cost Overview</h2>
              <p className="mb-6">
                Malpractice insurance typically costs between <strong>$80–$500 per year</strong> depending on your role and provider. Advanced practice nurses will pay on the higher end of this range.
              </p>
              
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8">
                <h3 className="text-xl font-semibold mb-4">Top Insurance Providers</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded shadow-sm border border-gray-100 flex flex-col h-full">
                    <h4 className="font-medium mb-2">NSO</h4>
                    <p className="text-sm text-gray-600 mb-4 flex-grow">Specializes in nursing coverage with 60+ years experience</p>
                    <a 
                      href="https://www.nso.com/malpractice-insurance/Individuals/Nurses" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center"
                    >
                      <Button className="w-full bg-primary-500 hover:bg-primary-600 text-sm">
                        Visit NSO <ExternalLink className="h-4 w-4 ml-1" />
                      </Button>
                    </a>
                  </div>
                  <div className="bg-white p-4 rounded shadow-sm border border-gray-100 flex flex-col h-full">
                    <h4 className="font-medium mb-2">Berxi</h4>
                    <p className="text-sm text-gray-600 mb-4 flex-grow">Digital-first with instant quotes and competitive rates</p>
                    <a 
                      href="https://www.berxi.com/insurance/all-nurses/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center"
                    >
                      <Button className="w-full bg-primary-500 hover:bg-primary-600 text-sm">
                        Visit Berxi <ExternalLink className="h-4 w-4 ml-1" />
                      </Button>
                    </a>
                  </div>
                  <div className="bg-white p-4 rounded shadow-sm border border-gray-100 flex flex-col h-full">
                    <h4 className="font-medium mb-2">CM&F Group</h4>
                    <p className="text-sm text-gray-600 mb-4 flex-grow">Flexible policies with same-day coverage available</p>
                    <a 
                      href="https://www.cmfgroup.com/professional-liability-insurance/nursing-liability-insurance/registered-nurse-rn-insurance/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center"
                    >
                      <Button className="w-full bg-primary-500 hover:bg-primary-600 text-sm">
                        Visit CM&F <ExternalLink className="h-4 w-4 ml-1" />
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
              
              <p>
                Most providers offer <strong>same-day coverage</strong>, so you can get protected quickly when you need it. Remember to keep your policy limits adequate for your practice area, typically at least $1 million per occurrence.
              </p>

              {/* Internal cross-link */}
              <div className="mt-8 bg-blue-50 p-4 rounded border border-blue-100">
                <h3 className="text-lg font-medium mb-2 text-blue-800">Related Resources</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="/llc-setup-help" className="text-blue-600 hover:text-blue-800 flex items-center">
                      <svg className="w-4 h-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                      </svg>
                      Setting up an LLC for your nursing practice? View our guide
                    </a>
                  </li>
                  <li>
                    <a href="/1099-tax-tips" className="text-blue-600 hover:text-blue-800 flex items-center">
                      <svg className="w-4 h-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                      </svg>
                      Learn about tax deductions for your insurance premiums
                    </a>
                  </li>
                </ul>
              </div>

              {/* FAQ Section for SEO schema */}
              <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  <div className="bg-white rounded border border-gray-200 p-4">
                    <h3 className="font-medium text-lg mb-2">Do I need malpractice insurance if I'm a part-time nurse?</h3>
                    <p>Yes, even part-time independent nurses need malpractice insurance. Coverage is based on your professional activities, not your hours worked.</p>
                  </div>
                  <div className="bg-white rounded border border-gray-200 p-4">
                    <h3 className="font-medium text-lg mb-2">What's the difference between occurrence and claims-made policies?</h3>
                    <p>An occurrence policy covers incidents that happen during the policy period, regardless of when claims are filed. A claims-made policy only covers claims filed while the policy is active.</p>
                  </div>
                  <div className="bg-white rounded border border-gray-200 p-4">
                    <h3 className="font-medium text-lg mb-2">Will my employer's insurance cover me for side gigs?</h3>
                    <p>No, employer policies typically only cover work performed for that specific employer. Independent work requires separate coverage.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
