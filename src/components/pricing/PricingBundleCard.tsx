
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
}

export default function PricingBundleCard({
  title,
  price,
  badge,
  tag,
  tagColor,
  features,
  icon,
}: PricingBundleCardProps) {
  const IconEl = icon === "shield" ? Shield : undefined;

  return (
    <article
      className="relative flex flex-col rounded-2xl bg-white shadow-xl transition border border-gray-100 px-8 pt-10 pb-9 min-h-[440px] md:min-h-[470px] overflow-hidden items-center"
      style={{ minHeight: 470 }}
    >
      {/* Card Icon & Title */}
      <div className="flex items-center mb-3">
        {IconEl && (
          <div className="rounded-full p-2 bg-gray-50 flex items-center justify-center mr-3 shadow-sm">
            <IconEl className="w-7 h-7 text-primary-500" />
          </div>
        )}
        <h2 className="font-semibold text-2xl md:text-2xl text-gray-800">{title}</h2>
      </div>

      {/* Price (centered) */}
      <div className="flex flex-col items-center mb-3">
        <span className="text-3xl font-bold text-gray-900 tracking-tight mb-2">{price}</span>
        {/* Badge (under price) */}
        <div
          className="rounded-full font-medium text-xs px-3 py-1 mt-1 mb-2"
          style={{
            background: badge.color,
            color: badge.textColor,
          }}
        >
          {badge.text}
        </div>
      </div>

      {/* "Best for" Tag */}
      <div className={`${tagColor} mb-3`}>
        {tag}
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-gray-100 mb-5"></div>

      {/* Features List */}
      <ul className="flex-1 flex flex-col gap-2 mb-2 w-full">
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
