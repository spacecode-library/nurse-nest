
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
              path.style.transition = 'stroke-dashoffset 1.5s ease-out';
              path.style.strokeDashoffset = '0';
            }, 500);
            
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
    <section className="section-padding bg-white" id="about-me">
      <div className="container-custom">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-start">
            {/* Image Column - Left side on desktop */}
            <AnimatedSection 
              animation="fade-up" 
              className="md:col-span-4 lg:col-span-3 flex justify-center"
            >
              <div className="relative mb-8 md:mb-0 max-w-xs">
                <div className="w-60 h-60 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-gray-200 shadow-md mx-auto">
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
              <div className="max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-bold mb-1 text-gray-800">
                  Jayson M.
                </h2>
                <p className="text-primary-500 text-lg mb-6">Founder of Nurse Nest</p>
                
                <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
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
                
                {/* Animated Signature */}
                <div className="mt-8" id="signature-animation">
                  <svg width="220" height="80" viewBox="0 0 220 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path 
                      ref={signatureRef}
                      d="M20,50 C25,35 28,48 32,40 C38,28 42,52 47,40 C50,30 52,52 54,40 C56,30 58,40 60,35 C62,28 64,40 66,42 C68,38 70,47 72,42 C74,38 76,43 78,40 C82,34 80,43 82,40 C84,38 86,40 87,35 C90,28 92,40 94,35 C96,30 98,43 100,35 C102,25 104,45 106,35 C108,30 111,35 112,30 C114,25 116,40 118,30 C120,25 123,50 125,45 C127,39 129,50 132,44 C136,35 138,48 140,40 C142,35 144,40 146,35 C148,30 150,35 152,38 C154,35 156,40 158,38 C160,35 164,42 166,38 C168,35 170,42 172,38 C178,30 174,45 177,40 C180,35 183,40 186,35 C190,28 194,45 200,40"
                      stroke="#4A90E2"
                      strokeWidth="2"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
}
