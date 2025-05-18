
import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NavigationControlsProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  className?: string;
}

export function NavigationControls({ currentStep, totalSteps, onNext, onPrev, className }: NavigationControlsProps) {
  const isLastStep = currentStep === totalSteps - 1;
  
  return (
    <div className={cn("absolute bottom-8 right-8 flex gap-4 z-20", className)}>
      <Button
        variant="outline"
        onClick={onPrev}
        disabled={currentStep === 0}
        className="rounded-full h-14 w-14 p-0 flex items-center justify-center bg-white/70 backdrop-blur-sm border-white/60 hover:bg-white/90 shadow-md transition-all"
        aria-label="Previous step"
      >
        <ArrowLeft className="h-6 w-6 text-primary-600" />
      </Button>
      {!isLastStep && (
        <Button
          onClick={onNext}
          className="rounded-full h-14 w-14 p-0 flex items-center justify-center bg-primary-500 hover:bg-primary-600 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all"
          aria-label="Next step"
        >
          <ArrowRight className="h-6 w-6 text-white" />
        </Button>
      )}
    </div>
  );
}
