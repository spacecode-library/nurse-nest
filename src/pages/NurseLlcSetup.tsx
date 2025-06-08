
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Building2, Shield, Calculator, FileText } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function NurseLlcSetup() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <main className="flex-1 pt-24">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#f0f9ff] to-[#e0f2fe] py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-light text-[#1e293b] mb-6">
                LLC Setup for Nurses - Complete Guide 2025
              </h1>
              <p className="text-xl text-[#475569] mb-8 leading-relaxed">
                Protect your nursing career with proper business structure. Learn why LLCs are essential for independent nurses and how to set one up correctly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-[#9bcbff] hover:bg-[#7dd3fc] text-[#1e293b] px-8 py-3 text-lg font-semibold">
                  Start Your LLC Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Link to="/get-ein-nurse-business">
                  <Button variant="outline" className="border-[#3b82f6] text-[#3b82f6] hover:bg-[#3b82f6] hover:text-white px-8 py-3 text-lg">
                    Get Your EIN Number
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Why Nurses Need LLCs */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-normal text-[#1e293b] mb-8 text-center">
                Why Independent Nurses Need an LLC
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <Card className="border border-[#e2e8f0] shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center text-[#1e293b]">
                      <Shield className="h-6 w-6 text-[#3b82f6] mr-3" />
                      Legal Protection
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[#475569] leading-relaxed">
                      Separate your personal assets from business liabilities. If you're sued for malpractice or other professional issues, your personal home, car, and savings are protected.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border border-[#e2e8f0] shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center text-[#1e293b]">
                      <Calculator className="h-6 w-6 text-[#10b981] mr-3" />
                      Tax Benefits
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[#475569] leading-relaxed">
                      Deduct business expenses like equipment, continuing education, travel, and professional memberships. LLCs also offer flexibility in how you're taxed.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border border-[#e2e8f0] shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center text-[#1e293b]">
                      <Building2 className="h-6 w-6 text-[#9bcbff] mr-3" />
                      Professional Credibility
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[#475569] leading-relaxed">
                      Clients and healthcare facilities view LLCs as more professional and established. This can lead to better contracts and higher pay rates.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border border-[#e2e8f0] shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center text-[#1e293b]">
                      <FileText className="h-6 w-6 text-[#f59e0b] mr-3" />
                      Business Banking
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[#475569] leading-relaxed">
                      Keep business and personal finances separate with dedicated business bank accounts. This makes taxes easier and provides better financial tracking.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Formation Process */}
        <section className="py-16 bg-[#f1f5f9]">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-normal text-[#1e293b] mb-8 text-center">
                LLC Formation Process for Nurses
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-[#9bcbff] text-[#1e293b] rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 mt-1">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-[#1e293b] mb-2">Choose Your Business Name</h3>
                    <p className="text-[#475569]">
                      Select a unique name that reflects your nursing practice. Common formats include "[Your Name] Nursing Services, LLC" or "[City] Home Care, LLC". Check availability with your state.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-[#9bcbff] text-[#1e293b] rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 mt-1">
                    2
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-[#1e293b] mb-2">File Articles of Organization</h3>
                    <p className="text-[#475569]">
                      Submit the required paperwork to your state's Secretary of State office. Filing fees typically range from $50-$500 depending on your state.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-[#9bcbff] text-[#1e293b] rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 mt-1">
                    3
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-[#1e293b] mb-2">Get Your EIN Number</h3>
                    <p className="text-[#475569]">
                      Apply for an Employer Identification Number (EIN) from the IRS. This is free and required for business banking and taxes.
                    </p>
                    <Link to="/get-ein-nurse-business" className="text-[#3b82f6] hover:underline inline-flex items-center mt-2">
                      Learn about EIN applications <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-[#9bcbff] text-[#1e293b] rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 mt-1">
                    4
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-[#1e293b] mb-2">Open a Business Bank Account</h3>
                    <p className="text-[#475569]">
                      Keep your business and personal finances separate. You'll need your Articles of Organization and EIN to open an account.
                    </p>
                    <Link to="/business-bank-account-for-nurses" className="text-[#3b82f6] hover:underline inline-flex items-center mt-2">
                      Banking guide for nurses <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-[#9bcbff] text-[#1e293b] rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 mt-1">
                    5
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-[#1e293b] mb-2">Get Professional Insurance</h3>
                    <p className="text-[#475569]">
                      Update your malpractice insurance to cover your LLC. Professional liability insurance is essential for independent nurses.
                    </p>
                    <Link to="/malpractice-insurance-for-nurses" className="text-[#3b82f6] hover:underline inline-flex items-center mt-2">
                      Malpractice insurance guide <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Costs */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-normal text-[#1e293b] mb-8 text-center">
                LLC Setup Costs for Nurses
              </h2>
              
              <Card className="border border-[#e2e8f0] shadow-lg">
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl font-semibold text-[#1e293b] mb-4">Required Costs</h3>
                      <ul className="space-y-3">
                        <li className="flex justify-between">
                          <span className="text-[#475569]">State filing fee</span>
                          <span className="font-semibold text-[#1e293b]">$50-$500</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-[#475569]">EIN application</span>
                          <span className="font-semibold text-[#10b981]">FREE</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-[#475569]">Annual state fee</span>
                          <span className="font-semibold text-[#1e293b]">$0-$300/year</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-[#1e293b] mb-4">Optional Services</h3>
                      <ul className="space-y-3">
                        <li className="flex justify-between">
                          <span className="text-[#475569]">Registered agent</span>
                          <span className="font-semibold text-[#1e293b]">$100-$300/year</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-[#475569]">Operating agreement</span>
                          <span className="font-semibold text-[#1e293b]">$200-$500</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-[#475569]">Formation service</span>
                          <span className="font-semibold text-[#1e293b]">$50-$300</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Related Resources */}
        <section className="py-16 bg-[#f0f9ff]">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-normal text-[#1e293b] mb-8 text-center">
                Essential Resources for Nurse Business Owners
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card className="border border-[#e2e8f0] shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-[#1e293b] mb-3">
                      <CheckCircle className="inline h-5 w-5 text-[#10b981] mr-2" />
                      Published Article
                    </h3>
                    <p className="text-[#475569] mb-4">
                      Understanding the difference between using your EIN vs SSN for tax purposes and client payments.
                    </p>
                    <Link to="/blog/ein-vs-ssn-what-nurses-need-to-know" className="text-[#3b82f6] hover:underline font-semibold">
                      Read: EIN vs SSN - What Nurses Need to Know →
                    </Link>
                  </CardContent>
                </Card>

                <Card className="border border-[#e2e8f0] shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-[#1e293b] mb-3">
                      <FileText className="inline h-5 w-5 text-[#f59e0b] mr-2" />
                      Coming Soon
                    </h3>
                    <div className="space-y-2 text-[#475569]">
                      <p>• Do I Need an LLC as a Travel Nurse?</p>
                      <p>• LLC vs Sole Proprietor for Nurses</p>
                      <p>• Best State to Start an LLC for Nurses</p>
                      <p>• Mistakes Nurses Make When Forming an LLC</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="text-center">
                <Button className="bg-[#9bcbff] hover:bg-[#7dd3fc] text-[#1e293b] px-8 py-3 text-lg font-semibold">
                  Get Started with Your LLC
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
