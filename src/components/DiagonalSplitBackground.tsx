
import React from "react";

/**
 * DiagonalSplitBackground renders a sharp, corner-to-corner, bottom-left to top-right diagonal,
 * with a subtle 3D effect as if the white side is gently elevated above the blue.
 * The shadow at the split is neutral, thin, and mimics a real cast shadow—no blue/bright highlight.
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
          {/* A soft, thin, neutral (black/grey) shadow—no blue tint—hugging the white/blue diagonal. */}
          <linearGradient
            id="diagonalShadow"
            x1="0"
            y1="100"
            x2="100"
            y2="0"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="rgba(40,40,55,0.14)" />
            <stop offset="50%" stopColor="rgba(40,40,55,0.08)" />
            <stop offset="85%" stopColor="rgba(40,40,55,0.03)" />
            <stop offset="100%" stopColor="rgba(40,40,55,0)" />
          </linearGradient>
        </defs>
        {/* Blue triangle */}
        <polygon points="0,100 100,100 100,0" fill="#9bcbff" />
        {/* White triangle */}
        <polygon points="0,0 100,0 0,100" fill="#fff" />
        {/* Subtle, neutral, realistic shadow along the diagonal (no blue, no glow, just shadow) */}
        <polygon
          /* The shadow hugs the diagonal, visually sits right under the white "edge" */
          points="
            2,98
            98,2
            99,3.5
            3.5,99
          "
          fill="url(#diagonalShadow)"
        />
      </svg>
    </div>
  );
};

export default DiagonalSplitBackground;

