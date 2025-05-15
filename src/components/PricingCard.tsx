
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PricingCard() {
  const [showCustomOptions, setShowCustomOptions] = useState(false);
  const navigate = useNavigate();

  const handleGetStarted = (plan: string) => {
    // Store the selected plan in session storage
    sessionStorage.setItem('selectedPlan', plan);
    navigate('/vetting-options');
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Nurse Vetting Packages</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Choose the right vetting package for your needs or build your own custom screening solution
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
        {/* Nest Safe Basic */}
        <div className="border rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
          <div className="bg-gradient-to-r from-nurse-dark to-primary-400 p-6 text-white">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">🛡️ Nest Safe Basic</h2>
              <span className="bg-white text-primary-600 font-bold px-3 py-1 rounded-full text-sm">Recommended</span>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-bold">$169</span>
              <span className="text-white/80 ml-1">one-time fee</span>
            </div>
            <p className="mt-2 text-white/80">💸 Client Saves $15</p>
          </div>
          
          <div className="p-6 bg-white">
            <ul className="space-y-3">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                <span>Basic Background Check</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                <span>License Verification</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                <span>5-Panel Drug Test</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                <span>Motor Vehicle Record</span>
              </li>
            </ul>
            
            <Button 
              className="w-full mt-6 bg-nurse-dark hover:bg-primary-700"
              onClick={() => handleGetStarted('basic')}
            >
              Get Started
            </Button>
          </div>
        </div>
        
        {/* Nest Shield Pro */}
        <div className="border rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
          <div className="bg-gradient-to-r from-primary-400 to-purple-600 p-6 text-white">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">🛡️ Nest Shield Pro</h2>
              <span className="bg-white text-purple-600 font-bold px-3 py-1 rounded-full text-sm">Premium</span>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-bold">$289</span>
              <span className="text-white/80 ml-1">one-time fee</span>
            </div>
            <p className="mt-2 text-white/80">💸 Client Saves $44</p>
          </div>
          
          <div className="p-6 bg-white">
            <ul className="space-y-3">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                <span>Comprehensive Background Check</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                <span>License Verification</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                <span>10-Panel Drug Test</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                <span>Employment Verification</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                <span>Motor Vehicle Record</span>
              </li>
            </ul>
            
            <Button 
              className="w-full mt-6 bg-purple-600 hover:bg-purple-700"
              onClick={() => handleGetStarted('pro')}
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>

      {/* Build Your Own */}
      <div className="max-w-5xl mx-auto">
        <div 
          className="border rounded-xl overflow-hidden cursor-pointer"
          onClick={() => setShowCustomOptions(!showCustomOptions)}
        >
          <div className="bg-gray-100 p-6 flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center">
              Build-Your-Own Screening
            </h2>
            <button className="text-gray-600 hover:text-gray-900">
              {showCustomOptions ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
            </button>
          </div>
          
          {showCustomOptions && (
            <div className="p-6 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Background Checks */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Background Checks</h3>
                  
                  <div className="mb-6 border rounded-md p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">Basic Background</h4>
                      <span className="text-lg font-bold">$45</span>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• SSN trace</li>
                      <li>• Sex offender registry search</li>
                      <li>• Global watchlist search</li>
                      <li>• National criminal search</li>
                    </ul>
                    <p className="text-xs text-gray-500 mt-2">Results typically &lt;24hrs</p>
                  </div>
                  
                  <div className="mb-6 border rounded-md p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">Comprehensive Background</h4>
                      <span className="text-lg font-bold">$125</span>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Includes all Basic Background features</li>
                      <li>• State Criminal Search</li>
                      <li>• Federal Criminal Search</li>
                    </ul>
                    <p className="text-xs text-gray-500 mt-2">Results in 5-7 business days</p>
                  </div>
                  
                  <div className="mb-6 border rounded-md p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">Professional License Verification</h4>
                      <span className="text-lg font-bold">$15</span>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Complete report of all active and inactive licenses</li>
                    </ul>
                    <p className="text-xs text-gray-500 mt-2">Results typically &lt;24hrs</p>
                  </div>
                  
                  <div className="mb-6 border rounded-md p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">Employment History Verification</h4>
                      <span className="text-lg font-bold">$49</span>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• 7-year lookback period</li>
                      <li>• Confirmation of employment dates and titles</li>
                    </ul>
                    <p className="text-xs text-gray-500 mt-2">Automated results when candidate connects payroll provider</p>
                  </div>
                </div>
                
                {/* Other Checks */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Additional Verifications</h3>
                  
                  <div className="mb-6 border rounded-md p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">Motor Vehicle Record</h4>
                      <span className="text-lg font-bold">$19</span>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Driver's license confirmation</li>
                      <li>• Driving incident identification</li>
                    </ul>
                    <p className="text-xs text-gray-500 mt-2">PA residents require manual processing - contact us</p>
                  </div>
                  
                  <div className="mb-6 border rounded-md p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">5-Panel Drug Test</h4>
                      <span className="text-lg font-bold">$85</span>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Screens for: Amphetamines, Cocaine, Marijuana (THC), Opiates, PCP</li>
                    </ul>
                  </div>
                  
                  <div className="mb-6 border rounded-md p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">10-Panel Drug Test</h4>
                      <span className="text-lg font-bold">$125</span>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• All 5-panel substances plus: Barbiturates, Benzodiazepines, Methadone, Methaqualone, Propoxyphene</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <Button 
                className="mt-6 bg-nurse-dark hover:bg-primary-700"
                onClick={() => navigate('/vetting-options')}
              >
                Build Custom Package
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
