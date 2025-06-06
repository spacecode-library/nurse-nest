import React, { useEffect, useRef } from 'react';
import AnimatedSection from './AnimatedSection';

export default function AboutMeSection() {
  const signatureRef = useRef<SVGPathElement>(null);
  
  useEffect(() => {
    // Animate the signature when it comes into view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && signatureRef.current) {
            const path = signatureRef.current;
            const length = path.getTotalLength();
            
            // Set up the starting position
            path.style.strokeDasharray = `${length}`;
            path.style.strokeDashoffset = `${length}`;
            
            // Trigger the animation
            setTimeout(() => {
              path.style.transition = 'stroke-dashoffset 2s ease-out';
              path.style.strokeDashoffset = '0';
            }, 800);
            
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    
    // Start observing the signature
    const signature = document.getElementById('signature-animation');
    if (signature) {
      observer.observe(signature);
    }
    
    return () => {
      if (signature) {
        observer.unobserve(signature);
      }
    };
  }, []);
  
  return (
    <section 
      className="py-16 md:py-20 relative overflow-hidden" 
      id="about-me"
      style={{
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f1f5f9 100%)'
      }}
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-4 h-4 border border-brand-blue/20 rotate-45"></div>
        <div className="absolute top-40 right-20 w-3 h-3 border border-brand-primary/20 rounded-full"></div>
        <div className="absolute bottom-32 left-1/4 w-5 h-5 border border-brand-blue/20 rotate-12"></div>
        <div className="absolute bottom-20 right-1/3 w-2 h-2 bg-brand-primary/10 rounded-full"></div>
        <div className="absolute top-1/3 left-3/4 w-3 h-3 border border-brand-blue/15 rotate-45"></div>
        <div className="absolute bottom-1/3 left-1/6 w-2 h-2 bg-brand-primary/15 rounded-full"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <AnimatedSection animation="fade-up" className="text-center mb-12">
          <h2 
            className="text-4xl md:text-5xl font-light mb-6 tracking-wide"
            style={{ 
              fontFamily: 'Arial, Helvetica, sans-serif',
              color: '#1e293b',
              letterSpacing: '2px'
            }}
          >
            Meet the Founder
          </h2>
          <div className="w-48 h-3 bg-brand-primary mx-auto rounded-full mb-4"></div>
          <p className="text-lg text-neutral-dark font-normal max-w-2xl mx-auto leading-relaxed">
            The healthcare professional behind Nurse Nest's mission
          </p>
        </AnimatedSection>

        <div className="max-w-5xl mx-auto">
          {/* Modern Two-Column Card Design */}
          <div 
            className="bg-white/95 backdrop-blur-sm rounded-2xl border border-white/50"
            style={{
              boxShadow: '0 20px 40px rgba(30, 41, 59, 0.08), 0 8px 16px rgba(30, 41, 59, 0.04)'
            }}
          >
            <div className="flex flex-col lg:flex-row">
              {/* Left Column - Profile & Credentials (60%) */}
              <div className="lg:w-3/5 p-8 lg:p-12 bg-gradient-to-br from-blue-50/80 to-white rounded-l-2xl">
                <AnimatedSection animation="fade-up" className="text-center">
                  {/* Enlarged Profile Picture */}
                  <div className="relative mb-6">
                    <div 
                      className="w-56 h-56 md:w-64 md:h-64 rounded-full overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 mx-auto"
                      style={{
                        border: '5px solid #9bcbff'
                      }}
                    >
                      <img
                        src="/lovable-uploads/9daccab5-730e-4656-81e6-a31931f7d3f6.png"
                        alt="Jayson M."
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                  </div>
                  
                  {/* Founder Name & Title - Tight Grouping */}
                  <div className="space-y-1">
                    <h3 
                      className="text-4xl md:text-5xl font-bold"
                      style={{ 
                        fontFamily: 'Arial, Helvetica, sans-serif',
                        color: '#1e293b',
                        fontSize: '32px'
                      }}
                    >
                      Jayson M.
                    </h3>
                    <p 
                      className="text-base font-medium"
                      style={{ 
                        fontFamily: 'Arial, Helvetica, sans-serif',
                        color: '#64748b',
                        fontSize: '16px'
                      }}
                    >
                      Founder of Nurse Nest
                    </p>
                  </div>
                  
                  {/* Decorative accent */}
                  <div className="w-20 h-px bg-brand-primary/40 mx-auto mt-4"></div>
                </AnimatedSection>
              </div>
              
              {/* Right Column - Story Content (40%) */}
              <div className="lg:w-2/5 p-8 lg:p-12">
                <AnimatedSection animation="fade-up" delay={150}>
                  <div 
                    className="space-y-6"
                    style={{ 
                      fontFamily: 'Arial, Helvetica, sans-serif',
                      color: '#475569',
                      fontSize: '18px',
                      lineHeight: '1.6'
                    }}
                  >
                    <p className="font-medium text-xl" style={{ color: '#1e293b' }}>
                      Hi, I'm Jayson — Thank you so much for being here.
                    </p>
                    
                    <div className="w-12 h-px bg-brand-primary/30"></div>
                    
                    <p>
                      I started my nursing journey in 2008, and I'll be honest—it didn't start smoothly. I struggled through my first semester of nursing school and seriously questioned whether I could do it.
                    </p>
                    
                    <p>
                      Since then, I've worked in over 10 hospitals and nearly every type of critical care environment. In 2016, I transitioned into travel nursing, where I've continued to grow and learn.
                    </p>
                    
                    <p>
                      Along the way, I've seen how challenging it can be for families to find the right in-home nurse—and how difficult it is for nurses to navigate constant credentialing.
                    </p>
                    
                    <p>
                      I created Nurse Nest to make things better. This platform exists to simplify the process for both clients and nurses, offering a thoughtful, transparent way to connect.
                    </p>
                    
                    <p className="font-semibold text-lg" style={{ color: '#1e293b' }}>
                      If you have any questions or just want to connect, I'd love to hear from you.
                    </p>
                  </div>
                </AnimatedSection>
              </div>
            </div>
            
            {/* Signature Section - Reduced Padding */}
            <div className="px-8 lg:px-12 py-4 border-t border-brand-primary/10">
              <div className="text-center" id="signature-animation">
                <div className="py-2">
                  <div className="w-16 h-px bg-brand-primary/20 mx-auto mb-2"></div>
                </div>
                <img 
                  src="/lovable-uploads/16f8aab2-52ef-4d03-a067-775c04042d1f.png"
                  alt="Jayson Hinagawa Signature"
                  className="h-24 md:h-32 w-auto mx-auto opacity-90"
                  style={{
                    filter: 'brightness(0.1) sepia(1) saturate(10) hue-rotate(190deg)',
                    maxWidth: '400px'
                  }}
                />
                <div className="py-2">
                  <div className="w-16 h-px bg-brand-primary/20 mx-auto mt-2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
