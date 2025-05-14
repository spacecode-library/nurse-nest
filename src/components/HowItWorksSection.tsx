
import React from 'react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import AnimatedSection from './AnimatedSection';
import { useScrollAnimationObserver } from '@/hooks/use-scroll-animation-observer';

export default function HowItWorksSection() {
  // Use our custom hook to set up scroll animation
  useScrollAnimationObserver();
  
  const steps = [
    {
      number: 1,
      title: "Tell Us What You Need",
      description: "Create your account and complete a brief form describing your care preferences—like start date, specialty, and location. Whether postpartum, overnight, or elder care, we tailor the search to your unique needs.",
      icon: "📝",
      imageSrc: "/lovable-uploads/119a6708-a3cb-400b-ac7b-c2437a103499.png",
      imageAlt: "Nurse consultation form"
    },
    {
      number: 2,
      title: "Secure Your Search",
      description: "Pay a fully refundable $100 nurse search fee to begin. Want speed? Choose FastTrack Match for a guaranteed nurse within 5 business days—or get your money back.",
      icon: "💸",
      imageSrc: "/lovable-uploads/4ef081e3-1c5e-4e3b-a36f-40a679b96779.png",
      imageAlt: "Secure payment process"
    },
    {
      number: 3,
      title: "We Find the Right Fit",
      description: "We post your job across platforms, run targeted recruitment ads, and tap our nationwide network of licensed nurses. Every candidate is pre-screened for location, availability, and skills before we present options.",
      icon: "🎯",
      imageSrc: "/lovable-uploads/0ecf2c8e-3915-4487-bb58-3e25ada5cf81.png",
      imageAlt: "Nurse providing care to elderly person"
    },
    {
      number: 4,
      title: "You Choose Your Nurse",
      description: "Browse handpicked profiles and select the nurse who fits best. We then conduct a full vetting process—license verification, background check, references, and optional drug or driving screening.",
      icon: "👩‍⚕️",
      imageSrc: "/lovable-uploads/77ddc10d-2117-4745-8bba-2347c09f1bb7.png",
      imageAlt: "Group of nurses meeting with family"
    },
    {
      number: 5,
      title: "Approve Hours & Pay Securely",
      description: "Your nurse logs hours via our platform. You approve them, and payment is processed securely through Stripe—sent directly to the nurse. You stay in control; we handle the rest.",
      icon: "🔒",
      imageSrc: "/lovable-uploads/24d6dd5c-dd41-4a60-88eb-f70d46f03ae9.png",
      imageAlt: "Nurse arriving at home in the evening"
    }
  ];

  return (
    <section className="py-20 md:py-32 bg-white relative overflow-hidden" id="how-it-works">
      <div className="container mx-auto px-4 relative z-10">
        <AnimatedSection animation="fade-up" className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How It <span className="text-primary-500">Works</span>
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            From request to payment—your seamless path to expert in-home care.
          </p>
        </AnimatedSection>
        
        {/* Steps */}
        <div className="space-y-24 md:space-y-32 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`step-block grid grid-cols-1 ${index % 2 === 0 ? 'lg:grid-cols-[1fr_1.2fr]' : 'lg:grid-cols-[1.2fr_1fr]'} gap-8 lg:gap-16 items-center`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              {/* Image section */}
              <div className={`${index % 2 !== 0 ? 'lg:order-first' : 'lg:order-last'}`}>
                <div className="relative rounded-2xl overflow-hidden shadow-xl transform hover:scale-[1.02] transition-all duration-700">
                  <AspectRatio ratio={16/9}>
                    <div className="relative w-full h-full">
                      <img 
                        src={step.imageSrc} 
                        alt={step.imageAlt}
                        className="w-full h-full object-cover"
                      />
                      {/* Subtle gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 via-transparent to-primary-500/20 opacity-60 mix-blend-soft-light"></div>
                    </div>
                  </AspectRatio>
                  
                  {/* Subtle light effect */}
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-2/3 h-20 bg-primary-300/30 blur-3xl rounded-full"></div>
                </div>
              </div>
              
              {/* Content section */}
              <div>
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 flex flex-col items-center">
                    <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary-500 text-white font-bold text-xl shadow-lg">
                      {step.number}
                    </div>
                    <div className="h-full w-0.5 bg-gradient-to-b from-primary-500 to-transparent mt-4 hidden lg:block" 
                         style={{ display: index === steps.length - 1 ? 'none' : '' }}></div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="text-4xl" data-icon-animation>{step.icon}</div>
                    <h3 className="text-2xl font-bold text-primary-500">{step.title}</h3>
                    <p className="text-gray-700 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* CTA Button */}
        <AnimatedSection animation="fade-up" delay={600} className="mt-20 text-center">
          <Link to="/apply">
            <Button className="bg-primary-500 hover:bg-primary-600 text-white py-6 px-8 text-lg rounded-lg shadow-lg hover:shadow-xl transform transition-all hover:-translate-y-1">
              Start Your Nurse Search
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
}
