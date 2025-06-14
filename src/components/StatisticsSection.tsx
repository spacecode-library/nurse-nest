
import React, { useState, useEffect, useRef } from "react";
import { StatisticsHeader } from "./statistics/StatisticsHeader";
import { StatisticsGrid } from "./statistics/StatisticsGrid";

export default function StatisticsSection() {
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
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="container mx-auto px-4 relative z-10">
        <StatisticsHeader />
        <StatisticsGrid isVisible={isVisible} />
      </div>
    </section>
  );
}
