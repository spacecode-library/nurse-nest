
import React, { useEffect } from 'react';
import AnimatedSection from './AnimatedSection';
import { useScrollAnimationObserver } from '@/hooks/use-scroll-animation-observer';

export default function HowItWorksSection() {
  // Use our custom hook to set up scroll animation
  useScrollAnimationObserver();

  useEffect(() => {
    // Scroll-triggered animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    }, observerOptions);

    // Observe all step cards
    document.querySelectorAll('.step-card').forEach((el) => {
      observer.observe(el);
    });

    // Observe package cards
    document.querySelectorAll('.package-card, .addon-card').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);
  
  return (
    <section 
      className="relative py-20 md:py-32 how-it-works-section" 
      id="how-it-works"
      style={{
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f1f5f9 100%)'
      }}
    >
      {/* Subtle decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#9bcbff] to-transparent opacity-30"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <AnimatedSection animation="fade-up" className="text-center mb-16">
          {/* Replace with the uploaded image */}
          <div className="flex justify-center mb-6">
            <img
              src="/lovable-uploads/1379c303-e425-47f4-99a8-e90f3e07c9ca.png"
              alt="How It Works"
              className="h-16 md:h-20 w-auto max-w-full object-contain"
            />
          </div>
          
          {/* Decorative accent line */}
          <div className="w-24 h-1 bg-gradient-to-r from-[#9bcbff] to-[#3b82f6] mx-auto mb-6 rounded-full"></div>
          
          <h3 className="text-xl md:text-2xl font-medium text-[#334155] mb-4" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
            Get matched with qualified nurses in 5 simple steps
          </h3>
          <p className="text-lg text-[#475569] max-w-4xl mx-auto leading-relaxed font-normal" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
            Our streamlined process puts you in control - from finding the perfect nurse to choosing your preferred level of screening.
          </p>
        </AnimatedSection>

        {/* 5-Step Flow */}
        <div className="steps-container max-w-7xl mx-auto mb-20">
          <div className="steps-flow flex flex-col lg:flex-row items-start justify-between gap-8 lg:gap-4">
            
            {/* Step 1 */}
            <div className="step-card w-full lg:w-72 bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105 border border-white/50 backdrop-blur-sm relative">
              <div className="step-icon text-5xl text-center mb-5">💻</div>
              <h4 className="step-title text-lg font-semibold text-[#1e293b] mb-4 text-center" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                Submit Your Care Request
              </h4>
              <p className="step-description text-[#475569] leading-relaxed text-center text-sm" style={{ fontFamily: 'Arial, Helvetica, sans-serif', lineHeight: '1.7' }}>
                Tell us about your nursing care needs through our simple online form. Specify your requirements, schedule preferences, and location - all in just a few minutes.
              </p>
            </div>

            <div className="connector-line w-2 lg:w-16 h-10 lg:h-2 mx-auto lg:mx-0 lg:mt-24 bg-gradient-to-b lg:bg-gradient-to-r from-[#9bcbff] via-transparent to-[#9bcbff] bg-[length:100%_8px] lg:bg-[length:8px_100%] opacity-60"></div>

            {/* Step 2 */}
            <div className="step-card w-full lg:w-72 bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105 border border-white/50 backdrop-blur-sm relative">
              <div className="step-icon text-5xl text-center mb-5">🔍</div>
              <h4 className="step-title text-lg font-semibold text-[#1e293b] mb-4 text-center" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                We Find Perfect Matches
              </h4>
              <p className="step-description text-[#475569] leading-relaxed text-center text-sm" style={{ fontFamily: 'Arial, Helvetica, sans-serif', lineHeight: '1.7' }}>
                Our platform instantly connects you with qualified, vetted nurses in your area who specialize in your specific care needs and availability requirements.
              </p>
            </div>

            <div className="connector-line w-2 lg:w-16 h-10 lg:h-2 mx-auto lg:mx-0 lg:mt-24 bg-gradient-to-b lg:bg-gradient-to-r from-[#9bcbff] via-transparent to-[#9bcbff] bg-[length:100%_8px] lg:bg-[length:8px_100%] opacity-60"></div>

            {/* Step 3 */}
            <div className="step-card w-full lg:w-72 bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105 border border-white/50 backdrop-blur-sm relative">
              <div className="step-icon text-5xl text-center mb-5">👥</div>
              <h4 className="step-title text-lg font-semibold text-[#1e293b] mb-4 text-center" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                Review & Select Your Nurse
              </h4>
              <p className="step-description text-[#475569] leading-relaxed text-center text-sm" style={{ fontFamily: 'Arial, Helvetica, sans-serif', lineHeight: '1.7' }}>
                Browse detailed nurse profiles, check credentials and reviews, then interview your top candidates. Choose the perfect nurse for your family's needs.
              </p>
            </div>

            <div className="connector-line w-2 lg:w-16 h-10 lg:h-2 mx-auto lg:mx-0 lg:mt-24 bg-gradient-to-b lg:bg-gradient-to-r from-[#9bcbff] via-transparent to-[#9bcbff] bg-[length:100%_8px] lg:bg-[length:8px_100%] opacity-60"></div>

            {/* Step 4 - EMPHASIZED */}
            <div className="step-card step-emphasized w-full lg:w-72 bg-gradient-to-br from-[#f0f9ff] to-white rounded-xl p-8 shadow-xl border-2 border-[#9bcbff] transform scale-105 relative min-h-[420px]">
              <div className="choice-badge absolute -top-3 right-4 bg-[#9bcbff] text-white px-3 py-1 rounded-full text-xs font-medium">Your Choice</div>
              <div className="step-icon text-5xl text-center mb-5">⚙️</div>
              <h4 className="step-title text-lg font-semibold text-[#1e293b] mb-4 text-center" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                Customize Your Screening
              </h4>
              <p className="step-description text-[#475569] leading-relaxed text-center text-sm mb-6" style={{ fontFamily: 'Arial, Helvetica, sans-serif', lineHeight: '1.7' }}>
                Select the level of background screening that gives you confidence. Choose from basic verification to comprehensive background checks - you decide what's right for your family.
              </p>
              <div className="option-indicators flex flex-col gap-2">
                <span className="option-badge text-xs px-3 py-2 rounded-full text-center border border-[#3b82f6] text-[#3b82f6] bg-white">Basic $169</span>
                <span className="option-badge text-xs px-3 py-2 rounded-full text-center border border-[#3b82f6] text-[#3b82f6] bg-white">Comprehensive $289</span>
                <span className="option-badge text-xs px-3 py-2 rounded-full text-center border border-[#3b82f6] text-[#3b82f6] bg-white">Custom Add-ons</span>
              </div>
            </div>

            <div className="connector-line w-2 lg:w-16 h-10 lg:h-2 mx-auto lg:mx-0 lg:mt-24 bg-gradient-to-b lg:bg-gradient-to-r from-[#9bcbff] via-transparent to-[#9bcbff] bg-[length:100%_8px] lg:bg-[length:8px_100%] opacity-60"></div>

            {/* Step 5 */}
            <div className="step-card w-full lg:w-72 bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105 border border-white/50 backdrop-blur-sm relative">
              <div className="step-icon text-5xl text-center mb-5">📋</div>
              <h4 className="step-title text-lg font-semibold text-[#1e293b] mb-4 text-center" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                Seamless Care Management
              </h4>
              <p className="step-description text-[#475569] leading-relaxed text-center text-sm" style={{ fontFamily: 'Arial, Helvetica, sans-serif', lineHeight: '1.7' }}>
                Manage schedules, approve timecards, process payments, and communicate with your nurse - all through our secure, easy-to-use platform.
              </p>
            </div>

          </div>
        </div>

        {/* Vetting Packages Section */}
        <section className="vetting-packages-section py-20 bg-white rounded-2xl shadow-sm mb-16">
          <div className="vetting-header text-center max-w-4xl mx-auto mb-16 px-6">
            <h3 className="vetting-title text-2xl md:text-3xl font-semibold text-[#1e293b] mb-4" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
              Choose Your Preferred Vetting Package
            </h3>
            <p className="vetting-subtitle text-lg text-[#475569] leading-relaxed" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
              Select the screening level that gives you peace of mind. All services are conducted by certified professionals and comply with federal and state regulations.
            </p>
          </div>
          
          {/* Package Options (2-Column Layout) */}
          <div className="packages-grid grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto mb-20 px-6">
            <div className="package-card bg-white border-2 border-[#e2e8f0] rounded-2xl p-8 text-center transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-xl hover:border-[#9bcbff]">
              <h4 className="package-title text-xl font-semibold text-[#1e293b] mb-2" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>Nest Safe Basic</h4>
              <div className="package-price text-3xl font-bold text-[#3b82f6] mb-4" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>$169</div>
              <p className="package-best-for text-sm font-medium text-[#10b981] mb-6" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>Best For: Standard safety assurance</p>
              <ul className="package-features list-none p-0 text-left space-y-2">
                <li className="text-sm text-[#475569] flex items-center" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                  <span className="text-[#10b981] mr-2">✓</span> Basic Background Check
                </li>
                <li className="text-sm text-[#475569] flex items-center" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                  <span className="text-[#10b981] mr-2">✓</span> License Verification
                </li>
                <li className="text-sm text-[#475569] flex items-center" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                  <span className="text-[#10b981] mr-2">✓</span> 5-Panel Drug Test
                </li>
                <li className="text-sm text-[#475569] flex items-center" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                  <span className="text-[#10b981] mr-2">✓</span> Motor Vehicle Record
                </li>
              </ul>
            </div>
            
            <div className="package-card pro-package border-2 border-[#3b82f6] rounded-2xl p-8 text-center transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-xl bg-gradient-to-br from-[#f0f9ff] to-white">
              <h4 className="package-title text-xl font-semibold text-[#1e293b] mb-2" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>Nest Shield Pro</h4>
              <div className="package-price text-3xl font-bold text-[#3b82f6] mb-4" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>$289</div>
              <p className="package-best-for text-sm font-medium text-[#10b981] mb-6" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>Best For: High-trust roles & deep vetting</p>
              <ul className="package-features list-none p-0 text-left space-y-2">
                <li className="text-sm text-[#475569] flex items-center" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                  <span className="text-[#10b981] mr-2">✓</span> Comprehensive Background Check
                </li>
                <li className="text-sm text-[#475569] flex items-center" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                  <span className="text-[#10b981] mr-2">✓</span> License Verification
                </li>
                <li className="text-sm text-[#475569] flex items-center" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                  <span className="text-[#10b981] mr-2">✓</span> 10-Panel Drug Test
                </li>
                <li className="text-sm text-[#475569] flex items-center" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                  <span className="text-[#10b981] mr-2">✓</span> Employment Verification
                </li>
                <li className="text-sm text-[#475569] flex items-center" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                  <span className="text-[#10b981] mr-2">✓</span> Motor Vehicle Record
                </li>
              </ul>
            </div>
          </div>
          
          {/* Optional Add-On Services (4-Column Grid) */}
          <div className="addons-section max-w-6xl mx-auto px-6">
            <h4 className="addons-title text-xl font-semibold text-[#1e293b] text-center mb-10" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
              Optional Add-On Services
            </h4>
            <div className="addons-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="addon-card bg-white border border-[#e2e8f0] rounded-xl p-6 text-center transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg hover:border-[#9bcbff]">
                <h5 className="addon-title text-base font-semibold text-[#1e293b] mb-2" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>Background Check</h5>
                <div className="addon-price text-lg font-semibold text-[#3b82f6] mb-4" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>$29</div>
                <ul className="addon-features list-none p-0 text-left space-y-1">
                  <li className="text-xs text-[#475569] flex items-center" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                    <span className="text-[#10b981] mr-1">✓</span> Criminal history verification
                  </li>
                  <li className="text-xs text-[#475569] flex items-center" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                    <span className="text-[#10b981] mr-1">✓</span> Employment verification
                  </li>
                  <li className="text-xs text-[#475569] flex items-center" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                    <span className="text-[#10b981] mr-1">✓</span> Reference checks
                  </li>
                  <li className="text-xs text-[#475569] flex items-center" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                    <span className="text-[#10b981] mr-1">✓</span> Professional license verification
                  </li>
                </ul>
              </div>
              
              <div className="addon-card bg-white border border-[#e2e8f0] rounded-xl p-6 text-center transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg hover:border-[#9bcbff]">
                <h5 className="addon-title text-base font-semibold text-[#1e293b] mb-2" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>Drug Screening</h5>
                <div className="addon-price text-lg font-semibold text-[#3b82f6] mb-4" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>$45</div>
                <ul className="addon-features list-none p-0 text-left space-y-1">
                  <li className="text-xs text-[#475569] flex items-center" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                    <span className="text-[#10b981] mr-1">✓</span> 10-panel drug test
                  </li>
                  <li className="text-xs text-[#475569] flex items-center" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                    <span className="text-[#10b981] mr-1">✓</span> Professional lab processing
                  </li>
                  <li className="text-xs text-[#475569] flex items-center" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                    <span className="text-[#10b981] mr-1">✓</span> Results within 24-48 hours
                  </li>
                  <li className="text-xs text-[#475569] flex items-center" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                    <span className="text-[#10b981] mr-1">✓</span> SAMHSA compliant testing
                  </li>
                </ul>
              </div>
              
              <div className="addon-card bg-white border border-[#e2e8f0] rounded-xl p-6 text-center transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg hover:border-[#9bcbff]">
                <h5 className="addon-title text-base font-semibold text-[#1e293b] mb-2" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>Driving Record</h5>
                <div className="addon-price text-lg font-semibold text-[#3b82f6] mb-4" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>$15</div>
                <ul className="addon-features list-none p-0 text-left space-y-1">
                  <li className="text-xs text-[#475569] flex items-center" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                    <span className="text-[#10b981] mr-1">✓</span> 3-year driving history
                  </li>
                  <li className="text-xs text-[#475569] flex items-center" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                    <span className="text-[#10b981] mr-1">✓</span> Moving violations check
                  </li>
                  <li className="text-xs text-[#475569] flex items-center" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                    <span className="text-[#10b981] mr-1">✓</span> License status verification
                  </li>
                  <li className="text-xs text-[#475569] flex items-center" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                    <span className="text-[#10b981] mr-1">✓</span> Insurance claims history
                  </li>
                </ul>
              </div>
              
              <div className="addon-card bg-white border border-[#e2e8f0] rounded-xl p-6 text-center transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg hover:border-[#9bcbff]">
                <h5 className="addon-title text-base font-semibold text-[#1e293b] mb-2" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>Custom Verification</h5>
                <div className="addon-price text-lg font-semibold text-[#3b82f6] mb-4" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>Contact Us</div>
                <ul className="addon-features list-none p-0 text-left space-y-1">
                  <li className="text-xs text-[#475569] flex items-center" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                    <span className="text-[#10b981] mr-1">✓</span> Specialized certifications
                  </li>
                  <li className="text-xs text-[#475569] flex items-center" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                    <span className="text-[#10b981] mr-1">✓</span> Additional references
                  </li>
                  <li className="text-xs text-[#475569] flex items-center" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                    <span className="text-[#10b981] mr-1">✓</span> Custom screening needs
                  </li>
                  <li className="text-xs text-[#475569] flex items-center" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                    <span className="text-[#10b981] mr-1">✓</span> Flexible verification options
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Client Empowerment Callout */}
        <section className="client-control-section py-16 bg-[#e0f2fe] rounded-2xl">
          <div className="control-callout max-w-3xl mx-auto text-center p-10 bg-white rounded-2xl shadow-sm">
            <div className="callout-icon text-5xl mb-6">🎯</div>
            <h4 className="callout-title text-2xl font-semibold text-[#1e293b] mb-4" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
              You're in Control
            </h4>
            <p className="callout-description text-lg text-[#475569] leading-relaxed" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
              We believe every family's needs are different. That's why you choose exactly what screening gives you confidence - from basic verification to comprehensive background checks. No mandatory expensive packages, no hidden fees.
            </p>
          </div>
        </section>

        {/* Subtle bottom decorative element */}
        <div className="mt-16 flex justify-center">
          <div className="flex space-x-2">
            {[...Array(4)].map((_, i) => (
              <div 
                key={i}
                className="w-2 h-2 rounded-full bg-gradient-to-r from-[#9bcbff] to-[#3b82f6] opacity-40"
                style={{
                  animationDelay: `${i * 0.2}s`
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Add custom CSS for animations */}
      <style jsx>{`
        .step-card {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.6s ease;
        }

        .step-card.animate {
          opacity: 1;
          transform: translateY(0);
        }

        .step-card:nth-child(1).animate { transition-delay: 0.1s; }
        .step-card:nth-child(3).animate { transition-delay: 0.2s; }
        .step-card:nth-child(5).animate { transition-delay: 0.3s; }
        .step-emphasized.animate { 
          transition-delay: 0.4s; 
          transform: translateY(0) scale(1.05);
        }
        .step-card:nth-child(9).animate { transition-delay: 0.5s; }

        .package-card, .addon-card {
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.5s ease;
        }

        .package-card.animate, .addon-card.animate {
          opacity: 1;
          transform: translateY(0);
        }

        @media (max-width: 1023px) {
          .step-emphasized {
            transform: none !important;
            scale: 1 !important;
          }
          
          .step-emphasized.animate {
            transform: translateY(0) !important;
          }
        }
      `}</style>
    </section>
  );
}
