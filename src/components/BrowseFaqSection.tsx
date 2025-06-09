
import React from 'react';

interface BrowseFaqSectionProps {
  onBrowseFaqClick: () => void;
}

export default function BrowseFaqSection({ onBrowseFaqClick }: BrowseFaqSectionProps) {
  return (
    <section className="py-16 px-4" style={{backgroundColor: '#f8fafc'}}>
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-white rounded-2xl shadow-lg p-12">
          <div className="space-y-6">
            <img 
              src="/lovable-uploads/85e79782-ec91-447f-ae99-6defbdd27e25.png" 
              alt="Signature" 
              className="mx-auto h-16"
            />
            
            <button
              onClick={onBrowseFaqClick}
              className="inline-flex items-center px-8 py-4 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-lg"
              style={{
                backgroundColor: '#3b82f6',
                minHeight: '44px'
              }}
            >
              Browse FAQs
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
