
import React from 'react';
import { Shield, FileText, Car, Clock } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import ScreeningCard from './ScreeningCard';

export default function ScreeningSection() {
  const screeningOptions = [
    {
      title: "Background Check",
      price: "$29",
      features: [
        "Criminal history verification",
        "Employment verification", 
        "Reference checks",
        "Professional license verification"
      ],
      icon: Shield,
      isPopular: false
    },
    {
      title: "Drug Screening",
      price: "$45", 
      features: [
        "10-panel drug test",
        "Professional lab processing",
        "Results within 24-48 hours",
        "SAMHSA compliant testing"
      ],
      icon: FileText,
      isPopular: true
    },
    {
      title: "Driving Record",
      price: "$15",
      features: [
        "3-year driving history",
        "Moving violations check", 
        "License status verification",
        "Insurance claims history"
      ],
      icon: Car,
      isPopular: false
    },
    {
      title: "Express Processing",
      price: "$25",
      features: [
        "24-hour rush processing",
        "Priority lab scheduling",
        "Expedited results delivery", 
        "Weekend processing available"
      ],
      icon: Clock,
      isPopular: false
    }
  ];

  return (
    <section className="section-padding bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container-custom">
        <AnimatedSection animation="fade-up" className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Optional <span className="text-blue-600">Screening Services</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Add extra peace of mind with our professional screening services. All screenings are optional and can be added during the nurse selection process.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {screeningOptions.map((option) => (
            <AnimatedSection
              key={option.title}
              animation="fade-up"
              delay={screeningOptions.indexOf(option) * 100}
            >
              <ScreeningCard
                title={option.title}
                price={option.price}
                features={option.features}
                icon={option.icon}
                isPopular={option.isPopular}
              />
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection animation="fade-up" delay={400} className="text-center mt-12">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Professional Screening Standards
            </h3>
            <p className="text-gray-600 leading-relaxed">
              All screening services are conducted by certified third-party providers and comply with federal and state regulations. Results are securely delivered and stored according to HIPAA guidelines.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
