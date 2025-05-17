
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useScrollToSection } from '@/hooks/use-scroll-to-section';

// Navigation links data moved from Navbar component
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
              ? "font-medium text-gray-700 hover:text-primary-500" 
              : cn(
                "font-medium link-underline",
                shouldUseDarkText
                  ? "text-gray-700 hover:text-primary-500" 
                  : "text-white hover:text-primary-100"
              )
          )}
        >
          {link.name}
        </Link>
      ))}
    </>
  );
}
