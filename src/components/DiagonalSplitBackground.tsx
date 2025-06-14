
import React from "react";

/**
 * DiagonalSplitBackground renders a sharp, corner-to-corner, bottom-left to top-right diagonal,
 * evenly splitting background as blue (bottom-left half) and white (top-right half).
 * Only render in mobile/tablet (use with lg:hidden).
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
        {/* Blue triangle: bottom-left to top-right (points: bottom-left, bottom-right, top-right) */}
        <polygon points="0,100 100,100 100,0" fill="#9bcbff" />
        {/* White triangle: top-left, top-right, bottom-left */}
        <polygon points="0,0 100,0 0,100" fill="#fff" />
      </svg>
    </div>
  );
};

export default DiagonalSplitBackground;

