
import React from 'react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { FileText, DollarSign, Search, Users, CheckCircle } from 'lucide-react';

export default function HowItWorksSection() {
  const steps = [
    {
      number: 1,
      title: "Share Your Care Needs",
      description: "Start by making an account, then complete a short form to tell us your preferences and specific care requirements.",
      icon: <FileText className="h-6 w-6" />
    },
    {
      number: 2,
      title: "Begin Your Search",
      description: "Start for just $100. Prefer speed? Add our optional Fast Track Match to receive a nurse within 5 business days. If we can't find a match within 14 days (or 5 days with Fast Track), you'll receive a full refund.",
      icon: <DollarSign className="h-6 w-6" />
    },
    {
      number: 3,
      title: "Expert Nurse Matching",
      description: "We leverage our nationwide RN network, run targeted recruitment ads, and post job listings across multiple platforms. You'll receive a curated selection of thoroughly vetted, licensed nurses matched to your unique needs.",
      icon: <Search className="h-6 w-6" />
    },
    {
      number: 4,
      title: "You Select Your Nurse",
      description: "Review detailed nurse profiles and choose the one that best fits your needs. Once selected, we conduct a comprehensive vetting process—including background check, license verification, reference checks, and optional drug screening and driving record review.",
      icon: <Users className="h-6 w-6" />
    },
    {
      number: 5,
      title: "Approve Hours & Pay Securely",
      description: "Your nurse logs hours through our system. You review and approve them, then make payments through our platform—sent directly to your nurse, securely and seamlessly.",
      icon: <CheckCircle className="h-6 w-6" />
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden" id="how-it-works">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute top-1/4 left-10 w-32 h-32 rounded-full bg-primary-300"></div>
        <div className="absolute bottom-1/4 right-10 w-40 h-40 rounded-full bg-nurse-accent"></div>
        <div className="absolute top-3/4 left-1/3 w-24 h-24 rounded-full bg-primary-300"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-start">
          {/* Left Side: Diagram */}
          <div className="w-full md:w-1/2 mb-10 md:mb-0 px-4">
            <div className="relative">
              {/* Drawn-style diagram container */}
              <div className="relative bg-nurse-light rounded-2xl p-6 shadow-lg border-2 border-dashed border-primary-300" style={{maxWidth: "550px", margin: "0 auto"}}>
                {/* Connection lines between step circles - vertical path */}
                <div className="absolute left-1/2 top-[60px] bottom-[60px] w-[3px] bg-primary-200 transform -translate-x-1/2 z-0" 
                     style={{backgroundImage: "linear-gradient(to bottom, transparent 0%, transparent 5%, currentColor 5%, currentColor 95%, transparent 95%, transparent 100%)", 
                           backgroundSize: "8px 16px"}}></div>

                {/* Steps - Vertically stacked */}
                <div className="space-y-16 relative z-10">
                  {steps.map((step, index) => (
                    <div key={index} className="flex items-center relative">
                      {/* Circle number with sketch effect */}
                      <div className={`relative w-14 h-14 rounded-full flex items-center justify-center bg-white border-[3px] border-primary-500 z-10 
                                     shadow-md transform transition-transform duration-300 hover:scale-110`}
                           style={{borderRadius: "50%", boxShadow: "0 0 0 4px rgba(30, 136, 229, 0.2)"}}>
                        <span className="text-xl font-bold text-primary-500">{step.number}</span>
                        {/* Irregular circle sketch effect */}
                        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="50" cy="50" r="48" fill="none" stroke="#1E88E5" strokeWidth="1" 
                                 strokeDasharray="5,3" className="opacity-60" />
                        </svg>
                      </div>
                      
                      {/* Icon element */}
                      <div className={`ml-4 w-10 h-10 rounded-full flex items-center justify-center bg-primary-100 border border-primary-200`}>
                        <div className="text-primary-500">{step.icon}</div>
                      </div>
                      
                      {/* Step title */}
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-800">{step.title}</h3>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-16 h-16 text-primary-200 opacity-30">
                  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                    <path d="M30,10 Q50,-10 70,10 Q90,30 70,50 Q50,70 30,50 Q10,30 30,10 Z" />
                  </svg>
                </div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 text-nurse-accent opacity-30 transform rotate-45">
                  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                    <path d="M30,10 Q50,-10 70,10 Q90,30 70,50 Q50,70 30,50 Q10,30 30,10 Z" />
                  </svg>
                </div>
              </div>
              
              {/* Hand-drawn style decorative elements */}
              <div className="absolute -top-10 -left-10 w-20 h-20 text-primary-200 opacity-40 transform -rotate-12 hidden md:block">
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20,50 Q50,20 80,50" strokeLinecap="round" strokeDasharray="5,5" />
                  <path d="M20,70 Q50,40 80,70" strokeLinecap="round" strokeDasharray="4,6" />
                </svg>
              </div>
              <div className="absolute -bottom-10 -right-10 w-24 h-24 text-nurse-accent opacity-30 transform rotate-12 hidden md:block">
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="50" cy="50" r="30" strokeDasharray="10,5" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Right Side: Header and Content */}
          <div className="w-full md:w-1/2 px-4">
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                How Nurse Nest <span className="text-primary-500">Works</span>
              </h2>
              <p className="text-lg text-gray-700">
                Our streamlined process makes finding your perfect nurse simple, secure, and stress-free.
              </p>
            </div>
            
            {/* Step details - vertical cards */}
            <div className="space-y-6">
              {steps.map((step, index) => (
                <div key={index} className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-primary-500 hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-semibold mb-2 flex items-center">
                    <span className="w-7 h-7 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm mr-3 flex-shrink-0">
                      {step.number}
                    </span>
                    {step.title}
                  </h3>
                  <p className="text-gray-700 pl-10">{step.description}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-10">
              <Link to="/apply">
                <Button className="bg-primary-500 hover:bg-primary-600 text-white button-hover-effect">
                  Start Your Nurse Search
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
