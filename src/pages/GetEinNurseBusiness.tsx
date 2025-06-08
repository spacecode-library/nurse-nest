
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, FileText, Clock, Shield, Calculator } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function GetEinNurseBusiness() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <main className="flex-1 pt-24">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#f0f9ff] to-[#e0f2fe] py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-light text-[#1e293b] mb-6">
                EIN Number for Nurse Businesses - Complete Application Guide
              </h1>
              <p className="text-xl text-[#475569] mb-8 leading-relaxed">
                Get your Employer Identification Number (EIN) free directly from the IRS. Essential for nurse contractors, business banking, and tax filing.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-[#9bcbff] hover:bg-[#7dd3fc] text-[#1e293b] px-8 py-3 text-lg font-semibold">
                  Apply for EIN (Free)
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Link to="/nurse-llc-setup-guide">
                  <Button variant="outline" className="border-[#3b82f6] text-[#3b82f6] hover:bg-[#3b82f6] hover:text-white px-8 py-3 text-lg">
                    LLC Setup Guide
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* What is an EIN */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-normal text-[#1e293b] mb-8 text-center">
                What is an EIN and Why Do Nurses Need One?
              </h2>
              
              <Card className="border border-[#e2e8f0] shadow-lg mb-12">
                <CardContent className="p-8">
                  <p className="text-lg text-[#475569] leading-relaxed mb-6">
                    An Employer Identification Number (EIN), also called a Federal Tax ID, is a unique nine-digit number assigned by the IRS to identify your business for tax purposes. Think of it as a Social Security number for your nursing business.
                  </p>
                  <div className="bg-[#f0f9ff] p-6 rounded-lg border border-[#9bcbff]">
                    <h3 className="text-xl font-semibold text-[#1e293b] mb-3">Format: XX-XXXXXXX</h3>
                    <p className="text-[#475569]">
                      Example: 12-3456789
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-8">
                <Card className="border border-[#e2e8f0] shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center text-[#1e293b]">
                      <Shield className="h-6 w-6 text-[#10b981] mr-3" />
                      Privacy Protection
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[#475569] leading-relaxed">
                      Use your EIN instead of your Social Security Number on contracts, invoices, and tax forms. This protects your personal information from identity theft.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border border-[#e2e8f0] shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center text-[#1e293b]">
                      <Calculator className="h-6 w-6 text-[#3b82f6] mr-3" />
                      Business Banking
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[#475569] leading-relaxed">
                      Required to open business bank accounts, apply for business credit cards, and establish business credit separate from your personal credit.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border border-[#e2e8f0] shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center text-[#1e293b]">
                      <FileText className="h-6 w-6 text-[#f59e0b] mr-3" />
                      Professional Image
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[#475569] leading-relaxed">
                      Clients and healthcare facilities view businesses with EINs as more professional and established, potentially leading to better contracts.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border border-[#e2e8f0] shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center text-[#1e293b]">
                      <Clock className="h-6 w-6 text-[#9bcbff] mr-3" />
                      Tax Benefits
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[#475569] leading-relaxed">
                      Simplifies tax filing and allows for better organization of business expenses and income separate from personal finances.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Application Process */}
        <section className="py-16 bg-[#f1f5f9]">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-normal text-[#1e293b] mb-8 text-center">
                How to Apply for Your EIN (Free)
              </h2>
              
              <div className="bg-[#ef4444] text-white p-6 rounded-lg mb-8">
                <h3 className="text-xl font-semibold mb-2">⚠️ Important Warning</h3>
                <p>
                  <strong>Only apply directly through the IRS website (irs.gov).</strong> Many third-party sites charge $200+ for a service that's completely free from the IRS. Avoid scams!
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-[#9bcbff] text-[#1e293b] rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 mt-1">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-[#1e293b] mb-2">Visit the Official IRS Website</h3>
                    <p className="text-[#475569] mb-3">
                      Go to <strong>irs.gov</strong> and search for "Apply for EIN Online". Only use the official government website to avoid fees and scams.
                    </p>
                    <div className="bg-[#f0f9ff] p-4 rounded border border-[#9bcbff]">
                      <p className="text-sm text-[#475569]">
                        <strong>Official URL:</strong> irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-[#9bcbff] text-[#1e293b] rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 mt-1">
                    2
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-[#1e293b] mb-2">Gather Required Information</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-[#1e293b] mb-2">Personal Information:</h4>
                        <ul className="text-[#475569] space-y-1">
                          <li>• Your legal name</li>
                          <li>• Social Security Number</li>
                          <li>• Home address</li>
                          <li>• Phone number</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#1e293b] mb-2">Business Information:</h4>
                        <ul className="text-[#475569] space-y-1">
                          <li>• Business name</li>
                          <li>• Business address</li>
                          <li>• Business start date</li>
                          <li>• Type of business entity</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-[#9bcbff] text-[#1e293b] rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 mt-1">
                    3
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-[#1e293b] mb-2">Complete the Online Application</h3>
                    <p className="text-[#475569] mb-3">
                      The SS-4 form is completed online and takes about 10-15 minutes. Answer questions about your business structure and purpose.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-[#f0f9ff] p-4 rounded border border-[#9bcbff]">
                        <h4 className="font-semibold text-[#1e293b] mb-2">For Sole Proprietors:</h4>
                        <p className="text-sm text-[#475569]">Select "Sole Proprietorship" as your business type</p>
                      </div>
                      <div className="bg-[#f0f9ff] p-4 rounded border border-[#9bcbff]">
                        <h4 className="font-semibold text-[#1e293b] mb-2">For LLCs:</h4>
                        <p className="text-sm text-[#475569]">Select "Limited Liability Company" and specify if single or multi-member</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-[#9bcbff] text-[#1e293b] rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 mt-1">
                    4
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-[#1e293b] mb-2">Receive Your EIN Immediately</h3>
                    <p className="text-[#475569]">
                      Once submitted, you'll receive your EIN instantly. Print or save the confirmation letter - this is your official documentation from the IRS.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* When Nurses Need EINs */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-normal text-[#1e293b] mb-8 text-center">
                When Do Nurses Need an EIN?
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="border border-[#10b981] shadow-lg">
                  <CardHeader className="bg-[#f0fdf4]">
                    <CardTitle className="text-[#10b981] flex items-center">
                      <CheckCircle className="h-6 w-6 mr-2" />
                      You Need an EIN If:
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <ul className="space-y-3 text-[#475569]">
                      <li>• You have an LLC or corporation</li>
                      <li>• You want to open a business bank account</li>
                      <li>• You plan to hire employees or contractors</li>
                      <li>• You want to protect your SSN privacy</li>
                      <li>• You're building business credit</li>
                      <li>• You're required by clients or agencies</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border border-[#f59e0b] shadow-lg">
                  <CardHeader className="bg-[#fffbeb]">
                    <CardTitle className="text-[#f59e0b] flex items-center">
                      <Clock className="h-6 w-6 mr-2" />
                      EIN Not Required If:
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <ul className="space-y-3 text-[#475569]">
                      <li>• You're a sole proprietor with no employees</li>
                      <li>• You only use your personal bank account</li>
                      <li>• You don't mind using your SSN</li>
                      <li>• You're just testing out freelance work</li>
                    </ul>
                    <p className="text-sm text-[#f59e0b] mt-4 font-semibold">
                      Note: Even if not required, most nurses benefit from having an EIN.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Related Resources */}
        <section className="py-16 bg-[#f0f9ff]">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-normal text-[#1e293b] mb-8 text-center">
                Related Business Setup Resources
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card className="border border-[#e2e8f0] shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-[#1e293b] mb-3">
                      <CheckCircle className="inline h-5 w-5 text-[#10b981] mr-2" />
                      Published Article
                    </h3>
                    <p className="text-[#475569] mb-4">
                      Learn when to use your EIN vs SSN for different business situations and client requirements.
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
                      <p>• How to Apply for an EIN as a 1099 Nurse</p>
                      <p>• Do I Need an EIN for My Nurse Business?</p>
                      <p>• Step-by-Step EIN Application Guide for Nurse Contractors</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="text-center">
                <Button className="bg-[#9bcbff] hover:bg-[#7dd3fc] text-[#1e293b] px-8 py-3 text-lg font-semibold mr-4">
                  Apply for Your EIN Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Link to="/business-bank-account-for-nurses">
                  <Button variant="outline" className="border-[#3b82f6] text-[#3b82f6] hover:bg-[#3b82f6] hover:text-white px-8 py-3 text-lg">
                    Next: Open Business Bank Account
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
