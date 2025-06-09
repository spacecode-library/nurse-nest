
import React, { useState } from 'react';
import { 
  Shield, 
  DollarSign, 
  FileText, 
  CheckCircle, 
  ArrowRight, 
  Users, 
  Clock, 
  Star,
  Download,
  ExternalLink,
  Phone,
  Mail,
  Calendar
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function NurseLlcSetup() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section 
          className="py-20 px-4 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)'
          }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 
                  className="text-4xl md:text-5xl mb-6"
                  style={{
                    fontWeight: '300',
                    color: '#1e293b',
                    letterSpacing: '2px',
                    lineHeight: '1.2'
                  }}
                >
                  LLC Setup for Nurses
                </h1>
                <p className="text-xl mb-8" style={{color: '#475569', lineHeight: '1.6'}}>
                  Professional LLC formation services designed specifically for nurses. Protect your practice, maximize tax benefits, and establish credibility with our comprehensive setup guide and services.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <button 
                    className="px-8 py-4 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center"
                    style={{backgroundColor: '#9bcbff', minHeight: '44px'}}
                  >
                    Start Your LLC Setup
                    <ArrowRight size={20} className="ml-2" />
                  </button>
                  <button 
                    className="px-8 py-4 border-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center"
                    style={{borderColor: '#3b82f6', color: '#3b82f6', minHeight: '44px'}}
                  >
                    Download Free Guide
                    <Download size={20} className="ml-2" />
                  </button>
                </div>

                <div className="flex items-center space-x-8 text-sm" style={{color: '#475569'}}>
                  <div className="flex items-center space-x-2">
                    <CheckCircle size={16} style={{color: '#10b981'}} />
                    <span>State Filing Included</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle size={16} style={{color: '#10b981'}} />
                    <span>EIN Application</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle size={16} style={{color: '#10b981'}} />
                    <span>Operating Agreement</span>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                  <h3 className="text-xl font-semibold mb-6" style={{color: '#1e293b'}}>Why 15,000+ Nurses Choose Us</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Shield size={20} style={{color: '#9bcbff'}} className="mt-1" />
                      <div>
                        <h4 className="font-medium" style={{color: '#1e293b'}}>Complete Asset Protection</h4>
                        <p className="text-sm" style={{color: '#475569'}}>Separate personal and business liability</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <DollarSign size={20} style={{color: '#10b981'}} className="mt-1" />
                      <div>
                        <h4 className="font-medium" style={{color: '#1e293b'}}>Tax Optimization</h4>
                        <p className="text-sm" style={{color: '#475569'}}>Maximize deductions and savings</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <FileText size={20} style={{color: '#3b82f6'}} className="mt-1" />
                      <div>
                        <h4 className="font-medium" style={{color: '#1e293b'}}>Professional Credibility</h4>
                        <p className="text-sm" style={{color: '#475569'}}>Establish trust with clients and facilities</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        {[1,2,3,4,5].map((star) => (
                          <Star key={star} size={16} fill="#f59e0b" style={{color: '#f59e0b'}} />
                        ))}
                      </div>
                      <span className="text-sm" style={{color: '#475569'}}>4.9/5 from 2,847 reviews</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Overview Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold mb-4" style={{color: '#1e293b'}}>Complete LLC Setup Services</h2>
              <p className="text-lg" style={{color: '#475569'}}>Everything you need to establish and maintain your nursing LLC</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Basic Package */}
              <div className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2" style={{color: '#1e293b'}}>Essential LLC</h3>
                  <div className="text-3xl font-bold mb-2" style={{color: '#3b82f6'}}>$299</div>
                  <p className="text-sm" style={{color: '#475569'}}>+ State filing fees</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center space-x-3">
                    <CheckCircle size={16} style={{color: '#10b981'}} />
                    <span className="text-sm">State LLC filing</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle size={16} style={{color: '#10b981'}} />
                    <span className="text-sm">Registered agent (1 year)</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle size={16} style={{color: '#10b981'}} />
                    <span className="text-sm">EIN application</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle size={16} style={{color: '#10b981'}} />
                    <span className="text-sm">Basic operating agreement</span>
                  </li>
                </ul>
                
                <button 
                  className="w-full py-3 border-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  style={{borderColor: '#3b82f6', color: '#3b82f6'}}
                >
                  Get Started
                </button>
              </div>

              {/* Professional Package */}
              <div 
                className="bg-white border-2 rounded-xl p-8 relative hover:shadow-lg transition-shadow"
                style={{borderColor: '#9bcbff'}}
              >
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span 
                    className="px-4 py-1 text-white text-sm font-semibold rounded-full"
                    style={{backgroundColor: '#9bcbff'}}
                  >
                    Most Popular
                  </span>
                </div>
                
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2" style={{color: '#1e293b'}}>Professional LLC</h3>
                  <div className="text-3xl font-bold mb-2" style={{color: '#3b82f6'}}>$599</div>
                  <p className="text-sm" style={{color: '#475569'}}>+ State filing fees</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center space-x-3">
                    <CheckCircle size={16} style={{color: '#10b981'}} />
                    <span className="text-sm">Everything in Essential</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle size={16} style={{color: '#10b981'}} />
                    <span className="text-sm">Custom operating agreement</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle size={16} style={{color: '#10b981'}} />
                    <span className="text-sm">Banking kit & recommendations</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle size={16} style={{color: '#10b981'}} />
                    <span className="text-sm">Tax election guidance</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle size={16} style={{color: '#10b981'}} />
                    <span className="text-sm">Compliance calendar</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle size={16} style={{color: '#10b981'}} />
                    <span className="text-sm">Phone consultation</span>
                  </li>
                </ul>
                
                <button 
                  className="w-full py-3 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
                  style={{backgroundColor: '#9bcbff'}}
                >
                  Get Started
                </button>
              </div>

              {/* Premium Package */}
              <div className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2" style={{color: '#1e293b'}}>Premium LLC</h3>
                  <div className="text-3xl font-bold mb-2" style={{color: '#3b82f6'}}>$999</div>
                  <p className="text-sm" style={{color: '#475569'}}>+ State filing fees</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center space-x-3">
                    <CheckCircle size={16} style={{color: '#10b981'}} />
                    <span className="text-sm">Everything in Professional</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle size={16} style={{color: '#10b981'}} />
                    <span className="text-sm">Legal document review</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle size={16} style={{color: '#10b981'}} />
                    <span className="text-sm">Multi-state compliance</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle size={16} style={{color: '#10b981'}} />
                    <span className="text-sm">Annual filing service</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle size={16} style={{color: '#10b981'}} />
                    <span className="text-sm">Priority support</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle size={16} style={{color: '#10b981'}} />
                    <span className="text-sm">Business credit setup</span>
                  </li>
                </ul>
                
                <button 
                  className="w-full py-3 border-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  style={{borderColor: '#3b82f6', color: '#3b82f6'}}
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Comprehensive Guide Section */}
        <section className="py-16 px-4" style={{backgroundColor: '#f8fafc'}}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold mb-4" style={{color: '#1e293b'}}>Complete LLC Setup Guide</h2>
              <p className="text-lg" style={{color: '#475569'}}>Step-by-step instructions for setting up your nursing LLC</p>
            </div>

            {/* Tab Navigation */}
            <div className="flex flex-wrap justify-center mb-8 border-b border-gray-200">
              {[
                {id: 'overview', label: 'Overview'},
                {id: 'benefits', label: 'Benefits'},
                {id: 'process', label: 'Process'},
                {id: 'requirements', label: 'Requirements'},
                {id: 'taxes', label: 'Taxes'},
                {id: 'maintenance', label: 'Maintenance'}
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 font-medium border-b-2 transition-colors ${
                    activeTab === tab.id 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-xl p-8 shadow-sm">
              {activeTab === 'overview' && (
                <div>
                  <h3 className="text-2xl font-semibold mb-6" style={{color: '#1e293b'}}>Why Nurses Need LLCs in 2025</h3>
                  
                  <p className="text-lg mb-6" style={{color: '#475569', lineHeight: '1.6'}}>
                    The healthcare landscape has dramatically shifted, with more nurses choosing independent contractor roles, starting private practices, or offering specialized services. According to recent industry data, over 35% of nurses work in some form of independent capacity, making business entity formation more critical than ever.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div>
                      <h4 className="text-lg font-semibold mb-4" style={{color: '#1e293b'}}>Growing Independent Nursing Sectors</h4>
                      <ul className="space-y-2">
                        <li className="flex items-center space-x-3">
                          <CheckCircle size={16} style={{color: '#10b981'}} />
                          <span>Private practice nursing</span>
                        </li>
                        <li className="flex items-center space-x-3">
                          <CheckCircle size={16} style={{color: '#10b981'}} />
                          <span>Specialized home care services</span>
                        </li>
                        <li className="flex items-center space-x-3">
                          <CheckCircle size={16} style={{color: '#10b981'}} />
                          <span>Travel nursing enterprises</span>
                        </li>
                        <li className="flex items-center space-x-3">
                          <CheckCircle size={16} style={{color: '#10b981'}} />
                          <span>Telehealth consultation</span>
                        </li>
                        <li className="flex items-center space-x-3">
                          <CheckCircle size={16} style={{color: '#10b981'}} />
                          <span>Health coaching businesses</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-semibold mb-4" style={{color: '#1e293b'}}>Key Statistics</h4>
                      <div className="space-y-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="text-2xl font-bold" style={{color: '#3b82f6'}}>4.2M+</div>
                          <div className="text-sm" style={{color: '#475569'}}>Registered nurses in the US</div>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <div className="text-2xl font-bold" style={{color: '#10b981'}}>35%</div>
                          <div className="text-sm" style={{color: '#475569'}}>Work independently</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h4 className="text-lg font-semibold mb-3" style={{color: '#1e293b'}}>Ready to Get Started?</h4>
                    <p className="mb-4" style={{color: '#475569'}}>
                      An LLC provides the perfect balance of liability protection and tax flexibility that nurses need. Whether you're providing direct patient care, offering consultation services, or running a healthcare-related business, an LLC shields your personal assets from potential lawsuits while offering significant tax advantages.
                    </p>
                    <button 
                      className="px-6 py-3 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
                      style={{backgroundColor: '#9bcbff'}}
                    >
                      Start Your LLC Today
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'benefits' && (
                <div>
                  <h3 className="text-2xl font-semibold mb-6" style={{color: '#1e293b'}}>Key Benefits of an LLC for Nurses</h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <div className="mb-8">
                        <div className="flex items-start space-x-4 mb-4">
                          <div className="p-3 rounded-lg" style={{backgroundColor: '#e0f2fe'}}>
                            <Shield size={24} style={{color: '#3b82f6'}} />
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold mb-2" style={{color: '#1e293b'}}>Personal Asset Protection</h4>
                            <p style={{color: '#475569'}}>
                              The primary advantage of forming an LLC is the separation it creates between your personal and business assets. If your nursing business faces a lawsuit or accumulates debt, your personal home, car, and savings accounts remain protected.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mb-8">
                        <div className="flex items-start space-x-4 mb-4">
                          <div className="p-3 rounded-lg" style={{backgroundColor: '#f0fdf4'}}>
                            <DollarSign size={24} style={{color: '#10b981'}} />
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold mb-2" style={{color: '#1e293b'}}>Tax Flexibility and Advantages</h4>
                            <p style={{color: '#475569'}}>
                              LLCs offer pass-through taxation, extensive business expense deductions, and potential self-employment tax savings with proper election.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mb-8">
                        <div className="flex items-start space-x-4 mb-4">
                          <div className="p-3 rounded-lg" style={{backgroundColor: '#fefce8'}}>
                            <Users size={24} style={{color: '#f59e0b'}} />
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold mb-2" style={{color: '#1e293b'}}>Professional Credibility</h4>
                            <p style={{color: '#475569'}}>
                              Operating as an LLC immediately elevates your professional standing. Clients, healthcare facilities, and insurance companies often prefer working with established business entities.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h4 className="text-lg font-semibold mb-4" style={{color: '#1e293b'}}>Business Expense Deductions</h4>
                        <ul className="space-y-2">
                          <li className="flex items-center space-x-3">
                            <CheckCircle size={16} style={{color: '#10b981'}} />
                            <span className="text-sm">Professional licensing fees</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <CheckCircle size={16} style={{color: '#10b981'}} />
                            <span className="text-sm">Continuing education costs</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <CheckCircle size={16} style={{color: '#10b981'}} />
                            <span className="text-sm">Medical equipment and supplies</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <CheckCircle size={16} style={{color: '#10b981'}} />
                            <span className="text-sm">Home office expenses</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <CheckCircle size={16} style={{color: '#10b981'}} />
                            <span className="text-sm">Vehicle expenses for client visits</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <CheckCircle size={16} style={{color: '#10b981'}} />
                            <span className="text-sm">Professional insurance premiums</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <CheckCircle size={16} style={{color: '#10b981'}} />
                            <span className="text-sm">Marketing and advertising costs</span>
                          </li>
                        </ul>
                      </div>

                      <div className="mt-6 bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
                        <h4 className="text-lg font-semibold mb-2" style={{color: '#1e293b'}}>Potential Annual Savings</h4>
                        <div className="text-2xl font-bold mb-2" style={{color: '#10b981'}}>$3,000 - $8,000+</div>
                        <p className="text-sm" style={{color: '#475569'}}>
                          Average annual tax savings for nursing LLCs through deductions and proper structuring
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'process' && (
                <div>
                  <h3 className="text-2xl font-semibold mb-6" style={{color: '#1e293b'}}>Step-by-Step LLC Formation Process</h3>
                  
                  <div className="space-y-8">
                    {[
                      {
                        step: 1,
                        title: "Choose Your State of Formation",
                        content: "While you can form an LLC in any state, most nurses benefit from forming in their state of residence and primary business operations. Consider state filing fees, annual reporting requirements, and tax implications.",
                        time: "1 day"
                      },
                      {
                        step: 2,
                        title: "Select Your LLC Name",
                        content: "Your LLC name must comply with state requirements and accurately represent your nursing business. Include 'LLC' or 'Limited Liability Company' and avoid restricted terms.",
                        time: "1-2 days"
                      },
                      {
                        step: 3,
                        title: "Appoint a Registered Agent",
                        content: "Every LLC must maintain a registered agent to receive legal documents. You can serve as your own agent or hire a professional service for privacy and reliability.",
                        time: "Same day"
                      },
                      {
                        step: 4,
                        title: "File Articles of Organization",
                        content: "This document officially establishes your LLC with the state. Include LLC name, address, registered agent information, and business purpose.",
                        time: "1-4 weeks"
                      },
                      {
                        step: 5,
                        title: "Obtain an EIN",
                        content: "Apply for your Employer Identification Number through the IRS website. Essential for banking, tax filing, and client documentation.",
                        time: "Same day"
                      },
                      {
                        step: 6,
                        title: "Create Operating Agreement",
                        content: "Define member roles, profit distribution, decision-making processes, and operational procedures. Crucial even for single-member LLCs.",
                        time: "1-2 weeks"
                      },
                      {
                        step: 7,
                        title: "Obtain Licenses & Insurance",
                        content: "Secure all required professional licenses, business permits, and insurance coverage including professional liability and general liability.",
                        time: "2-4 weeks"
                      }
                    ].map((item, index) => (
                      <div key={index} className="flex items-start space-x-6">
                        <div 
                          className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold"
                          style={{backgroundColor: '#3b82f6'}}
                        >
                          {item.step}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-lg font-semibold" style={{color: '#1e293b'}}>{item.title}</h4>
                            <span className="text-sm px-3 py-1 rounded-full" style={{backgroundColor: '#e0f2fe', color: '#3b82f6'}}>
                              {item.time}
                            </span>
                          </div>
                          <p style={{color: '#475569'}}>{item.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-12 bg-blue-50 p-8 rounded-lg">
                    <h4 className="text-xl font-semibold mb-4" style={{color: '#1e293b'}}>Let Us Handle the Process</h4>
                    <p className="mb-6" style={{color: '#475569'}}>
                      Skip the complexity and ensure everything is done correctly. Our professional service handles all steps from filing to ongoing compliance.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button 
                        className="px-6 py-3 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
                        style={{backgroundColor: '#9bcbff'}}
                      >
                        Get Professional Setup
                      </button>
                      <button 
                        className="px-6 py-3 border-2 rounded-lg font-semibold hover:bg-white transition-colors"
                        style={{borderColor: '#3b82f6', color: '#3b82f6'}}
                      >
                        Download DIY Checklist
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Related Services Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-semibold text-center mb-12" style={{color: '#1e293b'}}>Complete Business Setup Services</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <h3 className="font-semibold mb-3" style={{color: '#1e293b'}}>
                  <a href="/get-ein-nurse-business" className="text-blue-600 hover:underline">
                    EIN Application Service
                  </a>
                </h3>
                <p className="text-sm mb-4" style={{color: '#475569'}}>
                  Fast, reliable EIN application service for your nursing LLC with same-day processing.
                </p>
                <a href="/get-ein-nurse-business" className="text-blue-600 hover:underline text-sm font-medium">
                  Learn More →
                </a>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <h3 className="font-semibold mb-3" style={{color: '#1e293b'}}>
                  <a href="/business-bank-account-for-nurses" className="text-blue-600 hover:underline">
                    Business Banking Setup
                  </a>
                </h3>
                <p className="text-sm mb-4" style={{color: '#475569'}}>
                  Find the perfect business bank account for your nursing practice with our recommendations.
                </p>
                <a href="/business-bank-account-for-nurses" className="text-blue-600 hover:underline text-sm font-medium">
                  Learn More →
                </a>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <h3 className="font-semibold mb-3" style={{color: '#1e293b'}}>
                  <a href="/malpractice-insurance-for-nurses" className="text-blue-600 hover:underline">
                    Malpractice Insurance
                  </a>
                </h3>
                <p className="text-sm mb-4" style={{color: '#475569'}}>
                  Protect your nursing practice with comprehensive malpractice insurance coverage.
                </p>
                <a href="/malpractice-insurance-for-nurses" className="text-blue-600 hover:underline text-sm font-medium">
                  Learn More →
                </a>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <h3 className="font-semibold mb-3" style={{color: '#1e293b'}}>
                  <a href="/1099-tax-tips" className="text-blue-600 hover:underline">
                    1099 Tax Guidance
                  </a>
                </h3>
                <p className="text-sm mb-4" style={{color: '#475569'}}>
                  Navigate 1099 tax requirements and maximize deductions for your nursing business.
                </p>
                <a href="/1099-tax-tips" className="text-blue-600 hover:underline text-sm font-medium">
                  Learn More →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section 
          className="py-20 px-4"
          style={{
            background: 'linear-gradient(135deg, #9bcbff 0%, #3b82f6 100%)'
          }}
        >
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-4xl font-semibold mb-6">Ready to Start Your Nursing LLC?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of nurses who have protected their practices and maximized their earnings with professional LLC setup.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button 
                className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center"
                style={{minHeight: '44px'}}
              >
                <Phone size={20} className="mr-2" />
                Call (555) 123-4567
              </button>
              <button 
                className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors flex items-center justify-center"
                style={{minHeight: '44px'}}
              >
                <Calendar size={20} className="mr-2" />
                Schedule Consultation
              </button>
              <button 
                className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors flex items-center justify-center"
                style={{minHeight: '44px'}}
              >
                <Mail size={20} className="mr-2" />
                Get Free Quote
              </button>
            </div>

            <div className="flex items-center justify-center space-x-8 text-sm opacity-75">
              <div className="flex items-center space-x-2">
                <CheckCircle size={16} />
                <span>Same-day processing available</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle size={16} />
                <span>100% satisfaction guarantee</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle size={16} />
                <span>Expert nursing business guidance</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
