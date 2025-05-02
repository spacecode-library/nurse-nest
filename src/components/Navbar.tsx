
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'How It Works', path: '/how-it-works' },
  { name: 'Services', path: '/services' },
  { name: 'About Us', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'
    )}>
      <div className="container-custom flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className={cn(
            "text-2xl font-heading font-bold",
            isScrolled ? "text-nurse-dark" : "text-white"
          )}>
            Nurse<span className="text-primary-500">Nest</span>
          </span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name}
              to={link.path}
              className={cn(
                "font-medium link-underline",
                isScrolled ? "text-gray-700 hover:text-primary-500" : "text-white hover:text-primary-200"
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>
        
        {/* CTA Button */}
        <div className="hidden lg:block">
          <Button className="bg-primary-500 hover:bg-primary-600">
            Request a Nurse
          </Button>
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          className={cn(
            "lg:hidden focus:outline-none",
            isScrolled ? "text-gray-600" : "text-white"
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>
      
      {/* Mobile Menu */}
      <div
        className={cn(
          'lg:hidden fixed inset-0 bg-white z-40 transform transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="container-custom py-5">
          <div className="flex items-center justify-between mb-8">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-heading font-bold text-nurse-dark">
                Nurse<span className="text-primary-500">Nest</span>
              </span>
            </Link>
            
            <button 
              className="text-gray-600 focus:outline-none" 
              onClick={() => setIsOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <nav className="flex flex-col space-y-6">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                to={link.path}
                className="font-medium text-gray-700 hover:text-primary-500"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            
            <Button className="bg-primary-500 hover:bg-primary-600 w-full mt-4">
              Request a Nurse
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
