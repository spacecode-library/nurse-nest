
import React, { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface OptimizedBackgroundProps {
  src: string;
  alt?: string;
  lazy?: boolean;
  priority?: boolean;
  blur?: boolean;
  quality?: number;
  className?: string;
  children?: React.ReactNode;
  overlay?: boolean;
  overlayClassName?: string;
}

export function OptimizedBackground({
  src,
  alt = '',
  lazy = true,
  priority = false,
  blur = true,
  quality = 85,
  className,
  children,
  overlay = false,
  overlayClassName,
}: OptimizedBackgroundProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showBlur, setShowBlur] = useState(blur);

  const { elementRef, hasIntersected } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px',
    triggerOnce: true,
  });

  const shouldLoad = !lazy || hasIntersected || priority;

  const handleLoad = useCallback(() => {
    setImageLoaded(true);
    if (blur) {
      setTimeout(() => setShowBlur(false), 100);
    }
  }, [blur]);

  // Create optimized image URLs
  const optimizedSrc = `${src}?q=${quality}`;
  const placeholderSrc = `${src}?w=20&q=10&blur=10`;
  const webpSrc = src.replace(/\.[^/.]+$/, '.webp');

  return (
    <div 
      ref={elementRef as React.RefObject<HTMLDivElement>}
      className={cn('relative', className)}
    >
      {/* Low-quality placeholder */}
      {blur && showBlur && shouldLoad && (
        <div
          className="absolute inset-0 bg-cover bg-center filter blur-sm scale-110 transition-opacity duration-500"
          style={{ 
            backgroundImage: `url(${placeholderSrc})`,
            opacity: imageLoaded ? 0 : 1
          }}
        />
      )}

      {/* Main background image */}
      {shouldLoad && (
        <>
          <picture className="absolute inset-0">
            <source srcSet={webpSrc} type="image/webp" />
            <img
              src={optimizedSrc}
              alt={alt}
              loading={priority ? undefined : 'lazy'}
              fetchPriority={priority ? 'high' : 'low'}
              onLoad={handleLoad}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
              style={{ opacity: imageLoaded ? 1 : 0 }}
            />
          </picture>
        </>
      )}

      {/* Overlay */}
      {overlay && (
        <div className={cn('absolute inset-0 bg-black/30', overlayClassName)} />
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
