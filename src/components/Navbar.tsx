import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, Heart, Shield, Users, Stethoscope } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import NavLinks from './navbar/NavLinks';
import NurseDropdown from './navbar/NurseDropdown';
import UserMenu from './navbar/UserMenu';
import MobileMenu from './navbar/MobileMenu';
import FloatingCta from './navbar/FloatingCta';

interface NavbarProps {
  isHomePage?: boolean;
}

// Premium Logo Component
function PremiumLogo({ shouldUseDarkText }: { shouldUseDarkText: boolean }) {
  const navigate = useNavigate();
  
  return (
    <button 
      onClick={() => navigate('/')}
      className="flex items-center space-x-3 group transition-all duration-300 hover:scale-105"
    >
      {/* Logo Icon */}
      <div className={cn(
        "w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg group-hover:shadow-xl",
        shouldUseDarkText 
          ? "bg-gradient-to-br from-blue-600 to-teal-600" 
          : "bg-gradient-to-br from-blue-500 to-teal-500 group-hover:from-blue-400 group-hover:to-teal-400"
      )}>
        <Heart className="h-5 w-5 text-white" />
      </div>
      
      {/* Logo Text */}
      <div className="flex flex-col items-start">
        <h1 className={cn(
          "text-2xl font-bold tracking-tight transition-colors duration-300",
          shouldUseDarkText 
            ? "bg-gradient-to-r from-slate-800 via-blue-700 to-teal-700 bg-clip-text text-transparent" 
            : "text-white group-hover:text-blue-100"
        )}>
          NurseNest
        </h1>
        <span className={cn(
          "text-xs font-medium tracking-wider transition-colors duration-300",
          shouldUseDarkText ? "text-slate-500" : "text-blue-200/80"
        )}>
          HEALTHCARE MARKETPLACE
        </span>
      </div>
    </button>
  );
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
  
  // Text color should be dark on non-home pages or when scrolled
  const shouldUseDarkText = !isHomePageRoute || isScrolled;
  
  useEffect(() => {
    const handleScroll = () => {
      // Only consider as scrolled if we're beyond certain height
      setIsScrolled(window.scrollY > window.innerHeight * 0.1);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    // Always set isScrolled to true for non-home pages to show dark text on light background
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
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        isScrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-xl border-b border-slate-200/50 py-3' 
          : 'bg-transparent py-5'
      )}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          {/* Premium Logo */}
          <PremiumLogo shouldUseDarkText={shouldUseDarkText} />
          
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
              "lg:hidden focus:outline-none p-2 rounded-xl transition-all duration-300",
              shouldUseDarkText 
                ? "text-slate-600 hover:bg-slate-100" 
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
          handleRequestNurse={handleRequestNurse}
        />
      </header>
      
      {/* Floating CTA Button - Only show if not on the home page */}
      {!isHomePage && <FloatingCta onClick={handleRequestNurse} />}
    </>
  );
}