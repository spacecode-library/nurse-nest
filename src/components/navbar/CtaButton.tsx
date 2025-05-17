
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface CtaButtonProps {
  isScrolled: boolean;
  onClick: () => void;
}

export default function CtaButton({ isScrolled, onClick }: CtaButtonProps) {
  return (
    <Button 
      className={cn(
        "transition-opacity duration-300 button-hover-effect",
        isScrolled ? "bg-primary-500 hover:bg-primary-600" : "bg-white text-primary-500 hover:bg-gray-100"
      )}
      onClick={onClick}
    >
      Request a Nurse
    </Button>
  );
}
