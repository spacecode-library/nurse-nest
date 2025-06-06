
import React, { useState, useEffect, useRef } from 'react';
import AnimatedSection from './AnimatedSection';
import { useIsMobile } from '@/hooks/use-mobile';

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

  const statistics: StatisticItem[] = [
    {
      number: "98",
      description: "of parents experience sleep deprivation",
      source: "The Lullaby Trust, 2024",
      targetValue: 98,
      suffix: "%"
    },
    {
      number: "87",
      description: "prefer aging at home vs facilities", 
      source: "Ultimate Care NY, 2024",
      targetValue: 87,
      suffix: "%"
    },
    {
      number: "70",
      description: "of home care patients are 65+",
      source: "CDC, 2024", 
      targetValue: 70,
      suffix: "%"
    },
    {
      number: "133",
      description: "nights of sleep lost in baby's first year",
      source: "The Bump, 2022",
      targetValue: 133,
      suffix: ""
    },
    {
      number: "66",
      description: "rely solely on family caregivers",
      source: "Long-Term Care Statistics",
      targetValue: 66,
      suffix: "%"
    },
    {
      number: "24/7",
      description: "availability of private duty care",
      source: "Adoration Nursing",
      targetValue: 0,
      suffix: ""
    }
  ];

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
      className="relative py-16 md:py-20 overflow-hidden"
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
        <AnimatedSection animation="fade-up" className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-light mb-4 text-white">
            The care families need
          </h2>
          <p className="text-lg md:text-xl text-white/90 font-normal">
            Real statistics that matter
          </p>
        </AnimatedSection>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {statistics.map((stat, index) => (
            <AnimatedSection
              key={index}
              animation="fade-up"
              delay={index * 200}
              className="group"
            >
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 h-full flex flex-col justify-center text-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                {/* Animated Number */}
                <div className="mb-3">
                  {stat.number === "24/7" ? (
                    <div className="text-4xl md:text-5xl font-light text-white">
                      24/7
                    </div>
                  ) : (
                    <AnimatedCounter 
                      targetValue={stat.targetValue}
                      suffix={stat.suffix}
                      isVisible={isVisible}
                      delay={index * 200}
                    />
                  )}
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

interface AnimatedCounterProps {
  targetValue: number;
  suffix: string;
  isVisible: boolean;
  delay: number;
}

function AnimatedCounter({ targetValue, suffix, isVisible, delay }: AnimatedCounterProps) {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    const timer = setTimeout(() => {
      let startTime: number;
      const duration = 1500; // 1.5 seconds

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        
        // Easing function for smoother animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const value = Math.floor(easeOutQuart * targetValue);
        
        setCurrentValue(value);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }, delay);

    return () => clearTimeout(timer);
  }, [isVisible, targetValue, delay]);

  return (
    <div className="text-4xl md:text-5xl font-light text-white">
      {currentValue}{suffix}
    </div>
  );
}
