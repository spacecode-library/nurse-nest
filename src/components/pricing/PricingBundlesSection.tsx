
import React from "react";
import PricingBundleCard from "./PricingBundleCard";

type Bundle = {
  title: string;
  price: string;
  tag: string;
  tagColor: string;
  badge: { text: string; color: string; textColor: string };
  features: string[];
  icon: "shield";
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
      tagColor: "text-gray-500 italic text-[15px] mb-0.5",
      badge: { text: "Saves $15", color: "#E6F4EA", textColor: "#1A7F37" },
      features: [
        "Basic Background Check",
        "License Verification",
        "5-Panel Drug Test",
        "Motor Vehicle Record",
      ],
      icon: "shield",
    },
    {
      title: "Nest Shield Pro",
      price: "$289",
      tag: "Best for: High-trust roles & deep vetting",
      tagColor: "text-gray-500 italic text-[15px] mb-0.5",
      badge: { text: "Saves $44", color: "#FFF4E5", textColor: "#B95B00" },
      features: [
        "Comprehensive Background Check",
        "License Verification",
        "10-Panel Drug Test",
        "Employment Verification",
        "Motor Vehicle Record",
      ],
      icon: "shield",
    },
  ];

  return (
    <section className={`w-full max-w-5xl mx-auto ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-7 items-stretch">
        {bundles.map((b) => (
          <PricingBundleCard
            key={b.title}
            title={b.title}
            price={b.price}
            badge={b.badge}
            tag={b.tag}
            tagColor={b.tagColor}
            features={b.features}
            icon={b.icon}
          />
        ))}
      </div>
    </section>
  );
}
