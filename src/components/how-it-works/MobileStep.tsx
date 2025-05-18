
import React from 'react';
import { cn } from '@/lib/utils';

interface MobileStepProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  imageSrc: string;
  imageAlt: string;
  stepNumber: number;
}

export function MobileStep({ title, description, icon, imageSrc, imageAlt, stepNumber }: MobileStepProps) {
  return (
    <div className="w-full rounded-xl shadow-lg overflow-hidden bg-white relative h-[520px]">
      {/* Image Container (60% height) */}
      <div className="relative h-[60%] overflow-hidden">
        <img 
          src={imageSrc}
          alt={imageAlt} 
          className="w-full h-full object-cover"
        />
        
        {/* Step Number Badge */}
        <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-primary-500 shadow-lg flex items-center justify-center">
          <span className="text-white text-lg font-bold">{stepNumber}</span>
        </div>
      </div>

      {/* Text Panel (40% height) with semi-transparent background */}
      <div className="relative h-[40%] bg-white/85 backdrop-blur-sm p-5 rounded-t-2xl shadow-md transform -mt-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-500">
            {icon}
          </div>
          <h3 className="text-xl font-semibold text-gray-800">
            {title}
          </h3>
        </div>
        <p className="text-gray-600 text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
