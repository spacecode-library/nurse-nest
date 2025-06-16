
import React from 'react';
import { Button } from '@/components/ui/button';
import { useSmartNavigation } from '@/hooks/useSmartNavigation';

interface FloatingCtaProps {
  onClick: () => void;
}

export default function FloatingCta({ onClick }: FloatingCtaProps) {
  const { handleRequestNurse } = useSmartNavigation();

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <Button 
        onClick={handleRequestNurse} 
        className="bg-primary-500 hover:bg-primary-600 text-white rounded-full shadow-lg px-5 py-5 h-auto animate-button-glow"
      >
        Request a Nurse
      </Button>
    </div>
  );
}
