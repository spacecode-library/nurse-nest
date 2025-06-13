
import { useMemo } from 'react';

interface ResponsiveImageOptions {
  src: string;
  widths?: number[];
  formats?: string[];
  quality?: number;
}

interface ResponsiveImageResult {
  srcSet: string;
  sizes: string;
  webpSrcSet?: string;
  avifSrcSet?: string;
}

export function useResponsiveImage({
  src,
  widths = [320, 640, 768, 1024, 1280, 1920],
  formats = ['webp', 'jpg'],
  quality = 85,
}: ResponsiveImageOptions): ResponsiveImageResult {
  return useMemo(() => {
    // For now, we'll work with the original images and add query parameters for optimization
    // In a real implementation, these would be pre-generated or served by a CDN
    const baseSrc = src.replace(/\.[^/.]+$/, ''); // Remove extension
    const extension = src.match(/\.([^/.]+)$/)?.[1] || 'jpg';
    
    const createSrcSet = (format: string) => {
      return widths
        .map(width => {
          const optimizedSrc = `${src}?w=${width}&q=${quality}&f=${format}`;
          return `${optimizedSrc} ${width}w`;
        })
        .join(', ');
    };

    const sizes = [
      '(max-width: 320px) 320px',
      '(max-width: 640px) 640px',
      '(max-width: 768px) 768px',
      '(max-width: 1024px) 1024px',
      '(max-width: 1280px) 1280px',
      '1920px'
    ].join(', ');

    return {
      srcSet: createSrcSet(extension),
      sizes,
      webpSrcSet: formats.includes('webp') ? createSrcSet('webp') : undefined,
      avifSrcSet: formats.includes('avif') ? createSrcSet('avif') : undefined,
    };
  }, [src, widths, formats, quality]);
}
