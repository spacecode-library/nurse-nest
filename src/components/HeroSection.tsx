import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Users, Clock, Star } from 'lucide-react';
import '@/index.css';
import AnimatedSection from './AnimatedSection';
import RotatingText from './RotatingText';
export default function HeroSection() {
  const heroTexts = ["Easy", "Pain-Free", "Trusted", "Nationwide", "Worry-Free"];
  return <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Desktop Text Overlay - Only visible on desktop */}
      <div className="hidden md:block absolute top-1/2 left-8 md:left-16 transform -translate-y-1/2 z-20">
        <div className="text-left py-0 my-[36px] rounded-none px-0 mx-0 md:mx-[199px]">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-roboto-black font-black mb-2 my-0 mx-0 px-0 py-0 text-center md:text-left" style={{
          color: '#9bcbff',
          fontWeight: '900'
        }}>
            Need a nurse?
          </h1>
          <p style={{
          fontWeight: '800'
        }} className="text-xl md:text-2xl text-white font-roboto-extrabold italic py-0 my-0 text-center md:text-left">
            We make it{' '}
            <RotatingText texts={heroTexts} rotationInterval={2500} highlightColor="#9bcbff" mainClassName="text-white font-roboto-extrabold italic" initial={{
            y: "100%"
          }} animate={{
            y: 0
          }} exit={{
            y: "-100%"
          }} staggerFrom="first" staggerDuration={0.02} splitLevelClassName="overflow-hidden pb-0.5" transition={{
            type: "spring",
            damping: 35,
            stiffness: 300,
            duration: 0.6
          }} />
          </p>
          <p style={{
          fontWeight: '400'
        }} className="text-sm mt-4 tracking-wider font-roboto-regular text-center md:text-left text-zinc-50 md:text-lg md:mt-12 pt-4 md:pt-8 py-4 md:py-[166px]">
            NATIONWIDE CONCIERGE<br />
            NURSING SERVICE<br />
            DELIVERED TO YOUR DOORSTEP.
          </p>
        </div>
      </div>

      {/* Mobile Text Overlay - Only visible on mobile */}
      <div className="md:hidden mobile-hero-container absolute inset-0 z-20 flex flex-col">
        {/* Mobile Header positioned at forehead level */}
        <div className="mobile-hero-header absolute top-[20%] left-0 right-0 text-center px-4">
          <h1 className="text-3xl font-roboto-black font-black mb-2" style={{
          color: '#9bcbff',
          fontWeight: '900'
        }}>
            Need a nurse?
          </h1>
          <p className="text-lg text-white font-roboto-extrabold italic" style={{
          fontWeight: '800'
        }}>
            We make it{' '}
            <RotatingText texts={heroTexts} rotationInterval={2500} highlightColor="#9bcbff" mainClassName="text-white font-roboto-extrabold italic" initial={{
            y: "100%"
          }} animate={{
            y: 0
          }} exit={{
            y: "-100%"
          }} staggerFrom="first" staggerDuration={0.02} splitLevelClassName="overflow-hidden pb-0.5" transition={{
            type: "spring",
            damping: 35,
            stiffness: 300,
            duration: 0.6
          }} />
          </p>
        </div>

        {/* Mobile Description positioned at chin level */}
        <div className="mobile-hero-description absolute top-[60%] left-0 right-0 text-center px-4">
          <p style={{
          fontWeight: '400'
        }} className="text-xs tracking-wider font-roboto-regular text-zinc-50 my-[150px]">
            NATIONWIDE CONCIERGE<br />
            NURSING SERVICE<br />
            DELIVERED TO YOUR DOORSTEP.
          </p>
        </div>

        {/* Mobile Request A Nurse Button - compact and properly positioned */}
        <div className="mobile-hero-button absolute bottom-24 left-4 right-4">
          <AnimatedSection animation="fade-up">
            <Link to="/apply" className="block">
              <Button className="mobile-cta-button w-full bg-brand-primary hover:bg-brand-primary/90 text-brand-navy px-4 py-2 text-sm rounded-xl shadow-lg font-semibold max-w-xs mx-auto flex items-center justify-center">
                Request A Nurse
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </AnimatedSection>
        </div>
      </div>

      {/* Desktop Background - New static image with full coverage */}
      <div className="hidden md:block absolute inset-0">
        <img src="/lovable-uploads/7d6005a3-1dca-4980-bf11-bb34da3a852e.png" alt="Professional nurse providing care" className="w-full h-full object-cover object-center" style={{
        transform: 'none'
      }} />
      </div>
      
      {/* Mobile Layout - New mobile background */}
      <div className="md:hidden w-full relative min-h-screen">
        {/* Mobile Hero Image - Full screen */}
        <div className="flex-1 relative" style={{
        backgroundImage: `url('/lovable-uploads/ce1b982a-1811-48d4-bb03-8510645f5d2e.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: 'calc(100vh - 80px)'
      }}>
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
    </section>;
}