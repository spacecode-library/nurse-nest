
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
    
    if (priority) {
      img.fetchPriority = 'high';
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
    <div className={cn("relative", className)}>
      {/* Loading placeholder */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 animate-pulse" />
      )}
      
      {/* Background image */}
      {isLoaded && !hasError && (
        <div
          className="absolute inset-0 transition-opacity duration-500 ease-out"
          style={{
            backgroundImage: `url('${src}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: isLoaded ? 1 : 0,
          }}
          role="img"
          aria-label={alt}
        />
      )}
      
      {/* Error fallback */}
      {hasError && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-400" />
      )}
      
      {/* Content overlay */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
