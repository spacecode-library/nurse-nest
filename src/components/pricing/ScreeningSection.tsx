
import React from "react";
import { Shield } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface ScreeningSectionProps {
  className?: string;
}

interface ScreeningService {
  name: string;
  price: string;
  description: string;
  resultTime?: string;
  category: "background" | "license" | "driving";
}

export default function ScreeningSection({ className = "" }: ScreeningSectionProps) {
  const services: ScreeningService[] = [
    // Background Checks
    {
      name: "Basic Background",
      price: "$45",
      description: "SSN trace, sex offender registry, global watchlist, national criminal search",
      resultTime: "<24 hrs",
      category: "background"
    },
    {
      name: "Comprehensive Background",
      price: "$125",
      description: "All Basic features + State & Federal criminal search",
      resultTime: "5–7 days",
      category: "background"
    },
    // License & Employment
    {
      name: "Professional License Verification",
      price: "$15",
      description: "All active/inactive licenses",
      resultTime: "<24 hrs", 
      category: "license"
    },
    {
      name: "Employment History Verification",
      price: "$49",
      description: "7-year job history with title/date confirmation",
      category: "license"
    },
    // Driving & Drug
    {
      name: "Motor Vehicle Record",
      price: "$19",
      description: "Verifies license and driving history",
      category: "driving"
    },
    {
      name: "5-Panel Drug Test",
      price: "$85",
      description: "Includes Amphetamines, Cocaine, THC, Opiates, and PCP",
      category: "driving"
    },
    {
      name: "10-Panel Drug Test",
      price: "$125",
      description: "Includes 5-panel + Barbiturates, Benzodiazepines, Methadone, Methaqualone, Propoxyphene",
      category: "driving"
    }
  ];

  // Helper function to get category style
  const getCategoryStyle = (category: string) => {
    switch (category) {
      case "background":
        return { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-800" };
      case "license":
        return { bg: "bg-pink-50", border: "border-pink-200", text: "text-pink-800" };
      case "driving":
        return { bg: "bg-green-50", border: "border-green-200", text: "text-green-800" };
      default:
        return { bg: "bg-gray-50", border: "border-gray-200", text: "text-gray-800" };
    }
  };

  return (
    <section className={`w-full max-w-6xl mx-auto px-4 ${className}`}>
      {/* Section Header */}
      <AnimatedSection animation="fade-up" className="text-center mb-12">
        <div className="flex justify-center items-center mb-3">
          <Shield className="w-7 h-7 mr-2 text-primary-500 opacity-60" />
          <h2 className="text-3xl font-bold text-gray-800">
            Build-Your-Own Screening
          </h2>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Customize your screening. No hidden fees—choose only what you need.
        </p>
      </AnimatedSection>

      {/* New Grid Layout of Services */}
      <AnimatedSection animation="fade-up" delay={100}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service, index) => {
            const style = getCategoryStyle(service.category);
            return (
              <div 
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xl font-bold text-primary-700">{service.price}</span>
                  <h3 className="text-lg font-medium text-gray-800 text-right">{service.name}</h3>
                </div>
                
                {/* Category Tag */}
                <div className={`inline-flex self-end px-2 py-0.5 rounded-full text-xs mb-2 ${style.bg} ${style.border} ${style.text}`}>
                  {service.category === "background" ? "Background" : 
                   service.category === "license" ? "Verification" : "Testing"}
                </div>

                <p className="text-gray-600 text-sm">{service.description}</p>
                
                {service.resultTime && (
                  <div className="mt-auto pt-2 text-xs text-gray-500 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <circle cx="12" cy="12" r="10" strokeWidth="2" />
                      <polyline points="12 6 12 12 16 14" strokeWidth="2" />
                    </svg>
                    Results: {service.resultTime}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </AnimatedSection>

      {/* Call to Action */}
      <div className="text-center mt-10">
        <Link to="/apply" className="inline-flex">
          <Button variant="default" size="lg" className="bg-primary-500 hover:bg-primary-600">
            Build Custom Package
          </Button>
        </Link>
      </div>
    </section>
  );
}
