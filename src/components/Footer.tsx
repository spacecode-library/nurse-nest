import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Phone } from 'lucide-react';
import { BackgroundBeams } from './ui/background-beams';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  
  // Helper function to handle navigation with scroll to top
  const handleNavigation = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };
  
  return (
    <footer className="relative bg-brand-navy py-12 text-white">
      {/* Background Beams Animation - Same as HowItWorksSection */}
      <div className="absolute inset-0 z-0">
        <BackgroundBeams />
      </div>
      
      {/* Very light overlay to ensure text readability while keeping beams bright */}
      <div className="absolute inset-0 bg-brand-navy/20 z-10"></div>
      
      <div className="container mx-auto px-6 relative z-30">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <img 
              src="/lovable-uploads/f3b33d4c-f4e9-4a9b-9390-96cc49376903.png"
              alt="Nurse Nest"
              className="h-10 w-auto mb-3"
            />
            <p className="text-white/70 text-sm leading-relaxed max-w-xs">
              Connecting compassionate nurses with families in need through our trusted healthcare marketplace.
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-base font-medium mb-4 text-white">Company</h4>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => handleNavigation('/about')} 
                  className="text-white/70 hover:text-brand-primary transition-colors duration-300 text-sm"
                >
                  About Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/pricing')}
                  className="text-white/70 hover:text-brand-primary transition-colors duration-300 text-sm"
                >
                  Pricing
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/blog')}
                  className="text-white/70 hover:text-brand-primary transition-colors duration-300 text-sm"
                >
                  Blog
                </button>
              </li>
            </ul>
          </div>
          
          {/* Support Links */}
          <div>
            <h4 className="text-base font-medium mb-4 text-white">Support</h4>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => handleNavigation('/terms')}
                  className="text-white/70 hover:text-brand-primary transition-colors duration-300 text-sm"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/privacy')}
                  className="text-white/70 hover:text-brand-primary transition-colors duration-300 text-sm"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/disclaimer')}
                  className="text-white/70 hover:text-brand-primary transition-colors duration-300 text-sm"
                >
                  Disclaimer
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-base font-medium mb-4 text-white">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Mail className="h-4 w-4 text-brand-primary mr-2 mt-0.5 flex-shrink-0" />
                <a href="mailto:contact@nursenest.us" className="text-white/70 hover:text-brand-primary transition-colors duration-300 text-sm">
                  contact@nursenest.us
                </a>
              </li>
              <li className="flex items-start">
                <Phone className="h-4 w-4 text-brand-primary mr-2 mt-0.5 flex-shrink-0" />
                <a href="tel:4259543381" className="text-white/70 hover:text-brand-primary transition-colors duration-300 text-sm">
                  (425) 954-3381
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Copyright */}
        <div className="border-t border-white/20 pt-6">
          <p className="text-white/60 text-xs text-center">
            &copy; {currentYear} Nurse Nest. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
