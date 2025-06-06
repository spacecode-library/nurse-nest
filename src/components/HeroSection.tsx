import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Users, Clock, Star } from 'lucide-react';
import '@/index.css';
import AnimatedSection from './AnimatedSection';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Desktop Background - Full Canva Image */}
      <div className="hidden md:block absolute inset-0">
        <img 
          src="/lovable-uploads/74400556-f2a0-450a-9bbc-ad462e3d20c7.png" 
          alt="Need a nurse? We make it easy." 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Mobile Layout - Clean White Background */}
      <div className="md:hidden w-full bg-white">
        <div className="container mx-auto px-4 pt-24 pb-16">
          <AnimatedSection animation="fade-up">
            {/* Mobile Hero Image */}
            <div className="mb-8">
              <img 
                src="/lovable-uploads/aa259e38-4b67-4f28-9b10-39e924acad54.png" 
                alt="Professional nurse smiling" 
                className="w-full h-64 object-cover rounded-2xl shadow-lg"
              />
            </div>
            
            {/* Mobile Header Content */}
            <div className="text-center space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                <span className="text-brand-primary">Need a nurse?</span>
                <br />
                <span className="text-gray-600 font-normal italic">We make it easy.</span>
              </h1>
              
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p className="text-lg font-medium">
                  PREMIUM CONCIERGE NURSING SERVICE NATIONWIDE.
                </p>
                <p className="text-base">
                  WE SOURCE, VET, MATCH, AND MANAGE PAYMENTS
                  <br />
                  SO YOU FOCUS ON WHAT MATTERS.
                </p>
                <p className="text-lg font-medium text-brand-navy">
                  LICENSED NURSES FOR EVERY CARE NEED.
                </p>
              </div>
              
              {/* Mobile CTA Button */}
              <div className="pt-6">
                <Link to="/apply">
                  <Button className="w-full md:w-auto bg-brand-primary hover:bg-brand-primary/90 text-brand-navy px-8 py-4 text-lg rounded-xl shadow-lg font-semibold">
                    Request A Nurse
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </AnimatedSection>
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
          
          {/* Right Column - Platform Preview (keeping existing for desktop) */}
          <AnimatedSection animation="fade-up" delay={200} className="relative">
            <div className="relative">
              {/* Main Card */}
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-slate-800">Available Nurses</h3>
                    <div className="flex items-center space-x-1 text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">Live</span>
                    </div>
                  </div>
                  
                  {/* Nurse Cards Preview */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-2xl">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold">
                        SM
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-slate-800">Sarah M.</div>
                        <div className="text-sm text-slate-600">ICU Specialist • 8 years exp</div>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-current" />
                            ))}
                          </div>
                          <span className="text-xs text-slate-500">5.0 (127 reviews)</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-slate-800">$85/hr</div>
                        <div className="text-xs text-green-600">Available now</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-2xl">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                        MJ
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-slate-800">Maria J.</div>
                        <div className="text-sm text-slate-600">Pediatric Nurse • 12 years exp</div>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-current" />
                            ))}
                          </div>
                          <span className="text-xs text-slate-500">4.9 (203 reviews)</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-slate-800">$90/hr</div>
                        <div className="text-xs text-blue-600">Available tomorrow</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-2xl">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                        DL
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-slate-800">David L.</div>
                        <div className="text-sm text-slate-600">Home Health • 15 years exp</div>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-current" />
                            ))}
                          </div>
                          <span className="text-xs text-slate-500">5.0 (89 reviews)</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-slate-800">$75/hr</div>
                        <div className="text-xs text-green-600">Available now</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* View More Button */}
                  <Button className="w-full bg-brand-primary text-brand-navy rounded-xl">
                    View All Nurses
                  </Button>
                </div>
              </div>
              
              {/* Floating Stats Cards */}
              <div className="absolute -top-4 -left-4 bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-white/20">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-800">Active Nurses</div>
                    <div className="text-xs text-slate-600">24/7 availability</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -right-4 bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-white/20">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-800">Quick Response</div>
                    <div className="text-xs text-slate-600">Avg 2 hours</div>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
        
        {/* Trust Indicators */}
        <AnimatedSection animation="fade-up" delay={400} className="mt-16">
          <div className="flex flex-wrap items-center justify-center gap-8 text-white/70">
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
        </AnimatedSection>
      </div>
    </section>
  );
}
