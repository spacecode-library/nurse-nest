
const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#9bcbff", // Sky Blue - Primary Brand Color
          foreground: "#1e293b", // Professional Navy for text on primary
          50: "#f0f8ff",
          100: "#e0f1ff",
          200: "#c9e6ff",
          300: "#9bcbff", // Main Primary Brand Color
          400: "#6bb0ff",
          500: "#3b95ff",
          600: "#1a7fff",
          700: "#0066ff",
          800: "#0052d6",
          900: "#1e293b", // Professional Navy
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "#ef4444", // Error Red
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#f1f5f9", // Light Neutral (Clean Slate)
          foreground: "#475569", // Dark Neutral (Professional Gray)
        },
        accent: {
          DEFAULT: "#3b82f6", // Trust Blue - Accent Color
          foreground: "#ffffff",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Brand Colors
        brand: {
          primary: "#9bcbff", // Sky Blue
          navy: "#1e293b", // Professional Navy
          blue: "#3b82f6", // Trust Blue
        },
        // Supporting Colors
        success: "#10b981", // Success Green
        warning: "#f59e0b", // Warning Amber
        error: "#ef4444", // Error Red
        // Neutrals
        neutral: {
          light: "#f1f5f9", // Clean Slate
          dark: "#475569", // Professional Gray
        },
        // Legacy nurse colors (maintaining compatibility)
        nurse: {
          light: "#f1f5f9", // Clean Slate
          medium: "#9bcbff", // Sky Blue
          dark: "#1e293b", // Professional Navy
          accent: "#ef4444", // Error Red for accent
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ['Avenir', 'Helvetica', 'Arial', 'sans-serif'], // AvenirHelvetica font family
        heading: ['Avenir', 'Helvetica', 'Arial', 'sans-serif'],
        'roboto': ['Roboto', 'Arial', 'sans-serif'], // Add Roboto font
        'roboto-black': ['Roboto', 'Arial', 'sans-serif'], // Roboto Black 900
        'roboto-extrabold': ['Roboto', 'Arial', 'sans-serif'], // Roboto ExtraBold 800
        'roboto-regular': ['Roboto', 'Arial', 'sans-serif'], // Roboto Regular 400
      },
      fontWeight: {
        'light': '200', // Primary Heading weight
        'normal': '400', // Secondary Heading and Body Text weight
        'roboto-regular': '400', // Roboto Regular
        'roboto-extrabold': '800', // Roboto ExtraBold
        'roboto-black': '900', // Roboto Black
      },
      spacing: {
        'section': '6rem', // 96px for major section spacing
        'section-sm': '4rem', // 64px for smaller section spacing
        'section-lg': '8rem', // 128px for large section spacing
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "fade-in": {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" }
        },
        "fade-in-right": {
          "0%": { opacity: 0, transform: "translateX(30px)" },
          "100%": { opacity: 1, transform: "translateX(0)" }
        },
        "slide-in-bottom": {
          "0%": { transform: "translateY(30px)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 }
        },
        aurora: {
          from: {
            backgroundPosition: "50% 50%, 50% 50%",
          },
          to: {
            backgroundPosition: "350% 50%, 350% 50%",
          },
        },
        'star-movement-bottom': {
          '0%': { transform: 'translate(0%, 0%)', opacity: '1' },
          '100%': { transform: 'translate(-100%, 0%)', opacity: '0' },
        },
        'star-movement-top': {
          '0%': { transform: 'translate(0%, 0%)', opacity: '1' },
          '100%': { transform: 'translate(100%, 0%)', opacity: '0' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.8s ease-out forwards",
        "fade-in-right": "fade-in-right 0.8s ease-out forwards",
        "slide-in-bottom": "slide-in-bottom 0.8s ease-out forwards",
        aurora: "aurora 60s linear infinite",
        'star-movement-bottom': 'star-movement-bottom linear infinite alternate',
        'star-movement-top': 'star-movement-top linear infinite alternate',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'brand-gradient': 'linear-gradient(135deg, #9bcbff 0%, #3b82f6 100%)', // Primary Brand Gradient
        'professional-gradient': 'linear-gradient(135deg, #1e293b 0%, #475569 100%)', // Professional Dark Gradient
        'subtle-gradient': 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)', // Subtle Light Gradient
      },
      boxShadow: {
        'brand': '0 4px 6px -1px rgba(155, 203, 255, 0.1), 0 2px 4px -1px rgba(155, 203, 255, 0.06)',
        'professional': '0 10px 15px -3px rgba(30, 41, 59, 0.1), 0 4px 6px -2px rgba(30, 41, 59, 0.05)',
      }
    },
  },
  plugins: [require("tailwindcss-animate"), addVariablesForColors],
}

// This plugin adds each Tailwind color as a global CSS variable, e.g. var(--gray-200).
function addVariablesForColors({ addBase, theme }) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}
