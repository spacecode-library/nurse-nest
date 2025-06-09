
import React from 'react';
import AnimatedSection from './AnimatedSection';

export default function AboutMeSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-100 rounded-full -translate-x-32 -translate-y-32 opacity-20"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-200 rounded-full translate-x-48 translate-y-48 opacity-10"></div>
      
      <div className="container mx-auto px-6">
        <AnimatedSection animation="fade-up">
          <div className="text-center mb-16">
            {/* Make the title image slightly larger */}
            <img
              src="/lovable-uploads/598548b2-a370-469c-86f5-19503d151210.png"
              alt="Meet the Founder"
              className="h-20 md:h-24 w-auto mx-auto mb-8"
            />
            
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                {/* Left: Founder Image */}
                <div className="relative">
                  <div className="relative z-10">
                    <img
                      src="/lovable-uploads/e2b60f86-a631-4074-9374-e350c4ea1e3f.png"
                      alt="Founder - Healthcare Professional"
                      className="w-full max-w-md mx-auto rounded-3xl shadow-2xl"
                    />
                  </div>
                  {/* Decorative background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-blue-300 rounded-3xl transform rotate-3 scale-105 opacity-20"></div>
                </div>
                
                {/* Right: Founder Story */}
                <div className="space-y-6 text-left">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                    Our Story
                  </h3>
                  
                  <p className="text-lg text-gray-700 leading-relaxed">
                    As a nurse practitioner with over a decade of experience, I've witnessed firsthand the challenges families face when seeking quality healthcare at home. The traditional system often leaves gaps that can feel overwhelming.
                  </p>
                  
                  <p className="text-lg text-gray-700 leading-relaxed">
                    That's why I created NurseNest - to bridge those gaps with a platform that connects families with exceptional healthcare professionals quickly, safely, and affordably.
                  </p>
                  
                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-blue-100">
                    <p className="text-gray-800 font-medium italic">
                      "Every family deserves access to compassionate, professional healthcare in the comfort of their own home. We're here to make that happen."
                    </p>
                    <p className="text-sm text-gray-600 mt-3 font-semibold">
                      - Founder, NurseNest
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 pt-4">
                    <div className="bg-blue-50 px-4 py-2 rounded-full">
                      <span className="text-blue-700 font-medium text-sm">10+ Years Experience</span>
                    </div>
                    <div className="bg-green-50 px-4 py-2 rounded-full">
                      <span className="text-green-700 font-medium text-sm">Licensed NP</span>
                    </div>
                    <div className="bg-purple-50 px-4 py-2 rounded-full">
                      <span className="text-purple-700 font-medium text-sm">Healthcare Innovation</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
