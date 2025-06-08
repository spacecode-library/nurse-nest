
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import NavLinks from './NavLinks';

interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isNursePage?: boolean;
  handleApplyNowClick: () => void;
  handleRequestNurse: () => void;
}

export default function MobileMenu({ 
  isOpen, 
  setIsOpen, 
  isNursePage = false,
  handleApplyNowClick,
  handleRequestNurse
}: MobileMenuProps) {
  const [nurseDropdownOpen, setNurseDropdownOpen] = useState(false);
  const [careDropdownOpen, setCareDropdownOpen] = useState(false);

  const handleNavClick = (path: string) => {
    setIsOpen(false);
    window.scrollTo(0, 0);
  };

  if (!isOpen) return null;

  return (
    <div className={cn(
      "lg:hidden fixed inset-0 z-50 transition-all duration-300",
      isOpen ? "opacity-100 visible" : "opacity-0 invisible"
    )}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50" 
        onClick={() => setIsOpen(false)}
      />
      
      {/* Menu Panel - Ensure solid white background */}
      <div className={cn(
        "absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-xl transform transition-transform duration-300",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white">
            <h2 className="text-xl font-semibold text-gray-900">Menu</h2>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto bg-white">
            <nav className="p-6 space-y-6">
              <NavLinks 
                shouldUseDarkText={true} 
                isMobile={true}
                onNavClick={handleNavClick}
              />
              
              {/* For Nurses Dropdown */}
              <div className="space-y-3">
                <button
                  onClick={() => setNurseDropdownOpen(!nurseDropdownOpen)}
                  className="flex items-center justify-between w-full text-left font-medium text-gray-700 hover:text-brand-primary transition-colors"
                >
                  For Nurses
                  <ChevronDown className={cn(
                    "h-4 w-4 transition-transform",
                    nurseDropdownOpen && "transform rotate-180"
                  )} />
                </button>
                
                {nurseDropdownOpen && (
                  <div className="ml-4 space-y-3 border-l-2 border-gray-100 pl-4">
                    <button
                      onClick={handleApplyNowClick}
                      className="block text-gray-600 hover:text-brand-primary transition-colors"
                    >
                      Apply Now
                    </button>
                    <Link 
                      to="/malpractice-insurance"
                      onClick={() => handleNavClick('/malpractice-insurance')}
                      className="block text-gray-600 hover:text-brand-primary transition-colors"
                    >
                      Malpractice Insurance
                    </Link>
                    <Link 
                      to="/llc-setup-help"
                      onClick={() => handleNavClick('/llc-setup-help')}
                      className="block text-gray-600 hover:text-brand-primary transition-colors"
                    >
                      LLC Setup Help
                    </Link>
                    <Link 
                      to="/1099-tax-tips"
                      onClick={() => handleNavClick('/1099-tax-tips')}
                      className="block text-gray-600 hover:text-brand-primary transition-colors"
                    >
                      1099 Tax Tips
                    </Link>
                  </div>
                )}
              </div>

              {/* Care Services Dropdown */}
              <div className="space-y-3">
                <button
                  onClick={() => setCareDropdownOpen(!careDropdownOpen)}
                  className="flex items-center justify-between w-full text-left font-medium text-gray-700 hover:text-brand-primary transition-colors"
                >
                  Care Services
                  <ChevronDown className={cn(
                    "h-4 w-4 transition-transform",
                    careDropdownOpen && "transform rotate-180"
                  )} />
                </button>
                
                {careDropdownOpen && (
                  <div className="ml-4 space-y-3 border-l-2 border-gray-100 pl-4">
                    <span className="block text-gray-600">
                      Home Care Services
                    </span>
                    <span className="block text-gray-600">
                      Post-Surgery Support
                    </span>
                    <span className="block text-gray-600">
                      Chronic Disease Management
                    </span>
                    <span className="block text-gray-600">
                      Medication Management
                    </span>
                  </div>
                )}
              </div>
            </nav>
          </div>
          
          {/* Action Buttons */}
          <div className="p-6 bg-white border-t border-gray-100 space-y-3">
            <Button
              onClick={handleRequestNurse}
              className="w-full bg-gradient-to-r from-[#9bcbff] to-[#3b82f6] hover:from-[#7dd3fc] hover:to-[#2563eb] text-white font-semibold py-3 rounded-xl shadow-lg"
            >
              Request a Nurse
            </Button>
            
            <Link to="/auth" onClick={() => handleNavClick('/auth')}>
              <Button
                variant="outline"
                className="w-full border-2 border-gray-200 text-gray-700 hover:bg-gray-50 py-3 rounded-xl"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
