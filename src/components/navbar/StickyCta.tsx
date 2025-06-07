
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface StickyCtaProps {
  heroSectionRef?: React.RefObject<HTMLElement>;
}

export default function StickyCta({ heroSectionRef }: StickyCtaProps) {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // If no heroSectionRef provided, find it by selector
    const heroElement = heroSectionRef?.current || document.querySelector('[data-hero-section]') as HTMLElement;
    
    if (!heroElement) {
      // Fallback to scroll-based showing
      const handleScroll = () => {
        if (window.scrollY > 500) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }

    // Use Intersection Observer for better performance
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) {
            // Hero left viewport - show sticky CTA
            setIsVisible(true);
          } else {
            // Hero back in view - hide sticky CTA
            setIsVisible(false);
          }
        });
      },
      { 
        threshold: 0.1,
        rootMargin: '-50px 0px 0px 0px' // Trigger slightly before hero fully exits
      }
    );

    observer.observe(heroElement);

    return () => {
      observer.disconnect();
    };
  }, [heroSectionRef]);

  const handleClick = () => {
    navigate('/apply');
  };

  return (
    <button
      onClick={handleClick}
      className={`
        sticky-cta fixed top-5 right-5 z-50 px-6 py-3 
        bg-gradient-to-r from-[#9bcbff] to-[#3b82f6] 
        text-white font-normal text-base
        border-none rounded-xl shadow-lg
        transition-all duration-400 ease-out
        hover:from-[#3b82f6] hover:to-[#1e40af]
        hover:shadow-xl hover:-translate-y-0.5
        active:-translate-y-px active:transition-all active:duration-150
        focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:ring-offset-2
        ${isVisible 
          ? 'opacity-100 visible translate-y-0' 
          : 'opacity-0 invisible -translate-y-2'
        }
      `}
      style={{
        fontFamily: 'Arial, Helvetica, sans-serif',
        letterSpacing: '1px',
        backdropFilter: 'blur(8px)',
        minHeight: '44px', // Accessibility touch target
        animation: isVisible ? 'subtle-intro 0.6s ease-out' : undefined
      }}
      aria-label="Request a Nurse - Sticky CTA"
    >
      Request a Nurse
    </button>
  );
}
