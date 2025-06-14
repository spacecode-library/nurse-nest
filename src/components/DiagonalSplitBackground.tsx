
import React from "react";

/**
 * DiagonalSplitBackground renders a static, full-viewport diagonal split background:
 * Top-left is #9bcbff, bottom-right is white.
 * Only render in mobile (use with lg:hidden).
 */
const DiagonalSplitBackground: React.FC = () => {
  return (
    <div
      className="fixed inset-0 z-0 w-full h-full pointer-events-none select-none"
      aria-hidden="true"
      style={{
        background: "linear-gradient(135deg, #9bcbff 53%, #fff 53%)",
        // Adjustable split percentage based on design aesthetics (53% for visual match)
        minHeight: "100vh",
      }}
    />
  );
};

export default DiagonalSplitBackground;
