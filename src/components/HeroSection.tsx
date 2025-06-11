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
      {/* Desktop Layout - Keep exactly as is */}
      <div className="hidden md:block">
        {/* Rotating Text Overlay - Updated with Roboto fonts */}
        <div className="absolute top-1/2 left-8 md:left-16 transform -translate-y-1/2 z-20">
          <div className="text-left py-0 my-[36px] rounded-none px-0 mx-[199px]">
            <h1 className="text-5xl font-roboto-black font-black mb-2 md:text-7xl my-0 mx-0 px-0 py-0 text-center" style={{
            color: '#9bcbff',
            fontWeight: '900'
          }}>
              Need a nurse?
            </h1>
            <p style={{
            fontWeight: '800'
          }} className="text-2xl md:text-2xl text-white font-roboto-extrabold italic py-0 my-0">
              We make it{' '}
              <RotatingText texts={heroTexts} rotationInterval={2500} highlightColor="#9bcbff" mainClassName="text-white font-roboto-extrabold italic" initial={{
              y: "100%"
            }} animate={{
              y: 0
            }} exit={{
              y: "-100%"
            }} staggerFrom="first" staggerDuration={0.02} splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1" transition={{
              type: "spring",
              damping: 35,
              stiffness: 300,
              duration: 0.6
            }} />
            </p>
            <p style={{
            fontWeight: '400'
          }} className="text-sm mt-4 tracking-wider font-roboto-regular text-left text-zinc-50 md:text-lg mt-4 md:mt-12 pt-8 md:pt-24 my-0 py-[166px]">
              NATIONWIDE CONCIERGE<br />
              NURSING SERVICE<br />
              DELIVERED TO YOUR DOORSTEP.
            </p>
          </div>
        </div>

        {/* Desktop Background */}
        <div className="absolute inset-0">
          <img src="/lovable-uploads/7d6005a3-1dca-4980-bf11-bb34da3a852e.png" alt="Professional nurse providing care" className="w-full h-full object-cover object-center" style={{
          transform: 'none'
        }} />
        </div>
        
        {/* Desktop Content */}
        <div className="container mx-auto px-4 relative z-10 pt-16 md:pt-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <AnimatedSection animation="fade-up">
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
        
        {/* Trust Indicators - Desktop */}
        <div className="absolute bottom-8 left-0 right-0 z-10">
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
      </div>

      {/* Mobile Layout - Fixed positioning */}
      <div className="md:hidden w-full relative min-h-screen flex flex-col">
        {/* Mobile Hero Image - Full screen */}
        <div className="flex-1 relative" style={{
          backgroundImage: `url('/lovable-uploads/ce1b982a-1811-48d4-bb03-8510645f5d2e.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '100vh'
        }}>
          {/* Mobile Text Overlay - Positioned relative to woman's face */}
          <div className="absolute inset-0 z-10 flex flex-col justify-start items-center pt-20">
            {/* Header Text - Positioned near forehead area */}
            <div className="text-center px-4 mb-2">
              <h1 className="text-3xl font-roboto-black font-black text-[#9bcbff] leading-tight">
                Need a nurse?
              </h1>
              <p className="text-xl font-roboto-extrabold italic text-white mt-1">
                We make it Pain-Free
              </p>
            </div>
            
            {/* Description Text - Positioned at chin level */}
            <div className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2 px-6">
              <p className="text-sm font-roboto-regular text-white text-center tracking-wider leading-relaxed">
                NATIONWIDE CONCIERGE<br />
                NURSING SERVICE<br />
                DELIVERED TO YOUR DOORSTEP.
              </p>
            </div>
          </div>

          {/* Mobile Request a Nurse Button - Bottom positioned, smaller size */}
          <div className="absolute bottom-20 left-4 right-4 z-20">
            <AnimatedSection animation="fade-up">
              <Link to="/apply" className="block">
                <Button className="w-full bg-brand-primary hover:bg-brand-primary/90 text-brand-navy px-6 py-3 text-base rounded-lg shadow-lg font-semibold h-12">
                  Request A Nurse
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
}
