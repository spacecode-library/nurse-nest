
import React from 'react';

export interface ScreeningCardProps {
  title: string;
  price: string;
  features: string[];
  isPopular?: boolean;
}

export default function ScreeningCard({ title, price, features, isPopular }: ScreeningCardProps) {
  return (
    <div className={`bg-white border rounded-lg p-6 ${isPopular ? 'border-blue-500' : 'border-gray-200'}`}>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="text-2xl font-bold mb-4">{price}</div>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="text-sm">{feature}</li>
        ))}
      </ul>
    </div>
  );
}
