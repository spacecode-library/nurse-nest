
import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepIndicatorProps {
  steps: number;
  currentStep: number;
  onStepClick: (index: number) => void;
  className?: string;
}

export function StepIndicator({ steps, currentStep, onStepClick, className }: StepIndicatorProps) {
  return (
    <div className={cn("flex justify-center", className)}>
      <div className="flex items-center space-x-3">
        {Array.from({ length: steps }, (_, index) => (
          <button
            key={index}
            onClick={() => onStepClick(index)}
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
            {index < steps - 1 && (
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
  );
}
