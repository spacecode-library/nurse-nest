
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, LogOut, LayoutDashboard, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import NavLinks from './NavLinks';

interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isNursePage: boolean;
  handleApplyNowClick: () => void;
  handleRequestNurse: () => void;
}

export default function MobileMenu({ 
  isOpen, 
  setIsOpen, 
  isNursePage,
  handleApplyNowClick,
  handleRequestNurse 
}: MobileMenuProps) {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  
  const handleNavClick = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };
  
  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };
  
  return (
    <div
      className={cn(
        'lg:hidden fixed inset-0 z-[99999] transform transition-all duration-300 ease-in-out',
        'md:hidden',
        isOpen ? 'right-0' : 'right-[-100%]'
      )}
      style={{
        position: 'fixed',
        right: isOpen ? '0' : '-100%',
        transition: 'right 0.3s ease',
        width: '100%',
        height: '100vh'
      }}
    >
      {/* Solid white background - no transparency */}
      <div className="absolute inset-0 bg-white"></div>
      
      {/* Menu content */}
      <div className="relative z-10 bg-white min-h-full container-custom py-5">
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-heading font-bold text-nurse-dark">
              Nurse <span className="text-primary-500">Nest</span>
            </span>
          </Link>
          
          <button 
            className="text-gray-600 focus:outline-none p-2 hover:bg-gray-100 rounded-lg z-50" 
            onClick={() => setIsOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="flex flex-col space-y-6">
          <NavLinks 
            shouldUseDarkText={true} 
            isMobile={true} 
            onNavClick={handleNavClick} 
          />
          
          {/* For Nurses Section in Mobile Menu */}
          <div className="border-t border-b border-gray-100 py-4 space-y-4">
            <h3 className="font-semibold text-gray-800">For Nurses</h3>
            <Link 
              to="#"
              className="font-medium text-gray-700 hover:text-primary-500 block pl-3"
              onClick={(e) => {
                e.preventDefault();
                setIsOpen(false);
                handleApplyNowClick();
              }}
            >
              Apply Now
            </Link>
            <Link 
              to="/malpractice-insurance"
              className="font-medium text-gray-700 hover:text-primary-500 block pl-3"
              onClick={() => setIsOpen(false)}
            >
              Malpractice Insurance
            </Link>
            <Link 
              to="/llc-setup-help"
              className="font-medium text-gray-700 hover:text-primary-500 block pl-3"
              onClick={() => setIsOpen(false)}
            >
              LLC Setup Help
            </Link>
            <Link 
              to="/1099-tax-tips"
              className="font-medium text-gray-700 hover:text-primary-500 block pl-3"
              onClick={() => setIsOpen(false)}
            >
              1099 Tax Tips
            </Link>
          </div>
          
          {user ? (
            <>
              <Link 
                to="/dashboard" 
                className="font-medium text-gray-700 hover:text-primary-500"
                onClick={() => setIsOpen(false)}
              >
                <LayoutDashboard className="h-4 w-4 mr-2 inline" />
                Dashboard
              </Link>
              <Button 
                variant="ghost" 
                className="justify-start px-0 text-gray-700 hover:text-primary-500"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </>
          ) : (
            <Link 
              to="/auth"
              className="font-medium text-gray-700 hover:text-primary-500"
              onClick={() => setIsOpen(false)}
            >
              Sign In
            </Link>
          )}
          
          {/* CTA Button - Only show if not on nurse pages */}
          {!isNursePage && (
            <button 
              className="bg-gradient-to-r from-[#9bcbff] to-[#3b82f6] hover:from-[#7dd3fc] hover:to-[#2563eb] text-white font-semibold px-6 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center w-full mt-4"
              onClick={() => {
                setIsOpen(false);
                handleRequestNurse();
              }}
            >
              Request a Nurse
              <div className="ml-3 w-6 h-6 bg-black rounded-full flex items-center justify-center">
                <ArrowRight className="h-3 w-3 text-white" />
              </div>
            </button>
          )}
        </nav>
      </div>
    </div>
  );
}
