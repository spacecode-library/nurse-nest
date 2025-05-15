
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check, Shield } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface VettingOption {
  id: string;
  name: string;
  description: string;
  price: number;
  selected: boolean;
}

export default function VettingAddOns() {
  const navigate = useNavigate();
  const selectedPlan = sessionStorage.getItem('selectedPlan') || '';
  
  // Initialize options based on selected plan
  const [options, setOptions] = useState<VettingOption[]>(() => {
    if (selectedPlan === 'basic') {
      return [
        {
          id: 'background_basic',
          name: 'Basic Background Check',
          description: 'SSN trace, sex offender registry, global watchlist, national criminal search',
          price: 45,
          selected: true,
        },
        {
          id: 'license',
          name: 'License Verification',
          description: 'Confirm active nursing license and good standing',
          price: 15,
          selected: true,
        },
        {
          id: 'drug_5',
          name: '5-Panel Drug Test',
          description: 'Tests for Amphetamines, Cocaine, Marijuana, Opiates, PCP',
          price: 85,
          selected: true,
        },
        {
          id: 'motor',
          name: 'Motor Vehicle Record',
          description: 'Driver\'s license confirmation and driving incident identification',
          price: 19,
          selected: true,
        },
        {
          id: 'background_comp',
          name: 'Upgrade to Comprehensive Background',
          description: 'Includes state and federal criminal search (additional $80)',
          price: 80,
          selected: false,
        },
        {
          id: 'drug_10',
          name: 'Upgrade to 10-Panel Drug Test',
          description: 'Adds testing for Barbiturates, Benzodiazepines, Methadone, Methaqualone, Propoxyphene (additional $40)',
          price: 40,
          selected: false,
        },
        {
          id: 'employment',
          name: 'Employment Verification',
          description: '7-year lookback period, confirmation of employment dates and titles',
          price: 49,
          selected: false,
        }
      ];
    } else if (selectedPlan === 'pro') {
      return [
        {
          id: 'background_comp',
          name: 'Comprehensive Background Check',
          description: 'Includes state and federal criminal search',
          price: 125,
          selected: true,
        },
        {
          id: 'license',
          name: 'License Verification',
          description: 'Confirm active nursing license and good standing',
          price: 15,
          selected: true,
        },
        {
          id: 'drug_10',
          name: '10-Panel Drug Test',
          description: 'Tests for 10 different substances including opiates and benzodiazepines',
          price: 125,
          selected: true,
        },
        {
          id: 'employment',
          name: 'Employment Verification',
          description: '7-year lookback period, confirmation of employment dates and titles',
          price: 49,
          selected: true,
        },
        {
          id: 'motor',
          name: 'Motor Vehicle Record',
          description: 'Driver\'s license confirmation and driving incident identification',
          price: 19,
          selected: true,
        }
      ];
    } else {
      // Custom or default options
      return [
        {
          id: 'background_basic',
          name: 'Basic Background Check',
          description: 'SSN trace, sex offender registry, global watchlist, national criminal search',
          price: 45,
          selected: false,
        },
        {
          id: 'background_comp',
          name: 'Comprehensive Background Check',
          description: 'Includes state and federal criminal search',
          price: 125,
          selected: false,
        },
        {
          id: 'license',
          name: 'License Verification',
          description: 'Confirm active nursing license and good standing',
          price: 15,
          selected: false,
        },
        {
          id: 'drug_5',
          name: '5-Panel Drug Test',
          description: 'Tests for Amphetamines, Cocaine, Marijuana, Opiates, PCP',
          price: 85,
          selected: false,
        },
        {
          id: 'drug_10',
          name: '10-Panel Drug Test',
          description: 'Tests for 10 different substances including opiates and benzodiazepines',
          price: 125,
          selected: false,
        },
        {
          id: 'employment',
          name: 'Employment Verification',
          description: '7-year lookback period, confirmation of employment dates and titles',
          price: 49,
          selected: false,
        },
        {
          id: 'motor',
          name: 'Motor Vehicle Record',
          description: 'Driver\'s license confirmation and driving incident identification',
          price: 19,
          selected: false,
        }
      ];
    }
  });
  
  const isPreselectedPlan = selectedPlan === 'basic' || selectedPlan === 'pro';
  
  const toggleOption = (id: string) => {
    setOptions(options.map(option => 
      option.id === id ? { ...option, selected: !option.selected } : option
    ));
  };
  
  const calculateTotal = () => {
    return options
      .filter(option => option.selected)
      .reduce((total, option) => total + option.price, 0);
  };
  
  const handleProceed = () => {
    if (options.filter(option => option.selected).length === 0) {
      toast({
        title: "No options selected",
        description: "Please select at least one vetting option",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, you'd save the selections to your backend
    // and redirect to payment
    sessionStorage.setItem('vettingOptions', JSON.stringify(
      options.filter(option => option.selected)
    ));
    
    navigate('/payment');
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {isPreselectedPlan 
              ? `Your ${selectedPlan === 'basic' ? 'Nest Safe Basic' : 'Nest Shield Pro'} Package` 
              : 'Build Your Custom Vetting Package'}
          </h1>
          <p className="text-lg text-gray-600">
            {isPreselectedPlan 
              ? 'Review your package details or customize it further' 
              : 'Select the vetting services that best meet your needs'}
          </p>
        </div>
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-nurse-dark to-primary-400 p-4 md:p-6 text-white">
            <div className="flex items-center">
              <Shield className="h-6 w-6 mr-2" />
              <h2 className="text-xl md:text-2xl font-bold">Vetting Options</h2>
            </div>
          </div>
          
          <div className="p-4 md:p-6">
            <div className="space-y-4">
              {options.map((option) => (
                <div 
                  key={option.id} 
                  className={`border rounded-md p-4 transition-colors ${
                    option.selected 
                      ? 'border-primary-400 bg-primary-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                      <div 
                        className={`w-5 h-5 rounded border flex items-center justify-center cursor-pointer ${
                          option.selected 
                            ? 'bg-primary-400 border-primary-400' 
                            : 'border-gray-300'
                        }`}
                        onClick={() => toggleOption(option.id)}
                      >
                        {option.selected && <Check className="h-3 w-3 text-white" />}
                      </div>
                    </div>
                    
                    <div className="ml-3 flex-1" onClick={() => toggleOption(option.id)}>
                      <div className="flex justify-between">
                        <h3 className="text-lg font-medium">{option.name}</h3>
                        <span className="font-bold">${option.price}</span>
                      </div>
                      <p className="text-gray-600 text-sm mt-1">{option.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t">
              <div className="flex justify-between items-center">
                <div className="text-lg font-medium">Total</div>
                <div className="text-2xl font-bold">${calculateTotal()}</div>
              </div>
              
              {isPreselectedPlan && (
                <div className="mt-2 text-sm text-green-600">
                  {selectedPlan === 'basic' 
                    ? 'You save $15 with this package!' 
                    : 'You save $44 with this package!'}
                </div>
              )}
              
              <Button 
                className="w-full mt-4 bg-nurse-dark hover:bg-primary-700"
                onClick={handleProceed}
              >
                Proceed to Payment
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
