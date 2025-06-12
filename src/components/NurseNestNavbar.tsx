
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { GlowEffect } from '@/components/ui/glow-effect';
import { Menu, X } from "lucide-react";
import NavLinks from '@/components/navbar/NavLinks';
import NurseDropdown from '@/components/navbar/NurseDropdown';
import CareServicesDropdown from '@/components/navbar/CareServicesDropdown';
import UserMenu from '@/components/navbar/UserMenu';
import MobileMenu from '@/components/navbar/MobileMenu';

interface NurseNestNavbarProps {
  isHomePage?: boolean;
}

export default function NurseNestNavbar({ isHomePage = false }: NurseNestNavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const isHomePageRoute = location.pathname === '/';
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleApplyNowClick = () => {
    if (!user) {
      navigate('/auth', { state: { redirectAfterAuth: 'https://www.nursenest.us/nurseapplication' } });
    } else {
      window.location.href = 'https://www.nursenest.us/nurseapplication';
    }
  };

  const handleRequestNurseClick = () => {
    navigate('/apply');
  };

  const shouldUseDarkText = isScrolled || !isHomePageRoute;

  return (
    <nav className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out',
      'mt-3 md:mt-4',
      isScrolled 
        ? 'bg-white/95 backdrop-blur-xl shadow-lg border border-gray-200/50 py-0 mx-4 rounded-2xl' 
        : isHomePageRoute
          ? 'bg-transparent border-transparent py-2 mx-4'
          : 'bg-white border-transparent py-0 mx-4'
    )}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => navigate('/')}
          >
            <span className="text-3xl md:text-4xl font-bold">
              <span className={cn(
                "transition-colors duration-300 ease-in-out",
                shouldUseDarkText ? "text-gray-800" : "text-white"
              )}>Nurse</span>
              <span className="text-[#9bcbff] transition-colors duration-300 ease-in-out">Nest</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            <NavLinks shouldUseDarkText={shouldUseDarkText} />
            <NurseDropdown shouldUseDarkText={shouldUseDarkText} handleApplyNowClick={handleApplyNowClick} />
            <CareServicesDropdown shouldUseDarkText={shouldUseDarkText} />
          </div>

          {/* Desktop Right Side Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <UserMenu shouldUseDarkText={shouldUseDarkText} />
            
            {/* Request a Nurse Button */}
            <div className="relative">
              <GlowEffect
                colors={['#9bcbff', '#3b82f6', '#7dd3fc', '#2563eb']}
                mode="colorShift"
                blur="medium"
                duration={4}
                scale={1.1}
                intensity={0.35}
              />
              <Button
                onClick={handleRequestNurseClick}
                className="relative bg-gradient-to-r from-[#9bcbff] to-[#3b82f6] hover:from-[#7dd3fc] hover:to-[#2563eb] text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Request a Nurse
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn(
                "p-2 transition-colors duration-300",
                shouldUseDarkText ? "text-gray-800" : "text-white"
              )}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
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
