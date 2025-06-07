
import React from "react";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface PricingBundleCardProps {
  title: string;
  price: string;
  badge: { text: string; color: string; textColor: string };
  tag: string;
  tagColor: string;
  tagBg: string;
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
  tagBg,
  features,
  icon,
  variant = "basic",
}: PricingBundleCardProps) {
  const navigate = useNavigate();

  const handleSelectPackage = () => {
    navigate('/apply');
  };

  const getIcon = () => {
    switch (icon) {
      case "shield":
        return <Shield className="h-8 w-8 text-blue-600" />;
      default:
        return <Shield className="h-8 w-8 text-blue-600" />;
    }
  };

  const isPro = variant === "pro";

  return (
    <div className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl hover:scale-105 ${
      isPro ? "border-amber-200 ring-2 ring-amber-100" : "border-emerald-200 ring-2 ring-emerald-100"
    }`}>
      {/* Badge */}
      <div 
        className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-sm font-medium"
        style={{ backgroundColor: badge.color, color: badge.textColor }}
      >
        {badge.text}
      </div>

      <div className="p-8">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          {getIcon()}
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-center mb-2">{title}</h3>

        {/* Tag */}
        <div className={`${tagBg} ${tagColor} text-sm px-3 py-1 rounded-full text-center mb-6`}>
          {tag}
        </div>

        {/* Price */}
        <div className="text-center mb-6">
          <span className="text-4xl font-bold text-gray-900">{price}</span>
        </div>

        {/* Features */}
        <ul className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <div className={`w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 ${
                isPro ? "bg-amber-500" : "bg-emerald-500"
              }`} />
              <span className="text-gray-700 text-sm leading-relaxed">{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <Button
          onClick={handleSelectPackage}
          className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
            isPro 
              ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl" 
              : "bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white shadow-lg hover:shadow-xl"
          }`}
        >
          Select Package
        </Button>
      </div>
    </div>
  );
}
