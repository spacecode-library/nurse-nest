
import React from "react";

/**
 * DiagonalSplitBackground renders a sharp, hi-res, top-left to bottom-right diagonal background.
 * Uses SVG to prevent blur/artifacts and works crisply on all screens.
 * Only render in mobile (use with lg:hidden).
 */
const DiagonalSplitBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 w-full h-full pointer-events-none select-none" aria-hidden="true">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="w-full h-full absolute top-0 left-0"
        style={{ display: 'block' }}
      >
        <defs>
          <linearGradient id="diag" gradientTransform="rotate(45)">
            <stop offset="50%" stopColor="#9bcbff" />
            <stop offset="50%" stopColor="#fff" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="100" height="100" fill="url(#diag)" />
      </svg>
    </div>
  );
};

export default DiagonalSplitBackground;
