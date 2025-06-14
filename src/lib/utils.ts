
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Add animation for cart summary pulse effect
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes pulse-once {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
    .animate-pulse-once {
      animation: pulse-once 0.5s ease-in-out;
    }
    
    /* Optimized image rendering */
    img {
      image-rendering: -webkit-optimize-contrast;
      image-rendering: crisp-edges;
      backface-visibility: hidden;
      transform: translateZ(0);
    }
    
    /* Smooth background image transitions */
    [style*="background-image"] {
      will-change: opacity;
      backface-visibility: hidden;
      transform: translateZ(0);
    }
    
    /* Hardware acceleration for smooth animations */
    .transition-opacity {
      will-change: opacity;
      backface-visibility: hidden;
    }
  `;
  document.head.appendChild(style);
}
