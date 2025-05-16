
import React from "react";
import { Shield, CheckCircle2 } from "lucide-react";
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

  // Enhanced 3D effects and styling based on variant
  const cardClasses = variant === "pro" 
    ? "relative transform-gpu luxury-gold-gradient border-[#f6e6ac] hover:scale-[1.02] hover:shadow-[0_20px_60px_-12px_rgba(191,169,69,0.25),0_8px_24px_-4px_rgba(191,169,69,0.15)] transition-all duration-300"
    : "relative transform-gpu bg-gradient-to-br from-blue-50 via-white to-[#EAF3FE] border-blue-100 hover:scale-[1.02] hover:shadow-[0_16px_36px_-8px_rgba(30,136,229,0.2)] transition-all duration-300";

  const headerClasses = variant === "pro"
    ? "bg-gradient-to-r from-[#FFFBEF] to-[#FFF8E1] border-b border-[#f0d686]"
    : "bg-gradient-to-r from-[#F0F7FF] to-[#E8F2FF] border-b border-blue-100";
  
  const textColor = variant === "pro" ? "text-yellow-900" : "text-blue-900";
  const iconBgColor = variant === "pro" ? "bg-amber-50" : "bg-blue-50";
  const iconColor = variant === "pro" ? "text-amber-600" : "text-primary-500";
  const buttonClasses = variant === "pro" 
    ? "bg-gradient-to-br from-amber-50 to-amber-100 hover:bg-gradient-to-br hover:from-amber-100 hover:to-amber-200 text-amber-800 font-medium border border-amber-200 shadow-md hover:shadow-xl"
    : "bg-primary-500 hover:bg-primary-600 text-white shadow-md hover:shadow-xl";

  return (
    <div 
      className={`flex flex-col rounded-2xl shadow-lg overflow-hidden ${cardClasses} min-h-[420px] max-w-[440px] mx-auto w-full border`}
      style={{ 
        perspective: '1000px',
        transformStyle: 'preserve-3d',
        boxShadow: variant === 'pro' 
          ? '0 10px 30px -5px rgba(191,169,69,0.2), 0 5px 15px -5px rgba(191,169,69,0.1)'
          : '0 10px 30px -5px rgba(30,136,229,0.15), 0 5px 15px -5px rgba(30,136,229,0.05)'
      }}
    >
      {/* "Best for" Tag at top */}
      <div className={`${tagBg} ${tagColor} text-sm font-medium py-1.5 px-4 text-center`}>
        {tag}
      </div>

      {/* Card Header */}
      <div className={`${headerClasses} p-6 flex flex-col items-center`}>
        {/* Icon & Title */}
        <div className="flex items-center mb-4">
          {IconEl && (
            <div className={`rounded-full p-2 ${iconBgColor} flex items-center justify-center mr-3 shadow-sm`}>
              <IconEl className={`w-5 h-5 ${iconColor}`} />
            </div>
          )}
          <h2 className={`font-semibold text-2xl ${textColor}`}>{title}</h2>
        </div>

        {/* Price (centered) */}
        <div className="flex flex-col items-center">
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
      <div className="flex flex-col flex-1 p-6 bg-white">
        {/* Features List */}
        <div className="flex-1">
          <ul className="space-y-3">
            {features.map((feat, i) => (
              <li key={i} className="flex items-start">
                <CheckCircle2 className={`h-5 w-5 mt-0.5 mr-3 flex-shrink-0 ${variant === 'pro' ? 'text-amber-500' : 'text-green-500'}`} />
                <span className="text-gray-700">{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Button */}
        <Link to="/apply" className="mt-6 block">
          <Button className={`w-full ${buttonClasses}`}>
            Select This Bundle
          </Button>
        </Link>
      </div>
    </div>
  );
}
