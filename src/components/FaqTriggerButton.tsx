
import React from 'react';
import { HelpCircle } from 'lucide-react';

interface FaqTriggerButtonProps {
  onClick: () => void;
}

export default function FaqTriggerButton({ onClick }: FaqTriggerButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 left-8 z-30 bg-[#3b82f6] hover:bg-[#2563eb] text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 group"
      aria-label="Open FAQ"
    >
      <HelpCircle className="h-6 w-6 group-hover:rotate-12 transition-transform duration-200" />
      <span className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-[#1e293b] text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        Frequently Asked Questions
      </span>
    </button>
  );
}
