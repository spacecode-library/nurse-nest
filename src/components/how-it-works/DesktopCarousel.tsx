
import React from 'react';
import { DesktopStep } from './DesktopStep';
import { NavigationControls } from './NavigationControls';
import { StepIndicator } from './StepIndicator';
import { StepType } from './types';
import { cn } from '@/lib/utils';

interface DesktopCarouselProps {
  steps: StepType[];
  currentStep: number;
  nextStep: () => void;
  prevStep: () => void;
  setCurrentStep: (step: number) => void;
}

export function DesktopCarousel({ steps, currentStep, nextStep, prevStep, setCurrentStep }: DesktopCarouselProps) {
  return (
    <div 
      className="relative overflow-hidden rounded-xl shadow-lg bg-white"
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
          <div key={index} className="w-full flex-shrink-0">
            <DesktopStep
              title={step.title}
              description={step.description}
              icon={step.icon}
              imageSrc={step.imageSrc}
              imageAlt={step.imageAlt}
              stepNumber={step.number}
            />
          </div>
        ))}
      </div>
      
      {/* Navigation buttons */}
      <NavigationControls
        currentStep={currentStep}
        totalSteps={steps.length}
        onNext={nextStep}
        onPrev={prevStep}
      />
      
      {/* Step indicator */}
      <StepIndicator 
        steps={steps.length} 
        currentStep={currentStep} 
        onStepClick={setCurrentStep}
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex"
      />
    </div>
  );
}
