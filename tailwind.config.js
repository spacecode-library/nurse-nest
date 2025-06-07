
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
          DEFAULT: "#9bcbff", // Primary Blue
          foreground: "#ffffff",
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#9bcbff", // Main Primary Blue
          400: "#60a5fa",
          500: "#3b82f6", // Trust Blue
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e293b", // Professional Navy
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "#ef4444", // Alert Red
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#f1f5f9", // Clean Slate
          foreground: "#475569", // Professional Gray
        },
        accent: {
          DEFAULT: "#3b82f6", // Trust Blue
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
        // Nurse Nest Brand Colors
        brand: {
          primary: "#9bcbff", // Primary Blue
          navy: "#1e293b", // Professional Navy
          blue: "#3b82f6", // Trust Blue
          slate: "#f1f5f9", // Clean Slate
          gray: "#475569", // Professional Gray
          green: "#10b981", // Health Green
          amber: "#f59e0b", // Attention Amber
          red: "#ef4444", // Alert Red
          "cloud-white": "#f0f9ff", // Cloud White
          "soft-sky": "#e0f2fe", // Soft Sky
        },
        // Supporting Colors
        success: "#10b981", // Health Green
        warning: "#f59e0b", // Attention Amber
        error: "#ef4444", // Alert Red
        // Text Colors
        text: {
          primary: "#1e293b", // Heading Primary
          secondary: "#334155", // Heading Secondary
          body: "#475569", // Text Body
          small: "#64748b", // Text Small
        },
        // Legacy nurse colors (maintaining compatibility)
        nurse: {
          light: "#f1f5f9", // Clean Slate
          medium: "#9bcbff", // Primary Blue
          dark: "#1e293b", // Professional Navy
          accent: "#ef4444", // Alert Red for accent
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ['Arial', 'Helvetica', 'sans-serif'], // Primary brand font
        heading: ['Arial', 'Helvetica', 'sans-serif'],
      },
      fontWeight: {
        'light': '300', // Primary Heading weight
        'normal': '400', // Secondary Heading and Body Text weight
      },
      letterSpacing: {
        'brand-wide': '2px', // For primary headings
        'brand-normal': '1px', // For secondary headings
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
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.8s ease-out forwards",
        "fade-in-right": "fade-in-right 0.8s ease-out forwards",
        "slide-in-bottom": "slide-in-bottom 0.8s ease-out forwards"
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'brand-gradient': 'linear-gradient(135deg, #9bcbff 0%, #3b82f6 100%)', // Primary Brand Gradient
        'professional-gradient': 'linear-gradient(135deg, #1e293b 0%, #475569 100%)', // Professional Dark Gradient
        'subtle-gradient': 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)', // Subtle Light Gradient
        'sky-gradient': 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', // Sky Gradient
      },
      boxShadow: {
        'brand': '0 2px 8px rgba(71, 85, 105, 0.1)',
        'brand-hover': '0 4px 16px rgba(71, 85, 105, 0.15)',
        'professional': '0 2px 4px rgba(155, 203, 255, 0.3)',
        'professional-hover': '0 4px 8px rgba(59, 130, 246, 0.4)',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
}
