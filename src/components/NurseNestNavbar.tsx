
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import MobileMenu from "@/components/navbar/MobileMenu";
import { useNavbarScroll } from "./navbar/useNavbarScroll";
import { useNavbarActions } from "./navbar/useNavbarActions";
import { DesktopNavigation } from "./navbar/DesktopNavigation";
import { NavbarActions } from "./navbar/NavbarActions";

interface NurseNestNavbarProps {
  isHomePage?: boolean;
}

export default function NurseNestNavbar({ isHomePage = false }: NurseNestNavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { isScrolled, showNavbarButton, isHomePageRoute } = useNavbarScroll();
  const { handleApplyNowClick, handleRequestNurseClick } = useNavbarActions();

  const shouldUseDarkText = isScrolled || !isHomePageRoute;

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
        "mt-3 md:mt-4",
        isScrolled
          ? "bg-white/95 backdrop-blur-xl shadow-lg border border-gray-200/50 py-0 mx-4 rounded-2xl"
          : isHomePageRoute
          ? "bg-transparent border-transparent py-2 mx-4"
          : "bg-white border-transparent py-0 mx-4"
      )}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            className="flex items-center cursor-pointer focus:outline-none focus-visible:outline-none"
            onClick={() => (window.location.href = "/")}
            tabIndex={0}
          >
            <span className="text-3xl md:text-4xl font-bold">
              <span
                className={cn(
                  "transition-colors duration-300 ease-in-out",
                  shouldUseDarkText ? "text-gray-800" : "text-white"
                )}
              >
                Nurse
              </span>
              <span className="text-[#9bcbff] transition-colors duration-300 ease-in-out">
                Nest
              </span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <DesktopNavigation
            shouldUseDarkText={shouldUseDarkText}
            handleApplyNowClick={handleApplyNowClick}
          />

          {/* Desktop Right Side Buttons */}
          <NavbarActions
            shouldUseDarkText={shouldUseDarkText}
            showNavbarButton={showNavbarButton}
            handleRequestNurseClick={handleRequestNurseClick}
          />

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn(
                "p-2 transition-colors duration-300 focus:outline-none focus-visible:outline-none",
                shouldUseDarkText ? "text-gray-800" : "text-white"
              )}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <MobileMenu
          isOpen={isMobileMenuOpen}
          setIsOpen={setIsMobileMenuOpen}
          isNursePage={isHomePageRoute}
          handleApplyNowClick={handleApplyNowClick}
          handleRequestNurse={handleRequestNurseClick}
        />
      </div>
    </nav>
  );
}
