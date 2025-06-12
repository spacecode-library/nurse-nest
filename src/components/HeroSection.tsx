
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Users, Clock, Star } from 'lucide-react';
import '@/index.css';
import AnimatedSection from './AnimatedSection';
import { Hero } from './AnimatedHero';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Desktop Background */}
      <div className="hidden md:block absolute inset-0">
        <img 
          src="/lovable-uploads/7d6005a3-1dca-4980-bf11-bb34da3a852e.png" 
          alt="Professional nurse providing care" 
          className="w-full h-full object-cover object-center" 
        />
      </div>
      
      {/* Mobile Layout */}
      <div className="md:hidden relative flex-1 flex flex-col">
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url('/lovable-uploads/ce1b982a-1811-48d4-bb03-8510645f5d2e.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        
        {/* Mobile Hero Content */}
        <div className="relative z-10 flex-1 flex items-end">
          <Hero isMobile={true} />
        </div>
      </div>
      
      {/* Desktop Hero Content */}
      <div className="hidden md:flex absolute inset-0 z-10 items-center">
        <div className="w-full">
          <Hero isMobile={false} />
        </div>
      </div>
      
      {/* Trust Indicators - Fixed positioning at bottom with proper spacing */}
      <div className="absolute bottom-0 left-0 right-0 hidden md:block z-20 bg-gradient-to-t from-black/20 to-transparent pt-8 pb-6">
        <AnimatedSection animation="fade-up" delay={400}>
          <div className="container mx-auto px-6">
            <div className="flex flex-wrap items-center justify-center gap-8 text-white/90 bg-black/30 backdrop-blur-sm rounded-2xl mx-auto max-w-4xl py-4 px-6">
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-blue-300" />
                <span className="text-sm font-medium">HIPAA Compliant</span>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-green-300" />
                <span className="text-sm font-medium">Licensed Professionals</span>
              </div>
              <div className="flex items-center space-x-3">
                <Star className="h-5 w-5 text-yellow-300" />
                <span className="text-sm font-medium">Verified Reviews</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-teal-300" />
                <span className="text-sm font-medium">24/7 Support</span>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
