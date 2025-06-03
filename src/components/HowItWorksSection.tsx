import React, { useState } from 'react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Check, Search, UserCheck, MessageSquare, HandHeart, CreditCard, Shield } from 'lucide-react';
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
      title: "Post Your Care Request",
      description: "Create a detailed request specifying your nursing needs, location, schedule, and budget. Our smart matching system immediately starts identifying qualified professionals in your area.",
      icon: <Search className="h-6 w-6" />,
      imageSrc: "/lovable-uploads/119a6708-a3cb-400b-ac7b-c2437a103499.png",
      imageAlt: "Care request creation",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      number: 2,
      title: "Get Verified Nurse Profiles",
      description: "Receive curated profiles of licensed nurses who match your criteria. Each profile includes credentials, experience, specializations, reviews, and availability—all verified by our platform.",
      icon: <UserCheck className="h-6 w-6" />,
      imageSrc: "/lovable-uploads/f66fe8ea-d702-495f-8720-47b3cb6adcdc.png",
      imageAlt: "Verified nurse profiles",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      number: 3,
      title: "Connect & Interview",
      description: "Use our secure messaging and video calling features to communicate with potential nurses. Ask questions, discuss requirements, and ensure they're the right fit for your needs.",
      icon: <MessageSquare className="h-6 w-6" />,
      imageSrc: "/lovable-uploads/0ecf2c8e-3915-4487-bb58-3e25ada5cf81.png",
      imageAlt: "Nurse client communication",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      number: 4,
      title: "Select & Customize Vetting",
      description: "Choose your preferred nurse and customize additional verification services. Background checks, drug screenings, and reference verification are available for added peace of mind.",
      icon: <HandHeart className="h-6 w-6" />,
      imageSrc: "/lovable-uploads/77ddc10d-2117-4745-8bba-2347c09f1bb7.png",
      imageAlt: "Nurse selection and vetting",
      gradient: "from-rose-500 to-orange-500"
    },
    {
      number: 5,
      title: "Secure Care & Payment",
      description: "Your nurse provides professional care while logging hours through our platform. You review and approve time worked, then our secure payment system handles everything automatically.",
      icon: <CreditCard className="h-6 w-6" />,
      imageSrc: "/lovable-uploads/24d6dd5c-dd41-4a60-88eb-f70d46f03ae9.png",
      imageAlt: "Secure payment and care delivery",
      gradient: "from-teal-500 to-blue-500"
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
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-32 left-16 w-64 h-64 bg-gradient-to-br from-blue-400/5 to-teal-400/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-16 right-20 w-48 h-48 bg-gradient-to-tr from-green-400/5 to-blue-400/5 rounded-full blur-2xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <AnimatedSection animation="fade-up" className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-700 text-sm font-medium mb-6">
            <Shield className="h-4 w-4 mr-2" />
            Simple, Secure, Professional
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-800 via-blue-700 to-teal-700 bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            From posting your request to receiving professional care—our platform makes it simple to connect with qualified nurses.
          </p>
        </AnimatedSection>
        
        {/* Progress Indicator - Only for desktop */}
        {!isMobile && (
          <div className="flex justify-center mb-12">
            <div className="flex items-center space-x-2">
              {steps.map((step, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className="flex items-center justify-center group"
                  aria-label={`Go to step ${index + 1}`}
                >
                  <div 
                    className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 border-2 relative overflow-hidden",
                      currentStep === index 
                        ? `bg-gradient-to-r ${step.gradient} text-white border-transparent shadow-lg` 
                        : index < currentStep
                          ? "bg-gradient-to-r from-green-500 to-emerald-500 border-transparent text-white"
                          : "bg-white border-slate-200 text-slate-400 hover:border-blue-300"
                    )}
                  >
                    {index < currentStep ? (
                      <Check className="h-6 w-6" />
                    ) : (
                      <span className="font-bold text-lg">{index + 1}</span>
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div 
                      className={cn(
                        "h-1 w-8 mx-2 rounded-full transition-all duration-300", 
                        index < currentStep ? "bg-gradient-to-r from-green-500 to-emerald-500" : "bg-slate-200"
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
                    <div className="w-full rounded-3xl shadow-xl overflow-hidden bg-white border border-slate-200/50">
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
                          <div className={`flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-r ${step.gradient} flex items-center justify-center text-white shadow-lg`}>
                            {step.icon}
                          </div>
                          <h3 className="text-xl font-bold text-slate-800">
                            {step.title}
                          </h3>
                        </div>
                        <p className="text-slate-600 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center mt-6 gap-2">
                {steps.map((_, i) => (
                  <button 
                    key={i}
                    onClick={() => setCurrentStep(i)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      i === currentStep ? "bg-blue-600 scale-110" : "bg-slate-300"
                    }`}
                    aria-label={`Go to step ${i + 1}`}
                  />
                ))}
              </div>
            </Carousel>
          </div>
        ) : (
          /* Desktop View */
          <div className="max-w-7xl mx-auto">
            <div 
              className="relative overflow-hidden rounded-3xl shadow-2xl border border-slate-200/50"
              style={{ minHeight: "500px" }}
            >
              {/* Step content with animations */}
              <div 
                className="transition-all duration-700 ease-out flex"
                style={{ 
                  transform: `translateX(-${currentStep * 100}%)`,
                }}
              >
                {steps.map((step, index) => (
                  <div 
                    key={index}
                    className="w-full flex-shrink-0 px-8 md:px-12 py-12 flex flex-col md:flex-row gap-12 items-center bg-gradient-to-br from-slate-50 to-white"
                    aria-hidden={currentStep !== index}
                  >
                    {/* Image */}
                    <div className="md:w-1/2">
                      <div className="rounded-2xl overflow-hidden shadow-xl transform transition-all duration-500 hover:scale-105">
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
                    <div className="md:w-1/2 space-y-8">
                      <div className="flex items-center gap-4">
                        <div className={`flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-r ${step.gradient} flex items-center justify-center text-white shadow-xl`}>
                          {step.icon}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                            Step {step.number}
                          </div>
                          <h3 className="text-3xl font-bold text-slate-800">
                            {step.title}
                          </h3>
                        </div>
                      </div>
                      <p className="text-slate-600 text-lg leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Navigation buttons */}
              <div className="absolute bottom-8 right-8 flex gap-3">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="rounded-full h-12 w-12 p-0 flex items-center justify-center border-slate-300 hover:border-blue-500 hover:text-blue-600 transition-all duration-300"
                  aria-label="Previous step"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                {!isLastStep ? (
                  <Button
                    onClick={nextStep}
                    className="rounded-full h-12 w-12 p-0 flex items-center justify-center bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all duration-300"
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
          <AnimatedSection animation="fade-up" delay={300} className="mt-16 text-center">
            <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-3xl p-8 md:p-12 text-white">
              <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Join thousands of families and healthcare facilities who trust NurseNest for their nursing needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/apply">
                  <Button className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                    Find a Nurse Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button variant="outline" className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg rounded-xl backdrop-blur-sm transition-all duration-300">
                    Join as a Nurse
                  </Button>
                </Link>
              </div>
            </div>
          </AnimatedSection>
        )}
      </div>
    </section>
  );
}