
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useScrollToSection } from '@/hooks/use-scroll-to-section';
import { mainNavLinks } from '@/config/navigation';

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
    return (
      <div className="space-y-3">
        {mainNavLinks.map((link) => (
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
  
  return (
    <>
      {mainNavLinks.map((link) => (
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
