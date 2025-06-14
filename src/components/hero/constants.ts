// Animation constants
export const ANIMATION_CONFIG = {
  rotationInterval: 2000,
  mobileRotatingTextHeight: 32,
  desktopRotatingTextHeight: 80,
  desktopRotatingTextWidth: 300,
  // Use 'spring' for hero rotating text, to match best working sample
  animationTransition: {
    type: "spring" as const,
    stiffness: 50
  }
};

// Nursing specialties for rotating text
export const NURSING_TITLES = [
  "Specialized", "Night", "Private Duty", "Compassionate", 
  "Newborn", "Home Care", "Reliable", "Wound Care", 
  "Post-Surgery", "Gentle"
];

// Glow effect configurations
export const BUTTON_GLOW_CONFIGS = {
  primary: {
    colors: ['#2563eb', '#3b82f6', '#1d4ed8', '#60a5fa'],
    mode: 'rotate' as const,
    blur: 'soft' as const,
    duration: 3,
    scale: 1.05,
    intensity: 0.2
  },
  secondary: {
    colors: ['#ffffff', '#f8fafc', '#e2e8f0', '#cbd5e1'],
    mode: 'pulse' as const,
    blur: 'soft' as const,
    duration: 2,
    scale: 1.03,
    intensity: 0.35
  }
};
