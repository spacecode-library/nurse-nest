
import { useState, useEffect, useRef } from "react";
import AnimatedSection from "../AnimatedSection";
import { useIsMobile } from "@/hooks/use-mobile";
import { OptimizedImage } from "../ui/optimized-image";

export function StatisticsHeader() {
  const isMobile = useIsMobile();
  const [showImage, setShowImage] = useState(false);
  const imageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const refCurrent = imageRef.current;
    if (!refCurrent) return;

    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowImage(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(refCurrent);
    return () => observer.disconnect();
  }, []);

  return (
    <AnimatedSection animation="fade-up" className="text-center mb-8 md:mb-12">
      <div className="flex justify-center mb-4" ref={imageRef}>
        {showImage ? (
          isMobile ? (
            <OptimizedImage
              src="/lovable-uploads/a4fa0189-6013-49f5-a0b4-d869807d7f31.png"
              alt="When staying home isn't just a preference"
              className="h-20 md:h-48 w-auto max-w-full object-contain"
              priority={false}
              loading="lazy"
            />
          ) : (
            <OptimizedImage
              src="/lovable-uploads/89138824-7217-49ac-bcf7-52d26a067082.png"
              alt="When staying home isn't just a preference"
              className="h-32 md:h-48 w-auto max-w-full object-contain"
              priority={false}
              loading="lazy"
            />
          )
        ) : (
          // Skeleton/loading placeholder matches intended image size
          <div className={isMobile ? "h-20 md:h-48 w-44 bg-gray-100 rounded-xl animate-pulse" : "h-32 md:h-48 w-60 bg-gray-100 rounded-xl animate-pulse"} />
        )}
      </div>
    </AnimatedSection>
  );
}

