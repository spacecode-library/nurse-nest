
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedBackgroundProps {
  src: string;
  alt?: string;
  className?: string;
  priority?: boolean;
  children?: React.ReactNode;
}

export const OptimizedBackground: React.FC<OptimizedBackgroundProps> = ({
  src,
  alt = '',
  className,
  priority = false,
  children
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const img = new Image();
    
    // Fix TypeScript error - use proper way to set fetchPriority
    if (priority && 'fetchPriority' in img) {
      (img as any).fetchPriority = 'high';
    }
    
    img.onload = () => {
      setIsLoaded(true);
    };
    
    img.onerror = () => {
      setHasError(true);
    };
    
    img.src = src;
    
    // Cleanup
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, priority]);

  return (
    <div className={cn("relative", className)} style={{ willChange: isLoaded ? 'auto' : 'opacity' }}>
      {/* Loading placeholder with improved animation */}
      {!isLoaded && !hasError && (
        <div 
          className="absolute inset-0 bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 animate-pulse"
          style={{ willChange: 'opacity' }}
        />
      )}
      
      {/* Background image with performance optimizations */}
      {isLoaded && !hasError && (
        <div
          className="absolute inset-0 transition-opacity duration-500 ease-out"
          style={{
            backgroundImage: `url('${src}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: isLoaded ? 1 : 0,
            willChange: 'auto',
            transform: 'translateZ(0)', // Hardware acceleration
            backfaceVisibility: 'hidden'
          }}
          role="img"
          aria-label={alt}
        />
      )}
      
      {/* Error fallback with better styling */}
      {hasError && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-400 flex items-center justify-center">
          <span className="text-gray-600 text-sm">Unable to load background image</span>
        </div>
      )}
      
      {/* Content overlay */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
