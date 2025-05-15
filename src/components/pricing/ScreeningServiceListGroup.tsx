
import React from "react";
import { Search, FileText, Car } from "lucide-react";

type CategoryIcon = "search" | "file-text" | "car";

const iconMap: Record<CategoryIcon, React.ReactNode> = {
  "search": <Search className="w-5 h-5 text-primary-400 mr-2 opacity-60" />,
  "file-text": <FileText className="w-5 h-5 text-primary-400 mr-2 opacity-60" />,
  "car": <Car className="w-5 h-5 text-primary-400 mr-2 opacity-60" />,
};

interface ScreeningService {
  name: string;
  price: string;
  details: string;
  note?: string;
  noteType?: "fast" | "manual" | "instant" | "danger";
}

interface ScreeningServiceListGroupProps {
  icon: CategoryIcon;
  title: string;
  services: ScreeningService[];
  bgClass: string;
}

export default function ScreeningServiceListGroup({
  icon,
  title,
  services,
  bgClass,
}: ScreeningServiceListGroupProps) {
  return (
    <section className={`rounded-xl p-0 md:p-2 ${bgClass} shadow-sm`}>
      <div className="flex items-center gap-3 pt-6 px-4">
        <span className="flex items-center">{iconMap[icon]}</span>
        <h3 className="font-bold text-lg md:text-xl text-gray-900 tracking-tight">{title}</h3>
      </div>
      <div className="h-[2px] bg-gradient-to-r from-blue-100 via-blue-200 to-transparent my-3 w-24 ml-4" />
      <ul className="divide-y divide-gray-100">
        {services.map((service, idx) => (
          <li key={service.name} className="flex flex-col md:flex-row md:items-center px-4 py-4 bg-opacity-80">
            <div className="flex flex-col md:flex-row md:items-center flex-1 min-w-0">
              <span className="font-semibold text-gray-800 text-base md:w-60">{service.name}</span>
              <span className="ml-0 md:ml-6 text-gray-500 text-sm flex-1">
                {service.details}
              </span>
            </div>
            <div className="flex flex-col items-end md:items-center md:flex-row gap-2 mt-2 md:mt-0 md:ml-6">
              <span className="font-bold text-primary-700 text-base">{service.price}</span>
              {service.note && (
                <span className={`ml-2 inline-flex items-center text-xs rounded-full px-3 py-1 font-medium
                  ${service.noteType === "danger"
                    ? "bg-red-50 text-red-700"
                    : service.noteType === "manual"
                    ? "bg-orange-50 text-orange-700"
                    : service.noteType === "fast"
                    ? "bg-blue-50 text-blue-700"
                    : "bg-green-50 text-green-700"
                  }
                `}>
                  {service.noteType === "fast" && (
                    <span className="mr-1 text-blue-400 text-lg">⏱️</span>
                  )}
                  {service.noteType === "instant" && (
                    <span className="mr-1">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#299D5D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </span>
                  )}
                  {service.noteType === "danger" && (
                    <span className="mr-1 text-red-500 text-lg">❗</span>
                  )}
                  {service.note}
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
