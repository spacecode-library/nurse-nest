
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
          <li
            key={service.name}
            className="group flex flex-row items-stretch px-4 py-5 md:py-6 hover:bg-primary-50/80 transition"
          >
            {/* Price Left */}
            <span className="font-bold text-primary-700 text-xl md:text-2xl flex-shrink-0 min-w-[70px] text-left">
              {service.price}
            </span>
            {/* Text block (fills remainder) */}
            <div className="ml-6 flex flex-col flex-1 justify-center">
              <div className="text-base md:text-lg font-semibold text-gray-800 leading-tight">
                {service.name}
              </div>
              <div className="text-gray-500 text-sm md:text-base font-normal mt-0.5">
                {service.details}
              </div>
              {service.note && (
                <span className={`mt-1 inline-flex items-center text-sm md:text-base font-medium
                  ${
                    service.noteType === "danger"
                      ? "text-red-700"
                      : service.noteType === "manual"
                      ? "text-orange-700"
                      : service.noteType === "fast"
                      ? "text-blue-700"
                      : "text-green-700"
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
