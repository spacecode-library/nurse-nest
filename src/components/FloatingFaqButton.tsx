
import React from 'react';
import { MessageCircleQuestion } from 'lucide-react';

interface FloatingFaqButtonProps {
  onClick: () => void;
}

export default function FloatingFaqButton({ onClick }: FloatingFaqButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      }}
    >
      <MessageCircleQuestion size={24} />
    </button>
  );
}
