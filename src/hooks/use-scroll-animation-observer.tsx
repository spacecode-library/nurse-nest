
import { useEffect, useRef } from 'react';

interface ScrollAnimationObserverOptions {
  rootMargin?: string;
  threshold?: number;
  animationClass?: string;
}

export function useScrollAnimationObserver({
  rootMargin = '0px 0px -100px 0px',
  threshold = 0.1,
  animationClass = 'animate-in'
}: ScrollAnimationObserverOptions = {}) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  
  useEffect(() => {
    // Create a new IntersectionObserver instance
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // If the element is in the viewport (or close to it)
        if (entry.isIntersecting) {
          // Add the animation class
          entry.target.classList.add(animationClass);
          // Stop observing the element
          observerRef.current?.unobserve(entry.target);
        }
      });
    }, {
      rootMargin,
      threshold
    });
    
    // Select all elements with the target class (.step-block in this case)
    const elements = document.querySelectorAll('.step-block');
    
    // Start observing each element
    elements.forEach(element => {
      observerRef.current?.observe(element);
    });
    
    // Clean up the observer when the component unmounts
    return () => {
      observerRef.current?.disconnect();
    };
  }, [animationClass, rootMargin, threshold]);
  
  return null;
}
