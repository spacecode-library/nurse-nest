import React from 'react';
import { ScreeningCard } from './ScreeningCard';
import ScreeningCategoryGroup from './ScreeningCategoryGroup';
import AnimatedSection from "@/components/AnimatedSection";

export default function ScreeningSection({ className = "" }: { className?: string }) {
  const screeningOptions = [
    {
      title: "Basic Background Check",
      price: "$49",
      description: "Standard criminal history review",
      features: [
        "County and state criminal history",
        "Sex offender registry check",
        "Basic identity verification",
        "5-7 business day turnaround"
      ]
    },
    {
      title: "Comprehensive Background Check",
      price: "$89",
      description: "In-depth multi-jurisdictional screening",
      features: [
        "Federal and multi-state criminal search",
        "Court records verification",
        "Enhanced identity verification",
        "Professional reference contacts",
        "7-10 business day turnaround"
      ],
      isPopular: true
    },
    {
      title: "License Verification",
      price: "$29",
      description: "Professional nursing license validation",
      features: [
        "Current license status confirmation",
        "Disciplinary action history",
        "Expiration date verification",
        "Multi-state license validation"
      ]
    },
    {
      title: "5-Panel Drug Test",
      price: "$59",
      description: "Standard substance screening",
      features: [
        "Cocaine, Marijuana, PCP testing",
        "Amphetamines and Opiates",
        "Chain of custody documentation",
        "24-48 hour results"
      ]
    },
    {
      title: "10-Panel Drug Test",
      price: "$79",
      description: "Comprehensive substance screening",
      features: [
        "All 5-panel substances plus:",
        "Barbiturates, Benzodiazepines",
        "Methadone, Propoxyphene, Quaaludes",
        "Enhanced detection capabilities"
      ]
    },
    {
      title: "Employment Verification",
      price: "$39",
      description: "Previous work history confirmation",
      features: [
        "Past 3 employers contacted",
        "Position and tenure verification",
        "Performance and conduct review",
        "Reference quality assessment"
      ]
    },
    {
      title: "Motor Vehicle Record",
      price: "$19",
      description: "Driving history and violations",
      features: [
        "3-year driving history",
        "Moving violations review",
        "License status verification",
        "Insurance claims history"
      ]
    }
  ];

  return (
    <section className={`w-full max-w-6xl mx-auto px-4 ${className}`}>
      <AnimatedSection animation="fade-up" className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Build Your Custom Package</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-4">
          Select individual screening services to create a custom vetting package that meets your specific requirements.
        </p>
      </AnimatedSection>
      
      <AnimatedSection animation="fade-up" delay={100}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {screeningOptions.map((option) => (
            <ScreeningCard
              key={option.title}
              title={option.title}
              price={option.price}
              description={option.description}
              features={option.features}
              isPopular={option.isPopular}
            />
          ))}
        </div>
      </AnimatedSection>
    </section>
  );
}
