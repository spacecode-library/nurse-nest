
import React, { useState, useEffect } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi
} from "@/components/ui/carousel";
import { MobileStep } from './MobileStep';
import { MobileStepIndicator } from './MobileStepIndicator';
import { StepType } from './types';

interface MobileCarouselProps {
  steps: StepType[];
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

export function MobileCarousel({ steps, currentStep, setCurrentStep }: MobileCarouselProps) {
  const [api, setApi] = useState<CarouselApi | null>(null);
  
  // Effect to handle carousel and step sync
  useEffect(() => {
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
  }, [api, setCurrentStep]);
  
  // Effect to update carousel when currentStep changes manually (via buttons)
  useEffect(() => {
    if (!api) return;
    
    api.scrollTo(currentStep);
  }, [currentStep, api]);
  
  return (
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
              <MobileStep
                title={step.title}
                description={step.description}
                icon={step.icon}
                imageSrc={step.imageSrc}
                imageAlt={step.imageAlt}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <MobileStepIndicator
          totalSteps={steps.length}
          currentStep={currentStep}
          onStepClick={setCurrentStep}
          className="mt-4"
        />
      </Carousel>
    </div>
  );
}
