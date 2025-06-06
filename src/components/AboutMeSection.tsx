
import React from 'react';
import AnimatedSection from './AnimatedSection';

export default function AboutMeSection() {
  return (
    <section 
      className="py-16 bg-white" 
      id="about-me"
    >
      <div className="max-w-2xl mx-auto px-8">
        {/* Clean Document Header */}
        <AnimatedSection animation="fade-up" className="mb-8">
          <h2 
            className="text-2xl font-medium mb-6 text-slate-900"
            style={{ 
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            }}
          >
            Meet the Founder
          </h2>
        </AnimatedSection>

        {/* Profile Image - Natural Flow */}
        <AnimatedSection animation="fade-up" className="mb-6">
          <div className="w-32 h-32 rounded-full overflow-hidden mb-6 border border-slate-200">
            <img
              src="/lovable-uploads/9daccab5-730e-4656-81e6-a31931f7d3f6.png"
              alt="Jayson M."
              className="w-full h-full object-cover object-top"
            />
          </div>
          
          {/* Founder Information */}
          <div className="mb-6">
            <h3 
              className="text-3xl font-bold text-slate-900 mb-1"
              style={{ 
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
              }}
            >
              Jayson M.
            </h3>
            <p 
              className="text-base text-slate-600"
              style={{ 
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
              }}
            >
              Founder of Nurse Nest
            </p>
          </div>
        </AnimatedSection>
        
        {/* Document Content */}
        <AnimatedSection animation="fade-up" delay={150}>
          <div 
            className="space-y-4 text-left"
            style={{ 
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              fontSize: '16px',
              lineHeight: '1.5',
              color: '#334155'
            }}
          >
            <p className="font-medium text-slate-900">
              Hi, I'm Jayson — Thank you so much for being here.
            </p>
            
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
            
            <p className="font-medium text-slate-900">
              If you have any questions or just want to connect, I'd love to hear from you.
            </p>
          </div>
        </AnimatedSection>
        
        {/* Signature */}
        <div className="mt-8 text-center">
          <img 
            src="/lovable-uploads/16f8aab2-52ef-4d03-a067-775c04042d1f.png"
            alt="Jayson Hinagawa Signature"
            className="h-20 w-auto mx-auto opacity-80"
            style={{
              filter: 'brightness(0.2)',
              maxWidth: '200px'
            }}
          />
        </div>
      </div>
    </section>
  );
}
