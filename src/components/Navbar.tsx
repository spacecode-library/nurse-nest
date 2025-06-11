
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { GlowEffect } from '@/components/ui/glow-effect';
import NavLinks from './navbar/NavLinks';
import NurseDropdown from './navbar/NurseDropdown';
import UserMenu from './navbar/UserMenu';
import MobileMenu from './navbar/MobileMenu';
import CareServicesDropdown from './navbar/CareServicesDropdown';

interface NavbarProps {
  isHomePage?: boolean;
}

export default function Navbar({ isHomePage = false }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Check if we're on the home page
  const isHomePageRoute = location.pathname === '/';
  
  // Check if we're on one of the nurses resources pages
  const isNursePage = location.pathname === '/malpractice-insurance' ||
                     location.pathname === '/llc-setup-help' ||
                     location.pathname === '/1099-tax-tips';
  
  useEffect(() => {
    const handleScroll = () => {
      // Only consider as scrolled if we're beyond certain height
      setIsScrolled(window.scrollY > 100);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (path) => {
    setIsOpen(false);
    navigate(path);
    window.scrollTo(0, 0);
  };

  const handleApplyNowClick = () => {
    if (!user) {
      // If user is not logged in, redirect to auth page
      navigate('/auth', { state: { redirectAfterAuth: 'https://www.nursenest.us/nurseapplication' } });
    } else {
      // If user is logged in, redirect directly to the application
      window.location.href = 'https://www.nursenest.us/nurseapplication';
    }
  };

  const handleRequestNurseClick = () => {
    navigate('/apply');
  };
  
  return (
    <>
      <header className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out',
        isScrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-lg border border-gray-200/50 py-3 mx-4 mt-4 rounded-2xl' 
          : isHomePageRoute
            ? 'bg-transparent border-transparent py-6 mx-4 mt-4'
            : 'bg-white border-transparent py-4 mx-4'
      )}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          {/* Logo with NurseNest styling - Made bigger */}
          <div className="flex items-center">
            <span className="text-3xl md:text-4xl font-bold">
              <span className={cn(
                "transition-colors duration-300 ease-in-out",
                isScrolled || !isHomePageRoute ? "text-gray-800" : "text-white"
              )}>Nurse</span>
              <span className="text-[#9bcbff] transition-colors duration-300 ease-in-out">Nest</span>
            </span>
          </div>
          
          {/* Desktop Navigation - centered */}
          <nav className="hidden lg:flex items-center space-x-8 flex-grow justify-center">
            <NavLinks shouldUseDarkText={isScrolled || !isHomePageRoute} />

            {/* For Nurses Dropdown */}
            <NurseDropdown 
              shouldUseDarkText={isScrolled || !isHomePageRoute} 
              handleApplyNowClick={handleApplyNowClick} 
            />

            {/* Care Services Dropdown */}
            <CareServicesDropdown shouldUseDarkText={isScrolled || !isHomePageRoute} />
          </nav>
          
          {/* Authentication & CTA - Desktop */}
          <div className="hidden lg:flex items-center space-x-4 ml-auto">
            {/* Request a Nurse Button with Glow */}
            <div className="relative">
              <GlowEffect
                colors={['#9bcbff', '#3b82f6', '#7dd3fc', '#2563eb']}
                mode="colorShift"
                blur="medium"
                duration={4}
                scale={1.1}
              />
              <Button
                onClick={handleRequestNurseClick}
                className="relative bg-gradient-to-r from-[#9bcbff] to-[#3b82f6] hover:from-[#7dd3fc] hover:to-[#2563eb] text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Request a Nurse
              </Button>
            </div>
            
            <UserMenu shouldUseDarkText={isScrolled || !isHomePageRoute} />
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className={cn(
              "lg:hidden focus:outline-none p-2 rounded-xl transition-all duration-300 ease-in-out",
              isScrolled || !isHomePageRoute
                ? "text-brand-navy hover:bg-neutral-light" 
                : "text-white hover:bg-white/10"
            )}
            onClick={() => setIsOpen(!isOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
        
        {/* Mobile Menu */}
        <MobileMenu 
          isOpen={isOpen} 
          setIsOpen={setIsOpen} 
          isNursePage={isNursePage}
          handleApplyNowClick={handleApplyNowClick}
          handleRequestNurse={handleRequestNurseClick}
        />
      </header>
    </>
  );
}
