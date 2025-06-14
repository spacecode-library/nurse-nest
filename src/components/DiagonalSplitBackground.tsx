
import React from "react";

/**
 * DiagonalSplitBackground renders a sharp, corner-to-corner, bottom-left to top-right diagonal,
 * with a realistic 3D effect as if the white side is elevated above the blue, using a soft shadowed split.
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
          {/* Diagonal shadow gradient: from semi-transparent black, fading out */}
          <linearGradient id="diagonalShadow" x1="0" y1="100" x2="100" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="rgba(0,0,0,0.15)" />
            <stop offset="60%" stopColor="rgba(0,0,0,0.12)" />
            <stop offset="90%" stopColor="rgba(0,0,0,0.06)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </linearGradient>
        </defs>
        {/* Blue triangle */}
        <polygon points="0,100 100,100 100,0" fill="#9bcbff" />
        {/* White triangle */}
        <polygon points="0,0 100,0 0,100" fill="#fff" />
        {/* Diagonal shadow overlay for 3D illusion - slightly below diagonal */}
        <polygon
          points="
            0,100
            100,0
            100,3
            3,100
          "
          fill="url(#diagonalShadow)"
        />
      </svg>
    </div>
  );
};

export default DiagonalSplitBackground;
