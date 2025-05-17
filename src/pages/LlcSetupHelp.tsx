import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

export default function LlcSetupHelp() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Helmet>
        <title>LLC Formation Help for Nurses | Start Your Nursing Business</title>
        <meta name="description" content="Learn how to form an LLC or PLLC as a nurse. Protect your business and unlock tax advantages with easy, state-compliant setup tips." />
        <meta name="keywords" content="LLC for nurses, how to start a PLLC, nurse contractor business setup, LegalZoom for nurses" />
      </Helmet>
      
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
                  State rules vary. Confirm requirements with your state's Board of Nursing or legal expert.
                </p>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
            <div className="prose max-w-none">
              <h2 className="text-2xl font-semibold mb-4" id="benefits">Benefits of Forming a Nursing LLC or PLLC</h2>
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
              
              <h2 className="text-2xl font-semibold mb-4" id="filing-services">Recommended Filing Services</h2>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 flex flex-col h-full">
                  <h3 className="font-semibold mb-2">LegalZoom</h3>
                  <ul className="text-sm text-gray-600 mb-4 flex-grow">
                    <li>✓ Well-established</li>
                    <li>✓ Additional legal services</li>
                    <li>✓ $79 + state fees</li>
                  </ul>
                  <a 
                    href="https://www.legalzoom.com/marketing/business-formation/llc?utm_source=bing&utm_medium=cpc&utm_term=start%20llc&utm_content=78134259565528&utm_campaign=SMB%20%7C%20LLC%20%7C%20Exact&utm_campaignID=31756160&utm_adgroupID=1250144791224007&utm_partner=bingsearch&b_adgroup=SMB%20%7C%20LLC%20%7C%20Action%20-%20Start%20%7C%20Exact&b_adgroupid=1250144791224007&b_adid=78134259565528&b_campaign=SMB%20%7C%20LLC%20%7C%20Exact&b_campaignid=31756160&b_isproduct=&b_productid=&b_term=start%20llc&b_termid=kwd-78134120244813:loc-4132&msclkid=87df36fd6f5a144604155ef249cf72e7" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center w-full mt-auto"
                  >
                    <Button className="w-full bg-primary-500 hover:bg-primary-600 text-sm">
                      Visit LegalZoom <ExternalLink className="h-4 w-4 ml-1" />
                    </Button>
                  </a>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 flex flex-col h-full">
                  <h3 className="font-semibold mb-2">ZenBusiness</h3>
                  <ul className="text-sm text-gray-600 mb-4 flex-grow">
                    <li>✓ Great pricing</li>
                    <li>✓ Fast processing</li>
                    <li>✓ $49 + state fees</li>
                  </ul>
                  <a 
                    href="https://www.zenbusiness.com/file/llc-c/?headline=Start+Your+LLC+Today&utm_source=bing&utm_medium=cpc&utm_campaign=388610299&adgroupid=1274334906371325&creative=&matchtype=e&utm_term=start%20llc&device=c&CT=Prospecting_&ST=ZenBusiness_&msclkid=9899b124517a102c07c1d92b77eff933" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center w-full mt-auto"
                  >
                    <Button className="w-full bg-primary-500 hover:bg-primary-600 text-sm">
                      Visit ZenBusiness <ExternalLink className="h-4 w-4 ml-1" />
                    </Button>
                  </a>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 flex flex-col h-full">
                  <h3 className="font-semibold mb-2">Bizee</h3>
                  <ul className="text-sm text-gray-600 mb-4 flex-grow">
                    <li>✓ User-friendly</li>
                    <li>✓ LLC formation experts</li>
                    <li>✓ $0 + state fees</li>
                  </ul>
                  <a 
                    href="https://bizee.com/form/bizee-2?adlclid=0e5e4e0ae5cf14a7a0192605c2c7d93c&msclkid=0e5e4e0ae5cf14a7a0192605c2c7d93c&utm_source=bing&utm_medium=cpc&utm_campaign=%5BADL%5D%20%5BNon-Brand%5D%20LLC&utm_term=how%20to%20start%20a%20llc%20business&utm_content=LLC%20-%20Start%20LLC%20-%20General" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center w-full mt-auto"
                  >
                    <Button className="w-full bg-primary-500 hover:bg-primary-600 text-sm">
                      Visit Bizee <ExternalLink className="h-4 w-4 ml-1" />
                    </Button>
                  </a>
                </div>
              </div>
              
              <h2 className="text-2xl font-semibold mb-4" id="next-steps">Additional Steps After Formation</h2>
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

              {/* Internal cross-link */}
              <div className="mt-8 bg-blue-50 p-4 rounded border border-blue-100">
                <h3 className="text-lg font-medium mb-2 text-blue-800">Related Resources</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="/malpractice-insurance" className="text-blue-600 hover:text-blue-800 flex items-center">
                      <svg className="w-4 h-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                      </svg>
                      Protect your new business with malpractice insurance
                    </a>
                  </li>
                  <li>
                    <a href="/1099-tax-tips" className="text-blue-600 hover:text-blue-800 flex items-center">
                      <svg className="w-4 h-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                      </svg>
                      Learn tax deductions available for your new nursing LLC
                    </a>
                  </li>
                </ul>
              </div>

              {/* FAQ Section for SEO schema */}
              <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  <div className="bg-white rounded border border-gray-200 p-4">
                    <h3 className="font-medium text-lg mb-2">Do I need an LLC as a 1099 nurse contractor?</h3>
                    <p>While not legally required, forming an LLC provides personal asset protection and potential tax benefits for independent nurses. It creates separation between business and personal finances.</p>
                  </div>
                  <div className="bg-white rounded border border-gray-200 p-4">
                    <h3 className="font-medium text-lg mb-2">What's the difference between an LLC and a PLLC?</h3>
                    <p>A PLLC (Professional Limited Liability Company) is specifically for licensed professionals like nurses in some states. It offers similar protections as an LLC but meets additional regulatory requirements for licensed practitioners.</p>
                  </div>
                  <div className="bg-white rounded border border-gray-200 p-4">
                    <h3 className="font-medium text-lg mb-2">How long does it take to form a nursing LLC?</h3>
                    <p>The timeline varies by state, but typically ranges from 1-6 weeks. Expedited services through providers like ZenBusiness can speed up the process for an additional fee.</p>
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
