
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Users, Clock, Star } from 'lucide-react';
import '@/index.css';
import AnimatedSection from './AnimatedSection';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Desktop Background - Keep existing desktop hero unchanged */}
      <div className="hidden md:block absolute inset-0">
        <img 
          src="/lovable-uploads/d26f2a2e-9eb9-4d20-87e7-979b6954da43.png" 
          alt="Need a nurse? We make it easy." 
          className="w-full h-full object-cover"
          style={{
            objectPosition: '20% center'
          }}
        />
      </div>
      
      {/* NEW Mobile Layout - Complete replacement with nurse background */}
      <div className="md:hidden w-full relative min-h-screen">
        {/* Mobile Background - New nurse image with built-in text */}
        <div className="absolute inset-0">
          <img 
            src="/lovable-uploads/1efc2a46-b1ce-450d-8694-25066ad43f85.png" 
            alt="Need a nurse? We make it easy." 
            className="w-full h-full object-cover"
            style={{
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
        </div>
        
        {/* Mobile Content - Request a Nurse button positioned lower */}
        <div className="relative z-10 container mx-auto px-4 min-h-screen flex flex-col justify-center">
          <AnimatedSection animation="fade-up">
            <div className="text-center">
              {/* Request a Nurse Button - positioned lower, above description text */}
              <div className="mt-96 pt-24">
                <Link to="/apply">
                  <Button 
                    className="text-white px-8 py-4 text-lg rounded-xl shadow-lg font-semibold min-h-[44px] transition-all duration-300 hover:shadow-xl"
                    style={{
                      backgroundColor: '#9bcbff',
                      color: '#1e293b'
                    }}
                  >
                    Request A Nurse
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
      
      {/* Desktop Content - Keep existing desktop content unchanged */}
      <div className="hidden md:block container mx-auto px-4 relative z-10 pt-16 md:pt-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column - Subtle CTA for Desktop */}
          <div className="space-y-8">
            <AnimatedSection animation="fade-up">
              {/* Desktop CTA positioned to complement the background image */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 mt-96">
                <Link to="/apply">
                  <Button 
                    className="text-brand-navy px-8 py-4 text-lg rounded-xl shadow-lg font-semibold transform hover:scale-105 transition-all duration-300"
                    style={{
                      backgroundColor: '#9bcbff'
                    }}
                  >
                    Request A Nurse
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                
                <Link to="/auth">
                  <Button className="bg-white text-slate-800 hover:bg-white border-2 border-white/20 px-8 py-4 text-lg rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 backdrop-blur-sm font-semibold">
                    Join as a Nurse
                  </Button>
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
      
      {/* Trust Indicators - Desktop only, moved much lower on the page */}
      <div className="absolute bottom-8 left-0 right-0 hidden md:block">
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
