
import React from 'react';
import { GlowEffect } from '@/components/ui/glow-effect';

interface BrowseFaqSectionProps {
  onToggleFaq: () => void;
  isOpen: boolean;
}

export default function BrowseFaqSection({
  onToggleFaq,
  isOpen
}: BrowseFaqSectionProps) {
  return (
    <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
          Have Questions?
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Browse our comprehensive FAQ section to find answers to common questions about our nursing services.
        </p>
        
        <div className="relative inline-block">
          <GlowEffect 
            colors={['#2563eb', '#3b82f6', '#1d4ed8', '#60a5fa']} 
            mode="pulse" 
            blur="soft" 
            duration={2} 
            scale={1.05} 
            intensity={0.3} 
          />
          <button
            onClick={onToggleFaq}
            className="relative bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
          >
            {isOpen ? 'Close FAQ' : 'Browse FAQ'}
          </button>
        </div>
      </div>
    </section>
  );
}
