
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface LogoProps {
  shouldUseDarkText: boolean;
}

export default function Logo({ shouldUseDarkText }: LogoProps) {
  // Determine which logo to use based on the background
  const getLogoSrc = () => {
    if (shouldUseDarkText) {
      // When background is light (scrolled state), use black logo
      return '/lovable-uploads/46897ac7-31a7-4a99-acca-afdd941db957.png';
    } else {
      // When background is dark/transparent (hero state), use white logo
      return '/lovable-uploads/f3b33d4c-f4e9-4a9b-9390-96cc49376903.png';
    }
  };

  return (
    <Link to="/" className="flex items-center transition-all duration-300 hover:scale-105">
      <img 
        src={getLogoSrc()}
        alt="Nurse Nest"
        className="h-8 w-auto md:h-10 transition-all duration-300"
      />
    </Link>
  );
}
