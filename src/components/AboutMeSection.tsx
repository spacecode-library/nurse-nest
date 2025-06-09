
import React from 'react';
import AnimatedSection from './AnimatedSection';

export default function AboutMeSection() {
  return (
    <section className="py-section" style={{backgroundColor: '#f1f5f9'}}>
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            {/* Title moved inside the white card */}
            <div className="text-center mb-8">
              <img 
                src="/lovable-uploads/f19134b3-3045-4fc9-a9bc-2437d29ebfbd.png" 
                alt="Meet the Founder" 
                className="mx-auto mb-6"
                style={{maxHeight: '80px'}}
              />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Profile Photo */}
              <AnimatedSection animation="fade-in" delay={200} className="text-center lg:text-left">
                <div className="relative inline-block">
                  <img
                    src="/lovable-uploads/fd0f9e23-7074-4670-8f43-6b3cf64a08dc.png"
                    alt="Founder"
                    className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 object-cover rounded-full mx-auto lg:mx-0 shadow-lg"
                  />
                </div>
              </AnimatedSection>

              {/* Content */}
              <AnimatedSection animation="fade-in" delay={400} className="space-y-6">
                <div className="space-y-4">
                  <p className="text-lg leading-relaxed" style={{color: '#475569'}}>
                    Hi, I'm Jayson — Thank you so much for being here.
                  </p>
                  
                  <p className="text-base leading-relaxed" style={{color: '#475569'}}>
                    I started my nursing journey in 2008, and I'll be honest—it didn't start smoothly. I 
                    struggled through my first semester of nursing school and seriously questioned 
                    whether I could do it. But I kept going, graduated, and began my career in the ICU.
                  </p>

                  <p className="text-base leading-relaxed" style={{color: '#475569'}}>
                    Since then, I've worked in over 10 hospitals and nearly every type of critical care 
                    environment. In 2016, I transitioned into travel nursing, where I've continued to grow 
                    and learn across a wide variety of clinical settings. My career has also taken me into 
                    correctional health, psychiatry, telehealth, and independent contracting.
                  </p>

                  <p className="text-base leading-relaxed" style={{color: '#475569'}}>
                    Along the way, I've seen how challenging it can be for families to find the right in-home nurse—and how difficult it is for nurses to navigate constant credentialing and 
                    onboarding with little guidance.
                  </p>

                  <p className="text-base leading-relaxed" style={{color: '#475569'}}>
                    I created Nurse Nest to make things better. This platform exists to simplify the 
                    process for both clients and nurses, offering a thoughtful, transparent way to connect 
                    with licensed professionals who are ready to help.
                  </p>

                  <p className="text-base leading-relaxed" style={{color: '#475569'}}>
                    Whether you're a new parent, caring for an aging family member, or a clinic in need 
                    of support, I'm here to make it easier to get the care you need from someone you can 
                    trust.
                  </p>

                  <p className="text-base leading-relaxed" style={{color: '#475569'}}>
                    If you have any questions or just want to connect, I'd love to hear from you.
                  </p>
                </div>

                {/* Signature */}
                <div className="pt-6">
                  <img
                    src="/lovable-uploads/85e79782-ec91-447f-ae99-6defbdd27e25.png"
                    alt="Signature"
                    className="h-16 w-auto"
                  />
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
