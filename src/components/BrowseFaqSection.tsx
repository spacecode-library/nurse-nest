
import React from 'react';

interface BrowseFaqSectionProps {
  onToggleFaq: () => void;
  isOpen: boolean;
}

export default function BrowseFaqSection({ onToggleFaq, isOpen }: BrowseFaqSectionProps) {
  return (
    <section className="py-12 px-4" style={{ backgroundColor: '#f8fafc' }}>
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div className="flex flex-col items-center space-y-6">
            
            {/* Signature */}
            <div className="mb-4">
              <img 
                src="/lovable-uploads/16f8aab2-52ef-4d03-a067-775c04042d1f.png"
                alt="Signature"
                className="h-16 md:h-20 w-auto opacity-70"
                style={{
                  filter: 'brightness(0.3)',
                  maxWidth: '250px'
                }}
              />
            </div>

            <div className="space-y-4">
              <p 
                className="text-lg text-gray-700"
                style={{ 
                  fontFamily: 'Arial, Helvetica, sans-serif',
                  lineHeight: '1.6'
                }}
              >
                Have questions about getting started? I've compiled answers to the most common questions 
                nurses and clients ask about our platform and services.
              </p>
              
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
      </div>
    </section>
  );
}
