
import React from "react";

/**
 * DiagonalSplitBackground renders a sharp, corner-to-corner, bottom-left to top-right diagonal,
 * with a subtle 3D effect as if the white side is gently elevated above the blue, using a very soft shadowed split.
 * Only renders on mobile/tablet (use with lg:hidden).
 */
const DiagonalSplitBackground: React.FC = () => {
  return (
    <div
      className="fixed inset-0 z-0 w-full h-full pointer-events-none select-none"
      aria-hidden="true"
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="w-full h-full absolute top-0 left-0"
        style={{ display: "block" }}
        shapeRendering="crispEdges"
      >
        <defs>
          {/* Softer diagonal shadow gradient: much lighter, thinner, closer to diagonal */}
          <linearGradient id="diagonalShadow" x1="0" y1="100" x2="100" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="rgba(0,0,0,0.08)" />
            <stop offset="70%" stopColor="rgba(0,0,0,0.04)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </linearGradient>
        </defs>
        {/* Blue triangle */}
        <polygon points="0,100 100,100 100,0" fill="#9bcbff" />
        {/* White triangle */}
        <polygon points="0,0 100,0 0,100" fill="#fff" />
        {/* More subtle 3D shadow overlay—thinner and lighter */}
        <polygon
          points="
            1,99
            99,1
            100,2
            2,100
          "
          fill="url(#diagonalShadow)"
        />
      </svg>
    </div>
  );
};

export default DiagonalSplitBackground;

