
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Users, Star, Clock } from 'lucide-react';
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
        {/* Mobile Background - Updated with new image */}
        <div className="absolute inset-0">
          <img 
            src="/lovable-uploads/4fc18a45-a3a3-4dae-be8a-ef43f145758e.png" 
            alt="Need a nurse? We make it easy." 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 pt-24 pb-16 min-h-screen flex flex-col justify-center">
          <AnimatedSection animation="fade-up">
            <div className="text-center space-y-6">
              {/* Description text first */}
              <div className="space-y-4 mb-6">
                <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                  Need a nurse?
                  <br />
                  <span className="italic">We make it easy.</span>
                </h1>
                <div className="space-y-2 text-white/90 text-lg">
                  <p>Premium concierge nursing service nationwide.</p>
                  <p>We source, vet, match, and manage payments</p>
                  <p>so you focus on what matters.</p>
                  <p className="font-semibold">Licensed nurses for every care need.</p>
                </div>
              </div>
              
              {/* Request a Nurse Button - Positioned just above the description text area */}
              <div className="mb-8">
                <Link to="/apply">
                  <Button className="w-full md:w-auto bg-[#9bcbff] hover:bg-[#7dd3fc] text-[#1e293b] px-8 py-4 text-lg rounded-xl shadow-lg font-semibold transform hover:scale-105 transition-all duration-300">
                    Request A Nurse
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
      
      {/* Desktop Content - Updated button styling to match reference */}
      <div className="hidden md:block container mx-auto px-4 relative z-10 pt-16 md:pt-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column - Updated button styling */}
          <div className="space-y-8">
            <AnimatedSection animation="fade-up">
              {/* Desktop CTA positioned to complement the background image */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 mt-96">
                <Link to="/apply">
                  <Button className="bg-[#9bcbff] hover:bg-[#7dd3fc] text-[#1e293b] px-8 py-4 text-lg rounded-xl shadow-lg font-semibold transform hover:scale-105 transition-all duration-300">
                    Request A Nurse
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                
                <Link to="/auth">
                  <Button className="bg-white hover:bg-gray-50 text-[#1e293b] border border-gray-300 px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-semibold">
                    Join as a Nurse
                  </Button>
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
      
      {/* Trust Indicators - Desktop only, moved much lower on the page with icons restored */}
      <div className="absolute bottom-8 left-0 right-0 hidden md:block">
        <AnimatedSection animation="fade-up" delay={400}>
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center justify-center gap-8 text-white/80">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span className="text-sm">HIPAA Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span className="text-sm">Licensed Professionals</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4" />
                <span className="text-sm">Verified Reviews</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span className="text-sm">24/7 Support</span>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
