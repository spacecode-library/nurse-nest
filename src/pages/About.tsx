
import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedSection from '@/components/AnimatedSection';

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24">
        {/* Meet the Founder Section - Moved from HomePage */}
        <section 
          className="relative py-20 md:py-32" 
          id="about-me"
          style={{
            background: 'linear-gradient(to bottom, #f8fafc 0%, #e2e8f0 100%)'
          }}
        >
          <div className="container mx-auto px-4 relative z-10">
            {/* Large White Card */}
            <AnimatedSection animation="fade-up" delay={150}>
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl p-8 md:p-12 lg:p-16 max-w-5xl mx-auto border border-white/50 backdrop-blur-sm">
                
                {/* Meet the Founder Header - Now inside the card */}
                <div className="flex justify-center mb-8">
                  <img
                    src="/lovable-uploads/62c6c4e8-63bf-4393-b4c0-042689b94066.png"
                    alt="Meet the Founder"
                    className="h-16 md:h-20 w-auto max-w-full object-contain"
                  />
                </div>

                <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12">
                  {/* Profile Image */}
                  <div className="flex-shrink-0">
                    <div className="w-48 h-48 md:w-60 md:h-60 rounded-full overflow-hidden border-4 border-blue-100 shadow-lg">
                      <img
                        src="/lovable-uploads/9daccab5-730e-4656-81e6-a31931f7d3f6.png"
                        alt="Founder"
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                  </div>
                  
                  {/* Story Content */}
                  <div className="flex-1">
                    <div 
                      className="space-y-6 text-left"
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
                    
                    {/* Signature */}
                    <div className="mt-6">
                      <img 
                        src="/lovable-uploads/16f8aab2-52ef-4d03-a067-775c04042d1f.png"
                        alt="Signature"
                        className="h-24 md:h-32 w-auto opacity-70"
                        style={{
                          filter: 'brightness(0.3)',
                          maxWidth: '300px'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
