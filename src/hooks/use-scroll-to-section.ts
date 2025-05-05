
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export function useScrollToSection() {
  const navigate = useNavigate();

  const scrollToSection = useCallback((path: string) => {
    if (path.includes('#')) {
      const [routePath, sectionId] = path.split('#');
      
      // If we're already on the correct route
      if (window.location.pathname === routePath || (routePath === '' && window.location.pathname === '/')) {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        // Navigate to the route first, then scroll
        navigate(routePath);
        // Set a small timeout to allow the page to load before scrolling
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    } else {
      navigate(path);
    }
  }, [navigate]);

  return scrollToSection;
}
