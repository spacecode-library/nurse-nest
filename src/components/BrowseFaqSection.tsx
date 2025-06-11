
import React from 'react';
import { GlowEffect } from '@/components/ui/glow-effect';

interface BrowseFaqSectionProps {
  onToggleFaq: () => void;
  isOpen: boolean;
}

export default function BrowseFaqSection({ onToggleFaq, isOpen }: BrowseFaqSectionProps) {
  return (
    <section className="py-12 px-4 bg-brand-navy">
      <div className="max-w-4xl mx-auto text-center">
        <div className="relative inline-block">
          <GlowEffect
            colors={isOpen 
              ? ['#ef4444', '#dc2626', '#b91c1c', '#991b1b']
              : ['#2563eb', '#3b82f6', '#1d4ed8', '#1e40af']
            }
            mode="breathe"
            blur="soft"
            duration={3}
            scale={1.05}
          />
          <button
            onClick={onToggleFaq}
            className={`relative px-10 py-5 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${
              isOpen
                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
            }`}
            style={{ 
              fontFamily: 'Arial, Helvetica, sans-serif',
              minHeight: '60px'
            }}
          >
            {isOpen ? 'Close FAQs' : 'Browse FAQs'}
          </button>
        </div>
      </div>
    </section>
  );
}
