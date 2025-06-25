
import React from "react";

interface LuxIconProps {
  children: React.ReactNode;
}

/**
 * Wraps an icon (lucide) in a span with a luxurious interaction/hover effect.
 * Use: <LuxIcon><Pill ... /></LuxIcon>
 */
export const LuxIcon = ({ children }: LuxIconProps) => (
  <span className="lux-icon-wrapper">{children}</span>
);

// Add CSS for .lux-icon-wrapper and hover effect in index.css
