
import { motion } from "framer-motion";
import { ANIMATION_CONFIG } from "./constants";
import { RotatingTextProps } from "./types";

export function RotatingText({ titles, titleNumber, isMobile }: RotatingTextProps) {
  // Use spring animation for rotating text
  const transition = ANIMATION_CONFIG.animationTransition;
  const motionDistance = isMobile ? 28 : 64;

  const getAnimationProps = (index: number) => ({
    initial: { opacity: 0, y: -100 },
    transition,
    animate:
      titleNumber === index
        ? { y: 0, opacity: 1, transition }
        : {
            y: titleNumber > index ? -motionDistance * 2 : motionDistance * 2,
            opacity: 0,
            transition
          }
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
