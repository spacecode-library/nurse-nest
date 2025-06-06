
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
      className="section-padding relative overflow-hidden" 
      id="about-me"
      style={{
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f1f5f9 100%)'
      }}
    >
      {/* Enhanced subtle medical pattern overlay */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-4 h-4 border border-brand-blue/20 rotate-45"></div>
        <div className="absolute top-40 right-20 w-3 h-3 border border-brand-primary/20 rounded-full"></div>
        <div className="absolute bottom-32 left-1/4 w-5 h-5 border border-brand-blue/20 rotate-12"></div>
        <div className="absolute bottom-20 right-1/3 w-2 h-2 bg-brand-primary/10 rounded-full"></div>
        <div className="absolute top-1/3 left-3/4 w-3 h-3 border border-brand-blue/15 rotate-45"></div>
        <div className="absolute bottom-1/3 left-1/6 w-2 h-2 bg-brand-primary/15 rounded-full"></div>
      </div>
      
      <div className="container-custom relative z-10">
        {/* Section Header */}
        <AnimatedSection animation="fade-up" className="text-center mb-20">
          <h2 
            className="text-4xl md:text-5xl font-light mb-8 tracking-wide"
            style={{ 
              fontFamily: 'Arial, Helvetica, sans-serif',
              color: '#1e293b',
              letterSpacing: '2px'
            }}
          >
            Meet the Founder
          </h2>
          <div className="w-40 h-2 bg-brand-primary mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-neutral-dark font-normal max-w-2xl mx-auto leading-relaxed">
            The healthcare professional behind Nurse Nest's mission
          </p>
        </AnimatedSection>

        <div className="max-w-6xl mx-auto">
          {/* Enhanced content card with better spacing */}
          <div 
            className="bg-white rounded-3xl p-16 md:p-20 border border-brand-primary/20"
            style={{
              boxShadow: '0 25px 50px rgba(30, 41, 59, 0.15)'
            }}
          >
            <div className="flex flex-col lg:flex-row gap-16 items-start">
              {/* Profile Section - Left Side */}
              <AnimatedSection 
                animation="fade-up" 
                className="flex-shrink-0"
              >
                <div className="text-center">
                  {/* Larger Profile Picture */}
                  <div className="relative mb-8">
                    <div 
                      className="w-56 h-56 md:w-64 md:h-64 rounded-full overflow-hidden shadow-xl transition-transform duration-300 hover:scale-105 mx-auto"
                      style={{
                        border: '4px solid #9bcbff'
                      }}
                    >
                      <img
                        src="/lovable-uploads/9daccab5-730e-4656-81e6-a31931f7d3f6.png"
                        alt="Jayson M."
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                  </div>
                  
                  {/* Founder Name and Title - Center aligned under image */}
                  <h3 
                    className="text-5xl md:text-6xl font-bold mb-4"
                    style={{ 
                      fontFamily: 'Arial, Helvetica, sans-serif',
                      color: '#1e293b'
                    }}
                  >
                    Jayson M.
                  </h3>
                  <p 
                    className="text-lg font-medium mb-8"
                    style={{ 
                      fontFamily: 'Arial, Helvetica, sans-serif',
                      color: '#64748b'
                    }}
                  >
                    Founder of Nurse Nest
                  </p>
                  
                  {/* Decorative element */}
                  <div className="w-24 h-px bg-brand-primary/30 mx-auto"></div>
                </div>
              </AnimatedSection>
              
              {/* Content Section - Right Side */}
              <AnimatedSection 
                animation="fade-up" 
                delay={150} 
                className="flex-1 max-w-3xl"
              >
                <div 
                  className="space-y-8"
                  style={{ 
                    fontFamily: 'Arial, Helvetica, sans-serif',
                    color: '#475569',
                    lineHeight: '1.7'
                  }}
                >
                  <p className="text-xl font-medium" style={{ color: '#1e293b' }}>
                    Hi, I'm Jayson — Thank you so much for being here.
                  </p>
                  
                  <div className="w-16 h-px bg-brand-primary/30"></div>
                  
                  <p className="text-lg leading-relaxed">
                    I started my nursing journey in 2008, and I'll be honest—it didn't start smoothly. I struggled through my first semester of nursing school and seriously questioned whether I could do it. But I kept going, graduated, and began my career in the ICU.
                  </p>
                  
                  <div className="w-16 h-px bg-brand-primary/30"></div>
                  
                  <p className="text-lg leading-relaxed">
                    Since then, I've worked in over 10 hospitals and nearly every type of critical care environment. In 2016, I transitioned into travel nursing, where I've continued to grow and learn across a wide variety of clinical settings. My career has also taken me into correctional health, psychiatry, telehealth, and independent contracting.
                  </p>
                  
                  <div className="w-16 h-px bg-brand-primary/30"></div>
                  
                  <p className="text-lg leading-relaxed">
                    Along the way, I've seen how challenging it can be for families to find the right in-home nurse—and how difficult it is for nurses to navigate constant credentialing and onboarding with little guidance.
                  </p>
                  
                  <div className="w-16 h-px bg-brand-primary/30"></div>
                  
                  <p className="text-lg leading-relaxed">
                    I created Nurse Nest to make things better. This platform exists to simplify the process for both clients and nurses, offering a thoughtful, transparent way to connect with licensed professionals who are ready to help.
                  </p>
                  
                  <div className="w-16 h-px bg-brand-primary/30"></div>
                  
                  <p className="text-lg leading-relaxed">
                    Whether you're a new parent, caring for an aging family member, or a clinic in need of support, I'm here to make it easier to get the care you need from someone you can trust.
                  </p>
                  
                  <div className="w-16 h-px bg-brand-primary/30"></div>
                  
                  <p className="text-xl font-semibold" style={{ color: '#1e293b' }}>
                    If you have any questions or just want to connect, I'd love to hear from you.
                  </p>
                </div>
              </AnimatedSection>
            </div>
            
            {/* Signature Section with reduced padding */}
            <div className="mt-12 pt-8 border-t border-brand-primary/10">
              <div className="text-center" id="signature-animation">
                <div className="mb-4">
                  <div className="w-16 h-px bg-brand-primary/20 mx-auto mb-4"></div>
                </div>
                <img 
                  src="/lovable-uploads/16f8aab2-52ef-4d03-a067-775c04042d1f.png"
                  alt="Jayson Hinagawa Signature"
                  className="h-40 md:h-48 w-auto mx-auto opacity-90"
                  style={{
                    filter: 'brightness(0.1) sepia(1) saturate(10) hue-rotate(190deg)',
                    maxWidth: '500px'
                  }}
                />
                <div className="mt-4">
                  <div className="w-16 h-px bg-brand-primary/20 mx-auto"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
