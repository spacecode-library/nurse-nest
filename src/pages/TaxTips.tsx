import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function TaxTips() {
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
              Maximize Your Take-Home as a <span className="text-primary-500">1099 Nurse</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              You can save thousands each year by understanding your deductions.
            </p>
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
              <h2 className="text-2xl font-semibold mb-4">Tax Deductions for Independent Nurses</h2>
              <p className="mb-6">
                Independent nurse contractors, typically classified as 1099 workers, can deduct ordinary and necessary business expenses related to their nursing services. Here are some common deductions:
              </p>
              
              <div className="space-y-8">
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h3 className="text-xl font-semibold mb-3">Nurse Malpractice Insurance</h3>
                  <p className="mb-2">Deduct premiums for liability insurance ($80–$500/year for RNs, $500–$2,000 for NPs).</p>
                  <div className="bg-gray-100 p-3 rounded-md">
                    <p className="text-sm text-gray-700"><strong>Example:</strong> A $300 annual premium is fully deductible.</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h3 className="text-xl font-semibold mb-3">Licensing and Certifications</h3>
                  <p className="mb-2">Deduct costs for maintaining an active RN or NP license, renewals, and certifications (e.g., BLS, ACLS).</p>
                  <div className="bg-gray-100 p-3 rounded-md">
                    <p className="text-sm text-gray-700"><strong>Example:</strong> $200 for license renewal or $350 for a certification course.</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h3 className="text-xl font-semibold mb-3">Continuing Education (CEUs)</h3>
                  <p className="mb-2">Deduct expenses for CEUs, workshops, or seminars required for licensure or skill enhancement.</p>
                  <div className="bg-gray-100 p-3 rounded-md">
                    <p className="text-sm text-gray-700"><strong>Example:</strong> $500 for an online CEU course or conference fees.</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h3 className="text-xl font-semibold mb-3">Professional Memberships</h3>
                  <p className="mb-2">Deduct dues for organizations like the American Nurses Association (ANA) or specialty groups.</p>
                  <div className="bg-gray-100 p-3 rounded-md">
                    <p className="text-sm text-gray-700"><strong>Example:</strong> $150/year for ANA membership.</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h3 className="text-xl font-semibold mb-3">Home Office Expenses</h3>
                  <p className="mb-2">Deduct a portion of home expenses (e.g., rent, utilities, internet) if you use a dedicated space for administrative tasks.</p>
                  <p className="mb-2">Use the simplified method ($5/square foot, up to 300 sq. ft., max $1,500) or actual expenses (percentage of home used).</p>
                  <div className="bg-gray-100 p-3 rounded-md">
                    <p className="text-sm text-gray-700"><strong>Example:</strong> $1,200 deduction for a 240 sq. ft. home office (simplified method).</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h3 className="text-xl font-semibold mb-3">Business Equipment and Supplies</h3>
                  <p className="mb-2">Deduct costs for stethoscopes, scrubs, medical bags, computers, or software used for work.</p>
                  <div className="bg-gray-100 p-3 rounded-md">
                    <p className="text-sm text-gray-700"><strong>Example:</strong> $200 for scrubs or $1,000 for a laptop (may require depreciation if over $2,500).</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h3 className="text-xl font-semibold mb-3">Mileage and Travel Expenses</h3>
                  <p className="mb-2">Deduct mileage for business-related travel (e.g., to client sites, hospitals) at the 2025 IRS rate (estimated ~$0.67/mile, pending confirmation).</p>
                  <p className="mb-2">Alternatively, deduct actual vehicle expenses (gas, maintenance, insurance) based on business use percentage.</p>
                  <p className="mb-2">Deduct travel costs (flights, hotels, meals at 50%) for work-related trips, such as conferences.</p>
                  <div className="bg-gray-100 p-3 rounded-md">
                    <p className="text-sm text-gray-700"><strong>Example:</strong> 5,000 business miles = $3,350 deduction (at $0.67/mile).</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h3 className="text-xl font-semibold mb-3">Cell Phone and Internet</h3>
                  <p className="mb-2">Deduct the business-use portion of phone and internet bills.</p>
                  <div className="bg-gray-100 p-3 rounded-md">
                    <p className="text-sm text-gray-700"><strong>Example:</strong> 50% of a $1,200 annual phone bill = $600 deduction.</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h3 className="text-xl font-semibold mb-3">Office Expenses</h3>
                  <p className="mb-2">Deduct costs for stationery, postage, or software subscriptions (e.g., scheduling tools).</p>
                  <div className="bg-gray-100 p-3 rounded-md">
                    <p className="text-sm text-gray-700"><strong>Example:</strong> $200 for office supplies or $240 for a scheduling app.</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h3 className="text-xl font-semibold mb-3">Legal and Professional Services</h3>
                  <p className="mb-2">Deduct fees for CPAs, attorneys, or LLC formation services.</p>
                  <div className="bg-gray-100 p-3 rounded-md">
                    <p className="text-sm text-gray-700"><strong>Example:</strong> $500 for tax preparation or $200 for LLC filing assistance.</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h3 className="text-xl font-semibold mb-3">Health Insurance Premiums</h3>
                  <p className="mb-2">Deduct self-employed health insurance premiums for yourself, spouse, and dependents, subject to income limits.</p>
                  <div className="bg-gray-100 p-3 rounded-md">
                    <p className="text-sm text-gray-700"><strong>Example:</strong> $6,000 in premiums, fully deductible if net business income exceeds the amount.</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h3 className="text-xl font-semibold mb-3">Retirement Contributions</h3>
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
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
