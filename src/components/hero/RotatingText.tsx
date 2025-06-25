import { motion } from "framer-motion";
import { ANIMATION_CONFIG } from "./constants";
import { RotatingTextProps } from "./types";

export function RotatingText({ titles, titleNumber, isMobile }: RotatingTextProps) {
  // Use 'spring' animation for rotating text with extra smooth transition
  const transition = { ...ANIMATION_CONFIG.animationTransition, damping: 14, mass: 0.6, velocity: 0.8 };

  // Slightly more movement for premium feel
  const OUT_Y = isMobile ? 48 : 128;
  const IN_Y = 0;
  const OUT_NEG_Y = isMobile ? -48 : -128;

  const getAnimationProps = (index: number) => ({
    initial: { opacity: 0, y: OUT_Y, scale: 0.98 },
    transition,
    animate:
      titleNumber === index
        ? { y: IN_Y, opacity: 1, scale: 1, transition }
        : {
            y: titleNumber > index ? OUT_NEG_Y : OUT_Y,
            opacity: 0,
            scale: 0.96,
            transition
          }
  });

  // MOBILE: Container taller, no margin bottom
  if (isMobile) {
    return (
      <div
        className="relative w-full"
        style={{
          height: `${ANIMATION_CONFIG.mobileRotatingTextHeight}px`,
          overflow: 'hidden'
        }}
      >
        <span className="text-white">&nbsp;</span>
        {titles.map((title, index) => (
          <motion.span
            key={index}
            className="absolute font-semibold text-[#9bcbff] drop-shadow-md left-0 top-0 w-max leading-none py-1"
            {...getAnimationProps(index)}
          >
            {title}
          </motion.span>
        ))}
      </div>
    );
  }

  // DESKTOP: Keep as previously implemented (shorter height!)
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
          className="absolute left-0 top-0 font-semibold text-[#9bcbff] drop-shadow-md whitespace-nowrap leading-none py-1"
          {...getAnimationProps(index)}
        >
          {title}
        </motion.span>
      ))}
    </span>
  );
}
