
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
  variant?: "basic" | "pro";
}

export default function PricingBundleCard({
  title,
  price,
  badge,
  tag,
  tagColor,
  features,
  icon,
  variant = "basic",
}: PricingBundleCardProps) {
  const IconEl = icon === "shield" ? Shield : undefined;

  // Color backgrounds
  const cardBg =
    variant === "pro"
      ? "bg-gradient-to-br from-yellow-300 via-yellow-100 to-yellow-400"
      : "bg-gradient-to-br from-blue-50 via-blue-100 to-[#D3E4FD]";

  // Text color for Pro needs more contrast
  const textColor =
    variant === "pro"
      ? "text-yellow-900"
      : "text-blue-900";

  // Glow shadow for "pro"
  const shadow =
    variant === "pro"
      ? "shadow-xl shadow-yellow-300/50 hover:shadow-2xl hover:shadow-yellow-400/80"
      : "shadow-xl hover:shadow-2xl shadow-blue-100/60";

  return (
    <article
      className={`relative flex flex-col rounded-2xl ${cardBg} ${shadow} border-2 border-transparent px-8 pt-10 pb-9 min-h-[440px] md:min-h-[470px] overflow-hidden items-center transition-transform duration-200 hover:scale-[1.025]`}
      style={{ minHeight: 470 }}
    >
      {/* Card Icon & Title */}
      <div className="flex items-center mb-3">
        {IconEl && (
          <div className="rounded-full p-2 bg-white/70 flex items-center justify-center mr-3 shadow-sm">
            <IconEl className={`w-7 h-7 ${variant === "pro" ? "text-yellow-700" : "text-blue-500"}`} />
          </div>
        )}
        <h2 className={`font-semibold text-2xl md:text-2xl ${textColor}`}>{title}</h2>
      </div>

      {/* Price (centered) */}
      <div className="flex flex-col items-center mb-3">
        <span className="text-3xl font-bold tracking-tight mb-2 ${textColor}">{price}</span>
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
      <ul className="flex-1 flex flex-col gap-3 mb-3 w-full">
        {features.map((feat, i) => (
          <li key={i} className={`flex items-center text-base font-normal ${textColor}`}>
            <span className="inline-block mr-2 text-green-600 text-lg" aria-hidden="true">✔</span>
            <span>{feat}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
