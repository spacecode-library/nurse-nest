
import React from 'react';

interface MobileStepProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  imageSrc: string;
  imageAlt: string;
}

export function MobileStep({ title, description, icon, imageSrc, imageAlt }: MobileStepProps) {
  return (
    <div className="w-full rounded-xl shadow-lg overflow-hidden bg-[#F9FAFB] relative h-[500px]">
      {/* Full bleed image with overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={imageSrc}
          alt={imageAlt} 
          className="w-full h-full object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 p-6 h-full flex flex-col justify-end">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
            {icon}
          </div>
          <h3 className="text-xl font-semibold text-white">
            {title}
          </h3>
        </div>
        <p className="text-white/90 text-sm">
          {description}
        </p>
      </div>
    </div>
  );
}
