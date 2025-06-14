
import { motion } from "framer-motion";
import { ANIMATION_CONFIG } from "./constants";
import { RotatingTextProps } from "./types";

export function RotatingText({ titles, titleNumber, isMobile }: RotatingTextProps) {
  const getAnimationProps = (index: number) => ({
    initial: { opacity: 0, y: isMobile ? 28 : 64 },
    transition: ANIMATION_CONFIG.animationTransition,
    animate: titleNumber === index 
      ? { y: 0, opacity: 1 }
      : { y: titleNumber > index ? (isMobile ? -28 : -64) : (isMobile ? 28 : 64), opacity: 0 }
  });

  if (isMobile) {
    return (
      <div 
        className="relative w-full mb-2"
        style={{ 
          height: `${ANIMATION_CONFIG.mobileRotatingTextHeight}px`,
          overflow: 'visible' 
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

  return (
    <span className="text-white block">
      <span className="inline-block">
        <span className="text-white"> </span>
        <span 
          className="relative inline-block"
          style={{
            width: `${ANIMATION_CONFIG.desktopRotatingTextWidth}px`,
            height: `${ANIMATION_CONFIG.desktopRotatingTextHeight}px`,
            overflow: 'visible'
          }}
        >
          {titles.map((title, index) => (
            <motion.span
              key={index}
              className="absolute top-0 left-0 font-semibold text-blue-300 whitespace-nowrap leading-tight py-1"
              {...getAnimationProps(index)}
            >
              {title}
            </motion.span>
          ))}
        </span>
      </span>
    </span>
  );
}
