
import React from "react";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

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

  // Enhanced 3D effects and styling
  const cardClasses = variant === "pro" 
    ? "transform-gpu luxury-gold-gradient border-[#f6e6ac] hover:scale-[1.03] hover:shadow-[0_22px_70px_-15px_rgba(191,169,69,0.35),0_10px_45px_-5px_rgba(191,169,69,0.2)] transition-all duration-300"
    : "transform-gpu bg-gradient-to-br from-blue-50 via-white to-[#D3E4FD] border-blue-100 hover:scale-[1.03] hover:shadow-[0_18px_40px_-12px_rgba(30,136,229,0.25)] transition-all duration-300";

  const headerClasses = variant === "pro"
    ? "bg-gradient-to-r from-[#fff5df] to-[#ffe8a3] border-b border-[#f0d686]"
    : "bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100";
  
  const textColor = variant === "pro" ? "text-yellow-900" : "text-blue-900";
  const iconColor = variant === "pro" ? "text-yellow-700" : "text-blue-500";
  const buttonClasses = variant === "pro" 
    ? "bg-[#ffedbe] hover:bg-[#ffe082] text-[#a3822b] font-medium border border-[#e6d6b7] shadow-md hover:shadow-xl"
    : "bg-primary-500 hover:bg-primary-600 text-white shadow-md hover:shadow-xl";

  return (
    <div 
      className={`relative flex flex-col rounded-2xl shadow-xl overflow-hidden ${cardClasses} min-h-[320px] max-w-[400px] mx-auto w-full`}
      style={{ 
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Card Header */}
      <div className={`${headerClasses} py-8 px-6 flex flex-col items-center`}>
        {/* Icon & Title */}
        <div className="flex items-center mb-3">
          {IconEl && (
            <div className="rounded-full p-2 bg-white/70 flex items-center justify-center mr-3 shadow-sm">
              <IconEl className={`w-6 h-6 ${iconColor}`} />
            </div>
          )}
          <h2 className={`font-semibold text-2xl ${textColor}`}>{title}</h2>
        </div>

        {/* Price (centered) */}
        <div className="flex flex-col items-center mt-2">
          <span className={`text-3xl font-bold ${textColor}`}>{price}</span>
          
          {/* Badge (under price) */}
          <div
            className="rounded-full font-medium text-xs px-3 py-1 mt-2"
            style={{ background: badge.color, color: badge.textColor }}
          >
            {badge.text}
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-6">
        {/* "Best for" Tag */}
        <div className={`${tagColor} mb-3 text-center`}>{tag}</div>

        {/* Features List */}
        <div className="flex-1">
          <ul className="space-y-3">
            {features.map((feat, i) => (
              <li key={i} className="flex items-start">
                <span className="inline-block mr-2 text-green-600 text-lg" aria-hidden="true">✓</span>
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Button */}
        <Link to="/apply" className="mt-4 block">
          <Button className={`w-full ${buttonClasses}`}>
            Select This Bundle
          </Button>
        </Link>
      </div>
    </div>
  );
}
