
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet';

export default function TaxTips() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Helmet>
        <title>1099 Tax Deductions for Nurses | Independent Contractor Tips</title>
        <meta name="description" content="Explore common tax deductions for 1099 nurse contractors. Maximize your take-home pay with expert-backed financial tips." />
        <meta name="keywords" content="1099 nurse tax write-offs, tax deductions for independent nurse contractors, nurse business expenses, SEP IRA for nurses" />
      </Helmet>
      
      <Navbar />
      
      <main className="flex-1 pt-24">
        <div className="container mx-auto px-4 py-12">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Maximize Your Take-Home as a <span className="text-primary-500">1099 Nurse</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              You can save thousands each year by understanding your deductions.
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
                  This content is not tax advice. Please speak with a qualified CPA or tax advisor.
                </p>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
            <div className="prose max-w-none">
              <h2 className="text-2xl font-semibold mb-4" id="tax-deductions">Tax Deductions for Independent Nurses</h2>
              <p className="mb-6">
                Independent nurse contractors, typically classified as 1099 workers, can deduct ordinary and necessary business expenses related to their nursing services. Here are some common deductions:
              </p>
              
              <div className="space-y-8">
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h3 className="text-xl font-semibold mb-3" id="malpractice-insurance">Nurse Malpractice Insurance</h3>
                  <p className="mb-2">Deduct premiums for liability insurance ($80–$500/year for RNs, $500–$2,000 for NPs).</p>
                  <div className="bg-gray-100 p-3 rounded-md">
                    <p className="text-sm text-gray-700"><strong>Example:</strong> A $300 annual premium is fully deductible.</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h3 className="text-xl font-semibold mb-3" id="licensing">Licensing and Certifications</h3>
                  <p className="mb-2">Deduct costs for maintaining an active RN or NP license, renewals, and certifications (e.g., BLS, ACLS).</p>
                  <div className="bg-gray-100 p-3 rounded-md">
                    <p className="text-sm text-gray-700"><strong>Example:</strong> $200 for license renewal or $350 for a certification course.</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h3 className="text-xl font-semibold mb-3" id="ceus">Continuing Education (CEUs)</h3>
                  <p className="mb-2">Deduct expenses for CEUs, workshops, or seminars required for licensure or skill enhancement.</p>
                  <div className="bg-gray-100 p-3 rounded-md">
                    <p className="text-sm text-gray-700"><strong>Example:</strong> $500 for an online CEU course or conference fees.</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h3 className="text-xl font-semibold mb-3" id="memberships">Professional Memberships</h3>
                  <p className="mb-2">Deduct dues for organizations like the American Nurses Association (ANA) or specialty groups.</p>
                  <div className="bg-gray-100 p-3 rounded-md">
                    <p className="text-sm text-gray-700"><strong>Example:</strong> $150/year for ANA membership.</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h3 className="text-xl font-semibold mb-3" id="home-office">Home Office Expenses</h3>
                  <p className="mb-2">Deduct a portion of home expenses (e.g., rent, utilities, internet) if you use a dedicated space for administrative tasks.</p>
                  <p className="mb-2">Use the simplified method ($5/square foot, up to 300 sq. ft., max $1,500) or actual expenses (percentage of home used).</p>
                  <div className="bg-gray-100 p-3 rounded-md">
                    <p className="text-sm text-gray-700"><strong>Example:</strong> $1,200 deduction for a 240 sq. ft. home office (simplified method).</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h3 className="text-xl font-semibold mb-3" id="equipment">Business Equipment and Supplies</h3>
                  <p className="mb-2">Deduct costs for stethoscopes, scrubs, medical bags, computers, or software used for work.</p>
                  <div className="bg-gray-100 p-3 rounded-md">
                    <p className="text-sm text-gray-700"><strong>Example:</strong> $200 for scrubs or $1,000 for a laptop (may require depreciation if over $2,500).</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h3 className="text-xl font-semibold mb-3" id="mileage">Mileage and Travel Expenses</h3>
                  <p className="mb-2">Deduct mileage for business-related travel (e.g., to client sites, hospitals) at the 2025 IRS rate (estimated ~$0.67/mile, pending confirmation).</p>
                  <p className="mb-2">Alternatively, deduct actual vehicle expenses (gas, maintenance, insurance) based on business use percentage.</p>
                  <p className="mb-2">Deduct travel costs (flights, hotels, meals at 50%) for work-related trips, such as conferences.</p>
                  <div className="bg-gray-100 p-3 rounded-md">
                    <p className="text-sm text-gray-700"><strong>Example:</strong> 5,000 business miles = $3,350 deduction (at $0.67/mile).</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h3 className="text-xl font-semibold mb-3" id="phone-internet">Cell Phone and Internet</h3>
                  <p className="mb-2">Deduct the business-use portion of phone and internet bills.</p>
                  <div className="bg-gray-100 p-3 rounded-md">
                    <p className="text-sm text-gray-700"><strong>Example:</strong> 50% of a $1,200 annual phone bill = $600 deduction.</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h3 className="text-xl font-semibold mb-3" id="office-expenses">Office Expenses</h3>
                  <p className="mb-2">Deduct costs for stationery, postage, or software subscriptions (e.g., scheduling tools).</p>
                  <div className="bg-gray-100 p-3 rounded-md">
                    <p className="text-sm text-gray-700"><strong>Example:</strong> $200 for office supplies or $240 for a scheduling app.</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h3 className="text-xl font-semibold mb-3" id="legal-services">Legal and Professional Services</h3>
                  <p className="mb-2">Deduct fees for CPAs, attorneys, or LLC formation services.</p>
                  <div className="bg-gray-100 p-3 rounded-md">
                    <p className="text-sm text-gray-700"><strong>Example:</strong> $500 for tax preparation or $200 for LLC filing assistance.</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h3 className="text-xl font-semibold mb-3" id="health-insurance">Health Insurance Premiums</h3>
                  <p className="mb-2">Deduct self-employed health insurance premiums for yourself, spouse, and dependents, subject to income limits.</p>
                  <div className="bg-gray-100 p-3 rounded-md">
                    <p className="text-sm text-gray-700"><strong>Example:</strong> $6,000 in premiums, fully deductible if net business income exceeds the amount.</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h3 className="text-xl font-semibold mb-3" id="retirement">Retirement Contributions</h3>
                  <p className="mb-2">Deduct contributions to a SEP-IRA, SIMPLE IRA, or solo 401(k), up to IRS limits (e.g., $69,000 for SEP-IRA in 2025, subject to 25% of net earnings).</p>
                  <div className="bg-gray-100 p-3 rounded-md">
                    <p className="text-sm text-gray-700"><strong>Example:</strong> $10,000 SEP-IRA contribution reduces taxable income.</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-primary-50 p-6 rounded-lg border border-primary-100 my-8">
                <h3 className="text-xl font-semibold mb-3 text-primary-700">Pro Tip: Track Everything</h3>
                <p className="text-primary-600">
                  Use an app like QuickBooks Self-Employed, Wave, or FreshBooks to track expenses throughout the year. This makes tax time much easier and helps ensure you don't miss deductions.
                </p>
              </div>

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
                      Learn about malpractice insurance for nurses
                    </a>
                  </li>
                  <li>
                    <a href="/llc-setup-help" className="text-blue-600 hover:text-blue-800 flex items-center">
                      <svg className="w-4 h-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                      </svg>
                      Set up an LLC for better tax benefits
                    </a>
                  </li>
                </ul>
              </div>

              {/* FAQ Section for SEO schema */}
              <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  <div className="bg-white rounded border border-gray-200 p-4">
                    <h3 className="font-medium text-lg mb-2">How should I track my 1099 nurse income and expenses?</h3>
                    <p>Keep separate business accounts and use accounting software like QuickBooks Self-Employed to automatically categorize expenses. Save all receipts digitally, and track mileage with a dedicated app.</p>
                  </div>
                  <div className="bg-white rounded border border-gray-200 p-4">
                    <h3 className="font-medium text-lg mb-2">Do I need to make quarterly tax payments as a 1099 nurse?</h3>
                    <p>Yes, most independent contractors need to make quarterly estimated tax payments. Set aside approximately 25-35% of your income (depending on your tax bracket) to cover both income taxes and self-employment taxes.</p>
                  </div>
                  <div className="bg-white rounded border border-gray-200 p-4">
                    <h3 className="font-medium text-lg mb-2">What tax forms do I need as a 1099 nurse contractor?</h3>
                    <p>You'll receive 1099-NEC forms from each client who paid you $600 or more. You'll report this income on Schedule C of your personal tax return, and calculate self-employment tax on Schedule SE.</p>
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
