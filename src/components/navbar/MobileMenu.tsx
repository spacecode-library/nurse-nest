
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, LogOut, LayoutDashboard } from 'lucide-react';
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
        'lg:hidden fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out',
        isOpen ? 'translate-x-0' : 'translate-x-full'
      )}
    >
      {/* Solid white background overlay that completely covers background content */}
      <div className="absolute inset-0 bg-white z-40"></div>
      
      <div className="relative z-50 container-custom py-5 h-full bg-white">
        <div className="flex items-center justify-between mb-8">
          {/* Single NurseNest logo - removed duplicate */}
          <div className="flex items-center">
            <span className="text-2xl font-bold">
              <span className="text-gray-800">Nurse</span>
              <span className="text-[#9bcbff]">Nest</span>
            </span>
          </div>
          
          {/* Close button with better visibility */}
          <button 
            className="text-gray-600 hover:text-gray-800 focus:outline-none p-2 rounded-lg hover:bg-gray-100 transition-colors" 
            onClick={() => setIsOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        {/* Navigation with improved spacing and styling */}
        <nav className="flex flex-col space-y-6">
          <NavLinks 
            shouldUseDarkText={true} 
            isMobile={true} 
            onNavClick={handleNavClick} 
          />
          
          {/* For Nurses Section with better visual separation */}
          <div className="border-t border-b border-gray-200 py-6 space-y-4">
            <h3 className="font-semibold text-gray-800 text-lg">For Nurses</h3>
            <div className="space-y-3 pl-3">
              <Link 
                to="#"
                className="font-medium text-gray-700 hover:text-primary-500 block py-2 transition-colors"
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
                className="font-medium text-gray-700 hover:text-primary-500 block py-2 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Malpractice Insurance
              </Link>
              <Link 
                to="/llc-setup-help"
                className="font-medium text-gray-700 hover:text-primary-500 block py-2 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                LLC Setup Help
              </Link>
              <Link 
                to="/1099-tax-tips"
                className="font-medium text-gray-700 hover:text-primary-500 block py-2 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                1099 Tax Tips
              </Link>
            </div>
          </div>
          
          {/* User authentication section with improved styling */}
          <div className="space-y-4">
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="font-medium text-gray-700 hover:text-primary-500 flex items-center py-2 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <LayoutDashboard className="h-5 w-5 mr-3" />
                  Dashboard
                </Link>
                <Button 
                  variant="ghost" 
                  className="justify-start px-0 text-gray-700 hover:text-primary-500 w-full"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Link 
                to="/auth"
                className="font-medium text-gray-700 hover:text-primary-500 block py-2 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
          
          {/* CTA Button with improved styling */}
          {!isNursePage && (
            <div className="pt-6 border-t border-gray-200">
              <Button 
                className="bg-primary-500 hover:bg-primary-600 w-full py-3 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => {
                  setIsOpen(false);
                  handleRequestNurse();
                }}
              >
                Request a Nurse
              </Button>
            </div>
          )}
        </nav>
      </div>
    </div>
  );
}
