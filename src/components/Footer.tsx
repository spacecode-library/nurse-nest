
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Phone } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  
  // Helper function to handle navigation with scroll to top
  const handleNavigation = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };
  
  return (
    <footer className="bg-brand-navy py-section text-white">
      <div className="container mx-auto px-6">
        {/* Logo Section */}
        <div className="mb-12 text-center">
          <img 
            src="/lovable-uploads/f3b33d4c-f4e9-4a9b-9390-96cc49376903.png"
            alt="Nurse Nest"
            className="h-12 w-auto mx-auto mb-4"
          />
          <p className="text-white/80 max-w-md mx-auto">
            Connecting compassionate nurses with families in need through our trusted healthcare marketplace.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Company Links */}
          <div>
            <h4 className="text-lg font-normal mb-8 text-white">Company</h4>
            <ul className="space-y-4">
              <li>
                <button 
                  onClick={() => handleNavigation('/about')} 
                  className="text-white/80 hover:text-brand-primary transition-colors duration-300"
                >
                  About Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/pricing')}
                  className="text-white/80 hover:text-brand-primary transition-colors duration-300"
                >
                  Pricing
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/blog')}
                  className="text-white/80 hover:text-brand-primary transition-colors duration-300"
                >
                  Blog
                </button>
              </li>
            </ul>
          </div>
          
          {/* Support Links */}
          <div>
            <h4 className="text-lg font-normal mb-8 text-white">Support</h4>
            <ul className="space-y-4">
              <li>
                <button 
                  onClick={() => handleNavigation('/terms')}
                  className="text-white/80 hover:text-brand-primary transition-colors duration-300"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/privacy')}
                  className="text-white/80 hover:text-brand-primary transition-colors duration-300"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/disclaimer')}
                  className="text-white/80 hover:text-brand-primary transition-colors duration-300"
                >
                  Disclaimer
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-lg font-normal mb-8 text-white">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Mail className="h-5 w-5 text-brand-primary mr-3 mt-0.5" />
                <a href="mailto:contact@nursenest.us" className="text-white/80 hover:text-brand-primary transition-colors duration-300">
                  contact@nursenest.us
                </a>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 text-brand-primary mr-3 mt-0.5" />
                <a href="tel:4259543381" className="text-white/80 hover:text-brand-primary transition-colors duration-300">
                  (425) 954-3381
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Area */}
        <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/60 text-sm">
            &copy; {currentYear} Nurse Nest. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
