
import React from 'react';

export interface ScreeningCardProps {
  title: string;
  price: string;
  features: string[];
  isPopular?: boolean;
  description?: string;
  onSelect?: () => void;
}

export default function ScreeningCard({ title, price, features, isPopular, description, onSelect }: ScreeningCardProps) {
  return (
    <div 
      className={`bg-white border rounded-lg p-6 cursor-pointer transition-all hover:shadow-lg ${isPopular ? 'border-blue-500' : 'border-gray-200'}`}
      onClick={onSelect}
    >
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="text-2xl font-bold mb-4">{price}</div>
      {description && (
        <p className="text-gray-600 text-sm mb-4">{description}</p>
      )}
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="text-sm">{feature}</li>
        ))}
      </ul>
    </div>
  );
}
