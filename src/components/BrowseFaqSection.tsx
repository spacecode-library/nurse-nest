
import React from 'react';

interface BrowseFaqSectionProps {
  onToggleFaq: () => void;
  isOpen: boolean;
}

export default function BrowseFaqSection({ onToggleFaq, isOpen }: BrowseFaqSectionProps) {
  return (
    <section className="py-8 px-4" style={{ backgroundColor: '#f8fafc' }}>
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <div className="flex flex-col items-center space-y-4">
            <button
              onClick={onToggleFaq}
              className={`px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                isOpen
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
              style={{ 
                fontFamily: 'Arial, Helvetica, sans-serif',
                minHeight: '44px'
              }}
            >
              {isOpen ? 'Close FAQs' : 'Browse FAQs'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
