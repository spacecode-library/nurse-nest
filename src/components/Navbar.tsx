
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { GlowEffect } from '@/components/ui/glow-effect';
import { Navbar1 } from '@/components/ui/shadcnblocks-com-navbar1';
import { Book, Menu, Sunset, Trees, Zap } from "lucide-react";

interface NavbarProps {
  isHomePage?: boolean;
}

export default function Navbar({ isHomePage = false }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Check if we're on the home page
  const isHomePageRoute = location.pathname === '/';
  
  useEffect(() => {
    const handleScroll = () => {
      // Only consider as scrolled if we're beyond certain height
      setIsScrolled(window.scrollY > 100);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleApplyNowClick = () => {
    if (!user) {
      // If user is not logged in, redirect to auth page
      navigate('/auth', { state: { redirectAfterAuth: 'https://www.nursenest.us/nurseapplication' } });
    } else {
      // If user is logged in, redirect directly to the application
      window.location.href = 'https://www.nursenest.us/nurseapplication';
    }
  };

  const handleRequestNurseClick = () => {
    navigate('/apply');
  };

  // Navbar configuration for NurseNest
  const navbarConfig = {
    logo: {
      url: "/",
      src: "",
      alt: "NurseNest",
      title: "NurseNest",
    },
    menu: [
      { title: "Home", url: "/" },
      { title: "Pricing", url: "/pricing" },
      {
        title: "For Nurses",
        url: "#",
        items: [
          {
            title: "Apply Now",
            description: "Join our network of professional nurses",
            icon: <Zap className="size-5 shrink-0" />,
            url: "#apply-now",
          },
          {
            title: "LLC Setup Guide",
            description: "Learn how to set up your nursing LLC",
            icon: <Book className="size-5 shrink-0" />,
            url: "/nurse-llc-setup-guide",
          },
          {
            title: "EIN Applications",
            description: "Get your Employer Identification Number",
            icon: <Trees className="size-5 shrink-0" />,
            url: "/get-ein-nurse-business",
          },
          {
            title: "Business Banking",
            description: "Find the right bank for your nursing business",
            icon: <Sunset className="size-5 shrink-0" />,
            url: "/business-bank-account-for-nurses",
          },
          {
            title: "Malpractice Insurance",
            description: "Protect yourself with the right coverage",
            icon: <Book className="size-5 shrink-0" />,
            url: "/malpractice-insurance-for-nurses",
          },
          {
            title: "1099 Tax Tips",
            description: "Navigate taxes as an independent contractor",
            icon: <Zap className="size-5 shrink-0" />,
            url: "/1099-tax-tips",
          },
        ],
      },
      {
        title: "Care Services",
        url: "#",
        items: [
          {
            title: "Newborn Care",
            description: "Expert care for newborns and new parents",
            icon: <Sunset className="size-5 shrink-0" />,
            url: "/newborn-nurse-support-guide",
          },
          {
            title: "Elderly Care",
            description: "Compassionate care for seniors",
            icon: <Trees className="size-5 shrink-0" />,
            url: "/elderly-care-nurse-services",
          },
          {
            title: "Wound Care",
            description: "Specialized wound care services",
            icon: <Book className="size-5 shrink-0" />,
            url: "/wound-care-nursing-guide",
          },
          {
            title: "Product Reviews",
            description: "Best products for home healthcare",
            icon: <Zap className="size-5 shrink-0" />,
            url: "/best-products-for-home-healthcare",
          },
        ],
      },
    ],
    mobileExtraLinks: [],
    auth: {
      login: { text: user ? "Dashboard" : "Sign In", url: user ? "/dashboard" : "/auth" },
      signup: { text: "Request a Nurse", url: "#request-nurse" },
    },
  };

  const handleNavigation = (url: string, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
    }
    
    if (url === "#apply-now") {
      handleApplyNowClick();
    } else if (url === "#request-nurse") {
      handleRequestNurseClick();
    } else if (url.startsWith('/')) {
      navigate(url);
      window.scrollTo(0, 0);
    }
  };

  // Custom navbar wrapper to maintain existing styling and animations
  return (
    <div className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out',
      // Mobile header positioning: slightly lower
      'mt-3 md:mt-4',
      isScrolled 
        ? 'bg-white/95 backdrop-blur-xl shadow-lg border border-gray-200/50 py-0 mx-4 rounded-2xl' 
        : isHomePageRoute
          ? 'bg-transparent border-transparent py-2 mx-4'
          : 'bg-white border-transparent py-0 mx-4'
    )}>
      <div className="container mx-auto px-6">
        {/* Custom wrapper for the shadcn navbar */}
        <div className={cn(
          "relative",
          // Text color based on scroll state and page
          isScrolled || !isHomePageRoute ? "text-gray-800" : "text-white"
        )}>
          {/* Override the navbar component's section styling */}
          <div className={cn(
            "py-2", // Reduced padding for our design
            "[&_.container]:p-0 [&_.container]:mx-0", // Remove container padding/margin from shadcn component
            "[&_nav]:items-center", // Ensure nav items are centered
          )}>
            <Navbar1 
              {...navbarConfig}
              // Custom logo rendering
              logo={{
                ...navbarConfig.logo,
                title: "",
              }}
            />
          </div>
          
          {/* Custom logo overlay to match existing design */}
          <div className="absolute top-1/2 left-6 transform -translate-y-1/2 flex items-center pointer-events-none">
            <span className="text-3xl md:text-4xl font-bold pointer-events-auto cursor-pointer" onClick={() => navigate('/')}>
              <span className={cn(
                "transition-colors duration-300 ease-in-out",
                isScrolled || !isHomePageRoute ? "text-gray-800" : "text-white"
              )}>Nurse</span>
              <span className="text-[#9bcbff] transition-colors duration-300 ease-in-out">Nest</span>
            </span>
          </div>

          {/* Custom right-side buttons overlay */}
          <div className="absolute top-1/2 right-6 transform -translate-y-1/2 hidden lg:flex items-center space-x-4">
            {/* Sign In/User Menu comes first */}
            {user ? (
              <Button
                onClick={() => navigate('/dashboard')}
                variant="ghost"
                className={cn(
                  "transition-colors duration-300 ease-in-out",
                  isScrolled || !isHomePageRoute
                    ? "text-gray-700 hover:text-brand-primary hover:bg-neutral-light" 
                    : "text-white hover:text-blue-200 hover:bg-white/10"
                )}
              >
                Dashboard
              </Button>
            ) : (
              <Button
                onClick={() => navigate('/auth')}
                variant="ghost"
                className={cn(
                  "transition-colors duration-300 ease-in-out",
                  isScrolled || !isHomePageRoute
                    ? "text-gray-700 hover:text-brand-primary hover:bg-neutral-light" 
                    : "text-white hover:text-blue-200 hover:bg-white/10"
                )}
              >
                Sign In
              </Button>
            )}
            
            {/* Request a Nurse Button with Glow - now second */}
            <div className="relative">
              <GlowEffect
                colors={['#9bcbff', '#3b82f6', '#7dd3fc', '#2563eb']}
                mode="colorShift"
                blur="medium"
                duration={4}
                scale={1.1}
                intensity={0.35}
              />
              <Button
                onClick={handleRequestNurseClick}
                className="relative bg-gradient-to-r from-[#9bcbff] to-[#3b82f6] hover:from-[#7dd3fc] hover:to-[#2563eb] text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Request a Nurse
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
