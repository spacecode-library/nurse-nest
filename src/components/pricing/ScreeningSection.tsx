
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
      resultTime: "Under 24 hrs",
      category: "background"
    },
    {
      name: "Comprehensive Background",
      price: "$125",
      description: "Adds State + Federal criminal checks",
      resultTime: "5–7 days",
      category: "background"
    },
    // License & Employment
    {
      name: "Professional License Verification",
      price: "$15",
      description: "All active/inactive licenses",
      resultTime: "Under 24 hrs", 
      category: "license"
    },
    {
      name: "Employment History Verification",
      price: "$49",
      description: "7-year work history",
      category: "license"
    },
    // Driving & Drug
    {
      name: "Motor Vehicle Record",
      price: "$19",
      description: "Confirms license and incidents",
      category: "driving"
    },
    {
      name: "5-Panel Drug Test",
      price: "$85",
      description: "Includes Amphetamines, Cocaine, THC, Opiates, and PCP",
      resultTime: "1-3 days",
      category: "driving"
    },
    {
      name: "10-Panel Drug Test",
      price: "$125",
      description: "All 5-panel plus: Benzos, Barbiturates, Methadone, etc.",
      resultTime: "1-3 days",
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

  // Helper function to get result time icon
  const getResultTimeIcon = (time: string | undefined) => {
    if (!time) return null;
    
    if (time.includes("Under")) {
      return <span className="text-blue-500">⏱️</span>;
    }
    
    return <span className="text-gray-500">⏱️</span>;
  };

  return (
    <section className={`w-full max-w-6xl mx-auto px-4 ${className}`}>
      {/* Section Header */}
      <AnimatedSection animation="fade-up" className="text-center mb-10">
        <div className="flex justify-center items-center mb-3">
          <Shield className="w-6 h-6 mr-2 text-primary-500" />
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Build-Your-Own Screening
          </h2>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Customize your screening. No hidden fees—choose only what you need.
        </p>
      </AnimatedSection>

      {/* New Grid Layout of Services */}
      <AnimatedSection animation="fade-up" delay={100}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {services.map((service, index) => {
            const style = getCategoryStyle(service.category);
            const resultIcon = getResultTimeIcon(service.resultTime);
            
            return (
              <div 
                key={index}
                className="relative bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col hover:shadow-md transition-shadow h-full"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-medium text-gray-800">{service.name}</h3>
                  <span className="text-xl font-bold text-primary-700">{service.price}</span>
                </div>
                
                {/* Category Tag */}
                <div className={`inline-flex self-start px-2.5 py-0.5 rounded-full text-xs mb-3 ${style.bg} ${style.border} ${style.text}`}>
                  {service.category === "background" ? "Background" : 
                   service.category === "license" ? "Verification" : "Testing"}
                </div>

                <p className="text-gray-600 text-sm mb-3">{service.description}</p>
                
                {service.resultTime && (
                  <div className="mt-auto pt-2 text-sm text-gray-500 flex items-center">
                    {resultIcon}
                    <span className="ml-1">Results: {service.resultTime}</span>
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
