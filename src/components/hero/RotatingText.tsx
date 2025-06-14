
import { motion } from "framer-motion";
import { ANIMATION_CONFIG } from "./constants";
import { RotatingTextProps } from "./types";

export function RotatingText({ titles, titleNumber, isMobile }: RotatingTextProps) {
  const getAnimationProps = (index: number) => ({
    initial: { opacity: 0, y: isMobile ? 16 : 32 },
    transition: ANIMATION_CONFIG.animationTransition,
    animate: titleNumber === index 
      ? { y: 0, opacity: 1 }
      : { y: titleNumber > index ? (isMobile ? -16 : -32) : (isMobile ? 16 : 32), opacity: 0 }
  });

  if (isMobile) {
    return (
      <div 
        className="relative w-full mb-2 flex items-center justify-start"
        style={{ 
          height: `${ANIMATION_CONFIG.mobileRotatingTextHeight}px`,
          overflow: 'hidden'
        }}
      >
        <span className="text-white">&nbsp;</span>
        {titles.map((title, index) => (
          <motion.span
            key={index}
            className="absolute font-semibold text-blue-300 left-0 top-1/2 w-max leading-none"
            style={{ transform: 'translateY(-50%)' }}
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
            width: 'auto',
            minWidth: '200px',
            height: `${ANIMATION_CONFIG.desktopRotatingTextHeight}px`,
            overflow: 'hidden'
          }}
        >
          {titles.map((title, index) => (
            <motion.span
              key={index}
              className="absolute top-1/2 left-0 font-semibold text-blue-300 whitespace-nowrap leading-none"
              style={{ transform: 'translateY(-50%)' }}
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
