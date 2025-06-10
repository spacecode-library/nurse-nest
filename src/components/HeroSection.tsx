import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Users, Clock, Star } from 'lucide-react';
import '@/index.css';
import AnimatedSection from './AnimatedSection';
export default function HeroSection() {
  return <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Desktop Background - New Hero Image */}
      <div className="hidden md:block absolute inset-0">
        <img src="/lovable-uploads/9067393e-65f2-441b-9af1-b3646163052f.png" alt="Need a nurse? We make it easy." className="w-full h-full object-cover" />
      </div>
      
      {/* Mobile Layout - Updated with new image */}
      <div className="md:hidden w-full relative min-h-screen flex flex-col">
        {/* Mobile Hero Image - Full screen */}
        <div className="flex-1 relative" style={{
        backgroundImage: `url('/lovable-uploads/24cf5331-b151-4c38-a13e-c496ba867ace.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: 'calc(100vh - 80px)'
      }}>
          {/* Request a Nurse Button - positioned at bottom */}
          <div className="absolute bottom-8 left-4 right-4">
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
                <Link to="/apply">
                  <Button className="bg-brand-primary hover:bg-brand-primary/90 text-brand-navy px-8 py-4 rounded-xl shadow-lg font-semibold transform hover:scale-105 transition-all duration-300 text-lg">
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
    </section>;
}