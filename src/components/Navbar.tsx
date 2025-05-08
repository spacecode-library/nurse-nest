
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, UserRound, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { useScrollToSection } from '@/hooks/use-scroll-to-section';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

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
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  
  // Check if we're on the home page
  const isHomePage = location.pathname === '/';
  
  // Check if we're on pricing, blog, or contact pages
  const shouldShowCta = location.pathname === '/pricing' || 
                        location.pathname === '/blog' || 
                        location.pathname.includes('/blog/') ||
                        location.pathname === '/contact' ||
                        location.pathname === '/about' ||
                        location.pathname === '/terms' ||
                        location.pathname === '/privacy' ||
                        location.pathname === '/disclaimer';
  
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
  
  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handleRequestNurse = () => {
    navigate('/apply');
    window.scrollTo(0, 0); // Scroll to top when navigating
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
        
        {/* Authentication and CTA Button - Desktop */}
        <div className="hidden lg:flex items-center space-x-4">
          {/* Auth Button */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost"
                  className={cn(
                    "flex items-center",
                    shouldUseDarkText ? "text-gray-700" : "text-white"
                  )}
                >
                  <UserRound className="h-5 w-5 mr-1" />
                  <span className="hidden md:inline">Account</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth">
              <Button 
                variant="ghost"
                className={cn(
                  shouldUseDarkText 
                    ? "text-gray-700 hover:text-primary-500 hover:bg-transparent" 
                    : "text-white hover:text-primary-100 hover:bg-transparent"
                )}
              >
                Sign In
              </Button>
            </Link>
          )}
          
          {/* CTA Button */}
          <Button 
            className={cn(
              "transition-opacity duration-300",
              (showCta || shouldShowCta) ? "opacity-100" : "opacity-0 pointer-events-none",
              isScrolled ? "bg-primary-500 hover:bg-primary-600" : "bg-white text-primary-500 hover:bg-gray-100"
            )}
            onClick={handleRequestNurse}
          >
            Request a Nurse
          </Button>
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
            
            {user ? (
              <Button 
                variant="ghost" 
                className="justify-start px-0 text-gray-700 hover:text-primary-500"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            ) : (
              <Link 
                to="/auth"
                className="font-medium text-gray-700 hover:text-primary-500"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
            )}
            
            <Button 
              className="bg-primary-500 hover:bg-primary-600 w-full mt-4"
              onClick={() => {
                setIsOpen(false);
                handleRequestNurse();
              }}
            >
              Request a Nurse
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
