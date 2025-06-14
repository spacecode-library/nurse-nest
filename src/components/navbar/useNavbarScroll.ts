
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export function useNavbarScroll() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showNavbarButton, setShowNavbarButton] = useState(false);
  const location = useLocation();

  const isHomePageRoute = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isHomePageRoute) {
      setShowNavbarButton(true);
      return;
    }
    const heroSection = document.querySelector("section");
    if (!heroSection) return;

    const observer = new window.IntersectionObserver(
      ([entry]) => {
        setShowNavbarButton(!entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: "-10% 0px -10% 0px",
      }
    );
    observer.observe(heroSection as Element);
    return () => observer.disconnect();
  }, [isHomePageRoute]);

  return { isScrolled, showNavbarButton, isHomePageRoute };
}
