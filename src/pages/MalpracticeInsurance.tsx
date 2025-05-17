
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

export default function MalpracticeInsurance() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
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
              
              <h2 className="text-2xl font-semibold mb-4">Why You Need Coverage</h2>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Independent contractors don't receive employer coverage</li>
                <li>Protects your personal assets from lawsuits</li>
                <li>Often required by clients or facilities</li>
                <li>Provides legal defense costs even for unfounded claims</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mb-4">Cost Overview</h2>
              <p className="mb-6">
                Malpractice insurance typically costs between <strong>$80–$500 per year</strong> depending on your role and provider. Advanced practice nurses will pay on the higher end of this range.
              </p>
              
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8">
                <h3 className="text-xl font-semibold mb-4">Top Insurance Providers</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded shadow-sm border border-gray-100">
                    <h4 className="font-medium mb-2">NSO</h4>
                    <p className="text-sm text-gray-600 mb-4">Specializes in nursing coverage with 60+ years experience</p>
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
                  <div className="bg-white p-4 rounded shadow-sm border border-gray-100">
                    <h4 className="font-medium mb-2">Berxi</h4>
                    <p className="text-sm text-gray-600 mb-4">Digital-first with instant quotes and competitive rates</p>
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
                  <div className="bg-white p-4 rounded shadow-sm border border-gray-100">
                    <h4 className="font-medium mb-2">CM&F Group</h4>
                    <p className="text-sm text-gray-600 mb-4">Flexible policies with same-day coverage available</p>
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
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
