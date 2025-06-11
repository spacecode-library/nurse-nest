
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Users, Clock, Star } from 'lucide-react';
import '@/index.css';
import AnimatedSection from './AnimatedSection';
import RotatingText from './RotatingText';

export default function HeroSection() {
  const heroTexts = ["Easy", "Pain-Free", "Trusted", "Nationwide", "Worry-Free"];
  
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Rotating Text Overlay - Updated with Old Standard TT font */}
      <div className="absolute top-1/2 left-8 md:left-16 transform -translate-y-1/2 z-20">
        <div className="text-left">
          <h1 className="text-5xl font-old-standard font-bold mb-2 text-sky-200 md:text-7xl">
            Need a nurse?
          </h1>
          <p className="text-2xl md:text-2xl text-white/90 font-old-standard font-bold">
            We make it{' '}
            <RotatingText 
              texts={heroTexts} 
              rotationInterval={1500} 
              highlightColor="#9bcbff" 
              mainClassName="text-white font-old-standard font-bold italic" 
              initial={{
                y: "100%"
              }} 
              animate={{
                y: 0
              }} 
              exit={{
                y: "-120%"
              }} 
              staggerFrom="last" 
              staggerDuration={0.025} 
              splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1" 
              transition={{
                type: "spring",
                damping: 30,
                stiffness: 400
              }} 
            />
          </p>
          <p className="text-sm mt-4 tracking-wider font-old-standard text-left text-zinc-50 font-bold md:text-lg py-[84px]">
            NATIONWIDE CONCIERGE<br />
            NURSING SERVICE<br />
            DELIVERED TO YOUR DOORSTEP.
          </p>
        </div>
      </div>

      {/* Desktop Background - New static image with full coverage */}
      <div className="hidden md:block absolute inset-0">
        <img 
          src="/lovable-uploads/7d6005a3-1dca-4980-bf11-bb34da3a852e.png" 
          alt="Professional nurse providing care" 
          className="w-full h-full object-cover object-center" 
          style={{
            transform: 'none'
          }} 
        />
      </div>
      
      {/* Mobile Layout - New mobile background */}
      <div className="md:hidden w-full relative min-h-screen flex flex-col">
        {/* Mobile Hero Image - Full screen */}
        <div 
          className="flex-1 relative" 
          style={{
            backgroundImage: `url('/lovable-uploads/ce1b982a-1811-48d4-bb03-8510645f5d2e.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: 'calc(100vh - 80px)'
          }}
        >
          {/* Request a Nurse Button - positioned at bottom */}
          <div className="absolute bottom-8 left-4 right-4 z-20">
            <AnimatedSection animation="fade-up">
              <Link to="/apply" className="block">
                <Button className="w-full bg-brand-primary hover:bg-brand-primary/90 text-brand-navy px-8 py-4 text-lg rounded-xl shadow-lg font-semibold">
                  Request A Nurse
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </div>
      
      {/* Desktop Content - Minimal overlay since image contains text */}
      <div className="hidden md:block container mx-auto px-4 relative z-10 pt-16 md:pt-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column - Subtle CTA for Desktop */}
          <div className="space-y-8">
            <AnimatedSection animation="fade-up">
              {/* Desktop CTA positioned to complement the background image */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 mt-96">
                <Link to="/apply" className="py-0 px-[38px]">
                  <Button className="bg-brand-primary hover:bg-brand-primary/90 text-brand-navy px-8 py-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 text-lg font-semibold">
                    Request A Nurse
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                
                <Link to="/auth">
                  <Button className="bg-white/95 text-slate-800 hover:bg-white border-2 border-white/20 px-8 py-4 text-lg rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 backdrop-blur-sm font-semibold">
                    Join as a Nurse
                  </Button>
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
      
      {/* Trust Indicators - Moved much lower on the page */}
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
