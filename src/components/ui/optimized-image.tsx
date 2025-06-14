
import React, { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className,
  priority = false,
  loading = 'lazy',
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    onError?.();
  }, [onError]);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Loading placeholder with improved animation */}
      {!isLoaded && !hasError && (
        <div 
          className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" 
          style={{ willChange: 'opacity' }}
        />
      )}
      
      {/* Main image with performance optimizations */}
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : loading}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
        style={{
          filter: isLoaded ? 'none' : 'blur(5px)',
          willChange: isLoaded ? 'auto' : 'opacity, filter',
          transform: 'translateZ(0)', // Hardware acceleration
          backfaceVisibility: 'hidden'
        }}
        // Fix TypeScript error for fetchPriority
        {...(priority && { fetchPriority: 'high' } as any)}
      />
      
      {/* Error fallback with better accessibility */}
      {hasError && (
        <div 
          className="absolute inset-0 bg-gray-300 flex items-center justify-center"
          role="img"
          aria-label={`Failed to load: ${alt}`}
        >
          <span className="text-gray-600 text-sm">Image failed to load</span>
        </div>
      )}
    </div>
  );
};
