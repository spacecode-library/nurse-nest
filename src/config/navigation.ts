export interface NavLink {
  name: string;
  path: string;
  external?: boolean;
}

export interface DropdownSection {
  title: string;
  links: NavLink[];
}

// Main navigation links
export const mainNavLinks: NavLink[] = [
  { name: 'Home', path: '/' },
  { name: 'Pricing', path: '/pricing' },
];

// For Nurses dropdown configuration
export const nurseDropdownSections: DropdownSection[] = [
  {
    title: 'Get Started',
    links: [
      { name: 'Apply Now', path: '/nurse-application', external: true },
    ]
  },
  {
    title: 'Business Setup',
    links: [
      { name: 'LLC Setup Guide', path: '/nurse-llc-setup-guide' },
      { name: 'EIN Applications', path: '/blog/ein-applications-independent-contract-nurses' },
      { name: 'Business Banking', path: '/blog/business-banking-setup-guide-nurses' },
    ]
  },
  {
    title: 'Professional Resources',
    links: [
      { name: 'Malpractice Insurance', path: '/malpractice-insurance' },
      { name: '1099 Tax Tips', path: '/1099-tax-tips' },
    ]
  }
];

// Care Services dropdown configuration
export const careServicesDropdownSections: DropdownSection[] = [
  {
    title: 'Specialized Care',
    links: [
      { name: 'Newborn Care', path: '/newborn-nurse-support-guide' },
      { name: 'Night Nurse Guide', path: '/night-nurse-newborn-care-guide' },
      { name: 'Elderly Care', path: '/elderly-care-nurse-services' },
      { name: 'Post-Surgical Care', path: '/post-surgical-care' },
    ]
  }
];

// Animation variants for consistent animations
export const animationVariants = {
  fadeIn: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.2 }
  },
  slideIn: {
    initial: { opacity: 0, x: -10 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -10 },
    transition: { duration: 0.3 }
  }
};
