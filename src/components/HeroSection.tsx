
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import '@/index.css';
import AnimatedSection from './AnimatedSection';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Hero Image Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/lovable-uploads/8f74e0c5-9c2c-45c8-8588-e7b4fa1b1440.png" 
          alt="Nurse in a box delivered to doorstep" 
          className="w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
        />

        {/* Dark overlay for better text visibility */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      {/* Hero Content */}
      <div className="container-custom relative z-10 pt-16 md:pt-24">
        <div className="mt-12 md:mt-0">
          <AnimatedSection animation="fade-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6 text-white drop-shadow-lg">
              <div>Specialized Nurses</div>
              <div>
                <span className="relative">
                  <span className="text-blue-400 italic animate-pulse-slow">Delivered</span>
                </span> to
              </div>
              <div>Your Doorstep</div>
            </h1>
            <p className="text-base md:text-lg text-white mb-8 max-w-xl drop-shadow-md">
              Your Personal Nurse, One Tap Away. Nurse Nest's nationwide platform rigorously vets healthcare professionals, coordinates consultations, delivers qualified nurses to your home, and handles all payments directly. Premium care on your terms, anytime you need it.
            </p>
            <div>
              <Link to="/apply">
                <Button id="hero-cta-button" className="bg-nurse-dark hover:bg-primary-700 text-white shadow-lg button-hover-effect">
                  Request a Nurse
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
