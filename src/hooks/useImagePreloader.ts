
import { useEffect } from 'react';
import { imagePreloader } from '@/utils/imagePreloader';

interface UseImagePreloaderOptions {
  enabled?: boolean;
  priority?: 'high' | 'low';
}

export function useImagePreloader(
  sources: string | string[],
  { enabled = true, priority = 'low' }: UseImagePreloaderOptions = {}
) {
  useEffect(() => {
    if (!enabled) return;

    const imageSources = Array.isArray(sources) ? sources : [sources];
    
    if (priority === 'high') {
      imagePreloader.preloadCritical(imageSources);
    } else {
      imageSources.forEach(src => {
        imagePreloader.preload(src, { priority });
      });
    }
  }, [sources, enabled, priority]);
}
