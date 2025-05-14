
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import AnimatedSection from './AnimatedSection';
import { useScrollAnimationObserver } from '@/hooks/use-scroll-animation-observer';
import { cn } from '@/lib/utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useIsMobile } from '@/hooks/use-mobile';

export default function HowItWorksSection() {
  // Use our custom hook to set up scroll animation
  useScrollAnimationObserver();
  
  // State for current step
  const [currentStep, setCurrentStep] = useState(0);
  const isMobile = useIsMobile();
  
  const steps = [
    {
      number: 1,
      title: "Tell Us What You Need",
      description: "Create your account and complete a short form describing your care preferences—like start date, specialty, and location. We'll tailor the search based on your unique needs.",
      icon: "📝",
      imageSrc: "/lovable-uploads/119a6708-a3cb-400b-ac7b-c2437a103499.png",
      imageAlt: "Nurse consultation form"
    },
    {
      number: 2,
      title: "Secure Your Search",
      description: "Pay a fully refundable $100 search fee to begin. For urgent needs, choose FastTrack Match to guarantee a nurse within 5 business days—or get your money back.",
      icon: "💸",
      imageSrc: "/lovable-uploads/f66fe8ea-d702-495f-8720-47b3cb6adcdc.png",
      imageAlt: "Nurse arriving by parachute"
    },
    {
      number: 3,
      title: "We Find the Right Fit",
      description: "We promote your listing through targeted advertising, private nurse networks, and vetted job boards. Every applicant is screened for location, licensing, and compatibility before being presented to you.",
      icon: "🎯",
      imageSrc: "/lovable-uploads/0ecf2c8e-3915-4487-bb58-3e25ada5cf81.png",
      imageAlt: "Nurse providing care to elderly person"
    },
    {
      number: 4,
      title: "You Choose Your Nurse",
      description: "We'll send you detailed profiles to review. Once you select your match, we complete additional vetting (background checks, license verification, and optional drug screening) before you proceed.",
      icon: "👩‍⚕️",
      imageSrc: "/lovable-uploads/77ddc10d-2117-4745-8bba-2347c09f1bb7.png",
      imageAlt: "Group of nurses meeting with family"
    },
    {
      number: 5,
      title: "Approve Hours & Pay Securely",
      description: "Your nurse logs hours via our system. You approve the timesheet, and payment is processed securely through Stripe—sent directly to your nurse. Seamless, safe, and fully transparent.",
      icon: "🔒",
      imageSrc: "/lovable-uploads/24d6dd5c-dd41-4a60-88eb-f70d46f03ae9.png",
      imageAlt: "Nurse arriving at home in the evening"
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
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-3">
              {steps.map((step, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className="flex items-center justify-center"
                  aria-label={`Go to step ${index + 1}`}
                >
                  <div 
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2",
                      currentStep === index 
                        ? "bg-primary-500 text-white border-primary-500" 
                        : index < currentStep
                          ? "bg-primary-100 border-primary-500 text-primary-500"
                          : "bg-gray-100 border-gray-200 text-gray-500"
                    )}
                  >
                    {index < currentStep ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span className="font-bold">{index + 1}</span>
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div 
                      className={cn(
                        "h-0.5 w-6 mx-1", 
                        index < currentStep ? "bg-primary-500" : "bg-gray-200"
                      )}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Mobile Carousel View */}
        {isMobile ? (
          <div className="max-w-sm mx-auto mb-8">
            <Carousel
              className="w-full"
              onSelect={(api) => {
                if (api) setCurrentStep(api.selectedScrollSnap());
              }}
              opts={{
                align: "start",
                loop: false,
              }}
            >
              <CarouselContent>
                {steps.map((step, index) => (
                  <CarouselItem key={index} className="pl-0">
                    <div className="w-full rounded-xl shadow-lg overflow-hidden bg-[#F9FAFB]">
                      {/* Image */}
                      <div className="w-full">
                        <AspectRatio ratio={16/9}>
                          <img 
                            src={step.imageSrc}
                            alt={step.imageAlt} 
                            className={`w-full h-full object-cover ${step.number === 4 ? "object-bottom" : "object-center"}`}
                          />
                        </AspectRatio>
                      </div>

                      {/* Content */}
                      <div className="p-6 space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-xl">
                            {step.icon}
                          </div>
                          <h3 className="text-xl font-semibold text-primary-500">
                            {step.title}
                          </h3>
                        </div>
                        <p className="text-gray-700">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center mt-4 gap-2">
                {steps.map((_, i) => (
                  <button 
                    key={i}
                    onClick={() => setCurrentStep(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      i === currentStep ? "bg-primary-500 scale-110" : "bg-gray-300"
                    }`}
                    aria-label={`Go to step ${i + 1}`}
                  />
                ))}
              </div>
            </Carousel>
          </div>
        ) : (
          /* Desktop View */
          <div className="max-w-6xl mx-auto">
            <div 
              className="relative overflow-hidden rounded-xl shadow-lg"
              style={{ minHeight: "500px" }}
            >
              {/* Step content with animations */}
              <div 
                className="transition-all duration-500 ease-out flex"
                style={{ 
                  transform: `translateX(-${currentStep * 100}%)`,
                }}
              >
                {steps.map((step, index) => (
                  <div 
                    key={index}
                    className="w-full flex-shrink-0 px-6 md:px-10 py-12 flex flex-col md:flex-row gap-8 items-center bg-[#F9FAFB]"
                    aria-hidden={currentStep !== index}
                  >
                    {/* Image */}
                    <div className="md:w-1/2">
                      <div className="rounded-lg overflow-hidden shadow-md transform transition-all duration-500">
                        <AspectRatio ratio={16/9}>
                          <img 
                            src={step.imageSrc} 
                            alt={step.imageAlt}
                            className={`w-full h-full object-cover ${step.number === 4 ? "object-bottom" : "object-center"}`}
                          />
                        </AspectRatio>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="md:w-1/2 space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center text-2xl">
                          {step.icon}
                        </div>
                        <h3 className="text-2xl font-bold text-primary-500">
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-gray-700 text-lg">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Navigation buttons */}
              <div className="absolute bottom-6 right-6 flex gap-3">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="rounded-full h-10 w-10 p-0 flex items-center justify-center"
                  aria-label="Previous step"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                {!isLastStep ? (
                  <Button
                    onClick={nextStep}
                    className="rounded-full h-10 w-10 p-0 flex items-center justify-center bg-primary-500 hover:bg-primary-600"
                    aria-label="Next step"
                  >
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                ) : (
                  <span></span>
                )}
              </div>
            </div>
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
