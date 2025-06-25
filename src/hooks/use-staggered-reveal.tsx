
import { useEffect, useState } from "react";

/**
 * Returns a boolean array of length N, where each value turns true staggered over time.
 * Used for luxury fade-in or stagger reveals (cards, hero titles, etc).
 */
export function useStaggeredReveal(count: number, {
  initialDelay = 120,
  step = 120,
  disabled = false
}: { initialDelay?: number; step?: number; disabled?: boolean } = {}) {
  const [revealed, setRevealed] = useState(() => Array(count).fill(false));

  useEffect(() => {
    if (disabled) {
      setRevealed(Array(count).fill(true));
      return;
    }
    let timeouts: NodeJS.Timeout[] = [];
    for (let i = 0; i < count; i++) {
      timeouts.push(
        setTimeout(() => {
          setRevealed(rev => {
            const next = [...rev];
            next[i] = true;
            return next;
          });
        }, initialDelay + i * step)
      );
    }
    return () => timeouts.forEach(clearTimeout);
  }, [count, initialDelay, step, disabled]);

  return revealed;
}
