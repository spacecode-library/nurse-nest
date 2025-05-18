
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
      <div className="flex items-center space-x-2">
        {Array.from({ length: steps }, (_, index) => (
          <React.Fragment key={index}>
            <button
              onClick={() => onStepClick(index)}
              className="group flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-full"
              aria-label={`Go to step ${index + 1}`}
            >
              <div 
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2 shadow-md",
                  currentStep === index 
                    ? "bg-primary-500 text-white border-primary-500 scale-110" 
                    : index < currentStep
                      ? "bg-primary-100 border-primary-500 text-primary-500"
                      : "bg-gray-100 border-gray-200 text-gray-500 group-hover:border-gray-300"
                )}
              >
                {index < currentStep ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span className="font-bold">{index + 1}</span>
                )}
              </div>
            </button>
            {index < steps - 1 && (
              <div 
                className={cn(
                  "h-0.5 w-8", 
                  index < currentStep ? "bg-primary-500" : "bg-gray-200"
                )}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
