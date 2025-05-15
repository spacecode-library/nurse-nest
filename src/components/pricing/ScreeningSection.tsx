
import React from "react";
import ScreeningCategoryGroup from "./ScreeningCategoryGroup";

interface ScreeningSectionProps {
  className?: string;
}

export default function ScreeningSection({ className = "" }: ScreeningSectionProps) {
  return (
    <section className={`w-full max-w-6xl mx-auto ${className}`}>
      {/* Title */}
      <div className="text-center mb-10 mt-1">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-800 mb-2">
          Build-Your-Own Screening
        </h2>
        <div className="max-w-md mx-auto text-gray-500 text-base md:text-lg">
          Customize your screening. No hidden fees—choose only what you need.
        </div>
      </div>

      <div className="space-y-14 px-1">
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
    </section>
  );
}
