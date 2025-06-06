
import React from 'react';
import AnimatedSection from './AnimatedSection';

export default function AboutMeSection() {
  return (
    <section 
      className="py-20 bg-gradient-to-br from-blue-50 to-blue-100" 
      id="about-me"
    >
      <div className="max-w-6xl mx-auto px-8">
        {/* Section Header */}
        <AnimatedSection animation="fade-up" className="text-center mb-16">
          <h2 
            className="text-4xl md:text-5xl font-light mb-6 text-slate-800"
            style={{ 
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            }}
          >
            Meet the Founder
          </h2>
          <div className="w-16 h-1 bg-blue-400 mx-auto mb-6"></div>
          <p 
            className="text-lg text-slate-600 max-w-2xl mx-auto"
            style={{ 
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            }}
          >
            The healthcare professional behind Nurse Nest's mission
          </p>
        </AnimatedSection>

        {/* Large White Card */}
        <AnimatedSection animation="fade-up" delay={150}>
          <div className="bg-white rounded-3xl shadow-2xl p-12 md:p-16">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-12">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-blue-100 shadow-lg">
                  <img
                    src="/lovable-uploads/9daccab5-730e-4656-81e6-a31931f7d3f6.png"
                    alt="Jayson M."
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1">
                {/* Founder Information */}
                <div className="mb-8">
                  <h3 
                    className="text-4xl font-bold text-slate-900 mb-2"
                    style={{ 
                      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                    }}
                  >
                    Jayson M.
                  </h3>
                  <p 
                    className="text-xl text-blue-600 font-medium"
                    style={{ 
                      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                    }}
                  >
                    Founder of Nurse Nest
                  </p>
                </div>
                
                {/* Story Content */}
                <div 
                  className="space-y-6 text-left"
                  style={{ 
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
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
              </div>
            </div>
            
            {/* Signature */}
            <div className="mt-12 text-center">
              <img 
                src="/lovable-uploads/16f8aab2-52ef-4d03-a067-775c04042d1f.png"
                alt="Jayson Hinagawa Signature"
                className="h-24 w-auto mx-auto opacity-70"
                style={{
                  filter: 'brightness(0.3)',
                  maxWidth: '250px'
                }}
              />
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
