
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StepProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  imageSrc: string;
  imageAlt: string;
}

export function DesktopStep({ title, description, icon, imageSrc, imageAlt }: StepProps) {
  return (
    <div className="flex-shrink-0 relative h-full w-full">
      {/* Full bleed image */}
      <img 
        src={imageSrc} 
        alt={imageAlt}
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Gradient overlay - right side positioned */}
      <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/60 to-transparent"></div>
      
      {/* Content - positioned on the right side */}
      <div className="absolute inset-0 flex items-center justify-end">
        <div className="w-1/2 p-10 space-y-6 text-right">
          <div className="flex items-center justify-end gap-4">
            <h3 className="text-3xl font-bold text-white">
              {title}
            </h3>
            <div className="flex-shrink-0 w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
              {icon}
            </div>
          </div>
          <p className="text-white/90 text-lg leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
