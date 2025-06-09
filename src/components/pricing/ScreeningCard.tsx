
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ScreeningCardProps {
  title: string;
  price: string;
  features: string[];
  isPopular?: boolean;
  onSelect?: () => void;
}

const ScreeningCard: React.FC<ScreeningCardProps> = ({ 
  title, 
  price, 
  features, 
  isPopular = false, 
  onSelect 
}) => {
  return (
    <Card className={`relative ${isPopular ? 'border-blue-500 shadow-lg' : 'border-gray-200'}`}>
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-blue-500 text-white px-4 py-1 text-sm font-semibold rounded-full">
            Most Popular
          </span>
        </div>
      )}
      
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
        <div className="text-3xl font-bold text-blue-600">{price}</div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center space-x-3">
              <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
        
        <Button 
          className={`w-full ${isPopular ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-600 hover:bg-gray-700'}`}
          onClick={onSelect}
        >
          Select Package
        </Button>
      </CardContent>
    </Card>
  );
};

export default ScreeningCard;
