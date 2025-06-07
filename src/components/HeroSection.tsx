import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Users, Clock, Star } from 'lucide-react';
import '@/index.css';
import AnimatedSection from './AnimatedSection';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Desktop Background - Keep unchanged */}
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
      
      {/* Mobile Layout - Complete replacement with new background */}
      <div className="md:hidden w-full relative min-h-screen">
        {/* Mobile Background - New hero image with text overlay */}
        <div className="absolute inset-0">
          <img 
            src="/lovable-uploads/167f6ad3-c278-4101-99c7-b5c62d32d956.png" 
            alt="Need a nurse? We make it easy." 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 pt-24 pb-16 min-h-screen flex flex-col justify-end">
          <AnimatedSection animation="fade-up">
            <div className="text-center space-y-6 mb-8">
              {/* Request a Nurse Button - Positioned above the text from image */}
              <div className="mb-6">
                <Link to="/apply">
                  <Button className="w-full md:w-auto bg-[#3b82f6] hover:bg-[#2563eb] text-white px-8 py-4 text-lg rounded-xl shadow-lg font-semibold transform hover:scale-105 transition-all duration-300">
                    Request A Nurse
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
              
              {/* Trust Indicators at bottom for mobile */}
              <div className="grid grid-cols-2 gap-4 text-white/90 text-shadow">
                <div className="flex items-center justify-center space-x-2">
                  <Shield className="h-4 w-4 text-blue-300" />
                  <span className="text-sm font-medium">HIPAA Compliant</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Users className="h-4 w-4 text-green-300" />
                  <span className="text-sm font-medium">Licensed Professionals</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-300" />
                  <span className="text-sm font-medium">Verified Reviews</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Clock className="h-4 w-4 text-teal-300" />
                  <span className="text-sm font-medium">24/7 Support</span>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
      
      {/* Desktop Content - Keep unchanged */}
      <div className="hidden md:block container mx-auto px-4 relative z-10 pt-16 md:pt-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column - Subtle CTA for Desktop */}
          <div className="space-y-8">
            <AnimatedSection animation="fade-up">
              {/* Desktop CTA positioned to complement the background image */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 mt-96">
                <Link to="/apply">
                  <Button className="bg-brand-primary hover:bg-brand-primary/90 text-brand-navy px-8 py-4 text-lg rounded-xl shadow-lg font-semibold transform hover:scale-105 transition-all duration-300">
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
