
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
    <div className={cn("flex justify-center gap-4", className)}>
      {Array.from({ length: totalSteps }, (_, i) => (
        <button 
          key={i}
          onClick={() => onStepClick(i)}
          className={cn(
            "w-4 h-4 rounded-full transition-all duration-300",
            i === currentStep 
              ? "bg-primary-500 scale-125 shadow-md shadow-primary-300" 
              : "bg-gray-300 hover:bg-gray-400"
          )}
          aria-label={`Go to step ${i + 1}`}
        />
      ))}
    </div>
  );
}
