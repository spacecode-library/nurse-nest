
import { useEffect, useState } from "react";

// Hook: Returns true if user has scrolled past `triggerPx` vertical offset (default: 70% viewport height)
export function useFadeInOnScroll(triggerPx?: number) {
  const [fadedIn, setFadedIn] = useState(false);

  useEffect(() => {
    // Default trigger is 65% of window.innerHeight (just below the hero)
    const scrollTrigger = typeof triggerPx === "number" ? triggerPx : Math.round(window.innerHeight * 0.65);

    function onScroll() {
      // Scroll Y past the trigger
      if (window.scrollY >= scrollTrigger) setFadedIn(true);
      else setFadedIn(false);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // initial
    return () => window.removeEventListener("scroll", onScroll);
  }, [triggerPx]);

  return fadedIn;
}
