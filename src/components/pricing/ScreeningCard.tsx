
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

export interface ScreeningCardProps {
  title: string;
  price: string;
  description?: string;
  features?: string[];
  bullets?: string[];
  children?: React.ReactNode;
  isPopular?: boolean;
}

export function ScreeningCard({ title, price, description, features = [], bullets = [], children, isPopular }: ScreeningCardProps) {
  const displayItems = features.length > 0 ? features : bullets;
  
  return (
    <Card className={`h-full border border-neutral-light/50 shadow-brand hover:shadow-professional transition-all duration-300 ${isPopular ? 'ring-2 ring-brand-blue' : ''}`}>
      <CardHeader className="text-center pb-4">
        {isPopular && (
          <div className="bg-brand-blue text-white text-xs font-semibold px-3 py-1 rounded-full mx-auto mb-2 w-fit">
            Most Popular
          </div>
        )}
        <CardTitle className="text-xl font-semibold text-brand-navy mb-2">
          {title}
        </CardTitle>
        <div className="text-3xl font-bold text-brand-blue mb-4">
          {price}
        </div>
        {description && (
          <p className="text-sm text-neutral-dark">{description}</p>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        {displayItems.length > 0 && (
          <ul className="space-y-3 mb-6">
            {displayItems.map((item, index) => (
              <li key={index} className="flex items-start space-x-3">
                <Check className="h-5 w-5 text-brand-blue mt-0.5 flex-shrink-0" />
                <span className="text-neutral-dark leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        )}
        {children}
      </CardContent>
    </Card>
  );
}
