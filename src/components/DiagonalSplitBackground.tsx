
import React from "react";

/**
 * DiagonalSplitBackground renders a luxury, polished, gently elevated white side
 * with a more pronounced, smooth blue brand gradient and a photorealistic shadow.
 * The split is smooth, glowy, and integrates with surrounding themes.
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
          {/* Soft, modern brand gradient for the blue side */}
          <linearGradient id="blueGrad" x1="0" y1="100" x2="100" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#7bb3ff" />
            <stop offset="60%" stopColor="#9bcbff" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
          {/* Refined photo-real shadow: feathered, slightly warm, realistic blur */}
          <linearGradient id="diagShadow" x1="3" y1="99" x2="98" y2="2" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="rgba(40,40,55,0.24)" />
            <stop offset="40%" stopColor="rgba(40,40,55,0.10)" />
            <stop offset="85%" stopColor="rgba(128,110,90,0.07)" />
            <stop offset="100%" stopColor="rgba(80,70,50,0.015)" />
          </linearGradient>
        </defs>
        {/* Blue gradient triangle */}
        <polygon points="0,100 100,100 100,0" fill="url(#blueGrad)" />
        {/* White triangle with subtle glass blur at the split */}
        <polygon points="0,0 100,0 0,100" fill="#fff" />
        {/* Subtle, warm, realistic shadow along diagonal */}
        <polygon
          points="2,98 98,2 100,5 5,100"
          fill="url(#diagShadow)"
          style={{ filter: "blur(0.7px)" }}
        />
      </svg>
    </div>
  );
};

export default DiagonalSplitBackground;
