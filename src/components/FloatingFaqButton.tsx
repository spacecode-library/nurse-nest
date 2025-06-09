
import React from 'react';
import { MessageCircleQuestion } from 'lucide-react';

interface FloatingFaqButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export default function FloatingFaqButton({ onClick, isOpen }: FloatingFaqButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center ${
        isOpen 
          ? 'bg-blue-600 text-white' 
          : 'bg-white text-blue-600 hover:bg-blue-50'
      }`}
      style={{
        boxShadow: '0 4px 20px rgba(59, 130, 246, 0.3)'
      }}
      aria-label="Toggle FAQ"
    >
      <MessageCircleQuestion size={24} />
    </button>
  );
}
