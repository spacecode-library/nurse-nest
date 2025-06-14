import { motion } from "framer-motion";
import { ANIMATION_CONFIG } from "./constants";
import { RotatingTextProps } from "./types";

export function RotatingText({ titles, titleNumber, isMobile }: RotatingTextProps) {
  // Use 'spring' animation for rotating text
  const transition = ANIMATION_CONFIG.animationTransition;

  // Always use these values for y for consistent motion effect
  const OUT_Y = 150;
  const IN_Y = 0;
  const OUT_NEG_Y = -150;

  const getAnimationProps = (index: number) => ({
    initial: { opacity: 0, y: OUT_Y },
    transition,
    animate:
      titleNumber === index
        ? { y: IN_Y, opacity: 1, transition }
        : {
            y: titleNumber > index ? OUT_NEG_Y : OUT_Y,
            opacity: 0,
            transition
          }
  });

  // MOBILE: Keep as previously implemented
  if (isMobile) {
    return (
      <div
        className="relative w-full mb-2"
        style={{
          height: `${ANIMATION_CONFIG.mobileRotatingTextHeight}px`,
          overflow: 'hidden'
        }}
      >
        <span className="text-white">&nbsp;</span>
        {titles.map((title, index) => (
          <motion.span
            key={index}
            className="absolute font-semibold text-blue-300 left-0 top-0 w-max leading-tight py-1"
            {...getAnimationProps(index)}
          >
            {title}
          </motion.span>
        ))}
      </div>
    );
  }

  // DESKTOP: Simplified - inline container, fixed width, no vertical shifting, baseline aligned
  return (
    <span
      className="relative inline-block align-middle"
      style={{
        width: `${ANIMATION_CONFIG.desktopRotatingTextWidth}px`,
        height: `${ANIMATION_CONFIG.desktopRotatingTextHeight}px`,
        overflow: 'hidden',
        verticalAlign: 'middle',
      }}
    >
      {/* avoid shifting the nurse? text */}
      {titles.map((title, index) => (
        <motion.span
          key={index}
          className="absolute left-0 top-0 font-semibold text-blue-300 whitespace-nowrap leading-tight py-1"
          style={{
            // Only move vertically if needed for animation, but keep baseline as normal
            // (title is positioned at top:0, so text sits at baseline)
          }}
          {...getAnimationProps(index)}
        >
          {title}
        </motion.span>
      ))}
    </span>
  );
}
