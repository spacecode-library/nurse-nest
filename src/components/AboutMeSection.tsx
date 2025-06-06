
import React from 'react';
import AnimatedSection from './AnimatedSection';

export default function AboutMeSection() {
  return (
    <section 
      className="relative py-20 md:py-32" 
      id="about-me"
      style={{
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f1f5f9 100%)'
      }}
    >
      {/* Subtle decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#9bcbff] to-transparent opacity-30"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <AnimatedSection animation="fade-up" className="text-center mb-16">
          <h2 
            className="text-4xl md:text-5xl lg:text-6xl font-light mb-6 tracking-wide leading-tight"
            style={{ 
              fontFamily: 'Arial, Helvetica, sans-serif',
              background: 'linear-gradient(135deg, #1e293b 0%, #3b82f6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '1px',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
            }}
          >
            Meet the Founder
          </h2>
        </AnimatedSection>

        {/* Large White Card */}
        <AnimatedSection animation="fade-up" delay={150}>
          <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl p-8 md:p-12 lg:p-16 max-w-5xl mx-auto border border-white/50 backdrop-blur-sm">
            <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12">
              {/* Profile Image - moved up to be by the name */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-blue-100 shadow-lg">
                  <img
                    src="/lovable-uploads/9daccab5-730e-4656-81e6-a31931f7d3f6.png"
                    alt="Jayson M."
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>
              
              {/* Name and Title next to photo */}
              <div className="flex-1">
                <div className="mb-8">
                  <h3 
                    className="text-3xl md:text-4xl font-bold text-slate-900 mb-2"
                    style={{ 
                      fontFamily: 'Arial, Helvetica, sans-serif'
                    }}
                  >
                    Jayson M.
                  </h3>
                  <p 
                    className="text-lg md:text-xl text-blue-600 font-medium"
                    style={{ 
                      fontFamily: 'Arial, Helvetica, sans-serif'
                    }}
                  >
                    Founder of Nurse Nest
                  </p>
                </div>
              </div>
            </div>
            
            {/* Story Content - full width below */}
            <div 
              className="space-y-6 text-left mt-8"
              style={{ 
                fontFamily: 'Arial, Helvetica, sans-serif',
                fontSize: '18px',
                lineHeight: '1.6',
                color: '#475569'
              }}
            >
              <p className="font-medium text-slate-900 text-lg">
                Hi, I'm Jayson — Thank you so much for being here.
              </p>
              
              <p>
                I started my nursing journey in 2008, and I'll be honest—it didn't start smoothly. I struggled through my first semester of nursing school and seriously questioned whether I could do it. But I kept going, graduated, and began my career in the ICU.
              </p>
              
              <p>
                Since then, I've worked in over 10 hospitals and nearly every type of critical care environment. In 2016, I transitioned into travel nursing, where I've continued to grow and learn across a wide variety of clinical settings. My career has also taken me into correctional health, psychiatry, telehealth, and independent contracting.
              </p>
              
              <p>
                Along the way, I've seen how challenging it can be for families to find the right in-home nurse—and how difficult it is for nurses to navigate constant credentialing and onboarding with little guidance.
              </p>
              
              <p>
                I created Nurse Nest to make things better. This platform exists to simplify the process for both clients and nurses, offering a thoughtful, transparent way to connect with licensed professionals who are ready to help.
              </p>
              
              <p>
                Whether you're a new parent, caring for an aging family member, or a clinic in need of support, I'm here to make it easier to get the care you need from someone you can trust.
              </p>
              
              <p className="font-medium text-slate-900 text-lg">
                If you have any questions or just want to connect, I'd love to hear from you.
              </p>
            </div>
            
            {/* Signature - aligned to the left with text */}
            <div className="mt-12">
              <img 
                src="/lovable-uploads/16f8aab2-52ef-4d03-a067-775c04042d1f.png"
                alt="Jayson Hinagawa Signature"
                className="h-16 md:h-20 w-auto opacity-70"
                style={{
                  filter: 'brightness(0.3)',
                  maxWidth: '200px'
                }}
              />
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
