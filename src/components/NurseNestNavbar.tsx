
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { GlowEffect } from '@/components/ui/glow-effect';
import { Menu, X, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

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
            {/* Home */}
            <button
              onClick={() => navigate('/')}
              className={cn(
                "font-medium transition-colors duration-300 ease-in-out hover:scale-105",
                shouldUseDarkText
                  ? "text-gray-700 hover:text-[#3b82f6]" 
                  : "text-white hover:text-[#9bcbff]"
              )}
            >
              Home
            </button>

            {/* Pricing */}
            <button
              onClick={() => navigate('/pricing')}
              className={cn(
                "font-medium transition-colors duration-300 ease-in-out hover:scale-105",
                shouldUseDarkText
                  ? "text-gray-700 hover:text-[#3b82f6]" 
                  : "text-white hover:text-[#9bcbff]"
              )}
            >
              Pricing
            </button>

            {/* For Nurses Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button 
                  className={cn(
                    "font-medium flex items-center transition-colors duration-300 ease-in-out hover:scale-105",
                    shouldUseDarkText
                      ? "text-gray-700 hover:text-[#3b82f6]" 
                      : "text-white hover:text-[#9bcbff]"
                  )}
                >
                  For Nurses <ChevronDown className="ml-1 h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white shadow-lg rounded-md border border-gray-100 w-64 z-50">
                <DropdownMenuItem className="cursor-pointer hover:bg-[#f0f9ff] px-4 py-2" onClick={handleApplyNowClick}>
                  Apply Now
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-[#f0f9ff] px-4 py-2" onClick={() => navigate('/nurse-llc-setup-guide')}>
                  LLC Setup Guide
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-[#f0f9ff] px-4 py-2" onClick={() => navigate('/get-ein-nurse-business')}>
                  EIN Applications
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-[#f0f9ff] px-4 py-2" onClick={() => navigate('/business-bank-account-for-nurses')}>
                  Business Banking
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-[#f0f9ff] px-4 py-2" onClick={() => navigate('/malpractice-insurance-for-nurses')}>
                  Malpractice Insurance
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-[#f0f9ff] px-4 py-2" onClick={() => navigate('/1099-tax-tips')}>
                  1099 Tax Tips
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Care Services Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button 
                  className={cn(
                    "font-medium flex items-center transition-colors duration-300 ease-in-out hover:scale-105",
                    shouldUseDarkText
                      ? "text-gray-700 hover:text-[#3b82f6]" 
                      : "text-white hover:text-[#9bcbff]"
                  )}
                >
                  Care Services <ChevronDown className="ml-1 h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white shadow-lg rounded-md border border-gray-100 w-64 z-50">
                <DropdownMenuItem className="cursor-pointer hover:bg-[#f0f9ff] px-4 py-2" onClick={() => navigate('/newborn-nurse-support-guide')}>
                  Newborn Care
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-[#f0f9ff] px-4 py-2" onClick={() => navigate('/elderly-care-nurse-services')}>
                  Elderly Care
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-[#f0f9ff] px-4 py-2" onClick={() => navigate('/wound-care-nursing-guide')}>
                  Wound Care
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-[#f0f9ff] px-4 py-2" onClick={() => navigate('/best-products-for-home-healthcare')}>
                  Product Reviews
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Desktop Right Side Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Sign In Button */}
            {user ? (
              <Button
                onClick={() => navigate('/dashboard')}
                variant="ghost"
                className={cn(
                  "transition-colors duration-300 ease-in-out",
                  shouldUseDarkText
                    ? "text-gray-700 hover:text-brand-primary hover:bg-neutral-light" 
                    : "text-white hover:text-blue-200 hover:bg-white/10"
                )}
              >
                Dashboard
              </Button>
            ) : (
              <Button
                onClick={() => navigate('/auth')}
                variant="outline"
                className={cn(
                  "transition-colors duration-300 ease-in-out border",
                  shouldUseDarkText
                    ? "text-gray-700 border-gray-300 hover:bg-gray-50" 
                    : "text-white border-white/30 hover:bg-white/10"
                )}
              >
                Sign In
              </Button>
            )}
            
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
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl shadow-lg border-t border-gray-200/50 mx-4 rounded-b-2xl z-40">
            <div className="px-6 py-4 space-y-4">
              {/* Mobile Navigation Links */}
              <div className="space-y-3">
                <button
                  onClick={() => {
                    navigate('/');
                    setIsMobileMenuOpen(false);
                  }}
                  className="block font-medium text-gray-700 hover:text-brand-primary"
                >
                  Home
                </button>
                <button
                  onClick={() => {
                    navigate('/pricing');
                    setIsMobileMenuOpen(false);
                  }}
                  className="block font-medium text-gray-700 hover:text-brand-primary"
                >
                  Pricing
                </button>
                
                {/* For Nurses Mobile */}
                <div className="border-t pt-3">
                  <p className="font-medium text-gray-700 mb-2">For Nurses</p>
                  <div className="ml-4 space-y-2">
                    <button
                      onClick={() => {
                        handleApplyNowClick();
                        setIsMobileMenuOpen(false);
                      }}
                      className="block font-medium text-gray-600 hover:text-brand-primary"
                    >
                      Apply Now
                    </button>
                    <button
                      onClick={() => {
                        navigate('/nurse-llc-setup-guide');
                        setIsMobileMenuOpen(false);
                      }}
                      className="block font-medium text-gray-600 hover:text-brand-primary"
                    >
                      LLC Setup Guide
                    </button>
                    <button
                      onClick={() => {
                        navigate('/get-ein-nurse-business');
                        setIsMobileMenuOpen(false);
                      }}
                      className="block font-medium text-gray-600 hover:text-brand-primary"
                    >
                      EIN Applications
                    </button>
                    <button
                      onClick={() => {
                        navigate('/business-bank-account-for-nurses');
                        setIsMobileMenuOpen(false);
                      }}
                      className="block font-medium text-gray-600 hover:text-brand-primary"
                    >
                      Business Banking
                    </button>
                    <button
                      onClick={() => {
                        navigate('/malpractice-insurance-for-nurses');
                        setIsMobileMenuOpen(false);
                      }}
                      className="block font-medium text-gray-600 hover:text-brand-primary"
                    >
                      Malpractice Insurance
                    </button>
                    <button
                      onClick={() => {
                        navigate('/1099-tax-tips');
                        setIsMobileMenuOpen(false);
                      }}
                      className="block font-medium text-gray-600 hover:text-brand-primary"
                    >
                      1099 Tax Tips
                    </button>
                  </div>
                </div>

                {/* Care Services Mobile */}
                <div className="border-t pt-3">
                  <p className="font-medium text-gray-700 mb-2">Care Services</p>
                  <div className="ml-4 space-y-2">
                    <button
                      onClick={() => {
                        navigate('/newborn-nurse-support-guide');
                        setIsMobileMenuOpen(false);
                      }}
                      className="block font-medium text-gray-600 hover:text-brand-primary"
                    >
                      Newborn Care
                    </button>
                    <button
                      onClick={() => {
                        navigate('/elderly-care-nurse-services');
                        setIsMobileMenuOpen(false);
                      }}
                      className="block font-medium text-gray-600 hover:text-brand-primary"
                    >
                      Elderly Care
                    </button>
                    <button
                      onClick={() => {
                        navigate('/wound-care-nursing-guide');
                        setIsMobileMenuOpen(false);
                      }}
                      className="block font-medium text-gray-600 hover:text-brand-primary"
                    >
                      Wound Care
                    </button>
                    <button
                      onClick={() => {
                        navigate('/best-products-for-home-healthcare');
                        setIsMobileMenuOpen(false);
                      }}
                      className="block font-medium text-gray-600 hover:text-brand-primary"
                    >
                      Product Reviews
                    </button>
                  </div>
                </div>
              </div>

              {/* Mobile Auth & CTA Section */}
              <div className="border-t pt-4 space-y-3">
                {user ? (
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        navigate('/dashboard');
                        setIsMobileMenuOpen(false);
                      }}
                      className="block text-gray-700 hover:text-brand-primary font-medium"
                    >
                      Dashboard
                    </button>
                  </div>
                ) : (
                  <Button
                    onClick={() => {
                      navigate('/auth');
                      setIsMobileMenuOpen(false);
                    }}
                    variant="outline"
                    className="w-full text-gray-700 border-gray-300 hover:bg-gray-50"
                  >
                    Sign In
                  </Button>
                )}
                
                <div className="relative">
                  <GlowEffect
                    colors={['#9bcbff', '#3b82f6', '#7dd3fc', '#2563eb']}
                    mode="colorShift"
                    blur="medium"
                    duration={4}
                    scale={1.05}
                    intensity={0.3}
                  />
                  <Button
                    onClick={() => {
                      handleRequestNurseClick();
                      setIsMobileMenuOpen(false);
                    }}
                    className="relative w-full bg-gradient-to-r from-[#9bcbff] to-[#3b82f6] hover:from-[#7dd3fc] hover:to-[#2563eb] text-white font-semibold"
                  >
                    Request a Nurse
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
