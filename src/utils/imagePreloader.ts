
interface PreloadOptions {
  priority?: 'high' | 'low';
  formats?: string[];
}

class ImagePreloader {
  private preloadedImages = new Set<string>();
  private preloadQueue = new Map<string, Promise<void>>();

  preload(src: string, options: PreloadOptions = {}): Promise<void> {
    if (this.preloadedImages.has(src)) {
      return Promise.resolve();
    }

    if (this.preloadQueue.has(src)) {
      return this.preloadQueue.get(src)!;
    }

    const preloadPromise = this.createPreloadPromise(src, options);
    this.preloadQueue.set(src, preloadPromise);

    return preloadPromise;
  }

  private createPreloadPromise(src: string, options: PreloadOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        this.preloadedImages.add(src);
        this.preloadQueue.delete(src);
        resolve();
      };
      
      img.onerror = () => {
        this.preloadQueue.delete(src);
        reject(new Error(`Failed to preload image: ${src}`));
      };

      // Try WebP first if supported, fallback to original
      if (options.formats?.includes('webp') && this.supportsWebP()) {
        img.src = src.replace(/\.[^/.]+$/, '.webp');
      } else {
        img.src = src;
      }
    });
  }

  preloadCritical(sources: string[]): Promise<void[]> {
    return Promise.all(
      sources.map(src => this.preload(src, { priority: 'high' }))
    );
  }

  private supportsWebP(): boolean {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }
}

export const imagePreloader = new ImagePreloader();
