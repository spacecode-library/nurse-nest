
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedBackgroundProps {
  src: string;
  className?: string;
  priority?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export function OptimizedBackground({
  src,
  className,
  priority = false,
  children,
  style
}: OptimizedBackgroundProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [optimizedSrc, setOptimizedSrc] = useState(src);

  useEffect(() => {
    const loadOptimizedImage = async () => {
      // Try to load WebP version first
      const webpSrc = src.replace('.png', '.webp');
      
      const img = new Image();
      img.onload = () => {
        setOptimizedSrc(webpSrc);
        setImageLoaded(true);
      };
      img.onerror = () => {
        // Fallback to original if WebP fails
        const fallbackImg = new Image();
        fallbackImg.onload = () => {
          setOptimizedSrc(src);
          setImageLoaded(true);
        };
        fallbackImg.onerror = () => {
          // If original also fails, still show content
          setImageLoaded(true);
        };
        fallbackImg.src = src;
      };
      
      if (priority) {
        img.src = webpSrc;
      } else {
        // Lazy load for non-priority images
        const observer = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) {
            img.src = webpSrc;
            observer.disconnect();
          }
        });
        
        const element = document.querySelector(`[data-bg-src="${src}"]`);
        if (element) {
          observer.observe(element);
        } else {
          // If element not found, load immediately
          img.src = webpSrc;
        }
      }
    };

    loadOptimizedImage();
  }, [src, priority]);

  return (
    <div
      data-bg-src={src}
      className={cn(
        "transition-opacity duration-300",
        imageLoaded ? "opacity-100" : "opacity-0",
        className
      )}
      style={{
        ...style,
        backgroundImage: imageLoaded ? `url('${optimizedSrc}')` : undefined,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
      }}
    >
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      {children}
    </div>
  );
}
