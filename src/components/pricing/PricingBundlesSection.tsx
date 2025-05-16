
import React from "react";
import PricingBundleCard from "./PricingBundleCard";
import AnimatedSection from "@/components/AnimatedSection";

type Bundle = {
  title: string;
  price: string;
  tag: string;
  tagColor: string;
  tagBg: string;
  badge: { text: string; color: string; textColor: string };
  features: string[];
  icon: "shield";
  variant?: "basic" | "pro";
};

interface BundlesSectionProps {
  className?: string;
}

export default function PricingBundlesSection({ className = "" }: BundlesSectionProps) {
  const bundles: Bundle[] = [
    {
      title: "Nest Safe Basic",
      price: "$169",
      tag: "Best for: Standard safety assurance",
      tagColor: "text-emerald-700",
      tagBg: "bg-emerald-50",
      badge: { text: "Saves $15", color: "#E6F4EA", textColor: "#1A7F37" },
      features: [
        "Basic Background Check",
        "License Verification",
        "5-Panel Drug Test",
        "Motor Vehicle Record",
      ],
      icon: "shield",
      variant: "basic",
    },
    {
      title: "Nest Shield Pro",
      price: "$289",
      tag: "Best for: High-trust roles & deep vetting",
      tagColor: "text-amber-800",
      tagBg: "bg-amber-50",
      badge: { text: "Saves $44", color: "#FFF8E1", textColor: "#B45309" },
      features: [
        "Comprehensive Background Check",
        "License Verification",
        "10-Panel Drug Test",
        "Employment Verification",
        "Motor Vehicle Record",
      ],
      icon: "shield",
      variant: "pro",
    },
  ];

  return (
    <section className={`w-full max-w-5xl mx-auto px-4 ${className}`}>
      <AnimatedSection animation="fade-up" className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Choose a Pre-Built Bundle</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Get started with one of our most popular, curated vetting packages.
        </p>
      </AnimatedSection>
      
      <AnimatedSection animation="fade-up" delay={100}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {bundles.map((b) => (
            <PricingBundleCard
              key={b.title}
              title={b.title}
              price={b.price}
              badge={b.badge}
              tag={b.tag}
              tagColor={b.tagColor}
              tagBg={b.tagBg}
              features={b.features}
              icon={b.icon}
              variant={b.variant}
            />
          ))}
        </div>
      </AnimatedSection>
    </section>
  );
}
