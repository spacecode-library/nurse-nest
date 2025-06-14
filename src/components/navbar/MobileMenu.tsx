import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { GlowEffect } from '@/components/ui/glow-effect';
import NavLinks from './NavLinks';
import {
  nurseDropdownSections,
  careServicesDropdownSections,
} from '@/config/navigation';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';

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
  handleRequestNurse,
}: MobileMenuProps) {
  const { user, signOut } = useAuth();
  // Manage open accordion: "nurse", "care", or null
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const handleNavClick = (path: string) => {
    setIsOpen(false);
    setOpenAccordion(null);
  };

  // Reset dropdowns closed when menu opens
  React.useEffect(() => {
    if (isOpen) setOpenAccordion(null);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl shadow-lg border-t border-gray-200/50 mx-2 sm:mx-4 rounded-b-2xl z-40">
      <div className="px-3 py-3 sm:px-6 sm:py-4 space-y-4">
        {/* Navigation Links */}
        <div className="space-y-1.5 sm:space-y-2">
          {/* Home */}
          <Link
            to="/"
            onClick={() => handleNavClick('/')}
            className="block font-medium text-gray-700 hover:text-brand-primary py-2 px-1 rounded transition-colors"
          >
            Home
          </Link>
          {/* Sign In */}
          {!user && (
            <Link
              to="/sign-in"
              onClick={() => handleNavClick('/sign-in')}
              className="block font-medium text-gray-700 hover:text-brand-primary py-2 px-1 rounded transition-colors"
            >
              Sign In
            </Link>
          )}
          {/* Pricing */}
          <Link
            to="/pricing"
            onClick={() => handleNavClick('/pricing')}
            className="block font-medium text-gray-700 hover:text-brand-primary py-2 px-1 rounded transition-colors"
          >
            Pricing
          </Link>

          {/* Accordion Dropdowns */}
          <Accordion
            type="single"
            collapsible
            value={openAccordion ?? ''}
            onValueChange={(val) => setOpenAccordion(val ? val : null)}
            className="w-full"
          >
            {/* For Nurses Dropdown */}
            <AccordionItem value="nurse">
              <AccordionTrigger
                // match link styling on mobile/tablet: font, size, padding, no font-bold
                className="
                  block font-medium text-gray-700
                  hover:text-brand-primary
                  py-2 px-1 rounded transition-all
                  bg-transparent shadow-none ring-0 border-0
                  text-base sm:text-base
                  h-auto min-h-0 leading-normal
                  [&>svg]:ml-2  // icon spacing
                  "
                style={{
                  fontWeight: 500,
                  fontSize: "1rem",
                  paddingLeft: "0.25rem",
                  paddingRight: "0.25rem",
                }}
              >
                For Nurses
              </AccordionTrigger>
              <AccordionContent>
                <div className="ml-3 sm:ml-4 space-y-2">
                  <button
                    onClick={() => {
                      handleApplyNowClick();
                      setIsOpen(false);
                    }}
                    className="block font-medium text-gray-600 hover:text-brand-primary py-1 px-0"
                  >
                    Apply Now
                  </button>
                  {nurseDropdownSections.slice(1).map((section) =>
                    section.links.map((link) => (
                      <Link
                        key={link.name}
                        to={link.path}
                        onClick={() => handleNavClick(link.path)}
                        className="block font-medium text-gray-600 hover:text-brand-primary py-1 px-0"
                      >
                        {link.name}
                      </Link>
                    ))
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
            {/* Care Services Dropdown */}
            <AccordionItem value="care">
              <AccordionTrigger
                className="
                  block font-medium text-gray-700
                  hover:text-brand-primary
                  py-2 px-1 rounded transition-all
                  bg-transparent shadow-none ring-0 border-0
                  text-base sm:text-base
                  h-auto min-h-0 leading-normal
                  [&>svg]:ml-2
                  "
                style={{
                  fontWeight: 500,
                  fontSize: "1rem",
                  paddingLeft: "0.25rem",
                  paddingRight: "0.25rem",
                }}
              >
                Care Services
              </AccordionTrigger>
              <AccordionContent>
                <div className="ml-3 sm:ml-4 space-y-2">
                  {careServicesDropdownSections.map((section) =>
                    section.links.map((link) => (
                      <Link
                        key={link.name}
                        to={link.path}
                        onClick={() => handleNavClick(link.path)}
                        className="block font-medium text-gray-600 hover:text-brand-primary py-1 px-0"
                      >
                        {link.name}
                      </Link>
                    ))
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Authentication & CTA Section */}
        <div className="border-t pt-4 space-y-3">
          {user ? (
            <div className="space-y-2">
              <Link
                to="/dashboard"
                onClick={() => handleNavClick('/dashboard')}
                className="block text-gray-700 hover:text-brand-primary font-medium py-2 px-1 rounded"
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  signOut();
                  setIsOpen(false);
                }}
                className="block w-full text-left text-gray-700 hover:text-brand-primary font-medium py-2 px-1 rounded"
              >
                Sign Out
              </button>
            </div>
          ) : null}
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
              className="relative w-full bg-gradient-to-r from-[#9bcbff] to-[#3b82f6] hover:from-[#7dd3fc] hover:to-[#2563eb] text-white font-semibold mt-1"
            >
              Request a Nurse
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
