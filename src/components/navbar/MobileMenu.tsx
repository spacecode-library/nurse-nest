
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import NavLinks from './NavLinks';
import {
  nurseDropdownSections,
  careServicesDropdownSections,
} from '@/config/navigation';
import {
  Accordion,
} from '@/components/ui/accordion';
import styles from './MobileMenu.module.css';
import MobileMenuNavLink from './MobileMenuNavLink';
import MobileMenuDropdown from './MobileMenuDropdown';
import MobileMenuUserActions from './MobileMenuUserActions';

// Lucide chevron down icon for left side
const ChevronDown = () => (
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
);

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
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const handleNavClick = (path: string) => {
    setIsOpen(false);
    setOpenAccordion(null);
  };

  useEffect(() => {
    if (isOpen) setOpenAccordion(null);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.mobileMenu}>
      <div className={styles.menuWrapper}>
        {/* Navigation Links */}
        <div className="space-y-1.5 sm:space-y-2">
          <MobileMenuNavLink to="/" onClick={handleNavClick}>Home</MobileMenuNavLink>
          {!user && (
            <MobileMenuNavLink to="/sign-in" onClick={handleNavClick}>Sign In</MobileMenuNavLink>
          )}
          <MobileMenuNavLink to="/pricing" onClick={handleNavClick}>Pricing</MobileMenuNavLink>
          <Accordion
            type="single"
            collapsible
            value={openAccordion ?? ''}
            onValueChange={(val) => setOpenAccordion(val ? val : null)}
            className={styles.mobileAccordionNoBorder}
          >
            <MobileMenuDropdown
              label="For Nurses"
              icon={<ChevronDown />}
              value="nurse"
              onSpecialTopAction={() => { handleApplyNowClick(); setIsOpen(false); }}
              specialTopLabel="Apply Now"
              sections={nurseDropdownSections}
              onNavClick={handleNavClick}
              topLinkFirst={true}
            />
            <MobileMenuDropdown
              label="Care Services"
              icon={<ChevronDown />}
              value="care"
              sections={careServicesDropdownSections}
              onNavClick={handleNavClick}
            />
          </Accordion>
        </div>
        {/* User Actions & CTA */}
        <MobileMenuUserActions
          user={user}
          signOut={signOut}
          handleNavClick={handleNavClick}
          handleRequestNurse={handleRequestNurse}
          setIsOpen={setIsOpen}
        />
      </div>
    </div>
  );
}
