import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet-async';

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

          {/* Hero Section (NEW) */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-nurse-dark">
              The 1099 Nurse’s Ultimate Tax Optimization Guide
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Keep More of Your Hard-Earned Income — Master tax savings, avoid audit risks, and transform your take-home pay as an independent nurse contractor.
            </p>
          </div>

          {/* Why 1099 Nurses Have Unique Tax Advantages (and Pitfalls) */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 mb-10 max-w-3xl mx-auto">
            <h2 className="text-xl font-bold mb-2 text-blue-800">
              Why 1099 Nurses Have Unique Tax Advantages (and Pitfalls)
            </h2>
            <p className="mb-3">
              Unlike W-2 nurses who lost unreimbursed expense deductions under the Tax Cuts and Jobs Act, independent contract nurses can deduct business expenses that reduce their taxable income—potentially saving thousands annually. However, this comes with complexity: you're responsible for <b>15.3% self-employment tax</b> (Social Security + Medicare) plus income tax, with no employer withholding. The key is <b>strategic deduction planning</b>: Top-performing contract nurses reduce taxable income by 30-40% through legitimate write-offs.
            </p>
          </div>

          {/* Audit Risk Red Flags Callout */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8 max-w-3xl mx-auto">
            <div className="flex items-start">
              <div className="text-2xl mr-4">⚠️</div>
              <div>
                <h3 className="font-semibold text-red-900 mb-2">Critical Audit-Risk Red Flags</h3>
                <ul className="list-disc ml-4 text-red-800 space-y-1 text-sm">
                  <li>Commingling Funds: Mixing personal and business expenses in one account</li>
                  <li>Exaggerated Home Office Claims: Deducting spaces used for personal activities</li>
                  <li>Unsubstantiated Mileage: No contemporaneous logs (date, purpose, odometer)</li>
                  <li>Deducting Non-Qualifying Expenses: Scrubs usable outside work or personal phone costs</li>
                </ul>
                <p className="mt-2">
                  <b>Pro Tip:</b> Use separate business accounts and apps like <span className="font-semibold">MileIQ</span> or <span className="font-semibold">Stride</span> for automatic tracking. IRS audits of self-employed healthcare workers increased <span className="underline">28% in 2024</span>.
                </p>
              </div>
            </div>
          </div>

          {/* Vehicle Deduction Table */}
          <div className="bg-white border border-gray-200 rounded-lg mb-8 max-w-3xl mx-auto p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">🚗</span> Vehicle Deductions: Your Largest Potential Savings
            </h2>
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full text-sm border-collapse bg-white">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="font-semibold px-4 py-2 border text-left">Method</th>
                    <th className="font-semibold px-4 py-2 border text-left">2025 Rate</th>
                    <th className="font-semibold px-4 py-2 border text-left">Best For</th>
                    <th className="font-semibold px-4 py-2 border text-left">Documentation Required</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border px-4 py-2">Standard Mileage</td>
                    <td className="border px-4 py-2">$0.67/mile</td>
                    <td className="border px-4 py-2">Nurses with efficient vehicles</td>
                    <td className="border px-4 py-2">Odometer logs, trip purpose</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">Actual Expenses</td>
                    <td className="border px-4 py-2">Variable</td>
                    <td className="border px-4 py-2">High-maintenance vehicles</td>
                    <td className="border px-4 py-2">Gas receipts, repair invoices, insurance</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="text-gray-700">
              <p className="mb-1"><b>What Qualifies:</b></p>
              <ul className="list-disc ml-5 mb-2">
                <li>Travel between patient homes (home health)</li>
                <li>Trips to medical supply stores</li>
                <li>Conference/CEU travel</li>
              </ul>
              <p className="text-sm text-gray-500 mb-2">Non-Qualifying: Commuting from home to primary work location.</p>
              <div className="bg-gray-50 border border-gray-100 rounded px-4 py-2 mb-2">
                <b>Case Study:</b> A Florida home health nurse drove 12,000 business miles in 2025 → <span className="text-green-600 font-medium">$8,040 deduction</span> ($0.67/mile). With actual expenses? Her $9,500 vehicle costs (50% business use) yielded a $4,750 deduction—so standard mileage saved $3,290 more.
              </div>
            </div>
          </div>

          {/* Home Office Deduction */}
          <div className="bg-primary-50 border border-primary-100 rounded-lg p-6 mb-8 max-w-3xl mx-auto">
            <h2 className="text-xl font-semibold text-primary-700 mb-2">
              🏠 Home Office Deduction: Two Legal Approaches
            </h2>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-bold">Simplified Method:</h4>
                <ul className="list-disc ml-5">
                  <li>$5/sq ft for exclusively business space</li>
                  <li>Max 300 sq ft → <span className="font-semibold text-green-700">$1,500 deduction</span></li>
                  <li>No receipts needed</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold">Regular Method:</h4>
                <ul className="list-disc ml-5">
                  <li>Deduct percentage of mortgage interest/rent, utilities, home insurance, repairs</li>
                  <li>Example: 10% home office = 10% of eligible costs</li>
                </ul>
              </div>
            </div>
            <p className="mt-4 text-orange-600 font-medium">
              Warning: Your "office" must be regularly <i>and exclusively</i> used for business—kitchen tables don't qualify!
            </p>
          </div>

          {/* Specialized Deductions by Specialty */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg mb-8 max-w-3xl mx-auto p-6">
            <h2 className="text-xl font-bold text-nurse-dark mb-2">📋 Specialized Deductions by Nursing Specialty</h2>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-1">Travel Nurses</h4>
                <ul className="list-disc ml-5 mb-3">
                  <li>Lodging at temporary assignments</li>
                  <li>50% of work-travel meals</li>
                  <li>State licensing fees for multiple states</li>
                  <li>Travel between assignments</li>
                </ul>
                <h4 className="font-semibold mb-1">Home Health Nurses</h4>
                <ul className="list-disc ml-5">
                  <li>Medical bags ($100–$400)</li>
                  <li>Portable vitals monitors ($150–$600)</li>
                  <li>Disposable supplies (gloves, masks)</li>
                  <li>Safety equipment (personal alarms)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Infusion Nurses</h4>
                <ul className="list-disc ml-5 mb-3">
                  <li>Specialty equipment (IV poles, catheter kits)</li>
                  <li>Vaccine storage costs</li>
                  <li>Biohazard disposal fees</li>
                </ul>
                <h4 className="font-semibold mb-1">Advanced Practice Nurses</h4>
                <ul className="list-disc ml-5">
                  <li>Malpractice insurance ($1,200–$3,000/year)</li>
                  <li>Diagnostic tools (otoscopes, ECG devices)</li>
                  <li>Prescription pad costs</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Advanced Tax Strategies */}
          <div className="bg-nurse-dark/10 border border-nurse-dark/20 rounded-lg p-6 mb-8 max-w-3xl mx-auto">
            <h2 className="text-xl font-bold text-nurse-dark mb-3">🔥 Advanced Tax Strategies for High-Earners</h2>
            <div className="mb-4">
              <b>Retirement Super-Funding</b>
              <table className="min-w-full text-sm mt-2 border-collapse bg-white">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="font-semibold px-4 py-2 border text-left">Account Type</th>
                    <th className="font-semibold px-4 py-2 border text-left">2025 Contribution Limit</th>
                    <th className="font-semibold px-4 py-2 border text-left">Tax Benefit</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border px-4 py-2">Solo 401(k)</td>
                    <td className="border px-4 py-2">$69,000</td>
                    <td className="border px-4 py-2">Pre-tax contributions</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">SEP IRA</td>
                    <td className="border px-4 py-2">25% of net earnings</td>
                    <td className="border px-4 py-2">Deductible contributions</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">HSA</td>
                    <td className="border px-4 py-2">$4,300 (individual)</td>
                    <td className="border px-4 py-2">Triple tax-advantaged</td>
                  </tr>
                </tbody>
              </table>
              <div className="bg-gray-50 border border-gray-100 rounded px-4 py-2 mt-2 mb-1">
                Example: An NP earning $150,000 could contribute $37,500 to a SEP IRA → reduces taxable income to $112,500.
              </div>
            </div>
            <div className="mb-2">
              <b>The Augusta Rule (IRS Section 280A):</b> Rent your home to your business for meetings/administrative work up to 14 days/year tax-free.
              <div className="bg-gray-50 border border-gray-100 rounded px-4 py-2 mt-2 mb-1">
                Example: Charge your LLC $500/day for 2 days of charting → <span className="text-green-700">$1,000 tax-free income</span>.
              </div>
            </div>
            <div>
              <b>Entity Structure Upgrades</b><br />
              <ul className="list-disc ml-5 text-sm">
                <li><span className="font-semibold">LLC:</span> Basic liability protection</li>
                <li><span className="font-semibold">S-Corp Election:</span> Save ~15% on self-employment tax for earnings &gt;$100,000 by paying yourself a "reasonable salary" (e.g., $70,000) and taking remaining profits as distributions.</li>
              </ul>
            </div>
          </div>

          {/* Quarterly Tax Payment Guide */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 mb-8 max-w-3xl mx-auto">
            <h2 className="text-xl font-bold text-blue-900 mb-2">⏰ Quarterly Tax Payment Survival Guide</h2>
            <ul className="mb-2 list-disc ml-5">
              <li><span className="font-semibold">Why Required:</span> Avoid underpayment penalties (&gt;$1,000 tax liability)</li>
            </ul>
            <div className="flex flex-wrap gap-6 mb-3">
              <div>
                <div className="font-bold">2025 Deadlines:</div>
                <ul className="list-disc ml-5 text-sm">
                  <li>April 15: Q1 (Jan 1–Mar 31)</li>
                  <li>June 16: Q2 (Apr 1–May 31)</li>
                  <li>September 15: Q3 (Jun 1–Aug 31)</li>
                  <li>January 15, 2026: Q4 (Sep 1–Dec 31)</li>
                </ul>
              </div>
              <div>
                <div className="font-bold">Calculation Formula:</div>
                <div className="p-2 mt-1 rounded bg-white border border-gray-200 flex items-center text-base font-mono">
                  (Estimated Annual Tax Liability ÷ 4) - Previous Payments
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">Tool: IRS Form 1040-ES includes vouchers and calculators.</p>
              </div>
            </div>
          </div>

          {/* Essential Toolkit */}
          <div className="bg-white border border-gray-200 rounded-lg mb-8 max-w-3xl mx-auto p-6">
            <h2 className="text-xl font-bold text-nurse-dark mb-2">💼 Essential Implementation Toolkit</h2>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <ul className="list-disc ml-5">
                <li>Accounting Software: <span className="font-semibold">QuickBooks Self-Employed</span> ($15/month)</li>
                <li>Mileage Trackers: Everlance (free version available)</li>
                <li>Receipt Scanners: Expensify (free for &lt;25 receipts/month)</li>
                <li>Tax Pros: Find CPAs specializing in healthcare via NATP</li>
              </ul>
            </div>
          </div>

          {/* Critical FAQs (accordion style) */}
          <div className="bg-primary-50 border border-primary-100 rounded-lg p-6 mb-8 max-w-3xl mx-auto">
            <h2 className="text-xl font-bold mb-3 text-primary-900">❓ Critical FAQs Addressed</h2>
            <div className="space-y-3">
              <div className="border rounded bg-white px-4 py-3">
                <b>Can I deduct my nursing school loans?</b> <br />
                Yes! Student loan interest deductions (up to $2,500/year) apply if MAGI &lt; $90,000 (single) or $185,000 (joint).
              </div>
              <div className="border rounded bg-white px-4 py-3">
                <b>Are agency-provided stipends taxable?</b> <br />
                Non-accountable stipends (no receipts required) are taxable income. Accountable stipends (with expense documentation) are tax-free.
              </div>
              <div className="border rounded bg-white px-4 py-3">
                <b>What if I forgot quarterly payments?</b> <br />
                File Form 2210 to calculate penalty or request waiver if:
                <ul className="list-disc ml-5 mt-1">
                  <li>Retirement/disability occurred during tax year</li>
                  <li>Disaster victim</li>
                  <li>Reasonable cause exists</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Final Audit-Proof Checklist */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-10 max-w-3xl mx-auto">
            <div className="flex items-start">
              <div className="mr-4 text-xl">🚨</div>
              <div>
                <h3 className="font-semibold text-amber-800 mb-1">The Final Audit-Proof Checklist</h3>
                <ul className="list-disc ml-4 text-amber-800 space-y-1 text-sm">
                  <li>Digital Paper Trail: Cloud-stored receipts/documents</li>
                  <li>Mileage Logs: Date, odometer start/end, purpose, location</li>
                  <li>Home Office Photos: Time-stamped images showing exclusive use</li>
                  <li>Business Banking: Separate accounts for income/expenses</li>
                  <li>1099-NEC Reconciliation: Match all received 1099s to your income records</li>
                </ul>
                <blockquote className="italic text-amber-900 mt-3 border-l-4 border-amber-400 pl-3">
                  "The IRS audits 3.8% of self-employed nurses earning &gt;$100K versus 0.9% of W-2 nurses. Your best defense? Meticulous documentation."
                </blockquote>
                <p className="mt-3 text-xs italic text-amber-700">
                  Disclaimer: This guide provides general information, not personalized tax/legal advice. Consult a CPA for entity-specific strategies. Tax laws change annually—verify deductions with IRS Publication 535 or a tax professional.
                </p>
              </div>
            </div>
          </div>

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
