
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { GlowEffect } from '@/components/ui/glow-effect';
import NavLinks from './NavLinks';
import { nurseDropdownSections, careServicesDropdownSections } from '@/config/navigation';

interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
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
  const { user, signOut } = useAuth();

  const handleNavClick = (path: string) => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl shadow-lg border-t border-gray-200/50 mx-4 rounded-b-2xl z-40">
      <div className="px-6 py-4 space-y-4">
        {/* Navigation Links */}
        <div className="space-y-3">
          <NavLinks shouldUseDarkText={true} isMobile={true} onNavClick={handleNavClick} />
          
          {/* For Nurses Dropdown Mobile */}
          <div className="border-t pt-3">
            <p className="font-medium text-gray-700 mb-2">For Nurses</p>
            <div className="ml-4 space-y-2">
              <button
                onClick={() => {
                  handleApplyNowClick();
                  setIsOpen(false);
                }}
                className="block font-medium text-gray-600 hover:text-brand-primary"
              >
                Apply Now
              </button>
              {nurseDropdownSections.slice(1).map((section) => 
                section.links.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className="block font-medium text-gray-600 hover:text-brand-primary"
                  >
                    {link.name}
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Care Services Dropdown Mobile */}
          <div className="border-t pt-3">
            <p className="font-medium text-gray-700 mb-2">Care Services</p>
            <div className="ml-4 space-y-2">
              {careServicesDropdownSections.map((section) => 
                section.links.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className="block font-medium text-gray-600 hover:text-brand-primary"
                  >
                    {link.name}
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Authentication & CTA Section */}
        <div className="border-t pt-4 space-y-3">
          {user ? (
            <div className="space-y-2">
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="block text-gray-700 hover:text-brand-primary font-medium"
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  signOut();
                  setIsOpen(false);
                }}
                className="block w-full text-left text-gray-700 hover:text-brand-primary font-medium"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              onClick={() => setIsOpen(false)}
              className="block text-gray-700 hover:text-brand-primary font-medium"
            >
              Sign In
            </Link>
          )}
          
          {/* Request a Nurse Button */}
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
                handleRequestNurse();
                setIsOpen(false);
              }}
              className="relative w-full bg-gradient-to-r from-[#9bcbff] to-[#3b82f6] hover:from-[#7dd3fc] hover:to-[#2563eb] text-white font-semibold"
            >
              Request a Nurse
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
