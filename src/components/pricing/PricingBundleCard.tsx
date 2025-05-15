
import React from "react";
import { Shield, Check } from "lucide-react";

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
      className="relative flex flex-col rounded-2xl bg-white shadow-lg transition 
        border border-gray-100 px-8 py-6 min-h-[410px] md:min-h-[460px] overflow-hidden"
    >
      {/* Tag (top-right) */}
      <div
        className={`absolute top-6 right-8 px-3 py-1 text-xs font-medium rounded-full shadow-sm ${tagColor} z-10`}
      >
        {tag}
      </div>
      {/* Card header with icon + title/badge */}
      <div className="flex items-center mb-5">
        {IconEl && (
          <div className="rounded-full p-2 bg-gray-50 flex items-center justify-center mr-3 shadow-sm">
            <IconEl className="w-6 h-6 text-primary-500" />
          </div>
        )}
        <h2 className="font-semibold text-2xl text-gray-800 mr-auto">{title}</h2>
      </div>
      {/* Badge and price */}
      <div className="flex flex-row items-end mb-3">
        <span
          data-testid={badgeTestId}
          className="rounded-full font-medium text-xs px-3 py-1 mr-4"
          style={{
            background: badge.color,
            color: badge.textColor,
            minWidth: "fit-content"
          }}
        >
          {badge.text}
        </span>
        <span className="text-3xl font-bold text-gray-900 tracking-tight">{price}</span>
      </div>
      {/* Divider */}
      <div className="h-px w-full bg-gray-100 mb-5"></div>
      {/* Features */}
      <ul className="flex-1 flex flex-col justify-start gap-2 mb-2">
        {features.map((feat, i) => (
          <li key={i} className="flex items-center text-base text-gray-700">
            <Check className="w-4 h-4 mr-2 text-green-600" />
            <span>{feat}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
