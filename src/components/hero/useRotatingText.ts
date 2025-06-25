
import { useEffect, useMemo, useState } from "react";
import { NURSING_TITLES, ANIMATION_CONFIG } from "./constants";

export function useRotatingText() {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(() => NURSING_TITLES, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setTitleNumber(prev => prev === titles.length - 1 ? 0 : prev + 1);
    }, ANIMATION_CONFIG.rotationInterval);
    
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return { titleNumber, titles };
}
