
import React from 'react';
import { cn } from '@/lib/utils';

interface MobileStepIndicatorProps {
  totalSteps: number;
  currentStep: number;
  onStepClick: (index: number) => void;
  className?: string;
}

export function MobileStepIndicator({ totalSteps, currentStep, onStepClick, className }: MobileStepIndicatorProps) {
  return (
    <div className={cn("flex justify-center gap-3", className)}>
      {Array.from({ length: totalSteps }, (_, i) => (
        <button 
          key={i}
          onClick={() => onStepClick(i)}
          className={`w-3 h-3 rounded-full transition-all ${
            i === currentStep ? "bg-primary-500 scale-125" : "bg-gray-300"
          }`}
          aria-label={`Go to step ${i + 1}`}
        />
      ))}
    </div>
  );
}
