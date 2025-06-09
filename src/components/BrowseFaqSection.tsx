
import React from 'react';

interface BrowseFaqSectionProps {
  onToggleFaq: () => void;
  isOpen: boolean;
}

export default function BrowseFaqSection({ onToggleFaq, isOpen }: BrowseFaqSectionProps) {
  return (
    <section className="py-12 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto text-center">
        <button
          onClick={onToggleFaq}
          className={`px-10 py-5 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${
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
    </section>
  );
}
