
import React from "react";
import { CheckCircle2 } from "lucide-react";

interface ScreeningCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  badge?: {
    text: string;
    color: string;
    textColor: string;
  };
  isPopular?: boolean;
}

export default function ScreeningCard({
  title,
  price,
  description,
  features,
  badge,
  isPopular = false,
}: ScreeningCardProps) {
  return (
    <div className={`relative bg-white rounded-2xl shadow-lg border-2 p-6 transition-all duration-300 hover:shadow-xl hover:scale-105 ${
      isPopular 
        ? 'border-[#d97706] bg-gradient-to-br from-[#fffbf0] to-white' 
        : 'border-[#e2e8f0] hover:border-[#9bcbff]'
    }`}>
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-gradient-to-r from-[#fbbf24] to-[#d97706] text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
            Most Popular
          </span>
        </div>
      )}

      <div className="text-center mb-4">
        <h3 className="text-xl font-semibold text-[#1e293b] mb-2">{title}</h3>
        <div className="flex items-baseline justify-center mb-2">
          <span className={`text-3xl font-light ${isPopular ? 'text-[#92400e]' : 'text-[#0c4a6e]'}`}>
            {price}
          </span>
        </div>
        
        {badge && (
          <div
            className="inline-block rounded-full font-medium text-xs px-3 py-1 shadow-sm mb-3"
            style={{ background: badge.color, color: badge.textColor }}
          >
            {badge.text}
          </div>
        )}
        
        <p className="text-[#64748b] text-sm">{description}</p>
      </div>

      <ul className="space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <CheckCircle2 className={`h-4 w-4 mt-0.5 mr-2 flex-shrink-0 ${
              isPopular ? 'text-[#d97706]' : 'text-[#0ea5e9]'
            }`} />
            <span className="text-[#475569] text-sm leading-relaxed">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
