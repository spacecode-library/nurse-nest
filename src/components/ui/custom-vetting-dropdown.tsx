
"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

const customVettingServices = [
  { name: "Basic Background Check", price: 49, description: "County/state criminal, sex offender registry, 5-7 days" },
  { name: "Comprehensive Background Check", price: 89, description: "Federal/multi-state criminal, court records, 7-10 days" },
  { name: "License Verification", price: 29, description: "Current status, disciplinary history, multi-state validation" },
  { name: "5-Panel Drug Test", price: 59, description: "Standard substances, 24-48 hour results" },
  { name: "10-Panel Drug Test", price: 79, description: "Comprehensive screening including barbiturates, benzodiazepines" },
  { name: "Employment Verification", price: 39, description: "Past 3 employers, performance review" },
  { name: "Motor Vehicle Record", price: 19, description: "3-year history, violations, license status" },
];

export function CustomVettingDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <Card className="overflow-hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-colors"
        >
          <div className="text-left">
            <h3 className="text-xl font-bold">Custom Vetting Services</h3>
            <p className="text-muted-foreground">Build your own package with individual screenings</p>
          </div>
          {isOpen ? (
            <ChevronUp className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          )}
        </button>
        
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-6 pt-0 border-t">
                <div className="grid gap-4">
                  {customVettingServices.map((service, index) => (
                    <div key={index} className="flex justify-between items-start p-4 bg-muted/30 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-lg">${service.price}</span>
                          <h4 className="font-medium">{service.name}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
}
