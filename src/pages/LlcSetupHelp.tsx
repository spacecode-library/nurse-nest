
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function LlcSetupHelp() {
  const navigate = useNavigate();
  
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
              Set Up Your Nurse LLC the <span className="text-primary-500">Easy Way</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get liability protection, tax advantages, and look more professional.
            </p>
          </div>
          
          {/* Disclaimer */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-10 max-w-3xl mx-auto">
            <div className="flex items-start">
              <div className="mr-4 text-xl">💡</div>
              <div>
                <h3 className="font-semibold text-amber-800 mb-1">Disclaimer</h3>
                <p className="text-amber-700 text-sm">
                  State rules vary. Confirm requirements with your state's Board of Nursing or legal expert.
                </p>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
            <div className="prose max-w-none">
              <h2 className="text-2xl font-semibold mb-4">Benefits of Forming a Nursing LLC or PLLC</h2>
              <div className="mb-8">
                <div className="flex items-start mb-4">
                  <div className="bg-primary-100 rounded-full p-2 mr-3">
                    <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Legal separation of personal/business assets</h3>
                    <p className="text-gray-600">Protect your personal property from business liabilities</p>
                  </div>
                </div>
                
                <div className="flex items-start mb-4">
                  <div className="bg-primary-100 rounded-full p-2 mr-3">
                    <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Liability protection</h3>
                    <p className="text-gray-600">Reduce personal risk in case of a lawsuit (in addition to malpractice insurance)</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary-100 rounded-full p-2 mr-3">
                    <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Business credibility</h3>
                    <p className="text-gray-600">Present a more professional image to clients and facilities</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8">
                <h3 className="text-xl font-semibold mb-4">LLC vs. PLLC: Which One Do I Need?</h3>
                <p className="mb-4">Some states require nurses to form a Professional Limited Liability Company (PLLC) rather than a standard LLC. This applies to states like New York and Michigan.</p>
                <p className="font-medium">Check your state's requirements before proceeding.</p>
              </div>
              
              <h2 className="text-2xl font-semibold mb-4">Recommended Filing Services</h2>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                  <h3 className="font-semibold mb-2">LegalZoom</h3>
                  <ul className="text-sm text-gray-600">
                    <li>✓ Well-established</li>
                    <li>✓ Additional legal services</li>
                    <li>✓ $79 + state fees</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                  <h3 className="font-semibold mb-2">ZenBusiness</h3>
                  <ul className="text-sm text-gray-600">
                    <li>✓ Great pricing</li>
                    <li>✓ Fast processing</li>
                    <li>✓ $49 + state fees</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                  <h3 className="font-semibold mb-2">Bizee</h3>
                  <ul className="text-sm text-gray-600">
                    <li>✓ User-friendly</li>
                    <li>✓ LLC formation experts</li>
                    <li>✓ $0 + state fees</li>
                  </ul>
                </div>
              </div>
              
              <h2 className="text-2xl font-semibold mb-4">Additional Steps After Formation</h2>
              <ol className="list-decimal pl-6 mb-6 space-y-3">
                <li>
                  <strong>Obtain an EIN</strong> (Employer Identification Number) from IRS.gov (free)
                </li>
                <li>
                  <strong>Open a business bank account</strong> - this is required for full liability protection and helps with accounting
                </li>
                <li>
                  <strong>Check state-specific requirements</strong> - some states require publication notices or annual report filings
                </li>
              </ol>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-100">
              <Button 
                onClick={() => navigate('/apply')} 
                className="bg-primary-500 hover:bg-primary-600 button-hover-effect"
              >
                Request a Nurse
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
