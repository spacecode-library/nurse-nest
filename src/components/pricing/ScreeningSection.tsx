import React from "react";
import ScreeningCategoryGroup from "./ScreeningCategoryGroup";
import ScreeningServiceListGroup from "./ScreeningServiceListGroup";
import { Clipboard, Shield, Car } from "lucide-react";

interface ScreeningSectionProps {
  className?: string;
}

export default function ScreeningSection({ className = "" }: ScreeningSectionProps) {
  return (
    <section className={`w-full max-w-6xl mx-auto ${className}`}>
      {/* --- SECTION HEADER --- */}
      <div className="text-center mb-16 mt-2 px-2">
        <div className="flex justify-center items-center mb-3">
          <Shield className="w-7 h-7 mr-2 text-primary-500 opacity-40 -mb-1" />
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-gray-800 mb-0">
            Build-Your-Own Screening
          </h2>
        </div>
        <div className="w-24 h-[5px] mx-auto mb-2 rounded-full bg-gradient-to-r from-blue-200 via-primary-300 to-blue-200 opacity-65" />
        <div className="max-w-lg mx-auto text-gray-400 font-medium text-base md:text-lg">
          Customize your screening. No hidden fees—choose only what you need.
        </div>
      </div>
      {/* --- CATEGORY LIST GROUPS: alternate soft bg sections --- */}
      <div className="space-y-7">
        <ScreeningServiceListGroup
          icon="search"
          title="Background Checks"
          bgClass="bg-white"
          services={[
            {
              name: "Basic Background",
              price: "$45",
              details: "SSN trace, sex offender registry, global watchlist, national criminal search",
              note: "Results: Under 24 hours",
              noteType: "fast",
            },
            {
              name: "Comprehensive Background",
              price: "$125",
              details: "All Basic features + State & Federal criminal search",
              note: "Results: 5–7 business days",
              noteType: "fast",
            },
          ]}
        />
        <ScreeningServiceListGroup
          icon="file-text"
          title="License & Employment Verification"
          bgClass="bg-[#FBF5F6]"
          services={[
            {
              name: "Professional License Verification",
              price: "$15",
              details: "All active/inactive licenses",
              note: "Results: Under 24 hours",
              noteType: "fast",
            },
            {
              name: "Employment History Verification",
              price: "$49",
              details: "7-year job history with title/date confirmation",
            },
          ]}
        />
        <ScreeningServiceListGroup
          icon="car"
          title="Driving & Drug Testing"
          bgClass="bg-[#F2FCE2]"
          services={[
            {
              name: "Motor Vehicle Record",
              price: "$19",
              details: "Verifies license and driving history",
            },
            {
              name: "5-Panel Drug Test",
              price: "$85",
              details: "Screens: Amphetamines, Cocaine, THC, Opiates, PCP",
            },
            {
              name: "10-Panel Drug Test",
              price: "$125",
              details: "Includes 5-panel + Barbiturates, Benzodiazepines, Methadone, Methaqualone, Propoxyphene",
            },
          ]}
        />
      </div>
    </section>
  );
}
