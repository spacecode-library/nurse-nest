
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Check, Info, CircleDollarSign, ShieldCheck } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Badge } from './ui/badge';

export default function VettingAddOns() {
  const [addOns, setAddOns] = useState({
    drugTest: false,
    drivingHistory: false,
    backgroundCheck: false,
    tbTest: false,
    goldPackage: false,
  });
  
  const [addToCartAnimation, setAddToCartAnimation] = useState({
    isAnimating: false,
    item: null,
    x: 0,
    y: 0
  });
  
  // Calculate the total
  const pricing = {
    drugTest: 100,
    drivingHistory: 50,
    backgroundCheck: 50,
    tbTest: 250,
    goldPackage: 150,
  };
  
  const totalPrice = Object.keys(addOns).reduce((sum, key) => {
    return sum + (addOns[key] ? pricing[key] : 0);
  }, 0);
  
  const handleAddToCart = (item, e) => {
    // Only animate if not already selected
    if (!addOns[item]) {
      // Create an animation from the button
      const rect = e.currentTarget.getBoundingClientRect();
      const cartSummary = document.getElementById('dashboard-cart-summary');
      const cartRect = cartSummary?.getBoundingClientRect();
      
      if (cartRect) {
        setAddToCartAnimation({
          isAnimating: true,
          item,
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
            item: null,
            x: 0,
            y: 0
          });
          
          // Special case for Gold Package
          if (item === 'goldPackage') {
            setAddOns({
              ...addOns,
              drugTest: true,
              drivingHistory: true,
              backgroundCheck: true,
              goldPackage: true
            });
          } else {
            setAddOns({
              ...addOns,
              [item]: !addOns[item]
            });
          }
          
          toast({
            title: "Added to your package",
            description: `Additional vetting option selected.`,
            duration: 2000,
          });
        }, 500);
      }
    } else {
      setAddOns({
        ...addOns,
        [item]: !addOns[item]
      });
      
      if (item === 'goldPackage') {
        setAddOns({
          ...addOns,
          drugTest: false,
          drivingHistory: false,
          backgroundCheck: false,
          goldPackage: false
        });
      }
    }
  };
  
  const handleProceed = () => {
    // In a real app, this would save the selections to the server or session
    toast({
      title: "Vetting options confirmed",
      description: `Your selections have been saved and will be processed.`,
      duration: 3000,
    });
  };
  
  const ToolTip = ({ text }) => (
    <div className="group relative">
      <button className="text-gray-400 hover:text-gray-700">
        <Info className="h-4 w-4" />
      </button>
      <div className="absolute z-10 opacity-0 group-hover:opacity-100 bottom-full mb-2 left-1/2 transform -translate-x-1/2 w-60 bg-black text-white text-xs rounded p-2 transition-opacity duration-300 pointer-events-none">
        {text}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-black"></div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">Additional Vetting Options</h2>
      <p className="text-center text-gray-600 mb-8">Select any additional screening you'd like for your matched nurse</p>
      
      {/* Cart Summary */}
      <div 
        id="dashboard-cart-summary"
        className="fixed top-24 right-6 z-10 bg-white rounded-lg shadow-lg p-3 transition-all duration-300"
      >
        <div className="flex items-center gap-3">
          <CircleDollarSign className="text-primary-500 h-5 w-5" />
          <div>
            <div className="text-xs text-gray-500">Add-ons</div>
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
      
      <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {/* Drug Test */}
        <motion.div 
          className={`rounded-xl overflow-hidden bg-white shadow-md transition-all ${addOns.drugTest || addOns.goldPackage ? 'border-2 border-primary-500' : 'border border-gray-200'}`}
          whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
        >
          <CardContent className="p-6">
            <div className="flex justify-between mb-4">
              <div className="flex items-center space-x-2">
                <h4 className="text-lg font-semibold">Drug Test (10-panel)</h4>
                <ToolTip text="Recommended for overnight care, newborn care, or long-term engagements." />
              </div>
              <span className="text-xl font-bold">${pricing.drugTest}</span>
            </div>
            
            <p className="text-gray-600 text-sm mb-4">
              Ensure added peace of mind with a comprehensive 10-panel drug screen.
            </p>
            
            <Button
              onClick={(e) => handleAddToCart('drugTest', e)}
              variant={addOns.drugTest || addOns.goldPackage ? "default" : "outline"}
              className={`w-full ${addOns.drugTest || addOns.goldPackage ? 'bg-primary-500' : ''}`}
              disabled={addOns.goldPackage}
            >
              {addOns.drugTest || addOns.goldPackage ? (
                <>
                  <Check className="mr-2 h-4 w-4" /> Added
                </>
              ) : (
                'Add to Package'
              )}
            </Button>
            
            {addOns.goldPackage && (
              <p className="text-xs text-center mt-2 text-primary-500">
                Included in Gold Package
              </p>
            )}
          </CardContent>
        </motion.div>
        
        {/* Driving History */}
        <motion.div 
          className={`rounded-xl overflow-hidden bg-white shadow-md transition-all ${addOns.drivingHistory || addOns.goldPackage ? 'border-2 border-primary-500' : 'border border-gray-200'}`}
          whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
        >
          <CardContent className="p-6">
            <div className="flex justify-between mb-4">
              <div className="flex items-center space-x-2">
                <h4 className="text-lg font-semibold">Driving History Report</h4>
                <ToolTip text="Useful if the nurse will be transporting clients or driving as part of the job." />
              </div>
              <span className="text-xl font-bold">${pricing.drivingHistory}</span>
            </div>
            
            <p className="text-gray-600 text-sm mb-4">
              Verify driving history before permitting any transportation.
            </p>
            
            <Button
              onClick={(e) => handleAddToCart('drivingHistory', e)}
              variant={addOns.drivingHistory || addOns.goldPackage ? "default" : "outline"}
              className={`w-full ${addOns.drivingHistory || addOns.goldPackage ? 'bg-primary-500' : ''}`}
              disabled={addOns.goldPackage}
            >
              {addOns.drivingHistory || addOns.goldPackage ? (
                <>
                  <Check className="mr-2 h-4 w-4" /> Added
                </>
              ) : (
                'Add to Package'
              )}
            </Button>
            
            {addOns.goldPackage && (
              <p className="text-xs text-center mt-2 text-primary-500">
                Included in Gold Package
              </p>
            )}
          </CardContent>
        </motion.div>
        
        {/* Background Check */}
        <motion.div 
          className={`rounded-xl overflow-hidden bg-white shadow-md transition-all ${addOns.backgroundCheck || addOns.goldPackage ? 'border-2 border-primary-500' : 'border border-gray-200'}`}
          whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
        >
          <CardContent className="p-6">
            <div className="flex justify-between mb-4">
              <div className="flex items-center space-x-2">
                <h4 className="text-lg font-semibold">Background Check</h4>
                <ToolTip text="Covers criminal records and sex offender registry." />
              </div>
              <span className="text-xl font-bold">${pricing.backgroundCheck}</span>
            </div>
            
            <p className="text-gray-600 text-sm mb-4">
              Conduct a detailed national background check.
            </p>
            
            <Button
              onClick={(e) => handleAddToCart('backgroundCheck', e)}
              variant={addOns.backgroundCheck || addOns.goldPackage ? "default" : "outline"}
              className={`w-full ${addOns.backgroundCheck || addOns.goldPackage ? 'bg-primary-500' : ''}`}
              disabled={addOns.goldPackage}
            >
              {addOns.backgroundCheck || addOns.goldPackage ? (
                <>
                  <Check className="mr-2 h-4 w-4" /> Added
                </>
              ) : (
                'Add to Package'
              )}
            </Button>
            
            {addOns.goldPackage && (
              <p className="text-xs text-center mt-2 text-primary-500">
                Included in Gold Package
              </p>
            )}
          </CardContent>
        </motion.div>
        
        {/* TB Test */}
        <motion.div 
          className={`rounded-xl overflow-hidden bg-white shadow-md transition-all ${addOns.tbTest ? 'border-2 border-primary-500' : 'border border-gray-200'}`}
          whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
        >
          <CardContent className="p-6">
            <div className="flex justify-between mb-4">
              <div className="flex items-center space-x-2">
                <h4 className="text-lg font-semibold">TB Test Clearance</h4>
                <ToolTip text="Highly recommended for immunocompromised individuals or elderly care." />
              </div>
              <span className="text-xl font-bold">${pricing.tbTest}</span>
            </div>
            
            <p className="text-gray-600 text-sm mb-4">
              Proof of recent negative TB test (within 12 months).
            </p>
            
            <Button
              onClick={(e) => handleAddToCart('tbTest', e)}
              variant={addOns.tbTest ? "default" : "outline"}
              className={`w-full ${addOns.tbTest ? 'bg-primary-500' : ''}`}
            >
              {addOns.tbTest ? (
                <>
                  <Check className="mr-2 h-4 w-4" /> Added
                </>
              ) : (
                'Add to Package'
              )}
            </Button>
          </CardContent>
        </motion.div>
        
        {/* Gold Package */}
        <motion.div 
          className={`col-span-full rounded-xl overflow-hidden bg-amber-50 shadow-lg transition-all ${addOns.goldPackage ? 'border-2 border-amber-500' : 'border border-amber-200'}`}
          whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
        >
          <CardContent className="p-6">
            <div className="flex justify-between mb-4 items-center">
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="text-xl font-bold">Gold Vetting Package</h4>
                  <Badge className="bg-amber-500">Most Comprehensive</Badge>
                  <ToolTip text="Reference checks are already included by Nurse Nest's core vetting process." />
                </div>
                <p className="text-gray-600 mt-2">
                  Bundle your screenings for maximum peace of mind.
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-amber-700">${pricing.goldPackage}</div>
                <div className="text-sm text-gray-500 line-through">${pricing.drugTest + pricing.drivingHistory + pricing.backgroundCheck}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="bg-white rounded-md p-2 text-xs flex items-center">
                <ShieldCheck className="h-4 w-4 text-amber-600 mr-1" />
                Background Check
              </div>
              <div className="bg-white rounded-md p-2 text-xs flex items-center">
                <ShieldCheck className="h-4 w-4 text-amber-600 mr-1" />
                Drug Test
              </div>
              <div className="bg-white rounded-md p-2 text-xs flex items-center">
                <ShieldCheck className="h-4 w-4 text-amber-600 mr-1" />
                Driving History
              </div>
            </div>
            
            <Button
              onClick={(e) => handleAddToCart('goldPackage', e)}
              variant={addOns.goldPackage ? "default" : "outline"}
              className={`w-full ${addOns.goldPackage ? 'bg-amber-600 hover:bg-amber-700' : 'border-amber-600 text-amber-600 hover:bg-amber-100'}`}
            >
              {addOns.goldPackage ? (
                <>
                  <Check className="mr-2 h-4 w-4" /> Gold Package Added
                </>
              ) : (
                'Add Gold Package (Best Value)'
              )}
            </Button>
          </CardContent>
        </motion.div>
      </div>
      
      {/* Summary and checkout */}
      <div className="max-w-3xl mx-auto mt-10">
        <Card className="bg-gray-50">
          <CardContent className="p-6">
            <h4 className="font-semibold text-lg mb-4">Summary</h4>
            
            <div className="space-y-2 mb-6">
              {Object.keys(addOns).filter(key => addOns[key]).length === 0 ? (
                <p className="text-gray-500 italic">No additional vetting options selected.</p>
              ) : (
                Object.keys(addOns).map(key => {
                  if (addOns[key]) {
                    const label = key === 'drugTest' ? 'Drug Test' :
                      key === 'drivingHistory' ? 'Driving History Report' :
                      key === 'backgroundCheck' ? 'Background Check' :
                      key === 'tbTest' ? 'TB Test Clearance' : 'Gold Vetting Package';
                    return (
                      <div key={key} className="flex justify-between">
                        <span>{label}</span>
                        <span className="font-medium">${pricing[key].toFixed(2)}</span>
                      </div>
                    );
                  }
                  return null;
                })
              )}
              
              <div className="border-t border-gray-300 pt-2 mt-2 flex justify-between font-bold">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
            
            <Button onClick={handleProceed} className="w-full bg-nurse-dark hover:bg-primary-700">
              Proceed with Selected Options
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {/* Secure payment info */}
      <div className="mt-10 max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8 border-l-4 border-primary-500">
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
  );
}
