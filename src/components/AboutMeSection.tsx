
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
      {/* Subtle medical pattern overlay */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-4 h-4 border border-brand-blue/20 rotate-45"></div>
        <div className="absolute top-40 right-20 w-3 h-3 border border-brand-primary/20 rounded-full"></div>
        <div className="absolute bottom-32 left-1/4 w-5 h-5 border border-brand-blue/20 rotate-12"></div>
        <div className="absolute bottom-20 right-1/3 w-2 h-2 bg-brand-primary/10 rounded-full"></div>
      </div>
      
      <div className="container-custom relative z-10">
        {/* Section Header */}
        <AnimatedSection animation="fade-up" className="text-center mb-16">
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
          <div className="w-24 h-1 bg-brand-primary mx-auto rounded-full mb-4"></div>
          <p className="text-lg text-neutral-dark font-normal max-w-2xl mx-auto">
            The healthcare professional behind Nurse Nest's mission
          </p>
        </AnimatedSection>

        <div className="max-w-6xl mx-auto">
          {/* Enhanced content card */}
          <div 
            className="bg-white rounded-2xl p-8 md:p-12 border border-brand-primary/20"
            style={{
              boxShadow: '0 10px 25px rgba(30, 41, 59, 0.08)'
            }}
          >
            <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-start">
              {/* Image Column - Left side on desktop */}
              <AnimatedSection 
                animation="fade-up" 
                className="md:col-span-4 lg:col-span-3 flex justify-center"
              >
                <div className="relative mb-8 md:mb-0 max-w-xs">
                  <div 
                    className="w-72 h-72 md:w-80 md:h-80 rounded-full overflow-hidden shadow-lg mx-auto transition-transform duration-300 hover:scale-105"
                    style={{
                      border: '3px solid #9bcbff'
                    }}
                  >
                    <img
                      src="/lovable-uploads/9daccab5-730e-4656-81e6-a31931f7d3f6.png"
                      alt="Jayson M."
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                </div>
              </AnimatedSection>
              
              {/* Content Column - Right side on desktop */}
              <AnimatedSection 
                animation="fade-up" 
                delay={150} 
                className="md:col-span-8 lg:col-span-9"
              >
                <div className="max-w-3xl">
                  <h3 
                    className="text-3xl md:text-4xl font-light mb-1"
                    style={{ 
                      fontFamily: 'Arial, Helvetica, sans-serif',
                      color: '#1e293b'
                    }}
                  >
                    Jayson M.
                  </h3>
                  <p 
                    className="text-brand-blue text-lg mb-8 font-normal"
                    style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                  >
                    Founder of Nurse Nest
                  </p>
                  
                  {/* Subtle divider */}
                  <div className="w-16 h-px bg-brand-primary/30 mb-8"></div>
                  
                  <div 
                    className="space-y-6"
                    style={{ 
                      fontFamily: 'Arial, Helvetica, sans-serif',
                      color: '#475569',
                      lineHeight: '1.6'
                    }}
                  >
                    <p className="text-lg">
                      Hi, I'm Jayson — Thank you so much for being here.
                    </p>
                    
                    {/* Visual break */}
                    <div className="w-8 h-px bg-brand-primary/20 my-6"></div>
                    
                    <p>
                      I started my nursing journey in 2008, and I'll be honest—it didn't start smoothly. I struggled through my first semester of nursing school and seriously questioned whether I could do it. But I kept going, graduated, and began my career in the ICU.
                    </p>
                    
                    <div className="w-8 h-px bg-brand-primary/20 my-6"></div>
                    
                    <p>
                      Since then, I've worked in over 10 hospitals and nearly every type of critical care environment. In 2016, I transitioned into travel nursing, where I've continued to grow and learn across a wide variety of clinical settings. My career has also taken me into correctional health, psychiatry, telehealth, and independent contracting.
                    </p>
                    
                    <div className="w-8 h-px bg-brand-primary/20 my-6"></div>
                    
                    <p>
                      Along the way, I've seen how challenging it can be for families to find the right in-home nurse—and how difficult it is for nurses to navigate constant credentialing and onboarding with little guidance.
                    </p>
                    
                    <div className="w-8 h-px bg-brand-primary/20 my-6"></div>
                    
                    <p>
                      I created Nurse Nest to make things better. This platform exists to simplify the process for both clients and nurses, offering a thoughtful, transparent way to connect with licensed professionals who are ready to help.
                    </p>
                    
                    <div className="w-8 h-px bg-brand-primary/20 my-6"></div>
                    
                    <p>
                      Whether you're a new parent, caring for an aging family member, or a clinic in need of support, I'm here to make it easier to get the care you need from someone you can trust.
                    </p>
                    
                    <div className="w-8 h-px bg-brand-primary/20 my-6"></div>
                    
                    <p className="text-lg font-medium" style={{ color: '#1e293b' }}>
                      If you have any questions or just want to connect, I'd love to hear from you.
                    </p>
                  </div>
                  
                  {/* Enhanced Handwritten Signature */}
                  <div className="mt-12" id="signature-animation">
                    <img 
                      src="/lovable-uploads/e2b60f86-a631-4074-9374-e350c4ea1e3f.png"
                      alt="Jayson Hinagawa Signature"
                      className="h-16 md:h-20 w-auto opacity-90"
                      style={{
                        filter: 'brightness(0.2) sepia(1) saturate(5) hue-rotate(200deg)',
                        textShadow: '0 2px 4px rgba(30, 41, 59, 0.1)'
                      }}
                    />
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
