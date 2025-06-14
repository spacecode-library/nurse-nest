
import React from "react";
import AnimatedSection from "../AnimatedSection";
import { statisticsData } from "./statisticsData";
import { AnimatedCounter } from "./AnimatedCounter";

interface StatisticsGridProps {
  isVisible: boolean;
}

export function StatisticsGrid({ isVisible }: StatisticsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {statisticsData.map((stat, index) => (
        <AnimatedSection
          key={index}
          animation="fade-up"
          delay={index * 200}
          className="group"
        >
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 h-full flex flex-col justify-center text-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
            <div className="mb-3">
              <AnimatedCounter
                targetValue={stat.targetValue}
                suffix={stat.suffix}
                isVisible={isVisible}
                delay={index * 200}
              />
            </div>
            <p className="text-white/90 text-sm md:text-base font-normal mb-3 leading-relaxed">
              {stat.description}
            </p>
            <p className="text-white/70 text-xs font-normal">
              {stat.source}
            </p>
          </div>
        </AnimatedSection>
      ))}
    </div>
  );
}
