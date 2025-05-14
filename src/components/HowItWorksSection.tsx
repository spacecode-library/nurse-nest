
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Check } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import { Button } from './ui/button';
import { Link as RouterLink } from 'react-router-dom';
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
  // Create a ref for the section
  const sectionRef = useRef(null);
  
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
      title: "Begin Your Application",
      description: "Complete our simple online form to share your nursing care needs, preferences, and schedule requirements.",
      image: "/lovable-uploads/c12def84-e1c1-4758-83be-b70e6cee40a7.png",
    },
    {
      title: "Submit Search Fee",
      description: "Pay a fully refundable $100 search fee to begin your personalized nurse match. If we're unable to match you within 14 days, you'll receive a full refund—no questions asked.",
      image: "/lovable-uploads/9daccab5-730e-4656-81e6-a31931f7d3f6.png",
    },
    {
      title: "Review Nurse Profiles",
      description: "Receive carefully vetted nurse profiles with detailed bios, credentials, and availability that match your specific needs.",
      image: "/lovable-uploads/f66fe8ea-d702-495f-8720-47b3cb6adcdc.png",
    },
    {
      title: "Choose Your Nurse",
      description: "Select a nurse you connect with. We'll handle scheduling, agreements, and all other details to finalize your match.",
      image: "/lovable-uploads/4ef081e3-1c5e-4e3b-a36f-40a679b96779.png",
    },
    {
      title: "Begin Care & Pay Directly",
      description: "Your nurse begins providing care on your scheduled start date. You'll pay them directly through our secure system.",
      image: "/lovable-uploads/bbad18cd-7649-425c-8c5e-aee532e527a4.png",
    }
  ];

  // Function to handle step navigation
  const navigateToStep = (index) => {
    if (index >= 0 && index < steps.length) {
      setCurrentStep(index);
    }
  };

  return (
    <section id="how-it-works" ref={sectionRef} className="bg-nurse-light py-20 px-6">
      <div className="container-custom">
        <AnimatedSection animation="fade-up" className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            <span className="text-primary-500">How</span> It Works
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Our simple 5-step process connects you with the perfect nurse for your unique needs.
          </p>
        </AnimatedSection>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Steps Navigation */}
          <AnimatedSection animation="slide-in-right" className="order-2 lg:order-1">
            <div className="space-y-4">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  onClick={() => navigateToStep(index)}
                  className={`cursor-pointer rounded-xl p-5 shadow-md transition-all duration-300 bg-gray-50 ${
                    currentStep === index ? "border-l-4 border-primary-500" : "border-l-4 border-transparent"
                  }`}
                  whileHover={{ x: 5 }}
                  animate={{ 
                    opacity: currentStep === index ? 1 : 0.7,
                    scale: currentStep === index ? 1 : 0.98
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-start">
                    <div className={`rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0 ${
                      currentStep === index ? "bg-primary-500 text-white" : "bg-gray-200 text-gray-600"
                    }`}>
                      {currentStep > index ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <span className="font-semibold">{index + 1}</span>
                      )}
                    </div>
                    <div>
                      <h3 className={`font-semibold text-lg mb-1 ${
                        currentStep === index ? "text-primary-700" : "text-gray-800"
                      }`}>
                        {step.title}
                      </h3>
                      <p className="text-gray-600 text-sm">{step.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-8 flex justify-between">
              <Button
                variant="outline"
                onClick={() => navigateToStep(currentStep - 1)}
                disabled={currentStep === 0}
                className="text-primary-700 border-primary-300"
              >
                Previous
              </Button>
              
              <Button
                onClick={() => navigateToStep(currentStep + 1)}
                disabled={currentStep === steps.length - 1}
                className="bg-primary-500 hover:bg-primary-600"
              >
                Next
              </Button>
            </div>
          </AnimatedSection>
          
          {/* Right Column - Image Carousel */}
          <AnimatedSection animation="fade-in" className="order-1 lg:order-2">
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
                    <CarouselItem key={index}>
                      <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden shadow-lg">
                        <img
                          src={step.image}
                          alt={`Step ${index + 1}: ${step.title}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                
                {!isMobile && (
                  <>
                    <CarouselPrevious className="hidden lg:flex" />
                    <CarouselNext className="hidden lg:flex" />
                  </>
                )}
              </Carousel>
              
              <div className="flex justify-center space-x-2 mt-4">
                {steps.map((_, index) => (
                  <button
                    key={index}
                    className={`rounded-full ${
                      currentStep === index ? "w-8 bg-primary-500" : "w-2 bg-gray-300"
                    } h-2 transition-all duration-300`}
                    onClick={() => navigateToStep(index)}
                  ></button>
                ))}
              </div>
            </div>
            
            {isMobile && (
              <div className="text-center text-gray-500 flex justify-center items-center mb-4">
                <ArrowDown className="h-5 w-5 animate-bounce" />
                <span className="ml-2">Scroll down for steps</span>
              </div>
            )}
          </AnimatedSection>
        </div>
        
        <AnimatedSection animation="fade-up" className="text-center mt-16">
          <RouterLink to="/apply">
            <Button className="bg-primary-500 hover:bg-primary-600 px-8 py-6 h-auto text-lg rounded-lg shadow-lg hover:shadow-xl transform transition-all hover:-translate-y-1">
              Start Your Application
            </Button>
          </RouterLink>
        </AnimatedSection>
      </div>
    </section>
  );
}
