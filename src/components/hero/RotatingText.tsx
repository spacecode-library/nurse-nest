
import { motion } from "framer-motion";
import { ANIMATION_CONFIG, NURSING_TITLES } from "./constants";
import { RotatingTextProps } from "./types";
import React, { useMemo } from "react";

/**
 * Calculate the pixel width of the given titles using a canvas measurement method.
 * This allows us to assign container width dynamically based on the longest title.
 */
function useLongestTitleWidth(titles: string[], isMobile: boolean): number {
  return useMemo(() => {
    // Find the longest title string
    const longest = titles.reduce((a, b) => (a.length > b.length ? a : b), "");
    // Create a canvas for measurement
    const canvas: HTMLCanvasElement = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) return 200;
    // Font should match the hero's font
    context.font = isMobile ? "600 2.25rem Inter,sans-serif" : "600 4rem Inter,sans-serif";
    // Add extra padding to account for font variations & renders
    const padding = isMobile ? 24 : 36;
    return Math.ceil(context.measureText(longest).width + padding);
  }, [titles, isMobile]);
}

export function RotatingText({ titles, titleNumber, isMobile }: RotatingTextProps) {
  // Use all possible titles for width calculation for consistency
  const allTitles = useMemo(
    () => Array.isArray(titles) && titles.length > 0 ? titles : NURSING_TITLES,
    [titles]
  );

  // SSR fallback: static width, update on client mount
  const [ssrWidth, setSsrWidth] = React.useState(() => (isMobile ? 200 : 370));
  const width = useLongestTitleWidth(allTitles, Boolean(isMobile)) || ssrWidth;
  React.useEffect(() => {
    setSsrWidth(width);
  }, [width]);

  const getAnimationProps = (index: number) => ({
    initial: { opacity: 0, y: isMobile ? 28 : 64 },
    transition: ANIMATION_CONFIG.animationTransition,
    animate:
      titleNumber === index
        ? { y: 0, opacity: 1 }
        : { y: titleNumber > index ? (isMobile ? -28 : -64) : (isMobile ? 28 : 64), opacity: 0 }
  });

  if (isMobile) {
    return (
      <div
        className="relative w-full mb-2"
        style={{
          height: `${ANIMATION_CONFIG.mobileRotatingTextHeight}px`,
          minWidth: 0,
          maxWidth: "100vw",
        }}
      >
        <span className="text-white">&nbsp;</span>
        {titles.map((title, index) => (
          <motion.span
            key={index}
            className="absolute font-semibold text-blue-300 left-0 top-0 w-max leading-tight py-1 px-2 bg-blue-950 bg-opacity-50 rounded"
            {...getAnimationProps(index)}
            style={{
              minWidth: width,
              whiteSpace: "nowrap",
              boxSizing: "border-box",
            }}
          >
            {title}
          </motion.span>
        ))}
      </div>
    );
  }

  return (
    <span className="text-white block">
      <span className="inline-block">
        <span className="text-white"> </span>
        <span
          className="relative inline-block"
          style={{
            width,
            height: `${ANIMATION_CONFIG.desktopRotatingTextHeight}px`,
            minWidth: "max-content",
            overflow: "visible",
          }}
        >
          {titles.map((title, index) => (
            <motion.span
              key={index}
              className="absolute top-0 left-0 font-semibold text-blue-300 whitespace-nowrap leading-tight py-1 px-3 bg-blue-950 bg-opacity-50 rounded"
              {...getAnimationProps(index)}
              style={{
                minWidth: width,
                whiteSpace: "nowrap",
                boxSizing: "border-box",
              }}
            >
              {title}
            </motion.span>
          ))}
        </span>
      </span>
    </span>
  );
}
