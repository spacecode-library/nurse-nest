
import { ReactNode } from 'react';

interface BackgroundContainerProps {
  children: ReactNode;
}

export default function BackgroundContainer({ children }: BackgroundContainerProps) {
  return (
    <div className="relative">
      {/* Background image with feathered edges */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white opacity-30 z-10"></div>
        <img 
          src="/lovable-uploads/25f8c267-3393-44b8-aeab-f8e7d15a7423.png" 
          alt="Background pattern" 
          className="w-full h-full object-cover"
        />
        {/* Top feathering/gradient */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white to-transparent z-10"></div>
        {/* Bottom feathering/gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent z-10"></div>
      </div>
      
      {/* Content positioned on top of the background */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
