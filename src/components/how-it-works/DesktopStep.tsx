
import React from 'react';

interface StepProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  imageSrc: string;
  imageAlt: string;
  stepNumber: number;
}

export function DesktopStep({ title, description, icon, imageSrc, imageAlt, stepNumber }: StepProps) {
  return (
    <div className="flex-shrink-0 relative h-full w-full overflow-hidden rounded-xl shadow-lg bg-white">
      {/* Image Container (60% height) */}
      <div className="relative h-[60%] overflow-hidden">
        <img 
          src={imageSrc} 
          alt={imageAlt}
          className="w-full h-full object-cover"
        />
        
        {/* Step Number Badge */}
        <div className="absolute top-6 left-6 w-12 h-12 rounded-full bg-primary-500 shadow-lg flex items-center justify-center">
          <span className="text-white text-xl font-bold">{stepNumber}</span>
        </div>
      </div>
      
      {/* Text Panel (40% height) with semi-transparent background */}
      <div className="h-[40%] bg-white/85 backdrop-blur-sm p-8 rounded-t-2xl transform -mt-5 shadow-md">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-shrink-0 w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center text-primary-500">
            {icon}
          </div>
          <h3 className="text-2xl font-semibold text-gray-800">
            {title}
          </h3>
        </div>
        <p className="text-gray-600 text-base leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
