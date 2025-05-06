
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
    <footer className="bg-white py-8 border-t">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Company Links */}
          <div>
            <h4 className="text-lg font-bold mb-6">Company</h4>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => handleNavigation('/about')} 
                  className="text-gray-600 hover:text-primary-500 transition-colors"
                >
                  About Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/pricing')}
                  className="text-gray-600 hover:text-primary-500 transition-colors"
                >
                  Pricing
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/blog')}
                  className="text-gray-600 hover:text-primary-500 transition-colors"
                >
                  Blog
                </button>
              </li>
            </ul>
          </div>
          
          {/* Support Links - removed Contact and FAQ as requested */}
          <div>
            <h4 className="text-lg font-bold mb-6">Support</h4>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => handleNavigation('/terms')}
                  className="text-gray-600 hover:text-primary-500 transition-colors"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/privacy')}
                  className="text-gray-600 hover:text-primary-500 transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/disclaimer')}
                  className="text-gray-600 hover:text-primary-500 transition-colors"
                >
                  Disclaimer
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Information - updated description as requested */}
          <div>
            <h4 className="text-lg font-bold mb-6">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Mail className="h-5 w-5 text-primary-500 mr-2 mt-0.5" />
                <a href="mailto:contact@nursenest.us" className="text-gray-600 hover:text-primary-500 transition-colors">
                  contact@nursenest.us
                </a>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 text-primary-500 mr-2 mt-0.5" />
                <a href="tel:4259543381" className="text-gray-600 hover:text-primary-500 transition-colors">
                  (425) 954-3381
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Area - Simplified and added space between Nurse Nest */}
        <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} Nurse Nest. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
