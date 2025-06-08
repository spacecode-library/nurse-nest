
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

export interface ScreeningCardProps {
  title: string;
  price: string;
  bullets?: string[];
  features?: string[];
  popular?: boolean;
  category?: string;
}

export default function ScreeningCard({ 
  title, 
  price, 
  bullets = [], 
  features = [], 
  popular = false, 
  category 
}: ScreeningCardProps) {
  const allFeatures = [...bullets, ...features];
  
  return (
    <Card className={`relative h-full transition-all duration-300 hover:shadow-lg ${
      popular ? 'border-2 border-blue-500 shadow-lg' : 'border border-gray-200'
    }`}>
      {popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-blue-500 text-white px-3 py-1">Most Popular</Badge>
        </div>
      )}
      
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-semibold text-gray-900">{title}</CardTitle>
        <div className="text-3xl font-bold text-blue-600 mt-2">{price}</div>
        {category && (
          <Badge variant="secondary" className="mt-2">{category}</Badge>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        {allFeatures.length > 0 && (
          <ul className="space-y-2">
            {allFeatures.map((feature, index) => (
              <li key={index} className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-600">{feature}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
