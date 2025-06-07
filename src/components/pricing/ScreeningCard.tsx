
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

export interface ScreeningCardProps {
  title: string;
  price: string;
  bullets?: string[];
  children?: React.ReactNode;
}

export function ScreeningCard({ title, price, bullets = [], children }: ScreeningCardProps) {
  return (
    <Card className="h-full border border-neutral-light/50 shadow-brand hover:shadow-professional transition-all duration-300">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-xl font-semibold text-brand-navy mb-2">
          {title}
        </CardTitle>
        <div className="text-3xl font-bold text-brand-blue mb-4">
          {price}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {bullets.length > 0 && (
          <ul className="space-y-3 mb-6">
            {bullets.map((bullet, index) => (
              <li key={index} className="flex items-start space-x-3">
                <Check className="h-5 w-5 text-brand-blue mt-0.5 flex-shrink-0" />
                <span className="text-neutral-dark leading-relaxed">{bullet}</span>
              </li>
            ))}
          </ul>
        )}
        {children}
      </CardContent>
    </Card>
  );
}
