
import { Shield, Users, Clock } from 'lucide-react';

export default function WhatIsNurseNestSection() {
  return (
    <section className="section-padding bg-white" id="about">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Nurse Nest is a <span className="text-gradient">Nurse-Owned</span> Matching Service Built on Trust
          </h2>
          <p className="text-lg text-gray-700">
            We connect families and healthcare providers with licensed, background-checked nurses for in-home or in-practice support. Whether you need a NICU-trained night nurse, a postpartum caregiver, or an elder care nurse — we find the right match, fast.
          </p>
        </div>
        
        {/* Key Features */}
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Shield className="h-10 w-10 text-nurse-dark" />,
              title: "Licensed & Verified",
              description: "Every nurse in our network is licensed, background-checked, and credential-verified."
            },
            {
              icon: <Users className="h-10 w-10 text-nurse-dark" />,
              title: "Perfect Matching",
              description: "We match your unique needs with nurses who have the right specialization and experience."
            },
            {
              icon: <Clock className="h-10 w-10 text-nurse-dark" />,
              title: "Quick Response",
              description: "We understand urgency and can match you with the right nurse within 48 hours."
            }
          ].map((feature, index) => (
            <div 
              key={index} 
              className="glass-card p-8 text-center hover-scale animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
