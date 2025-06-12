
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavLinksProps {
  shouldUseDarkText: boolean;
  isMobile?: boolean;
  onNavClick?: (path: string) => void;
}

export default function NavLinks({ shouldUseDarkText, isMobile = false, onNavClick }: NavLinksProps) {
  const handleClick = (path: string) => {
    if (onNavClick) {
      onNavClick(path);
    }
  };

  const linkClass = cn(
    "font-medium transition-colors duration-300 ease-in-out",
    shouldUseDarkText 
      ? "text-gray-700 hover:text-primary-500" 
      : "text-white hover:text-primary-300"
  );

  if (isMobile) {
    return (
      <>
        <Link 
          to="/about" 
          className={linkClass}
          onClick={() => handleClick('/about')}
        >
          About
        </Link>
        <Link 
          to="/pricing" 
          className={linkClass}
          onClick={() => handleClick('/pricing')}
        >
          Pricing
        </Link>
        <Link 
          to="/blog" 
          className={linkClass}
          onClick={() => handleClick('/blog')}
        >
          Blog
        </Link>
        <Link 
          to="/contact" 
          className={linkClass}
          onClick={() => handleClick('/contact')}
        >
          Contact
        </Link>
        <Link 
          to="#faq" 
          className={linkClass}
          onClick={() => handleClick('#faq')}
        >
          FAQ
        </Link>
      </>
    );
  }

  return (
    <>
      <Link to="/about" className={linkClass}>About</Link>
      <Link to="/pricing" className={linkClass}>Pricing</Link>
      <Link to="/blog" className={linkClass}>Blog</Link>
      <Link to="/contact" className={linkClass}>Contact</Link>
    </>
  );
}
