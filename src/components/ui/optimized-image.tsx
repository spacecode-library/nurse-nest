
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  width?: number;
  height?: number;
  onLoad?: () => void;
  onError?: () => void;
}

export function OptimizedImage({
  src,
  alt,
  className,
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  width,
  height,
  onLoad,
  onError
}: OptimizedImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleLoad = () => {
    setImageLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setImageError(true);
    onError?.();
  };

  // Convert PNG to WebP path for optimization
  const getOptimizedSrc = (originalSrc: string) => {
    return originalSrc.replace('.png', '.webp');
  };

  // Generate srcset for responsive images
  const generateSrcSet = (baseSrc: string) => {
    const webpSrc = getOptimizedSrc(baseSrc);
    return `${webpSrc}?w=320 320w, ${webpSrc}?w=640 640w, ${webpSrc}?w=1024 1024w, ${webpSrc}?w=1920 1920w`;
  };

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      
      <picture>
        {/* AVIF format for maximum compression */}
        <source
          srcSet={generateSrcSet(src.replace('.png', '.avif'))}
          sizes={sizes}
          type="image/avif"
        />
        
        {/* WebP format as fallback */}
        <source
          srcSet={generateSrcSet(src)}
          sizes={sizes}
          type="image/webp"
        />
        
        {/* Original PNG as final fallback */}
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            "transition-opacity duration-300",
            imageLoaded ? "opacity-100" : "opacity-0",
            className
          )}
          sizes={sizes}
        />
      </picture>
    </div>
  );
}
