
import React from 'react';
import { DesktopStep } from './DesktopStep';
import { NavigationControls } from './NavigationControls';
import { StepType } from './types';

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
          <DesktopStep
            key={index}
            title={step.title}
            description={step.description}
            icon={step.icon}
            imageSrc={step.imageSrc}
            imageAlt={step.imageAlt}
          />
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
  );
}
