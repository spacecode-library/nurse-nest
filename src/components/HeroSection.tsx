
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Users, Clock, Star } from 'lucide-react';
import '@/index.css';
import AnimatedSection from './AnimatedSection';
import { Hero } from './AnimatedHero';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Desktop Background - Preserved */}
      <div className="hidden md:block absolute inset-0">
        <img 
          src="/lovable-uploads/7d6005a3-1dca-4980-bf11-bb34da3a852e.png" 
          alt="Professional nurse providing care" 
          className="w-full h-full object-cover object-center" 
          style={{ transform: 'none' }} 
        />
      </div>
      
      {/* Mobile Layout - Repositioned to bottom alignment */}
      <div className="md:hidden w-full relative min-h-screen flex items-end pb-6">
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url('/lovable-uploads/ce1b982a-1811-48d4-bb03-8510645f5d2e.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        
        {/* Mobile Hero Content - Positioned at bottom */}
        <div className="relative z-10 w-full px-4">
          <Hero isMobile={true} />
        </div>
      </div>
      
      {/* Desktop ANIMATED HERO CONTENT - Centered positioning */}
      <div className="hidden md:flex absolute inset-0 z-10 items-center justify-center">
        <Hero isMobile={false} />
      </div>
      
      {/* Trust Indicators - Preserved at bottom for desktop only */}
      <div className="absolute bottom-8 left-0 right-0 hidden md:block z-10">
        <AnimatedSection animation="fade-up" delay={400}>
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center justify-center gap-8 text-white/80">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-blue-300" />
                <span className="text-sm">HIPAA Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-green-300" />
                <span className="text-sm">Licensed Professionals</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-300" />
                <span className="text-sm">Verified Reviews</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-teal-300" />
                <span className="text-sm">24/7 Support</span>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
