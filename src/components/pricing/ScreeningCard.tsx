
import React from 'react';

export interface ScreeningCardProps {
  title: string;
  price: string;
  features: string[];
  isPopular?: boolean;
  description?: string;
  onSelect?: (packageTitle: string) => void;
}

export default function ScreeningCard({ title, price, features, isPopular, description, onSelect }: ScreeningCardProps) {
  return (
    <div className={`bg-white border rounded-lg p-6 ${isPopular ? 'border-blue-500' : 'border-gray-200'}`}>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {description && <p className="text-sm text-gray-600 mb-3">{description}</p>}
      <div className="text-2xl font-bold mb-4">{price}</div>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="text-sm">{feature}</li>
        ))}
      </ul>
      {onSelect && (
        <button
          onClick={() => onSelect(title)}
          className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
        >
          Select Package
        </button>
      )}
    </div>
  );
}
