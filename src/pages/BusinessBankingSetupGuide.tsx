
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { ExternalLink, CheckCircle, FileText, Shield, Calculator } from 'lucide-react';

export default function BusinessBankingSetupGuide() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Helmet>
        <title>Business Banking Setup Guide for Nurses: Complete Step-by-Step Process | Nurse Nest</title>
        <meta name="description" content="Complete guide to business banking setup for nurses. Learn how to choose the right bank, required documents, account types, and avoid common mistakes." />
        <meta name="keywords" content="business banking nurses, nursing practice bank account, independent contractor banking, nurse business checking account" />
      </Helmet>
      
      <Navbar />
      
      <main className="flex-1 pt-24">
        {/* Hero Section */}
        <section className="py-16" style={{background: 'linear-gradient(135deg, #f1f5f9 0%, #e0f2fe 100%)'}}>
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-light text-[#1e293b] mb-6">
                Business Banking Setup Guide for Nurses: Complete Step-by-Step Process
              </h1>
              <div className="flex items-center gap-6 text-[#475569] mb-8">
                <span className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  June 12, 2025
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  11 min read
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid lg:grid-cols-4 gap-8">
                <article className="lg:col-span-3">
                  {/* Introduction */}
                  <div className="prose max-w-none mb-12">
                    <p className="text-lg text-[#475569] leading-relaxed mb-6">
                      Setting up a business bank account is one of the most important steps for nurses starting their own practice or working as independent contractors. Over 85% of successful nursing entrepreneurs maintain separate business banking from day one to protect their liability protection and simplify tax preparation.
                    </p>
                    
                    <p className="text-lg text-[#475569] leading-relaxed">
                      Whether you're launching a private practice, working as a travel nurse, or providing home health services, this comprehensive guide walks you through everything you need to know about business banking setup, from choosing the right account type to understanding fees and requirements.
                    </p>
                  </div>

                  {/* Table of Contents */}
                  <div className="bg-[#f8fafc] p-6 rounded-lg border border-[#e2e8f0] mb-12">
                    <h3 className="text-xl font-semibold text-[#1e293b] mb-4">Table of Contents</h3>
                    <ul className="space-y-2 text-[#475569]">
                      <li><a href="#why-business-banking" className="text-[#3b82f6] hover:underline">Why Nurses Need Business Banking</a></li>
                      <li><a href="#personal-vs-business" className="text-[#3b82f6] hover:underline">Personal vs Business Banking: Key Differences</a></li>
                      <li><a href="#when-you-need" className="text-[#3b82f6] hover:underline">When You Need a Business Bank Account</a></li>
                      <li><a href="#types-of-accounts" className="text-[#3b82f6] hover:underline">Types of Business Bank Accounts</a></li>
                      <li><a href="#choosing-right-bank" className="text-[#3b82f6] hover:underline">Choosing the Right Bank for Your Nursing Practice</a></li>
                      <li><a href="#required-documents" className="text-[#3b82f6] hover:underline">Required Documents for Account Opening</a></li>
                      <li><a href="#step-by-step-process" className="text-[#3b82f6] hover:underline">Step-by-Step Account Opening Process</a></li>
                      <li><a href="#account-features" className="text-[#3b82f6] hover:underline">Essential Account Features for Nurses</a></li>
                      <li><a href="#fees-to-avoid" className="text-[#3b82f6] hover:underline">Common Fees and How to Avoid Them</a></li>
                      <li><a href="#common-mistakes" className="text-[#3b82f6] hover:underline">Common Business Banking Mistakes</a></li>
                    </ul>
                  </div>

                  {/* Main Content */}
                  <div className="prose max-w-none">
                    <h2 id="why-business-banking" className="text-3xl font-semibold text-[#1e293b] mb-6">Why Nurses Need Business Banking</h2>
                    <p className="text-[#475569] leading-relaxed mb-4">
                      Separate business banking is essential for nurses operating as independent contractors, sole proprietors, or business owners. It provides legal protection, financial clarity, and professional credibility that personal accounts cannot offer.
                    </p>

                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                      <div className="bg-[#f0f9ff] p-6 rounded-lg border border-[#9bcbff]">
                        <div className="flex items-center mb-3">
                          <Shield className="h-6 w-6 text-[#3b82f6] mr-3" />
                          <h3 className="text-xl font-semibold text-[#1e293b]">Legal Protection</h3>
                        </div>
                        <p className="text-[#475569]">
                          Mixing personal and business finances can "pierce the corporate veil" if you have an LLC, eliminating the liability protection you've worked to establish.
                        </p>
                      </div>

                      <div className="bg-[#f0f9ff] p-6 rounded-lg border border-[#9bcbff]">
                        <div className="flex items-center mb-3">
                          <Calculator className="h-6 w-6 text-[#3b82f6] mr-3" />
                          <h3 className="text-xl font-semibold text-[#1e293b]">Tax Compliance</h3>
                        </div>
                        <p className="text-[#475569]">
                          The IRS expects business expenses and income to be clearly separated from personal finances for accurate tax filing and audit protection.
                        </p>
                      </div>

                      <div className="bg-[#f0f9ff] p-6 rounded-lg border border-[#9bcbff]">
                        <div className="flex items-center mb-3">
                          <CheckCircle className="h-6 w-6 text-[#3b82f6] mr-3" />
                          <h3 className="text-xl font-semibold text-[#1e293b]">Professional Image</h3>
                        </div>
                        <p className="text-[#475569]">
                          Clients, hospitals, and healthcare facilities view business banking as a sign of professionalism and legitimate business operations.
                        </p>
                      </div>
                    </div>

                    <h2 id="personal-vs-business" className="text-3xl font-semibold text-[#1e293b] mb-6">Personal vs Business Banking: Key Differences</h2>
                    <p className="text-[#475569] leading-relaxed mb-6">
                      Understanding the fundamental differences between personal and business banking helps you make informed decisions about your financial setup.
                    </p>

                    <div className="bg-[#f8fafc] p-6 rounded-lg border border-[#e2e8f0] mb-8">
                      <h3 className="text-xl font-semibold text-[#1e293b] mb-4">Account Features Comparison</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-[#e2e8f0]">
                              <th className="text-left py-2 px-3 text-[#1e293b]">Feature</th>
                              <th className="text-left py-2 px-3 text-[#1e293b]">Personal Banking</th>
                              <th className="text-left py-2 px-3 text-[#1e293b]">Business Banking</th>
                            </tr>
                          </thead>
                          <tbody className="text-[#475569]">
                            <tr className="border-b border-[#e2e8f0]">
                              <td className="py-2 px-3">Transaction Limits</td>
                              <td className="py-2 px-3">Lower daily limits</td>
                              <td className="py-2 px-3">Higher daily limits</td>
                            </tr>
                            <tr className="border-b border-[#e2e8f0]">
                              <td className="py-2 px-3">Check Processing</td>
                              <td className="py-2 px-3">Limited business check acceptance</td>
                              <td className="py-2 px-3">Full business check processing</td>
                            </tr>
                            <tr className="border-b border-[#e2e8f0]">
                              <td className="py-2 px-3">Merchant Services</td>
                              <td className="py-2 px-3">Not available</td>
                              <td className="py-2 px-3">Credit card processing available</td>
                            </tr>
                            <tr>
                              <td className="py-2 px-3">Business Tools</td>
                              <td className="py-2 px-3">Basic personal tools</td>
                              <td className="py-2 px-3">Payroll, invoicing, expense tracking</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <h2 id="when-you-need" className="text-3xl font-semibold text-[#1e293b] mb-6">When You Need a Business Bank Account</h2>
                    <p className="text-[#475569] leading-relaxed mb-6">
                      Different nursing practice types have varying requirements for business banking. Here's when it becomes necessary or highly beneficial:
                    </p>

                    <div className="space-y-8 mb-12">
                      <div className="bg-white p-6 rounded-lg border border-[#e2e8f0] shadow-sm">
                        <h3 className="text-xl font-semibold text-[#1e293b] mb-4">Required Situations</h3>
                        <ul className="space-y-2 text-[#475569]">
                          <li><strong>LLC or Corporation:</strong> Legal entities must have separate business accounts</li>
                          <li><strong>Partnership:</strong> Multiple owner businesses require business banking</li>
                          <li><strong>Employees:</strong> Payroll processing requires business accounts</li>
                          <li><strong>Significant Income:</strong> Earning over $600 annually from nursing contracts</li>
                        </ul>
                      </div>

                      <div className="bg-white p-6 rounded-lg border border-[#e2e8f0] shadow-sm">
                        <h3 className="text-xl font-semibold text-[#1e293b] mb-4">Highly Recommended Situations</h3>
                        <ul className="space-y-2 text-[#475569]">
                          <li><strong>Independent Contracting:</strong> Working with multiple agencies or clients</li>
                          <li><strong>Travel Nursing:</strong> Managing expenses across multiple assignments</li>
                          <li><strong>Private Practice:</strong> Seeing patients directly or providing services</li>
                          <li><strong>Consulting Services:</strong> Offering nursing expertise or education</li>
                        </ul>
                      </div>
                    </div>

                    <h2 id="types-of-accounts" className="text-3xl font-semibold text-[#1e293b] mb-6">Types of Business Bank Accounts</h2>
                    <p className="text-[#475569] leading-relaxed mb-6">
                      Understanding different account types helps you choose the right setup for your nursing practice needs.
                    </p>

                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                      <div className="bg-[#f0f9ff] p-6 rounded-lg border border-[#9bcbff]">
                        <h3 className="text-xl font-semibold text-[#1e293b] mb-3">Business Checking Accounts</h3>
                        <p className="text-[#475569] mb-4">
                          The foundation of business banking, used for daily transactions, bill payments, and client payments.
                        </p>
                        <ul className="text-sm text-[#475569]">
                          <li>• Monthly fees typically $10-$30</li>
                          <li>• Transaction limits vary by bank</li>
                          <li>• Basic online banking included</li>
                        </ul>
                      </div>

                      <div className="bg-[#f0f9ff] p-6 rounded-lg border border-[#9bcbff]">
                        <h3 className="text-xl font-semibold text-[#1e293b] mb-3">Business Savings Accounts</h3>
                        <p className="text-[#475569] mb-4">
                          Essential for separating operating funds from emergency reserves and tax savings.
                        </p>
                        <ul className="text-sm text-[#475569]">
                          <li>• Lower interest rates</li>
                          <li>• Transaction limits (typically 6 per month)</li>
                          <li>• Good for emergency funds</li>
                        </ul>
                      </div>
                    </div>

                    <h2 id="choosing-right-bank" className="text-3xl font-semibold text-[#1e293b] mb-6">Choosing the Right Bank for Your Nursing Practice</h2>
                    <p className="text-[#475569] leading-relaxed mb-6">
                      The right bank choice depends on your practice type, transaction volume, and service needs.
                    </p>

                    <div className="space-y-6 mb-8">
                      <div className="bg-white p-6 rounded-lg border border-[#e2e8f0] shadow-sm">
                        <h3 className="text-xl font-semibold text-[#1e293b] mb-4">Large National Banks</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold text-green-700 mb-2">Advantages</h4>
                            <ul className="text-sm text-[#475569]">
                              <li>• Extensive branch and ATM networks</li>
                              <li>• Advanced online and mobile banking</li>
                              <li>• Travel-friendly for travel nurses</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-red-700 mb-2">Disadvantages</h4>
                            <ul className="text-sm text-[#475569]">
                              <li>• Higher fees</li>
                              <li>• Less personalized service</li>
                              <li>• Complex fee structures</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-6 rounded-lg border border-[#e2e8f0] shadow-sm">
                        <h3 className="text-xl font-semibold text-[#1e293b] mb-4">Community Banks & Credit Unions</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold text-green-700 mb-2">Advantages</h4>
                            <ul className="text-sm text-[#475569]">
                              <li>• More personalized service</li>
                              <li>• Lower fees often available</li>
                              <li>• Local healthcare industry knowledge</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-red-700 mb-2">Disadvantages</h4>
                            <ul className="text-sm text-[#475569]">
                              <li>• Limited geographic reach</li>
                              <li>• Fewer online features</li>
                              <li>• Smaller ATM networks</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <h2 id="required-documents" className="text-3xl font-semibold text-[#1e293b] mb-6">Required Documents for Account Opening</h2>
                    <p className="text-[#475569] leading-relaxed mb-6">
                      Gathering the right documents before visiting the bank streamlines the account opening process and prevents delays.
                    </p>

                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                      <div className="bg-[#f8fafc] p-6 rounded-lg border border-[#e2e8f0]">
                        <h3 className="text-xl font-semibold text-[#1e293b] mb-4">Personal Identification</h3>
                        <ul className="space-y-2 text-[#475569]">
                          <li>• Government-issued photo ID</li>
                          <li>• Social Security card</li>
                          <li>• Proof of address</li>
                        </ul>
                      </div>

                      <div className="bg-[#f8fafc] p-6 rounded-lg border border-[#e2e8f0]">
                        <h3 className="text-xl font-semibold text-[#1e293b] mb-4">Business Documentation</h3>
                        <ul className="space-y-2 text-[#475569]">
                          <li>• EIN letter from IRS</li>
                          <li>• Articles of Organization (LLC)</li>
                          <li>• Operating Agreement</li>
                          <li>• Professional nursing license</li>
                        </ul>
                      </div>
                    </div>

                    <p className="text-[#475569] leading-relaxed mb-8">
                      For detailed guidance on obtaining an EIN, see our comprehensive guide: <a href="/blog/ein-applications-independent-contract-nurses" className="text-[#3b82f6] hover:underline">EIN Applications for Independent Contract Nurses</a>.
                    </p>

                    <h2 id="step-by-step-process" className="text-3xl font-semibold text-[#1e293b] mb-6">Step-by-Step Account Opening Process</h2>
                    <p className="text-[#475569] leading-relaxed mb-6">
                      Following a systematic approach ensures smooth account opening and helps you ask the right questions.
                    </p>

                    <div className="space-y-6 mb-8">
                      <div className="bg-white p-6 rounded-lg border border-[#e2e8f0] shadow-sm">
                        <h3 className="text-lg font-semibold text-[#1e293b] mb-3">Step 1: Research and Compare Banks</h3>
                        <ol className="list-decimal pl-6 space-y-1 text-[#475569]">
                          <li>Create a list of potential banks</li>
                          <li>Compare account features and fees</li>
                          <li>Check branch/ATM locations</li>
                          <li>Read customer reviews</li>
                        </ol>
                      </div>

                      <div className="bg-white p-6 rounded-lg border border-[#e2e8f0] shadow-sm">
                        <h3 className="text-lg font-semibold text-[#1e293b] mb-3">Step 2: Prepare Documentation</h3>
                        <ol className="list-decimal pl-6 space-y-1 text-[#475569]">
                          <li>Gather all required documents</li>
                          <li>Make copies for your records</li>
                          <li>Organize documents in order</li>
                          <li>Prepare initial deposit</li>
                        </ol>
                      </div>

                      <div className="bg-white p-6 rounded-lg border border-[#e2e8f0] shadow-sm">
                        <h3 className="text-lg font-semibold text-[#1e293b] mb-3">Step 3: Complete Account Opening</h3>
                        <ol className="list-decimal pl-6 space-y-1 text-[#475569]">
                          <li>Schedule appointment with business banker</li>
                          <li>Review account terms carefully</li>
                          <li>Set up online banking access</li>
                          <li>Order checks and debit cards</li>
                        </ol>
                      </div>
                    </div>

                    <h2 id="account-features" className="text-3xl font-semibold text-[#1e293b] mb-6">Essential Account Features for Nurses</h2>
                    <p className="text-[#475569] leading-relaxed mb-6">
                      Certain banking features are particularly valuable for nursing practices and independent contractors.
                    </p>

                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                      <div className="bg-[#f0f9ff] p-6 rounded-lg border border-[#9bcbff]">
                        <h3 className="text-xl font-semibold text-[#1e293b] mb-3">Transaction Processing</h3>
                        <ul className="space-y-1 text-[#475569]">
                          <li>• Mobile deposit capabilities</li>
                          <li>• Wire transfer services</li>
                          <li>• ACH processing</li>
                          <li>• Remote check processing</li>
                        </ul>
                      </div>

                      <div className="bg-[#f0f9ff] p-6 rounded-lg border border-[#9bcbff]">
                        <h3 className="text-xl font-semibold text-[#1e293b] mb-3">Digital Banking Tools</h3>
                        <ul className="space-y-1 text-[#475569]">
                          <li>• Expense categorization</li>
                          <li>• Invoice generation</li>
                          <li>• Payment processing</li>
                          <li>• Accounting software integration</li>
                        </ul>
                      </div>
                    </div>

                    <h2 id="fees-to-avoid" className="text-3xl font-semibold text-[#1e293b] mb-6">Common Fees and How to Avoid Them</h2>
                    <p className="text-[#475569] leading-relaxed mb-6">
                      Understanding bank fees helps you choose accounts wisely and avoid unnecessary charges.
                    </p>

                    <div className="space-y-6 mb-8">
                      <div className="bg-[#f8fafc] p-6 rounded-lg border border-[#e2e8f0]">
                        <h3 className="text-lg font-semibold text-[#1e293b] mb-2">Monthly Maintenance Fees ($10-$50/month)</h3>
                        <p className="text-[#475569] mb-2"><strong>How to Avoid:</strong></p>
                        <ul className="text-sm text-[#475569]">
                          <li>• Maintain minimum daily balances</li>
                          <li>• Set up qualifying direct deposits</li>
                          <li>• Choose fee-free account options</li>
                        </ul>
                      </div>

                      <div className="bg-[#f8fafc] p-6 rounded-lg border border-[#e2e8f0]">
                        <h3 className="text-lg font-semibold text-[#1e293b] mb-2">Transaction Fees ($0.50-$3.00 per transaction)</h3>
                        <p className="text-[#475569] mb-2"><strong>How to Avoid:</strong></p>
                        <ul className="text-sm text-[#475569]">
                          <li>• Choose accounts with higher transaction limits</li>
                          <li>• Monitor monthly transaction counts</li>
                          <li>• Use online banking for free transactions</li>
                        </ul>
                      </div>

                      <div className="bg-[#f8fafc] p-6 rounded-lg border border-[#e2e8f0]">
                        <h3 className="text-lg font-semibold text-[#1e293b] mb-2">Overdraft Fees ($25-$40 per overdraft)</h3>
                        <p className="text-[#475569] mb-2"><strong>How to Avoid:</strong></p>
                        <ul className="text-sm text-[#475569]">
                          <li>• Set up account alerts</li>
                          <li>• Link to savings for overdraft protection</li>
                          <li>• Monitor account balances regularly</li>
                        </ul>
                      </div>
                    </div>

                    <h2 id="common-mistakes" className="text-3xl font-semibold text-[#1e293b] mb-6">Common Business Banking Mistakes</h2>
                    
                    <div className="space-y-6 mb-8">
                      <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                        <h3 className="text-lg font-semibold text-red-800 mb-2">Mixing Personal and Business Transactions</h3>
                        <p className="text-red-700">Using business accounts for personal expenses can compromise liability protection, complicate taxes, and violate banking agreements.</p>
                      </div>

                      <div className="bg-amber-50 p-6 rounded-lg border border-amber-200">
                        <h3 className="text-lg font-semibold text-amber-800 mb-2">Choosing Based on Fees Alone</h3>
                        <p className="text-amber-700">Consider total value including service quality, technology features, and long-term relationship potential beyond just fees.</p>
                      </div>

                      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                        <h3 className="text-lg font-semibold text-blue-800 mb-2">Inadequate Record Keeping</h3>
                        <p className="text-blue-700">Poor financial records can result in missed tax deductions, audit complications, and cash flow management problems.</p>
                      </div>
                    </div>

                    {/* FAQ Section */}
                    <h2 className="text-3xl font-semibold text-[#1e293b] mb-6">Frequently Asked Questions</h2>
                    
                    <div className="space-y-6 mb-12">
                      <div className="bg-white p-6 rounded-lg border border-[#e2e8f0]">
                        <h3 className="text-lg font-semibold text-[#1e293b] mb-2">Do I need a business bank account as a sole proprietor?</h3>
                        <p className="text-[#475569]">While not legally required, it's highly recommended for liability protection, tax preparation, and professional credibility. Many banks require business accounts for certain services.</p>
                      </div>

                      <div className="bg-white p-6 rounded-lg border border-[#e2e8f0]">
                        <h3 className="text-lg font-semibold text-[#1e293b] mb-2">How much money do I need to open a business bank account?</h3>
                        <p className="text-[#475569]">Minimum deposits vary by bank and account type, typically ranging from $25 to $1,000. Some accounts have no minimum opening deposit but require minimum balances to avoid fees.</p>
                      </div>

                      <div className="bg-white p-6 rounded-lg border border-[#e2e8f0]">
                        <h3 className="text-lg font-semibold text-[#1e293b] mb-2">Can I open a business account online?</h3>
                        <p className="text-[#475569]">Many banks offer online business account opening, though some may require in-person verification or document submission. The process varies by bank and business type.</p>
                      </div>
                    </div>

                    {/* Conclusion */}
                    <h2 className="text-3xl font-semibold text-[#1e293b] mb-6">Conclusion</h2>
                    <p className="text-[#475569] leading-relaxed mb-6">
                      Setting up proper business banking is a foundational step for any successful nursing practice or independent contracting career. The right banking relationship provides not just financial services, but also professional credibility, liability protection, and tax benefits that support your long-term success.
                    </p>

                    <p className="text-[#475569] leading-relaxed mb-8">
                      Take time to research your options thoroughly, considering not just fees but also the full range of services and support each bank offers. Most importantly, maintain strict separation between personal and business finances from day one.
                    </p>

                    {/* Important Disclaimer */}
                    <div className="bg-[#f8f9fa] p-6 rounded-lg border border-[#dee2e6] mb-8">
                      <h3 className="text-xl font-semibold text-[#1e293b] mb-3">Important Disclaimer</h3>
                      <p className="text-[#475569] mb-4">
                        <strong>This guide is for educational purposes only and does not constitute financial, legal, or business advice.</strong> Banking requirements, fees, and features vary by institution and change frequently. Always verify current terms and conditions directly with financial institutions before making decisions.
                      </p>
                      
                      <p className="text-[#475569] mb-4">
                        Nurse Nest provides educational resources and connects nurses with opportunities but does not provide banking, financial, or business services. Consult with qualified financial advisors, accountants, and banking professionals for your specific situation.
                      </p>
                      
                      <p className="text-[#475569]">
                        Banking regulations and business requirements change frequently. Always verify current requirements with relevant financial institutions and regulatory bodies before opening accounts or making financial decisions.
                      </p>
                    </div>
                  </div>
                </article>

                {/* Sidebar */}
                <aside className="lg:col-span-1">
                  <div className="space-y-8">
                    {/* Related Resources */}
                    <div className="bg-white p-6 rounded-lg border border-[#e2e8f0] shadow-sm">
                      <h3 className="text-lg font-semibold text-[#1e293b] mb-4">Related Resources</h3>
                      <ul className="space-y-3">
                        <li><a href="/business-bank-account-for-nurses" className="text-[#3b82f6] hover:underline text-sm">Business Banking Guide</a></li>
                        <li><a href="/get-ein-nurse-business" className="text-[#3b82f6] hover:underline text-sm">EIN Application Guide</a></li>
                        <li><a href="/nurse-llc-setup-guide" className="text-[#3b82f6] hover:underline text-sm">LLC Setup Guide</a></li>
                        <li><a href="/blog/nurse-llc-formation-guide" className="text-[#3b82f6] hover:underline text-sm">LLC Formation Guide</a></li>
                      </ul>
                    </div>

                    {/* Professional Services */}
                    <div className="bg-white p-6 rounded-lg border border-[#e2e8f0] shadow-sm">
                      <h3 className="text-lg font-semibold text-[#1e293b] mb-4">Professional Services</h3>
                      <div className="space-y-3">
                        <a 
                          href="https://legalzoomcominc.pxf.io/aOYdEN" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="block"
                        >
                          <Button variant="outline" className="w-full text-sm">
                            LegalZoom Business Services <ExternalLink className="h-3 w-3 ml-1" />
                          </Button>
                        </a>
                        <a 
                          href="http://shrsl.com/2qj12-1hzb-kp67" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="block"
                        >
                          <Button variant="outline" className="w-full text-sm">
                            Northwest Registered Agent <ExternalLink className="h-3 w-3 ml-1" />
                          </Button>
                        </a>
                      </div>
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16" style={{background: 'linear-gradient(135deg, #9bcbff 0%, #3b82f6 100%)'}}>
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Build Your Professional Nursing Practice?</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Get connected with resources and opportunities to help you establish a successful independent nursing career.
            </p>
            <Button size="lg" className="bg-white text-[#3b82f6] hover:bg-gray-100 px-8 py-3">
              Learn More
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
