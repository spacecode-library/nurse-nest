
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Check, Search, Lock, MessageSquare, ClipboardCheck, CreditCard } from 'lucide-react';
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
  type CarouselApi
} from "@/components/ui/carousel";
import { useIsMobile } from '@/hooks/use-mobile';

export default function HowItWorksSection() {
  // Use our custom hook to set up scroll animation
  useScrollAnimationObserver();
  
  // State for current step
  const [currentStep, setCurrentStep] = useState(0);
  const isMobile = useIsMobile();
  
  // State for carousel API
  const [api, setApi] = useState<CarouselApi | null>(null);
  
  // Effect to handle carousel and step sync
  React.useEffect(() => {
    if (!api) return;
    
    // Update currentStep when carousel changes
    const onSelect = () => {
      setCurrentStep(api.selectedScrollSnap());
    };
    
    api.on("select", onSelect);
    
    // Cleanup
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);
  
  // Effect to update carousel when currentStep changes manually (via buttons)
  React.useEffect(() => {
    if (!api) return;
    
    api.scrollTo(currentStep);
  }, [currentStep, api]);
  
  const steps = [
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
              setApi={setApi}
              opts={{
                align: "start",
                loop: false,
              }}
            >
              <CarouselContent>
                {steps.map((step, index) => (
                  <CarouselItem key={index} className="pl-0">
                    <div className="w-full rounded-xl shadow-lg overflow-hidden bg-[#F9FAFB] relative h-[500px]">
                      {/* Full bleed image with overlay */}
                      <div className="absolute inset-0 z-0">
                        <img 
                          src={step.imageSrc}
                          alt={step.imageAlt} 
                          className="w-full h-full object-cover"
                        />
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div>
                      </div>

                      {/* Content */}
                      <div className="relative z-10 p-6 h-full flex flex-col justify-end">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                            {step.icon}
                          </div>
                          <h3 className="text-xl font-semibold text-white">
                            {step.title}
                          </h3>
                        </div>
                        <p className="text-white/90 text-sm">
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
              style={{ height: "600px" }}
            >
              {/* Step content with animations */}
              <div 
                className="transition-all duration-500 ease-out flex h-full"
                style={{ 
                  transform: `translateX(-${currentStep * 100}%)`,
                  width: `${steps.length * 100}%`
                }}
              >
                {steps.map((step, index) => (
                  <div 
                    key={index}
                    className="flex-shrink-0 relative h-full"
                    style={{ width: `${100 / steps.length}%` }}
                    aria-hidden={currentStep !== index}
                  >
                    {/* Full bleed image */}
                    <img 
                      src={step.imageSrc} 
                      alt={step.imageAlt}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    
                    {/* Gradient overlay - right side positioned */}
                    <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/60 to-transparent"></div>
                    
                    {/* Content - positioned on the right side */}
                    <div className="absolute inset-0 flex items-center justify-end">
                      <div className="w-1/2 p-10 space-y-6 text-right">
                        <div className="flex items-center justify-end gap-4">
                          <h3 className="text-3xl font-bold text-white">
                            {step.title}
                          </h3>
                          <div className="flex-shrink-0 w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                            {step.icon}
                          </div>
                        </div>
                        <p className="text-white/90 text-lg leading-relaxed">
                          {step.description}
                        </p>
                      </div>
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
                  className="rounded-full h-12 w-12 p-0 flex items-center justify-center bg-white/30 backdrop-blur-sm border-white/40 hover:bg-white/50"
                  aria-label="Previous step"
                >
                  <ArrowLeft className="h-5 w-5 text-white" />
                </Button>
                {!isLastStep ? (
                  <Button
                    onClick={nextStep}
                    className="rounded-full h-12 w-12 p-0 flex items-center justify-center bg-primary-500/90 hover:bg-primary-600 backdrop-blur-sm"
                    aria-label="Next step"
                  >
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                ) : (
                  <span></span>
                )}
              </div>
              
              {/* Step indicator */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
                {steps.map((_, i) => (
                  <button 
                    key={i}
                    onClick={() => setCurrentStep(i)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      i === currentStep ? "bg-white scale-110" : "bg-white/50"
                    }`}
                    aria-label={`Go to step ${i + 1}`}
                  />
                ))}
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
