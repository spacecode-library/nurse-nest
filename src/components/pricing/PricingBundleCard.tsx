
import React from "react";
import { Shield } from "lucide-react";

interface BundleBadge {
  text: string;
  color: string;
  textColor: string;
}

interface PricingBundleCardProps {
  title: string;
  price: string;
  badge: BundleBadge;
  tag: string;
  tagColor: string;
  features: string[];
  icon: "shield";
  badgeTestId?: string;
}

export default function PricingBundleCard({
  title,
  price,
  badge,
  tag,
  tagColor,
  features,
  icon,
  badgeTestId,
}: PricingBundleCardProps) {
  // Choose icon for the card. Can expand per design.
  const IconEl = icon === "shield" ? Shield : null;

  return (
    <article
      className="relative flex flex-col rounded-2xl bg-white shadow-xl transition border border-gray-100 px-7 py-7 min-h-[380px] md:min-h-[430px] overflow-hidden"
      style={{ minHeight: 430 }}
    >
      {/* Badge (top right) */}
      <div
        data-testid={badgeTestId}
        className="absolute top-6 right-7 z-10 rounded-full font-medium text-xs px-3 py-1"
        style={{
          background: badge.color,
          color: badge.textColor,
        }}
      >
        {badge.text}
      </div>
      {/* Tag ("Best for") */}
      <div
        className={`absolute top-6 left-7 px-3 py-1 text-xs font-medium rounded-full ${tagColor} z-10`}
        style={{ fontSize: 13, opacity: 0.95 }}
      >
        {tag}
      </div>
      {/* Card header with icon + title */}
      <div className="flex items-center mb-6 mt-8">
        {IconEl && (
          <div className="rounded-full p-2 bg-gray-50 flex items-center justify-center mr-3 shadow-sm">
            <IconEl className="w-7 h-7 text-primary-500" />
          </div>
        )}
        <h2 className="font-semibold text-2xl md:text-2xl text-gray-800 mr-auto">{title}</h2>
      </div>
      {/* Price */}
      <div className="flex flex-col items-start mb-4 mt-1">
        <span className="text-3xl font-bold text-gray-900 tracking-tight">{price}</span>
      </div>
      {/* Divider */}
      <div className="h-px w-full bg-gray-100 mb-5"></div>
      {/* Features */}
      <ul className="flex-1 flex flex-col justify-start gap-2 mb-2">
        {features.map((feat, i) => (
          <li key={i} className="flex items-center text-base text-gray-700 font-normal">
            <span className="inline-block mr-2 text-green-600 text-lg" aria-hidden="true">✔</span>
            <span>{feat}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

