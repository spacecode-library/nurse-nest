
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
      <style>{`
        .mobile-menu-trigger {
          display: flex;
          align-items: center;
          width: 100%;
          padding: 0.5rem 0.25rem;
          background: transparent;
          border: none;
          box-shadow: none !important;
          outline: none !important;
          font-size: 1rem;
          font-weight: 500;
          text-align: left;
          color: #374151; /* text-gray-700 */
          border-radius: 0.5rem;
          transition: background 0.15s, color 0.15s;
        }
        .mobile-menu-trigger:focus,
        .mobile-menu-trigger[data-state="open"] {
          outline: none !important;
          box-shadow: none !important;
          background: none;
        }
        .mobile-menu-trigger:hover {
          color: #2563eb;
          background: none;
        }
        .mobile-trigger-icon {
          margin-right: 0.43em;
          margin-left: 0;
          flex-shrink: 0;
          display: flex;
          align-items: center;
        }
        /* Remove all accordion item divider lines and border */
        .mobile-accordion-no-border > div > [data-state] {
          border-bottom: none !important;
        }
        /* Hide the right chevron icon inside the accordion trigger */
        .mobile-menu-trigger > svg:last-child {
          display: none !important;
        }
      `}</style>
      <div className="px-3 py-3 sm:px-6 sm:py-4 space-y-4">

        {/* Navigation Links */}
        <div className="space-y-1.5 sm:space-y-2">
          {/* Home */}
          <Link
            to="/"
            onClick={() => handleNavClick('/')}
            className="block font-medium text-gray-700 hover:text-brand-primary py-2 px-1 rounded transition-colors text-base"
          >
            Home
          </Link>
          {/* Sign In */}
          {!user && (
            <Link
              to="/sign-in"
              onClick={() => handleNavClick('/sign-in')}
              className="block font-medium text-gray-700 hover:text-brand-primary py-2 px-1 rounded transition-colors text-base"
            >
              Sign In
            </Link>
          )}
          {/* Pricing */}
          <Link
            to="/pricing"
            onClick={() => handleNavClick('/pricing')}
            className="block font-medium text-gray-700 hover:text-brand-primary py-2 px-1 rounded transition-colors text-base"
          >
            Pricing
          </Link>

          {/* Accordion Dropdowns */}
          <Accordion
            type="single"
            collapsible
            value={openAccordion ?? ''}
            onValueChange={(val) => setOpenAccordion(val ? val : null)}
            className="w-full mobile-accordion-no-border"
          >
            {/* For Nurses Dropdown */}
            <AccordionItem value="nurse" className="border-b-0">
              {/* AccordionTrigger with icon left of label */}
              <AccordionTrigger
                className="mobile-menu-trigger"
                style={{
                  boxShadow: 'none',
                  outline: 'none',
                  border: 'none',
                  background: 'none',
                  paddingLeft: '0.25rem',
                  paddingRight: '0.25rem',
                  paddingTop: '0.5rem',
                  paddingBottom: '0.5rem',
                  fontWeight: 500,
                  fontSize: '1rem',
                  textAlign: 'left',
                  color: '#374151',
                  minHeight: 0,
                  height: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  gap: '0.15em',
                  width: '100%',
                }}
                tabIndex={0}
              >
                <span className="mobile-trigger-icon">
                  {/* Down Arrow/chevron icon rendered by AccordionTrigger by default */}
                  {/* We move icon manually, so prevent AccordionTrigger from rendering its default ChevronDown */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 shrink-0 transition-transform duration-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                  </svg>
                </span>
                <span className="flex items-center">
                  For Nurses
                </span>
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
            <AccordionItem value="care" className="border-b-0">
              <AccordionTrigger
                className="mobile-menu-trigger"
                style={{
                  boxShadow: 'none',
                  outline: 'none',
                  border: 'none',
                  background: 'none',
                  paddingLeft: '0.25rem',
                  paddingRight: '0.25rem',
                  paddingTop: '0.5rem',
                  paddingBottom: '0.5rem',
                  fontWeight: 500,
                  fontSize: '1rem',
                  textAlign: 'left',
                  color: '#374151',
                  minHeight: 0,
                  height: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  gap: '0.15em',
                  width: '100%',
                }}
                tabIndex={0}
              >
                <span className="mobile-trigger-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 shrink-0 transition-transform duration-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                  </svg>
                </span>
                <span className="flex items-center">
                  Care Services
                </span>
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

// ... end of file
