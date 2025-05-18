
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, Lock, MessageSquare, ClipboardCheck, CreditCard } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import { useScrollAnimationObserver } from '@/hooks/use-scroll-animation-observer';
import { useIsMobile } from '@/hooks/use-mobile';
import { StepIndicator } from './how-it-works/StepIndicator';
import { MobileCarousel } from './how-it-works/MobileCarousel';
import { DesktopCarousel } from './how-it-works/DesktopCarousel';
import { StepType } from './how-it-works/types';

export default function HowItWorksSection() {
  // Use our custom hook to set up scroll animation
  useScrollAnimationObserver();
  
  // State for current step
  const [currentStep, setCurrentStep] = useState(0);
  const isMobile = useIsMobile();
  
  const steps: StepType[] = [
    {
      number: 1,
      title: "Create Your Custom Request",
      description: "Start by submitting a quick care request tailored to your needs. Just tell us the type of nurse, your location, timeline, and preferences. From there, our smart matching engine begins sourcing the best-fit nurses—curated just for you.",
      icon: <Search className="h-6 w-6" />,
      imageSrc: "/lovable-uploads/119a6708-a3cb-400b-ac7b-c2437a103499.png",
      imageAlt: "Gloved & elderly hand"
    },
    {
      number: 2,
      title: "Unlock Full Platform Access",
      description: "Begin your nurse search with a fully refundable $100 concierge fee. This gives you instant access to Nurse Nest's secure messaging center, customizable vetting options, and built-in video/phone calling—right from your dashboard. Everything happens on our HIPAA-compliant, privacy-first platform.",
      icon: <Lock className="h-6 w-6" />,
      imageSrc: "/lovable-uploads/f66fe8ea-d702-495f-8720-47b3cb6adcdc.png",
      imageAlt: "Nurse parachuting to home"
    },
    {
      number: 3,
      title: "Let Us Curate the Best Matches",
      description: "We broadcast your job across our private network and nurse-facing platforms. Every applicant is screened with both AI and human review for licensure, specialty, experience, and proximity. Only top-tier candidates reach your inbox—saving you time and ensuring peace of mind.",
      icon: <MessageSquare className="h-6 w-6" />,
      imageSrc: "/lovable-uploads/0ecf2c8e-3915-4487-bb58-3e25ada5cf81.png",
      imageAlt: "Nurse with elderly man outdoors"
    },
    {
      number: 4,
      title: "Review, Connect, and Customize Vetting",
      description: "Explore nurse profiles featuring summaries, work history, and certifications. From your dashboard, securely message candidates or jump on a video call—no external apps needed. You decide which vetting services to run: background check, drug screen, license verification, or all of the above.",
      icon: <ClipboardCheck className="h-6 w-6" />,
      imageSrc: "/lovable-uploads/77ddc10d-2117-4745-8bba-2347c09f1bb7.png",
      imageAlt: "Family reviewing nurses"
    },
    {
      number: 5,
      title: "Hire with Confidence & Pay Seamlessly",
      description: "Once you've chosen your nurse, they'll log hours on the platform. You approve the timecard, and Stripe handles the rest—automatically paying your nurse while Nurse Nest collects a 15% fee. It's transparent, trackable, and completely paperless. One platform. Total control.",
      icon: <CreditCard className="h-6 w-6" />,
      imageSrc: "/lovable-uploads/24d6dd5c-dd41-4a60-88eb-f70d46f03ae9.png",
      imageAlt: "Nurse emerging from gift box"
    }
  ];

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  // Determine if we're at the last step
  const isLastStep = currentStep === steps.length - 1;

  return (
    <section className="py-20 md:py-32 bg-white relative overflow-hidden" id="how-it-works">
      <div className="container mx-auto px-4 relative z-10">
        <AnimatedSection animation="fade-up" className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How It <span className="text-primary-500">Works</span>
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            From request to payment—your seamless path to expert in-home care.
          </p>
        </AnimatedSection>
        
        {/* Progress Indicator - Only for desktop */}
        {!isMobile && (
          <StepIndicator 
            steps={steps.length} 
            currentStep={currentStep} 
            onStepClick={setCurrentStep} 
            className="mb-8"
          />
        )}
        
        {/* Mobile Carousel View */}
        {isMobile ? (
          <MobileCarousel 
            steps={steps}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
          />
        ) : (
          /* Desktop View */
          <div className="max-w-6xl mx-auto">
            <DesktopCarousel
              steps={steps}
              currentStep={currentStep}
              nextStep={nextStep}
              prevStep={prevStep}
              setCurrentStep={setCurrentStep}
            />
          </div>
        )}
        
        {/* Final CTA Button - only show on last step */}
        {isLastStep && (
          <AnimatedSection animation="fade-up" delay={300} className="mt-12 text-center">
            <Link to="/apply">
              <Button className="bg-gradient-to-r from-primary-500 to-primary-600 text-white py-6 px-8 text-lg rounded-lg shadow-lg hover:shadow-xl transform transition-all hover:-translate-y-1">
                Start Your Nurse Search
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </AnimatedSection>
        )}
      </div>
    </section>
  );
}
