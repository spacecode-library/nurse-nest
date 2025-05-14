
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Check, CircleDollarSign, Shield, Clock, Info, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { toast } from '@/hooks/use-toast';

export default function PricingCard() {
  const [fastTrackSelected, setFastTrackSelected] = useState(false);
  const [addToCartAnimation, setAddToCartAnimation] = useState({
    isAnimating: false,
    x: 0,
    y: 0
  });

  const basePrice = 100;
  const fastTrackPrice = 500;
  const totalPrice = basePrice + (fastTrackSelected ? fastTrackPrice : 0);

  const handleFastTrackToggle = (e) => {
    // Create an animation starting from the checkbox
    if (e.target) {
      const rect = e.target.getBoundingClientRect();
      const cartSummary = document.getElementById('cart-summary');
      const cartRect = cartSummary?.getBoundingClientRect();
      
      if (cartRect) {
        setAddToCartAnimation({
          isAnimating: true,
          x: cartRect.x - rect.x,
          y: cartRect.y - rect.y
        });
        
        // Animate cart summary
        if (cartSummary) {
          cartSummary.classList.add('animate-pulse-once');
          setTimeout(() => {
            cartSummary.classList.remove('animate-pulse-once');
          }, 500);
        }
        
        setTimeout(() => {
          setAddToCartAnimation({
            isAnimating: false,
            x: 0,
            y: 0
          });
          setFastTrackSelected(!fastTrackSelected);
        }, 500);
      } else {
        setFastTrackSelected(!fastTrackSelected);
      }
    } else {
      setFastTrackSelected(!fastTrackSelected);
    }
  };
  
  const handleGoToPayment = () => {
    // Store the selection in session storage for the payment page
    const applicationData = {
      formData: {
        addOns: {
          fastTrack: fastTrackSelected,
          drugTest: false,
          drivingHistory: false,
          backgroundCheck: false,
          tbTest: false,
          goldPackage: false
        }
      },
      pricing: {
        basePrice: basePrice,
        fastTrackPrice: fastTrackSelected ? fastTrackPrice : 0,
        totalPrice: totalPrice
      }
    };
    
    sessionStorage.setItem('applicationData', JSON.stringify(applicationData));
    toast({
      title: "Your selection has been saved!",
      description: "Taking you to payment...",
    });
  };

  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Transparent, Upfront Pricing</h2>
        <p className="text-lg text-gray-700">Simple pricing. Optional upgrades. No surprises.</p>
      </div>
      
      {/* Cart Summary */}
      <div 
        id="cart-summary"
        className="fixed top-24 right-6 z-10 bg-white rounded-lg shadow-lg p-3 transition-all duration-300"
      >
        <div className="flex items-center gap-3">
          <CircleDollarSign className="text-primary-500 h-5 w-5" />
          <div>
            <div className="text-xs text-gray-500">Total</div>
            <div className="font-bold">${totalPrice.toFixed(2)}</div>
          </div>
        </div>
      </div>
      
      {/* Add to cart animation */}
      <AnimatePresence>
        {addToCartAnimation.isAnimating && (
          <motion.div
            className="fixed z-50 bg-primary-200 text-primary-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold"
            initial={{ scale: 1, opacity: 1 }}
            animate={{ 
              x: addToCartAnimation.x, 
              y: addToCartAnimation.y,
              scale: 0.5,
              opacity: 0
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            $
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="max-w-4xl mx-auto">
        {/* Required Service */}
        <motion.div 
          className="rounded-xl shadow-lg overflow-hidden bg-white border border-gray-100 mb-8"
          whileHover={{ 
            scale: 1.01,
            transition: { duration: 0.3 }
          }}
        >
          <div className="bg-gradient-to-r from-nurse-dark to-primary-500 p-5 text-white">
            <h3 className="text-xl font-bold flex items-center">
              <Shield className="h-5 w-5 mr-2" /> Nurse Search Fee (Required)
            </h3>
          </div>
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <div className="text-3xl font-bold mb-2 text-primary-600">$100</div>
                <p className="text-gray-700">
                  Begin your personalized RN match with a fully refundable search fee 
                  (if we don't match you in 14 days).
                </p>
              </div>
              <div className="flex items-center justify-center bg-primary-50 text-primary-700 h-10 w-10 rounded-full">
                <Check className="h-5 w-5" />
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Optional FastTrack */}
        <motion.div 
          className="rounded-xl shadow-lg overflow-hidden bg-white border border-gray-100 mb-8"
          whileHover={{ 
            scale: 1.01,
            transition: { duration: 0.3 }
          }}
        >
          <div className="bg-gradient-to-r from-nurse-accent to-orange-500 p-5 text-white">
            <h3 className="text-xl font-bold flex items-center">
              <Clock className="h-5 w-5 mr-2" /> FastTrack Match (Optional)
            </h3>
          </div>
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="text-3xl font-bold mb-2 text-orange-500">$500</div>
                <p className="mb-4 text-gray-700">
                  Want care fast? Get matched with a nurse in 5 business days or your money back.
                </p>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="fast-track" 
                    checked={fastTrackSelected}
                    onCheckedChange={handleFastTrackToggle}
                    className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                  />
                  <label 
                    htmlFor="fast-track" 
                    className="font-medium cursor-pointer select-none"
                  >
                    Add FastTrack Match
                  </label>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      
        {/* Proceed to Payment Button */}
        <div className="text-center">
          <Link to="/payment" onClick={handleGoToPayment}>
            <Button className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-6 text-lg rounded-lg shadow-lg hover:shadow-xl transform transition-all hover:-translate-y-1">
              Proceed to Payment
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
        
        {/* Add-ons Preview - Coming in next phase */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <h3 className="text-xl font-bold mb-6 text-center">
            Additional Vetting Options <span className="text-gray-500 text-sm">(Available after matching)</span>
          </h3>
          <div className="grid md:grid-cols-2 gap-4 opacity-75">
            <Card className="bg-gray-50">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold">Drug Test (10-panel)</h4>
                    <p className="text-sm text-gray-600">Additional verification for peace of mind</p>
                  </div>
                  <span className="text-lg font-bold">$100</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-50">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold">Driving History Report</h4>
                    <p className="text-sm text-gray-600">For nurses who will provide transportation</p>
                  </div>
                  <span className="text-lg font-bold">$50</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-50">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold">Background Check</h4>
                    <p className="text-sm text-gray-600">Detailed national background check</p>
                  </div>
                  <span className="text-lg font-bold">$50</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-50">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold">TB Test Clearance</h4>
                    <p className="text-sm text-gray-600">Proof of recent negative TB test</p>
                  </div>
                  <span className="text-lg font-bold">$250</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-amber-50 col-span-full">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="flex items-center">
                      <h4 className="font-semibold">Gold Vetting Package</h4>
                      <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-800 text-xs rounded-full">Most Comprehensive</span>
                    </div>
                    <p className="text-sm text-gray-600">Includes Background Check, Drug Test, and Driving History Report</p>
                  </div>
                  <span className="text-lg font-bold">$150</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Secure Payment Info */}
        <div className="mt-12 bg-white rounded-xl shadow-md p-8 border-l-4 border-primary-500">
          <div className="flex items-start">
            <CircleDollarSign className="h-8 w-8 text-primary-500 mr-4 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold mb-2">Secure Payment Processing</h3>
              <p className="text-gray-700">
                Payments are handled via Stripe. You pay your nurse directly, and we retain a 15% platform fee to handle vetting, onboarding, and support.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
