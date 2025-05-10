
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
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-blue-50 relative overflow-hidden" id="how-it-works">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute top-1/4 left-10 w-32 h-32 rounded-full bg-primary-300"></div>
        <div className="absolute bottom-1/4 right-10 w-40 h-40 rounded-full bg-nurse-accent"></div>
        <div className="absolute top-3/4 left-1/3 w-24 h-24 rounded-full bg-primary-300"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Left Side: Image */}
          <div className="w-full md:w-1/2 mb-10 md:mb-0 px-4">
            <div className="relative">
              {/* Image container with glow and styling effects */}
              <div className="relative rounded-2xl overflow-hidden shadow-xl" 
                   style={{maxWidth: "600px", margin: "0 auto"}}>
                {/* Glowing overlay effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary-500/30 to-transparent opacity-40 z-10"></div>
                
                {/* The nurse image */}
                <img 
                  src="/lovable-uploads/c3267a23-af03-4d97-8ebb-c8680d11dcee.png" 
                  alt="Nurse as a gift to families" 
                  className="w-full h-auto object-cover rounded-2xl shadow-lg transform transition-all duration-500 hover:scale-[1.02]"
                />
                
                {/* Subtle overlay on hover */}
                <div className="absolute inset-0 bg-primary-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300 z-20"></div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-16 h-16 text-primary-200 opacity-50 hidden md:block">
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                  <path d="M30,10 Q50,-10 70,10 Q90,30 70,50 Q50,70 30,50 Q10,30 30,10 Z" />
                </svg>
              </div>
              <div className="absolute -bottom-6 -left-6 w-16 h-16 text-blue-300 opacity-50 transform rotate-45 hidden md:block">
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                  <path d="M30,10 Q50,-10 70,10 Q90,30 70,50 Q50,70 30,50 Q10,30 30,10 Z" />
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
