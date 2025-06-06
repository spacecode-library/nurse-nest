
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import NavLinks from './navbar/NavLinks';
import NurseDropdown from './navbar/NurseDropdown';
import UserMenu from './navbar/UserMenu';
import MobileMenu from './navbar/MobileMenu';

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
      setIsScrolled(window.scrollY > window.innerHeight * 0.1);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    // For non-home pages, always show white background
    if (!isHomePageRoute) {
      setIsScrolled(true);
    }
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePageRoute]);

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
  
  return (
    <>
      <header className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        isScrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200 py-3 mx-4 mt-4 rounded-2xl' 
          : isHomePageRoute
            ? 'bg-transparent py-4'
            : 'bg-white py-4'
      )}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          {/* Logo with NurseNest styling */}
          <div className="flex items-center">
            <span className="text-2xl font-bold">
              <span className={cn(
                isScrolled || !isHomePageRoute ? "text-gray-800" : "text-white"
              )}>Nurse</span>
              <span className="text-brand-primary">Nest</span>
            </span>
          </div>
          
          {/* Desktop Navigation - centered */}
          <nav className="hidden lg:flex items-center space-x-10 flex-grow justify-center">
            <NavLinks shouldUseDarkText={isScrolled || !isHomePageRoute} />

            {/* For Nurses Dropdown */}
            <NurseDropdown 
              shouldUseDarkText={isScrolled || !isHomePageRoute} 
              handleApplyNowClick={handleApplyNowClick} 
            />
          </nav>
          
          {/* Authentication - Desktop */}
          <div className="hidden lg:flex items-center ml-auto">
            <UserMenu shouldUseDarkText={isScrolled || !isHomePageRoute} />
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className={cn(
              "lg:hidden focus:outline-none p-2 rounded-xl transition-all duration-300",
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
          handleRequestNurse={() => navigate('/apply')}
        />
      </header>
    </>
  );
}
