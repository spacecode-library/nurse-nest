
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { GlowEffect } from '@/components/ui/glow-effect';
import NavLinks from './NavLinks';
import NurseDropdown from './NurseDropdown';
import CareServicesDropdown from './CareServicesDropdown';

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
              <Link
                to="/nurse-llc-setup-guide"
                onClick={() => setIsOpen(false)}
                className="block font-medium text-gray-600 hover:text-brand-primary"
              >
                LLC Setup Guide
              </Link>
              <Link
                to="/get-ein-nurse-business"
                onClick={() => setIsOpen(false)}
                className="block font-medium text-gray-600 hover:text-brand-primary"
              >
                EIN Applications
              </Link>
              <Link
                to="/business-bank-account-for-nurses"
                onClick={() => setIsOpen(false)}
                className="block font-medium text-gray-600 hover:text-brand-primary"
              >
                Business Banking
              </Link>
              <Link
                to="/malpractice-insurance-for-nurses"
                onClick={() => setIsOpen(false)}
                className="block font-medium text-gray-600 hover:text-brand-primary"
              >
                Malpractice Insurance
              </Link>
              <Link
                to="/1099-tax-tips"
                onClick={() => setIsOpen(false)}
                className="block font-medium text-gray-600 hover:text-brand-primary"
              >
                1099 Tax Tips
              </Link>
            </div>
          </div>

          {/* Care Services Dropdown Mobile */}
          <div className="border-t pt-3">
            <p className="font-medium text-gray-700 mb-2">Care Services</p>
            <div className="ml-4 space-y-2">
              <Link
                to="/newborn-nurse-support-guide"
                onClick={() => setIsOpen(false)}
                className="block font-medium text-gray-600 hover:text-brand-primary"
              >
                Newborn Care
              </Link>
              <Link
                to="/elderly-care-nurse-services"
                onClick={() => setIsOpen(false)}
                className="block font-medium text-gray-600 hover:text-brand-primary"
              >
                Elderly Care
              </Link>
              <Link
                to="/wound-care-nursing-guide"
                onClick={() => setIsOpen(false)}
                className="block font-medium text-gray-600 hover:text-brand-primary"
              >
                Wound Care
              </Link>
              <Link
                to="/best-products-for-home-healthcare"
                onClick={() => setIsOpen(false)}
                className="block font-medium text-gray-600 hover:text-brand-primary"
              >
                Product Reviews
              </Link>
            </div>
          </div>
        </div>

        {/* Authentication & CTA Section - Reordered */}
        <div className="border-t pt-4 space-y-3">
          {/* Sign In/User Menu first */}
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
          
          {/* Request a Nurse Button second */}
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
