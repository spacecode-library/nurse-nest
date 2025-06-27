// lib/theme.ts - Unified Design System for Nurse Nest
export const theme = {
    // Primary Brand Colors
    colors: {
      primary: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb', // Primary Blue
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',
      },
      secondary: {
        50: '#f0fdf4',
        100: '#dcfce7',
        200: '#bbf7d0',
        300: '#86efac',
        400: '#4ade80',
        500: '#22c55e', // Secondary Green
        600: '#16a34a',
        700: '#15803d',
        800: '#166534',
        900: '#14532d',
      },
      accent: {
        50: '#fff7ed',
        100: '#ffedd5',
        200: '#fed7aa',
        300: '#fdba74',
        400: '#fb923c',
        500: '#f97316', // Accent Orange
        600: '#ea580c',
        700: '#c2410c',
        800: '#9a3412',
        900: '#7c2d12',
      },
      gray: {
        50: '#f9fafb',
        100: '#f3f4f6',
        200: '#e5e7eb',
        300: '#d1d5db',
        400: '#9ca3af',
        500: '#6b7280',
        600: '#4b5563',
        700: '#374151',
        800: '#1f2937',
        900: '#111827',
      },
      // Status Colors
      success: {
        50: '#f0fdf4',
        500: '#22c55e',
        600: '#16a34a',
        700: '#15803d',
      },
      warning: {
        50: '#fffbeb',
        500: '#f59e0b',
        600: '#d97706',
        700: '#b45309',
      },
      error: {
        50: '#fef2f2',
        500: '#ef4444',
        600: '#dc2626',
        700: '#b91c1c',
      },
      info: {
        50: '#eff6ff',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
      }
    },
  
    // Typography Scale
    typography: {
      fontFamily: {
        sans: ['Noto Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      }
    },
  
    // Spacing Scale
    spacing: {
      px: '1px',
      0: '0',
      1: '0.25rem',
      2: '0.5rem',
      3: '0.75rem',
      4: '1rem',
      5: '1.25rem',
      6: '1.5rem',
      8: '2rem',
      10: '2.5rem',
      12: '3rem',
      16: '4rem',
      20: '5rem',
      24: '6rem',
      32: '8rem',
    },
  
    // Border Radius
    borderRadius: {
      none: '0',
      sm: '0.125rem',
      DEFAULT: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      '2xl': '1rem',
      '3xl': '1.5rem',
      full: '9999px',
    },
  
    // Shadows
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    },
  
    // Component Variants
    components: {
      button: {
        primary: {
          backgroundColor: '#2563eb',
          color: '#ffffff',
          hover: '#1d4ed8',
          focus: '#1e40af',
        },
        secondary: {
          backgroundColor: '#ffffff',
          color: '#374151',
          border: '#d1d5db',
          hover: '#f9fafb',
        },
        success: {
          backgroundColor: '#16a34a',
          color: '#ffffff',
          hover: '#15803d',
        },
        warning: {
          backgroundColor: '#d97706',
          color: '#ffffff',
          hover: '#b45309',
        },
        danger: {
          backgroundColor: '#dc2626',
          color: '#ffffff',
          hover: '#b91c1c',
        }
      },
      card: {
        default: {
          backgroundColor: '#ffffff',
          border: '#e5e7eb',
          shadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
          borderRadius: '0.5rem',
        },
        elevated: {
          backgroundColor: '#ffffff',
          border: '#e5e7eb',
          shadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
          borderRadius: '0.5rem',
        }
      },
      input: {
        default: {
          border: '#d1d5db',
          borderRadius: '0.375rem',
          padding: '0.5rem 0.75rem',
          focus: {
            borderColor: '#2563eb',
            boxShadow: '0 0 0 3px rgb(37 99 235 / 0.1)',
          }
        }
      },
      badge: {
        success: {
          backgroundColor: '#dcfce7',
          color: '#15803d',
          border: '#bbf7d0',
        },
        warning: {
          backgroundColor: '#fef3c7',
          color: '#92400e',
          border: '#fde68a',
        },
        error: {
          backgroundColor: '#fee2e2',
          color: '#991b1b',
          border: '#fecaca',
        },
        info: {
          backgroundColor: '#dbeafe',
          color: '#1e40af',
          border: '#bfdbfe',
        },
        neutral: {
          backgroundColor: '#f3f4f6',
          color: '#374151',
          border: '#e5e7eb',
        }
      }
    },
  
    // Breakpoints for Responsive Design
    breakpoints: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
  
    // Animations & Transitions
    animation: {
      duration: {
        fast: '150ms',
        normal: '300ms',
        slow: '500ms',
      },
      easing: {
        default: 'cubic-bezier(0.4, 0, 0.2, 1)',
        in: 'cubic-bezier(0.4, 0, 1, 1)',
        out: 'cubic-bezier(0, 0, 0.2, 1)',
        inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      }
    },
  
    // Medical/Healthcare Specific Gradients
    gradients: {
      primary: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 50%, #bfdbfe 100%)',
      secondary: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)',
      accent: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 50%, #fed7aa 100%)',
      neutral: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 50%, #e5e7eb 100%)',
    }
  } as const;
  
  // Helper functions for consistent styling
  export const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
      case 'active':
      case 'approved':
      case 'hired':
      case 'completed':
        return theme.components.badge.success;
      case 'pending':
      case 'submitted':
      case 'shortlisted':
        return theme.components.badge.warning;
      case 'declined':
      case 'rejected':
      case 'failed':
      case 'expired':
        return theme.components.badge.error;
      case 'new':
      case 'processing':
        return theme.components.badge.info;
      default:
        return theme.components.badge.neutral;
    }
  };
  
  export const getUserTypeIcon = (userType: string) => {
    switch (userType) {
      case 'nurse':
        return 'Stethoscope';
      case 'client':
        return 'Building';
      case 'admin':
        return 'Shield';
      default:
        return 'User';
    }
  };
  
  export const getUserTypeColor = (userType: string) => {
    switch (userType) {
      case 'nurse':
        return theme.colors.primary[600];
      case 'client':
        return theme.colors.secondary[600];
      case 'admin':
        return theme.colors.accent[600];
      default:
        return theme.colors.gray[600];
    }
  };
  
  // Utility classes for consistent styling
  export const utilityClasses = {
    // Container widths
    container: 'mx-auto px-4 sm:px-6 lg:px-8',
    
    // Common layouts
    centerContent: 'flex items-center justify-center',
    spaceBetween: 'flex items-center justify-between',
    
    // Text utilities
    textPrimary: 'text-gray-900',
    textSecondary: 'text-gray-600',
    textMuted: 'text-gray-500',
    
    // Background utilities
    bgPrimary: 'bg-blue-600',
    bgSecondary: 'bg-green-500',
    bgAccent: 'bg-orange-500',
    
    // Border utilities
    borderDefault: 'border border-gray-200',
    borderPrimary: 'border border-blue-200',
    
    // Shadow utilities
    shadowCard: 'shadow-md hover:shadow-lg transition-shadow',
    shadowButton: 'shadow-sm hover:shadow-md transition-shadow',
    
    // Transition utilities
    transition: 'transition-all duration-300 ease-in-out',
    transitionFast: 'transition-all duration-150 ease-in-out',
    
    // Focus utilities
    focusRing: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
    
    // Responsive utilities
    hiddenMobile: 'hidden sm:block',
    showMobile: 'block sm:hidden',
  };
  
  export default theme;