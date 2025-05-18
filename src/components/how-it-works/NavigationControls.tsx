
import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavigationControlsProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
}

export function NavigationControls({ currentStep, totalSteps, onNext, onPrev }: NavigationControlsProps) {
  const isLastStep = currentStep === totalSteps - 1;
  
  return (
    <div className="absolute bottom-6 right-6 flex gap-3 z-10">
      <Button
        variant="outline"
        onClick={onPrev}
        disabled={currentStep === 0}
        className="rounded-full h-12 w-12 p-0 flex items-center justify-center bg-white/50 backdrop-blur-sm border-white/40 hover:bg-white/70"
        aria-label="Previous step"
      >
        <ArrowLeft className="h-5 w-5 text-white" />
      </Button>
      {!isLastStep ? (
        <Button
          onClick={onNext}
          className="rounded-full h-12 w-12 p-0 flex items-center justify-center bg-primary-500/90 hover:bg-primary-600 backdrop-blur-sm"
          aria-label="Next step"
        >
          <ArrowRight className="h-5 w-5" />
        </Button>
      ) : (
        <span></span>
      )}
    </div>
  );
}
