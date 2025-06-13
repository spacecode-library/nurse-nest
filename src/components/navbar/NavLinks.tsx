
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useScrollToSection } from '@/hooks/use-scroll-to-section';

// Navigation links data
const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Pricing', path: '/pricing' },
];

interface NavLinksProps {
  shouldUseDarkText: boolean;
  isMobile?: boolean;
  onNavClick?: (path: string) => void;
}

export default function NavLinks({ shouldUseDarkText, isMobile = false, onNavClick }: NavLinksProps) {
  const scrollToSection = useScrollToSection();
  
  const handleNavClick = (path: string, e: React.MouseEvent) => {
    // For Home and Pricing, allow normal navigation
    if (path === '/' || path === '/pricing') {
      // Don't prevent default for these routes
      if (onNavClick) {
        onNavClick(path);
      }
      return;
    }
    
    // For other paths (with #), prevent default and use scroll
    e.preventDefault();
    if (onNavClick) {
      onNavClick(path);
    } else {
      scrollToSection(path);
    }
  };
  
  if (isMobile) {
    // For mobile, render each link in its own container for proper spacing
    return (
      <div className="space-y-3">
        {navLinks.map((link) => (
          <div key={link.name}>
            <Link 
              to={link.path}
              onClick={(e) => handleNavClick(link.path, e)}
              className="block font-medium text-gray-700 hover:text-brand-primary py-2 focus-visible:outline-none"
            >
              {link.name}
            </Link>
          </div>
        ))}
      </div>
    );
  }
  
  // For desktop, render as inline elements
  return (
    <>
      {navLinks.map((link) => (
        <Link 
          key={link.name}
          to={link.path}
          onClick={(e) => handleNavClick(link.path, e)}
          className={cn(
            "font-medium transition-colors duration-300 ease-in-out hover:scale-105 focus-visible:outline-none",
            shouldUseDarkText
              ? "text-gray-700 hover:text-[#3b82f6]" 
              : "text-white hover:text-[#9bcbff]"
          )}
        >
          {link.name}
        </Link>
      ))}
    </>
  );
}
