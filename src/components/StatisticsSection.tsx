import React, { useState, useEffect, useRef } from 'react';
import AnimatedSection from './AnimatedSection';
import { useIsMobile } from '@/hooks/use-mobile';
import { OptimizedImage } from './ui/optimized-image';
import { statisticsData } from './statistics/statisticsData';
import { AnimatedCounter } from './statistics/AnimatedCounter';

interface StatisticItem {
  number: string;
  description: string;
  source: string;
  targetValue: number;
  suffix: string;
}

export default function StatisticsSection() {
  const isMobile = useIsMobile();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [isVisible]);

  return (
    <section
      ref={sectionRef}
      className="relative py-12 md:py-20 overflow-hidden"
      style={{
        backgroundImage: `url('/lovable-uploads/240466de-65e5-4ba7-81c3-a666ac4a35ef.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark overlay to make text pop */}
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <AnimatedSection animation="fade-up" className="text-center mb-8 md:mb-12">
          {/* Statistics header image - different for mobile and desktop */}
          <div className="flex justify-center mb-4">
            {isMobile ? (
              <OptimizedImage
                src="/lovable-uploads/a4fa0189-6013-49f5-a0b4-d869807d7f31.png"
                alt="When staying home isn't just a preference"
                className="h-20 md:h-48 w-auto max-w-full object-contain"
                priority={true}
              />
            ) : (
              <OptimizedImage
                src="/lovable-uploads/89138824-7217-49ac-bcf7-52d26a067082.png"
                alt="When staying home isn't just a preference"
                className="h-32 md:h-48 w-auto max-w-full object-contain"
                priority={true}
              />
            )}
          </div>
        </AnimatedSection>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {statisticsData.map((stat, index) => (
            <AnimatedSection
              key={index}
              animation="fade-up"
              delay={index * 200}
              className="group"
            >
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 h-full flex flex-col justify-center text-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                {/* Animated Number */}
                <div className="mb-3">
                  <AnimatedCounter
                    targetValue={stat.targetValue}
                    suffix={stat.suffix}
                    isVisible={isVisible}
                    delay={index * 200}
                  />
                </div>

                {/* Description */}
                <p className="text-white/90 text-sm md:text-base font-normal mb-3 leading-relaxed">
                  {stat.description}
                </p>

                {/* Source */}
                <p className="text-white/70 text-xs font-normal">
                  {stat.source}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
