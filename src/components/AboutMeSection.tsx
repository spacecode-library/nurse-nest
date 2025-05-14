
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
                
                {/* Signature */}
                <div className="mt-8" id="signature-animation">
                  <svg width="280" height="80" viewBox="0 0 280 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path 
                      ref={signatureRef}
                      d="M40,50 C45,35 48,43 52,35 C53,31 55,30 57,28 C59,26 60,25 63,27 C65,29 66,36 68,38 C70,42 71,52 69,51 C68,50 69,45 71,42 C73,39 75,37 78,36 C80,35 82,33 85,34 C88,35 89,38 90,40 C92,43 93,48 94,52 C94,53 94,60 93,61 C92,61 91,61 90,57 C88,51 88,52 90,43 C90,42 91,40 92,39 C93,39 95,39 97,40 C98,41 99,43 100,47 C100,49 100,53 100,56 C100,57 101,58 103,56 C105,54 106,52 107,50 C109,46 110,43 114,45 C117,47 120,50 120,54 C120,57 120,60 118,63 C117,64 116,66 117,66 C118,66 122,65 125,63 C129,60 131,57 132,55 C134,51 135,48 136,44 C137,41 137,38 137,36 C137,35 137,34 137,32 C138,30 138,30 139,30 C140,30 141,31 142,37 C142,39 143,46 142,47 C141,48 140,49 138,52 C136,55 134,56 134,57 C134,58 135,58 140,54 C145,50 149,45 153,40 C156,36 159,33 161,30 C163,27 164,26 166,26 C168,26 170,28 171,30 C172,32 172,34 171,36 C170,40 168,42 168,44 C168,45 168,46 169,46 C170,46 173,44 177,39 C180,35 184,30 189,25 C191,23 194,21 196,20 C198,19 200,19 202,20 C204,21 205,23 205,25 C205,27 204,28 202,29 C200,30 197,31 195,33 C194,34 195,34 198,34 C200,34 203,35 207,37 C208,38 212,39 213,40 C214,41 214,42 214,45 C214,48 213,50 213,52 C213,53 214,54 215,54 C216,54 218,54 221,52 C224,50 227,48 231,46 C233,45 235,42 237,40"
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
