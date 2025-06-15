
import React from "react";
import { HelpCircle, Stethoscope } from "lucide-react";
import { LuxIcon } from "@/components/post-surgical-care/LuxIcon";

interface ActionCardsRowProps {
  onFaq: () => void;
  onGetNurse: () => void;
}

export default function ActionCardsRow({ onFaq, onGetNurse }: ActionCardsRowProps) {
  return (
    <div className="container-custom flex flex-col sm:flex-row gap-6 justify-center items-stretch my-8">
      {/* Browse FAQ's Card */}
      <div 
        className="flex-1 bg-white rounded-xl shadow-brand border border-neutral-light/50 flex flex-col items-center py-6 px-4 transition-all duration-700 ease-[cubic-bezier(.32,2,.55,.98)] hover-lux-scale cursor-pointer"
        onClick={onFaq}
        tabIndex={0}
        role="button"
        aria-label="Browse FAQs"
        onKeyDown={e => { if (e.key === "Enter" || e.key === " ") onFaq(); }}
      >
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-50 mb-3">
          <LuxIcon>
            <HelpCircle className="text-blue-600" size={32} />
          </LuxIcon>
        </div>
        <div className="text-lg font-bold text-brand-navy mb-1">Browse FAQ&#39;s</div>
        <div className="text-neutral-dark text-sm text-center mb-4">
          Find answers to common questions.
        </div>
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold text-base shadow-md hover:bg-blue-700 transition shine-on-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
          tabIndex={-1}
        >
          Browse FAQ&#39;s
        </button>
      </div>
      
      {/* Get Nurse Card */}
      <div 
        className="flex-1 bg-white rounded-xl shadow-brand border border-neutral-light/50 flex flex-col items-center py-6 px-4 transition-all duration-700 ease-[cubic-bezier(.32,2,.55,.98)] hover-lux-scale cursor-pointer"
        onClick={onGetNurse}
        tabIndex={0}
        role="button"
        aria-label="Get Nurse"
        onKeyDown={e => { if (e.key === "Enter" || e.key === " ") onGetNurse(); }}
      >
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-teal-50 mb-3">
          <LuxIcon>
            <Stethoscope className="text-teal-600" size={32} />
          </LuxIcon>
        </div>
        <div className="text-lg font-bold text-brand-navy mb-1">Get Nurse</div>
        <div className="text-neutral-dark text-sm text-center mb-4">
          Connect and apply for care with a licensed nurse.
        </div>
        <button
          className="bg-teal-600 text-white px-6 py-2 rounded-lg font-semibold text-base shadow-md hover:bg-teal-700 transition shine-on-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-300"
          tabIndex={-1}
        >
          Get Nurse
        </button>
      </div>
    </div>
  );
}
