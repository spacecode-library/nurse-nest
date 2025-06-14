
import React, { useState, useEffect } from 'react';
import { MessageCircleQuestion } from 'lucide-react';

interface FloatingFaqButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export default function FloatingFaqButton({ onClick, isOpen }: FloatingFaqButtonProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button when user scrolls past 50% of viewport height
      const scrolled = window.scrollY > window.innerHeight * 0.5;
      setIsVisible(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    onClick();
    // Always scroll to FAQ section after opening
    setTimeout(() => {
      const faqSection = document.getElementById('faq-section');
      if (faqSection) {
        faqSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  };

  return (
    <button
      onClick={handleClick}
      className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg transition-all duration-500 ease-in-out hover:scale-110 flex items-center justify-center transform ${
        isVisible 
          ? 'translate-y-0 opacity-100' 
          : 'translate-y-16 opacity-0 pointer-events-none'
      } ${
        isOpen 
          ? 'bg-blue-600 text-white' 
          : 'bg-white text-blue-600 hover:bg-blue-50'
      }`}
      style={{
        boxShadow: '0 4px 20px rgba(59, 130, 246, 0.3)'
      }}
      aria-label="Browse FAQ"
      data-testid="floating-faq-button"
    >
      <MessageCircleQuestion size={24} />
    </button>
  );
}
