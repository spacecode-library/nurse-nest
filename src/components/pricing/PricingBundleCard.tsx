
import React from "react";
import { Shield, CheckCircle2, Star } from "lucide-react";

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
  tagBg?: string;
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
  tagBg = "bg-gray-50",
  features,
  icon,
  variant = "basic",
}: PricingBundleCardProps) {
  const IconEl = icon === "shield" ? Shield : undefined;

  // Luxury styling based on variant
  const cardClasses = variant === "pro" 
    ? "relative group transform-gpu bg-gradient-to-br from-[#fffbf0] via-white to-[#fef7ed] border-[#d97706] hover:scale-105 hover:shadow-2xl transition-all duration-500 ease-out"
    : "relative group transform-gpu bg-gradient-to-br from-[#f0f9ff] via-white to-[#e0f2fe] border-[#0ea5e9] hover:scale-105 hover:shadow-xl transition-all duration-500 ease-out";

  const headerClasses = variant === "pro"
    ? "bg-gradient-to-r from-[#fefbf0] to-[#fef3e2] border-b border-[#e5e7eb]"
    : "bg-gradient-to-r from-[#f0f9ff] to-[#e0f2fe] border-b border-[#e5e7eb]";
  
  const textColor = variant === "pro" ? "text-[#1e293b]" : "text-[#1e293b]";
  const iconBgColor = variant === "pro" ? "bg-gradient-to-br from-[#fbbf24] to-[#d97706]" : "bg-gradient-to-br from-[#9bcbff] to-[#3b82f6]";
  const priceColor = variant === "pro" ? "text-[#92400e]" : "text-[#0c4a6e]";

  return (
    <div 
      className={`flex flex-col rounded-3xl shadow-lg overflow-hidden ${cardClasses} min-h-[480px] max-w-[400px] mx-auto w-full border-2`}
      style={{ 
        boxShadow: variant === 'pro' 
          ? '0 20px 40px -12px rgba(217, 119, 6, 0.15), 0 8px 20px -4px rgba(217, 119, 6, 0.08)'
          : '0 20px 40px -12px rgba(14, 165, 233, 0.15), 0 8px 20px -4px rgba(14, 165, 233, 0.08)'
      }}
    >
      {/* Premium Badge for Pro */}
      {variant === "pro" && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-gradient-to-r from-[#fbbf24] to-[#d97706] text-white px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1">
            <Star className="h-3 w-3 fill-current" />
            <span className="text-xs font-semibold">Most Popular</span>
            <Star className="h-3 w-3 fill-current" />
          </div>
        </div>
      )}

      {/* "Best for" Tag at top */}
      <div className={`${tagBg} ${tagColor} text-sm font-medium py-2 px-6 text-center ${variant === 'pro' ? 'pt-6' : ''}`}>
        {tag}
      </div>

      {/* Card Header */}
      <div className={`${headerClasses} p-8 flex flex-col items-center text-center`}>
        {/* Icon & Title */}
        <div className="flex items-center mb-6">
          {IconEl && (
            <div className={`rounded-2xl p-3 ${iconBgColor} flex items-center justify-center mr-4 shadow-md`}>
              <IconEl className="w-6 h-6 text-white" />
            </div>
          )}
          <h2 className={`font-medium text-2xl ${textColor}`}>{title}</h2>
        </div>

        {/* Price */}
        <div className="flex flex-col items-center mb-4">
          <span className={`text-4xl font-light ${priceColor} mb-2`}>{price}</span>
          
          {/* Badge */}
          <div
            className="rounded-full font-medium text-xs px-3 py-1.5 shadow-sm"
            style={{ background: badge.color, color: badge.textColor }}
          >
            {badge.text}
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-8 bg-white">
        {/* Features List */}
        <div className="flex-1 mb-6">
          <ul className="space-y-4">
            {features.map((feat, i) => (
              <li key={i} className="flex items-start">
                <CheckCircle2 className={`h-5 w-5 mt-0.5 mr-3 flex-shrink-0 ${variant === 'pro' ? 'text-[#d97706]' : 'text-[#0ea5e9]'}`} />
                <span className="text-[#475569] leading-relaxed">{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Information */}
        <div className="text-center">
          <p className="text-[#475569] text-sm mb-2">Contact us to get started:</p>
          <p className="text-[#1e293b] font-medium">info@nursenest.us</p>
        </div>
      </div>
    </div>
  );
}
