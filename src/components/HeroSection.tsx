
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import '@/index.css';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Hero Image Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/lovable-uploads/8f74e0c5-9c2c-45c8-8588-e7b4fa1b1440.png" 
          alt="Nurse in a box delivered to doorstep" 
          className="w-full h-full object-cover"
        />
        {/* Dark overlay for better text visibility */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      {/* Hero Content */}
      <div className="container-custom relative z-10 pt-16 md:pt-24">
        <div className="mt-12 md:mt-0 ml-4 lg:ml-6">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6 text-white drop-shadow-lg">
              <div>Specialized Nurses</div>
              <div>
                <span className="relative">
                  <span className="animate-fade-in-delivered text-blue-400">Delivered</span>
                </span> to
              </div>
              <div>Your Doorstep</div>
            </h1>
            <p className="text-base md:text-lg text-white mb-8 max-w-lg drop-shadow-md">
              Nationwide nurse-matching for newborns, elderly loved ones, and private practices — all backed by real clinical experience.
            </p>
            <div>
              <Link to="/apply">
                <Button id="hero-cta-button" className="bg-nurse-dark hover:bg-primary-700 text-white shadow-lg">
                  Request a Nurse
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
