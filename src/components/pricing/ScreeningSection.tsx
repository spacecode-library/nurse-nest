
import React from "react";
import ScreeningCategoryGroup from "./ScreeningCategoryGroup";
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
      {/* --- CATEGORY GROUPS (alternate soft bg sections) --- */}
      <div className="space-y-24">
        <div className="bg-white rounded-xl px-2 py-6 shadow-sm">
          <ScreeningCategoryGroup
            icon="search"
            title="Background Checks"
            cards={[
              {
                name: "Basic Background",
                price: "$45",
                bullets: [
                  "SSN trace, sex offender registry, global watchlist, national criminal search",
                  "⏱️ Results: Under 24 hours",
                ],
              },
              {
                name: "Comprehensive Background",
                price: "$125",
                bullets: [
                  "All Basic features + State & Federal criminal search",
                  "⏱️ Results: 5–7 business days",
                ],
              },
            ]}
          />
        </div>
        <div className="bg-[#FBF5F6] rounded-xl px-2 py-6 shadow-sm">
          <ScreeningCategoryGroup
            icon="file-text"
            title="License & Employment Verification"
            cards={[
              {
                name: "Professional License Verification",
                price: "$15",
                bullets: [
                  "All active/inactive licenses",
                  "⏱️ Results: Under 24 hours",
                ],
              },
              {
                name: "Employment History Verification",
                price: "$49",
                bullets: [
                  "7-year job history with title/date confirmation",
                  "✅ Instant if nurse connects payroll provider",
                ],
              },
            ]}
          />
        </div>
        <div className="bg-[#F2FCE2] rounded-xl px-2 py-6 shadow-sm">
          <ScreeningCategoryGroup
            icon="car"
            title="Driving & Drug Testing"
            cards={[
              {
                name: "Motor Vehicle Record",
                price: "$19",
                bullets: [
                  "Verifies license and driving history",
                  "❗ Manual setup required for Pennsylvania",
                ],
              },
              {
                name: "5-Panel Drug Test",
                price: "$85",
                bullets: [
                  "Screens: Amphetamines, Cocaine, THC, Opiates, PCP",
                ],
              },
              {
                name: "10-Panel Drug Test",
                price: "$125",
                bullets: [
                  "Includes 5-panel + Barbiturates, Benzodiazepines, Methadone, Methaqualone, Propoxyphene",
                ],
              },
            ]}
          />
        </div>
      </div>
    </section>
  );
}
