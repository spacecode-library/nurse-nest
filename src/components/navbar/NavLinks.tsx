
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useScrollToSection } from '@/hooks/use-scroll-to-section';

// Navigation links data with Pay Calculator added
const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Pricing', path: '/pricing' },
  { name: 'Pay Calculator', path: '/salary-calculator' },
  { name: 'Contact', path: '/contact' },
];

interface NavLinksProps {
  shouldUseDarkText: boolean;
  isMobile?: boolean;
  onNavClick?: (path: string) => void;
}

export default function NavLinks({ shouldUseDarkText, isMobile = false, onNavClick }: NavLinksProps) {
  const scrollToSection = useScrollToSection();
  
  const handleNavClick = (path: string) => {
    if (onNavClick) {
      onNavClick(path);
    } else {
      scrollToSection(path);
    }
  };
  
  return (
    <>
      {navLinks.map((link) => (
        <Link 
          key={link.name}
          to={link.path}
          onClick={(e) => {
            e.preventDefault();
            handleNavClick(link.path);
          }}
          className={cn(
            isMobile 
              ? "font-medium text-gray-700 hover:text-brand-primary" 
              : cn(
                "font-medium link-underline",
                shouldUseDarkText
                  ? "text-gray-700 hover:text-brand-primary" 
                  : "text-white hover:text-blue-200"
              )
          )}
        >
          {link.name}
        </Link>
      ))}
    </>
  );
}
