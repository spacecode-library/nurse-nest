import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Users, Clock, Star } from 'lucide-react';
import '@/index.css';
import AnimatedSection from './AnimatedSection';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Premium Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-teal-900">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:24px_24px]"></div>
        </div>
        
        {/* Floating elements for depth */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 left-16 w-48 h-48 bg-gradient-to-tr from-teal-400/20 to-green-400/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-teal-400/10 rounded-full blur-3xl"></div>
      </div>
      
      {/* Hero Content */}
      <div className="container mx-auto px-4 relative z-10 pt-16 md:pt-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column - Main Content */}
          <div className="space-y-8">
            <AnimatedSection animation="fade-up">
              {/* Platform badge */}
              <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-white/90 text-sm mb-6">
                <Shield className="h-4 w-4 mr-2 text-blue-300" />
                Professional Healthcare Marketplace
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
                <div className="mb-2">Connect with</div>
                <div className="bg-gradient-to-r from-blue-300 via-teal-300 to-green-300 bg-clip-text text-transparent mb-2">
                  Licensed Nurses
                </div>
                <div>On-Demand</div>
              </h1>
              
              <p className="text-xl text-blue-100 leading-relaxed max-w-xl">
                The trusted platform where healthcare professionals and clients connect. 
                Find qualified nurses for your specific needs or offer your professional services.
              </p>
              
              {/* Dual CTA */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/apply">
                  <Button className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white px-8 py-4 text-lg rounded-xl shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300 group">
                    Find a Nurse
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
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
          
          {/* Right Column - Platform Preview */}
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
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-xl">
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