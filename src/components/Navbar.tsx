
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import Logo from './navbar/Logo';
import NavLinks from './navbar/NavLinks';
import NurseDropdown from './navbar/NurseDropdown';
import UserMenu from './navbar/UserMenu';
import MobileMenu from './navbar/MobileMenu';
import FloatingCta from './navbar/FloatingCta';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Check if we're on the home page
  const isHomePage = location.pathname === '/';
  
  // Check if we're on one of the nurses resources pages
  const isNursePage = location.pathname === '/malpractice-insurance' ||
                     location.pathname === '/llc-setup-help' ||
                     location.pathname === '/1099-tax-tips';
  
  // Text color should be dark on non-home pages or when scrolled
  const shouldUseDarkText = !isHomePage || isScrolled;
  
  useEffect(() => {
    const handleScroll = () => {
      // Only consider as scrolled if we're beyond certain height
      setIsScrolled(window.scrollY > window.innerHeight * 0.1);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    // Always set isScrolled to true for non-home pages to show dark text on light background
    if (!isHomePage) {
      setIsScrolled(true);
    }
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  const handleNavClick = (path) => {
    setIsOpen(false);
    navigate(path);
    window.scrollTo(0, 0);
  };

  const handleRequestNurse = () => {
    navigate('/apply');
    window.scrollTo(0, 0); // Scroll to top when navigating
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
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'
      )}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Logo shouldUseDarkText={shouldUseDarkText} />
          
          {/* Desktop Navigation - centered */}
          <nav className="hidden lg:flex items-center space-x-10 flex-grow justify-center">
            <NavLinks shouldUseDarkText={shouldUseDarkText} />

            {/* For Nurses Dropdown */}
            <NurseDropdown 
              shouldUseDarkText={shouldUseDarkText} 
              handleApplyNowClick={handleApplyNowClick} 
            />
          </nav>
          
          {/* Authentication - Desktop */}
          <div className="hidden lg:flex items-center ml-auto">
            <UserMenu shouldUseDarkText={shouldUseDarkText} />
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className={cn(
              "lg:hidden focus:outline-none",
              shouldUseDarkText ? "text-gray-600" : "text-white"
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
          handleRequestNurse={handleRequestNurse}
        />
      </header>
      
      {/* Floating CTA Button */}
      <FloatingCta onClick={handleRequestNurse} />
    </>
  );
}
