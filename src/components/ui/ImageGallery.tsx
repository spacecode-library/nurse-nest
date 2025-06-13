
import React, { useState, useMemo } from 'react';
import { OptimizedImage } from './OptimizedImage';
import { cn } from '@/lib/utils';
import { useImagePreloader } from '@/hooks/useImagePreloader';

interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

interface ImageGalleryProps {
  images: GalleryImage[];
  columns?: number;
  gap?: number;
  className?: string;
  imageClassName?: string;
  onImageClick?: (image: GalleryImage, index: number) => void;
  preloadNext?: number;
}

export function ImageGallery({
  images,
  columns = 3,
  gap = 4,
  className,
  imageClassName,
  onImageClick,
  preloadNext = 5,
}: ImageGalleryProps) {
  const [loadedCount, setLoadedCount] = useState(0);

  // Preload next batch of images
  const nextImagesToPreload = useMemo(() => {
    return images
      .slice(loadedCount, loadedCount + preloadNext)
      .map(img => img.src);
  }, [images, loadedCount, preloadNext]);

  useImagePreloader(nextImagesToPreload, { enabled: loadedCount > 0 });

  return (
    <div 
      className={cn(
        'grid auto-rows-fr',
        `grid-cols-1 sm:grid-cols-2 lg:grid-cols-${columns}`,
        `gap-${gap}`,
        className
      )}
    >
      {images.map((image, index) => (
        <div
          key={`${image.src}-${index}`}
          className="relative group cursor-pointer"
          onClick={() => onImageClick?.(image, index)}
        >
          <OptimizedImage
            src={image.src}
            alt={image.alt}
            lazy={index > 6} // Don't lazy load first 6 images
            priority={index < 3} // High priority for first 3 images
            className={cn(
              'w-full h-full transition-transform duration-300 group-hover:scale-105',
              imageClassName
            )}
            containerClassName="aspect-square"
          />
          
          {image.caption && (
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4">
              <p className="text-white text-sm">{image.caption}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
