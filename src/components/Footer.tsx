
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white py-8 border-t">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Company Links */}
          <div>
            <h4 className="text-lg font-bold mb-6">Company</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-primary-500 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-600 hover:text-primary-500 transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-600 hover:text-primary-500 transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Support Links */}
          <div>
            <h4 className="text-lg font-bold mb-6">Support</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-primary-500 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-primary-500 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" className="text-gray-600 hover:text-primary-500 transition-colors">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
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
              <li className="mt-4 text-gray-600">
                <p>As a dedicated small business, we strive to respond to all inquiries within one business day.</p>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Area - Simplified */}
        <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} NurseNest. All rights reserved.
          </p>
          
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
              <Facebook className="h-5 w-5" />
              <span className="sr-only">Facebook</span>
            </a>
            <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </a>
            <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </a>
            <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
