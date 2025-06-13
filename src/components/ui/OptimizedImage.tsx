
import React, { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useResponsiveImage } from '@/hooks/useResponsiveImage';
import { Skeleton } from '@/components/ui/skeleton';

interface OptimizedImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'loading'> {
  src: string;
  alt: string;
  lazy?: boolean;
  priority?: boolean;
  blur?: boolean;
  quality?: number;
  widths?: number[];
  className?: string;
  containerClassName?: string;
  skeleton?: boolean;
}

export function OptimizedImage({
  src,
  alt,
  lazy = true,
  priority = false,
  blur = true,
  quality = 85,
  widths,
  className,
  containerClassName,
  skeleton = true,
  ...props
}: OptimizedImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showBlur, setShowBlur] = useState(blur);

  const { elementRef, hasIntersected } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px',
    triggerOnce: true,
  });

  const { srcSet, sizes, webpSrcSet } = useResponsiveImage({
    src,
    widths,
    quality,
    formats: ['webp', 'jpg'],
  });

  const shouldLoad = !lazy || hasIntersected || priority;

  const handleLoad = useCallback(() => {
    setImageLoaded(true);
    if (blur) {
      setTimeout(() => setShowBlur(false), 100);
    }
  }, [blur]);

  const handleError = useCallback(() => {
    setImageError(true);
    setImageLoaded(true);
    setShowBlur(false);
  }, []);

  // Create low-quality placeholder
  const placeholderSrc = `${src}?w=20&q=10&blur=10`;

  return (
    <div 
      ref={elementRef as React.RefObject<HTMLDivElement>}
      className={cn('relative overflow-hidden', containerClassName)}
    >
      {/* Skeleton loader */}
      {skeleton && !imageLoaded && (
        <Skeleton className="absolute inset-0 w-full h-full" />
      )}

      {/* Low-quality placeholder with blur */}
      {blur && showBlur && shouldLoad && (
        <img
          src={placeholderSrc}
          alt=""
          className={cn(
            'absolute inset-0 w-full h-full object-cover filter blur-sm scale-110 transition-opacity duration-500',
            imageLoaded ? 'opacity-0' : 'opacity-100'
          )}
          aria-hidden="true"
        />
      )}

      {/* Main optimized image */}
      {shouldLoad && !imageError && (
        <picture>
          {webpSrcSet && (
            <source
              srcSet={webpSrcSet}
              sizes={sizes}
              type="image/webp"
            />
          )}
          <img
            src={src}
            srcSet={srcSet}
            sizes={sizes}
            alt={alt}
            loading={priority ? undefined : 'lazy'}
            fetchPriority={priority ? 'high' : 'low'}
            onLoad={handleLoad}
            onError={handleError}
            className={cn(
              'w-full h-full object-cover transition-opacity duration-500',
              imageLoaded ? 'opacity-100' : 'opacity-0',
              className
            )}
            {...props}
          />
        </picture>
      )}

      {/* Error fallback */}
      {imageError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400">
          <span className="text-sm">Failed to load image</span>
        </div>
      )}
    </div>
  );
}
