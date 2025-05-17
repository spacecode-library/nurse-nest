
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface LogoProps {
  shouldUseDarkText: boolean;
}

export default function Logo({ shouldUseDarkText }: LogoProps) {
  return (
    <Link to="/" className="flex items-center mr-12">
      <span className={cn(
        "text-2xl font-heading font-bold",
        shouldUseDarkText ? "text-nurse-dark" : "text-white"
      )}>
        Nurse<span className="text-primary-500">Nest</span>
      </span>
    </Link>
  );
}
