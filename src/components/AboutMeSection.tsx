import React from 'react';
import AnimatedSection from './AnimatedSection';

export default function AboutMeSection() {
  const handleBrowseFAQs = () => {
    // Trigger the FAQ system to open
    const event = new CustomEvent('openFAQ');
    window.dispatchEvent(event);
  };

  return (
    <section 
      className="relative py-12 md:py-16" 
      id="about-me"
      style={{
        background: 'linear-gradient(to bottom, #f8fafc 0%, #e2e8f0 100%)'
      }}
    >
      <div className="container mx-auto px-4 relative z-10">
        {/* Large White Card */}
        <AnimatedSection animation="fade-up" delay={150}>
          <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl p-8 md:p-12 lg:p-16 max-w-5xl mx-auto border border-white/50 backdrop-blur-sm">
            {/* Section Header inside card */}
            <div className="text-center mb-12">
              <img
                src="/lovable-uploads/62c6c4e8-63bf-4393-b4c0-042689b94066.png"
                alt="Meet the Founder"
                className="h-20 md:h-24 w-auto max-w-full object-contain mx-auto"
              />
            </div>

            <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12">
              {/* Profile Image - bigger and centered */}
              <div className="flex-shrink-0 mx-auto lg:mx-0">
                <div className="w-48 h-48 md:w-60 md:h-60 rounded-full overflow-hidden border-4 border-blue-100 shadow-lg">
                  <img
                    src="/lovable-uploads/9daccab5-730e-4656-81e6-a31931f7d3f6.png"
                    alt="Jayson M."
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>
              
              {/* Story Content - starts immediately next to photo */}
              <div className="flex-1">
                <div 
                  className="space-y-6 text-left"
                  style={{ 
                    fontFamily: 'Arial, Helvetica, sans-serif',
                    fontSize: '18px',
                    lineHeight: '1.6',
                    color: '#475569',
                    fontWeight: '400'
                  }}
                >
                  <p>
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
                  
                  <p>
                    If you have any questions or just want to connect, I'd love to hear from you.
                  </p>
                </div>
                
                {/* Signature - bigger and left aligned with reduced padding */}
                <div className="mt-6">
                  <img 
                    src="/lovable-uploads/16f8aab2-52ef-4d03-a067-775c04042d1f.png"
                    alt="Jayson Hinagawa Signature"
                    className="h-24 md:h-32 w-auto opacity-70"
                    style={{
                      filter: 'brightness(0.3)',
                      maxWidth: '300px'
                    }}
                  />
                </div>

                {/* Browse FAQs Button */}
                <div className="mt-8">
                  <button
                    onClick={handleBrowseFAQs}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    Browse FAQs
                  </button>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
