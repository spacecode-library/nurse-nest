
import { Shield, Users, Star, Clock } from "lucide-react";
import { Hero } from "@/components/AnimatedHero";
import AnimatedSection from "@/components/AnimatedSection";

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
      
      {/* PHASE 2: Restructured Mobile Layout - No more centering conflicts */}
      <div className="md:hidden w-full relative h-screen">
        {/* Mobile background image */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url('/lovable-uploads/ce1b982a-1811-48d4-bb03-8510645f5d2e.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        
        {/* PHASE 5: Emergency Fallback Strategy - Separate mobile hero component */}
        <div className="relative z-10 w-full h-full">
          <Hero isMobile={true} />
        </div>
      </div>
      
      {/* Desktop ANIMATED HERO CONTENT - Stabilized centering */}
      <div className="hidden md:flex absolute inset-0 z-10 items-center justify-center" style={{ position: 'absolute', top: '0', left: '0', right: '0', bottom: '0' }}>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Hero isMobile={false} />
        </div>
      </div>
      
      {/* Trust Indicators - Fixed bottom positioning */}
      <div className="absolute z-10 hidden md:block" style={{ bottom: '32px', left: '0', right: '0', position: 'absolute' }}>
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
