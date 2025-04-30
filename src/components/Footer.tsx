
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone } from 'lucide-react';
import { Button } from './ui/button';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-br from-nurse-light to-white pt-16 pb-8 border-t">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <Link to="/" className="flex items-center mb-6">
              <span className="text-2xl font-heading font-bold text-nurse-dark">
                Nurse<span className="text-primary-500">Nest</span>
              </span>
            </Link>
            <p className="text-gray-600 mb-6">
              We connect families and healthcare providers with licensed, 
              background-checked nurses for in-home or in-practice support.
            </p>
            <div className="flex space-x-4">
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
                <Link to="/blog" className="text-gray-600 hover:text-primary-500 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-gray-600 hover:text-primary-500 transition-colors">
                  Careers
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Services Links */}
          <div>
            <h4 className="text-lg font-bold mb-6">Services</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/services/night-nurses" className="text-gray-600 hover:text-primary-500 transition-colors">
                  Night Nurses
                </Link>
              </li>
              <li>
                <Link to="/services/elder-care" className="text-gray-600 hover:text-primary-500 transition-colors">
                  Elder Care
                </Link>
              </li>
              <li>
                <Link to="/services/practice-staffing" className="text-gray-600 hover:text-primary-500 transition-colors">
                  Practice Staffing
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Support Links */}
          <div>
            <h4 className="text-lg font-bold mb-6">Support</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-primary-500 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-primary-500 transition-colors">
                  FAQ
                </Link>
              </li>
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
            </ul>
          </div>
        </div>
        
        {/* Bottom Area with CTA */}
        <div className="border-t border-gray-200 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {currentYear} NurseNest. All rights reserved.
          </p>
          
          <Button className="bg-primary-500 hover:bg-primary-600">
            Request a Nurse
          </Button>
        </div>
      </div>
    </footer>
  );
}
