
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
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How Nurse Nest <span className="text-primary-500">Works</span>
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Our streamlined process makes finding your perfect nurse simple, secure, and stress-free.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side: Image */}
          <div className="order-2 lg:order-1">
            <div className="relative mx-auto max-w-md">
              <div className="rounded-2xl overflow-hidden shadow-xl transform transition-all duration-700 hover:scale-[1.02]">
                {/* New image with glow effect */}
                <div className="relative">
                  <img 
                    src="/lovable-uploads/119a6708-a3cb-400b-ac7b-c2437a103499.png" 
                    alt="Connection between nurse and patient" 
                    className="w-full h-auto object-cover"
                  />
                  {/* Subtle glow overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 via-transparent to-nurse-accent/20 opacity-60 mix-blend-soft-light"></div>
                </div>
              </div>
              
              {/* Subtle light effect */}
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-2/3 h-20 bg-primary-300/30 blur-3xl rounded-full"></div>
            </div>
          </div>
          
          {/* Right Side: Alternating Steps */}
          <div className="order-1 lg:order-2">
            <div className="space-y-8">
              {steps.map((step, index) => (
                <div 
                  key={index}
                  className={`flex ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} items-start gap-4 group`}
                >
                  {/* Step Number */}
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-500 text-white font-bold text-lg shadow-md group-hover:shadow-lg group-hover:bg-primary-600 transition-all duration-300">
                      {step.number}
                    </div>
                  </div>
                  
                  {/* Step Content */}
                  <div className={`flex-1 p-5 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow group-hover:border-primary-100 ${index % 2 === 0 ? 'text-left' : 'text-right'}`}>
                    <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                      {index % 2 === 0 ? (
                        <>
                          <span className="text-primary-500">{step.title}</span>
                          {step.icon}
                        </>
                      ) : (
                        <>
                          {step.icon}
                          <span className="text-primary-500">{step.title}</span>
                        </>
                      )}
                    </h3>
                    <p className="text-gray-700">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-10 text-center lg:text-right">
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
