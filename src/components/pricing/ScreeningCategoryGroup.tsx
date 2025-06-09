
import React from 'react';
import ScreeningCard from './ScreeningCard';

interface Package {
  title: string;
  price: string;
  features: string[];
}

interface ScreeningCategoryGroupProps {
  title: string;
  description: string;
  packages: Package[];
  onPackageSelect?: (packageTitle: string) => void;
}

const ScreeningCategoryGroup: React.FC<ScreeningCategoryGroupProps> = ({
  title,
  description,
  packages,
  onPackageSelect
}) => {
  return (
    <div className="mb-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">{description}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg, index) => (
          <ScreeningCard
            key={pkg.title}
            title={pkg.title}
            price={pkg.price}
            features={pkg.features}
            isPopular={index === 1} // Make middle package popular
            onSelect={() => onPackageSelect?.(pkg.title)}
          />
        ))}
      </div>
    </div>
  );
};

export default ScreeningCategoryGroup;
