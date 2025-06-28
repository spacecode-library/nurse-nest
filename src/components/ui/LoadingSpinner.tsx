// components/ui/LoadingSpinner.tsx
import React from 'react';
import { Stethoscope } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function LoadingSpinner({ 
  message = "Loading...", 
  size = 'lg' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: {
      container: 'w-12 h-12',
      spinner: 'w-6 h-6',
      icon: 'w-4 h-4',
      text: 'text-sm'
    },
    md: {
      container: 'w-16 h-16',
      spinner: 'w-8 h-8',
      icon: 'w-5 h-5',
      text: 'text-base'
    },
    lg: {
      container: 'w-20 h-20',
      spinner: 'w-10 h-10',
      icon: 'w-6 h-6',
      text: 'text-lg'
    }
  };

  const classes = sizeClasses[size];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="relative">
          <div className={`${classes.container} bg-white rounded-full shadow-lg mx-auto flex items-center justify-center`}>
            <div className={`animate-spin ${classes.spinner} border-3 border-blue-600 border-t-transparent rounded-full`}></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Stethoscope className={`${classes.icon} text-blue-600 animate-pulse`} />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className={`${classes.text} font-semibold text-gray-900`}>{message}</h3>
          <p className="text-gray-600 text-sm">Please wait while we set up your experience</p>
        </div>
      </div>
    </div>
  );
}