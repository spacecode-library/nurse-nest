
import React, { useEffect, useState } from "react";

export interface AnimatedCounterProps {
  targetValue: number;
  suffix: string;
  isVisible: boolean;
  delay: number;
}

export function AnimatedCounter({
  targetValue,
  suffix,
  isVisible,
  delay,
}: AnimatedCounterProps) {
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
      {currentValue}
      {suffix}
    </div>
  );
}
