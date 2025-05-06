import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { useScrollToSection } from '@/hooks/use-scroll-to-section';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'How It Works', path: '/#how-it-works' },
  { name: 'Pricing', path: '/pricing' },
  { name: 'Blog', path: '/blog' },
  { name: 'Contact', path: '/contact' },
];

export default function Navbar({ showCta = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollToSection = useScrollToSection();
  const location = useLocation();
  
  // Check if we're on the home page
  const isHomePage = location.pathname === '/';
  
  // Text color should be dark on non-home pages or when scrolled
  const shouldUseDarkText = !isHomePage || isScrolled;
  
  useEffect(() => {
    const handleScroll = () => {
      // Only consider as scrolled if we're beyond certain height
      setIsScrolled(window.scrollY > window.innerHeight * 0.1);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    // Always set isScrolled to true for non-home pages to show dark text on light background
    if (!isHomePage) {
      setIsScrolled(true);
    }
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  const handleNavClick = (path) => {
    setIsOpen(false);
    scrollToSection(path);
  };
  
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
            shouldUseDarkText ? "text-nurse-dark" : "text-white"
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
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(link.path);
              }}
              className={cn(
                "font-medium link-underline",
                shouldUseDarkText
                  ? "text-gray-700 hover:text-primary-500" 
                  : "text-white hover:text-primary-100"
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>
        
        {/* CTA Button - Only show when scroll past hero */}
        <div className="hidden lg:block">
          <Link to="/apply">
            <Button 
              className={cn(
                "transition-opacity duration-1000",
                showCta ? "opacity-100" : "opacity-0 pointer-events-none",
                isScrolled ? "bg-primary-500 hover:bg-primary-600" : "bg-white text-primary-500 hover:bg-gray-100"
              )}
            >
              Request a Nurse
            </Button>
          </Link>
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          className={cn(
            "lg:hidden focus:outline-none",
            shouldUseDarkText ? "text-gray-600" : "text-white"
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
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.path);
                }}
              >
                {link.name}
              </Link>
            ))}
            
            <Link to="/apply" onClick={() => setIsOpen(false)}>
              <Button className="bg-primary-500 hover:bg-primary-600 w-full mt-4">
                Request a Nurse
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
