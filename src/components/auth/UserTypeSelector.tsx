
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Stethoscope, Building2, Shield, Sparkles } from "lucide-react";

export type UserType = 'nurse' | 'client' | 'admin';

interface UserTypeSelectorProps {
  value: UserType;
  onChange: (userType: UserType) => void;
  size?: "desktop" | "mobile";
}

const USER_TYPE_OPTIONS = [
  {
    value: "client",
    label: "Client",
    icon: <Building2 className="h-4 w-4 text-green-600" />,
    description: "I need nursing care services",
    mobileLabel: "Client",
    mobileDesc: "Needs care services"
  },
  {
    value: "nurse",
    label: "Healthcare Professional",
    icon: <Stethoscope className="h-4 w-4 text-blue-600" />,
    description: "I provide nursing care services",
    mobileLabel: "Professional",
    mobileDesc: "Care provider"
  },
  {
    value: "admin",
    label: "Administrator",
    icon: <Shield className="h-4 w-4 text-purple-600" />,
    description: "Platform administration",
    mobileLabel: (
      <span className="flex items-center">
        Admin
        <Sparkles className="h-3 w-3 ml-1 text-purple-600" />
      </span>
    ),
    mobileDesc: "Admin access"
  }
];

export const UserTypeSelector: React.FC<UserTypeSelectorProps> = ({
  value, onChange, size = "desktop"
}) => (
  <RadioGroup 
    value={value}
    onValueChange={val => onChange(val as UserType)}
    className={size === "desktop" ? "space-y-1.5" : "space-y-1"}
  >
    {USER_TYPE_OPTIONS.map(opt => (
      <div className="relative" key={opt.value}>
        <div className={`flex items-center space-x-2 p-2 border rounded-lg cursor-pointer transition-all hover:border-[#9bcbff] hover:bg-blue-50/50 ${
            value === opt.value 
              ? 'border-[#9bcbff] bg-blue-50' 
              : 'border-gray-200'
          }`}
        >
          <RadioGroupItem value={opt.value} id={opt.value} className="text-[#9bcbff]" />
          {opt.icon}
          <div className="flex-1">
            <div className={`font-medium text-gray-900 ${size === "desktop" ? "text-sm" : "text-xs"} flex items-center`}>
              {size === "desktop" ? opt.label : opt.mobileLabel}
              {opt.value === "admin" && size === "desktop" && (
                <Sparkles className="h-3 w-3 ml-1 text-purple-600" />
              )}
            </div>
            <div className={`${size === "desktop" ? "text-xs" : "text-[10px]"} text-gray-600`}>
              {size === "desktop" ? opt.description : opt.mobileDesc}
            </div>
          </div>
        </div>
      </div>
    ))}
  </RadioGroup>
);

