
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Initialize performance optimizations and animations
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    /* Cart Animation */
    @keyframes pulse-once {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
    .animate-pulse-once {
      animation: pulse-once 0.5s ease-in-out;
    }
    
    /* Image Performance Optimizations */
    img {
      image-rendering: -webkit-optimize-contrast;
      image-rendering: crisp-edges;
      backface-visibility: hidden;
      transform: translateZ(0);
    }
    
    /* Background Image Performance */
    [style*="background-image"] {
      will-change: opacity;
      backface-visibility: hidden;
      transform: translateZ(0);
    }
    
    /* Animation Performance */
    .transition-opacity {
      will-change: opacity;
      backface-visibility: hidden;
    }
  `;
  document.head.appendChild(style);
}
