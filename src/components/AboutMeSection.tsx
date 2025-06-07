
import React from 'react';
import { ArrowRight, Heart, Users, Award, CheckCircle } from 'lucide-react';
import AnimatedSection from './AnimatedSection';

export default function AboutMeSection() {
  const achievements = [
    { icon: <Users className="h-6 w-6 text-blue-600" />, text: "15+ years nursing experience" },
    { icon: <Award className="h-6 w-6 text-blue-600" />, text: "Advanced practice certification" },
    { icon: <Heart className="h-6 w-6 text-blue-600" />, text: "Passionate patient advocate" },
    { icon: <CheckCircle className="h-6 w-6 text-blue-600" />, text: "Healthcare innovation leader" }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4">
        <AnimatedSection animation="fade-up" className="text-center mb-16">
          {/* Custom Header Image */}
          <div className="flex justify-center mb-6">
            <img 
              src="/lovable-uploads/860b40a9-bce0-44b2-90e0-873b43061d41.png" 
              alt="Founder"
              className="h-16 md:h-20 lg:h-24 w-auto object-contain"
            />
          </div>
        </AnimatedSection>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Image */}
            <AnimatedSection animation="fade-right" className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white p-2">
                <img 
                  src="/lovable-uploads/119a6708-a3cb-400b-ac7b-c2437a103499.png" 
                  alt="Nurse Nest Founder" 
                  className="w-full h-auto rounded-xl"
                />
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-100 rounded-full opacity-20"></div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full opacity-30"></div>
              </div>
            </AnimatedSection>

            {/* Right Column - Content */}
            <AnimatedSection animation="fade-left" delay={200}>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold text-gray-800 leading-tight">
                    Meet the Nurse Behind Nurse Nest
                  </h3>
                  
                  <div className="space-y-4 text-gray-600 leading-relaxed">
                    <p>
                      Hi, I'm <span className="font-semibold text-gray-800">Ashley</span>, a registered nurse with over 15 years of experience in healthcare. Throughout my career, I've witnessed firsthand the challenges families face when trying to find reliable, skilled nursing care at home.
                    </p>
                    
                    <p>
                      After seeing countless patients struggle with impersonal agency care and families overwhelmed by the complexity of hiring independent nurses, I knew there had to be a better way.
                    </p>
                    
                    <p>
                      That's why I created <span className="font-semibold text-blue-600">Nurse Nest</span> – to bridge the gap between families who need exceptional care and skilled nurses who want to practice independently. Our platform combines the personal touch of private nursing with the security and support of a professional service.
                    </p>
                  </div>
                </div>

                {/* Achievements Grid */}
                <div className="grid grid-cols-2 gap-4 py-6">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                      {achievement.icon}
                      <span className="text-sm font-medium text-gray-700">{achievement.text}</span>
                    </div>
                  ))}
                </div>

                {/* Mission Statement */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <Heart className="h-5 w-5 text-red-500 mr-2" />
                    Our Mission
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    To empower families with access to exceptional nursing care while supporting independent nurses in building meaningful, sustainable practices. Every connection we make is a step toward better healthcare outcomes and stronger communities.
                  </p>
                </div>

                {/* CTA */}
                <div className="pt-4">
                  <a 
                    href="/apply" 
                    className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
                  >
                    Start Your Care Journey
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
}
