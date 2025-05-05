
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Check, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Payment() {
  const navigate = useNavigate();
  const [applicationData, setApplicationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    // Get stored application data
    const storedData = sessionStorage.getItem('applicationData');
    if (!storedData) {
      navigate('/apply');
      return;
    }
    
    setApplicationData(JSON.parse(storedData));
  }, [navigate]);
  
  const handlePayment = async () => {
    setLoading(true);
    setError('');
    
    try {
      // In a real implementation, this would call your Stripe backend
      // For now, we'll simulate a successful payment
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Clear the stored application data
      sessionStorage.removeItem('applicationData');
      
      // Navigate to success page
      navigate('/payment-success');
    } catch (err) {
      console.error('Payment error:', err);
      setError('There was an error processing your payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  if (!applicationData) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-1 pt-24">
          <div className="container mx-auto px-4 py-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Loading...</h2>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  const { formData, pricing } = applicationData;
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <main className="flex-1 pt-24">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Complete Your <span className="text-nurse-dark">Payment</span>
          </h1>
          
          <div className="max-w-2xl mx-auto">
            <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
              <div className="bg-gradient-to-r from-nurse-dark to-primary-400 p-4 text-white">
                <h2 className="text-xl font-semibold">Order Summary</h2>
              </div>
              
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Nurse Matching Service</h3>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Base Price:</span>
                    <span className="line-through text-gray-400">$1,333.33</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-green-600">Limited Time Discount (25%):</span>
                    <span className="text-green-600">-$333.33</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Discounted Price:</span>
                    <span>${pricing.basePrice.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Add-Ons</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="drug-test"
                          checked={formData.addOns.drugTest}
                          onChange={() => {
                            const updatedData = {...applicationData};
                            updatedData.formData.addOns.drugTest = !formData.addOns.drugTest;
                            
                            // Recalculate total
                            let newTotal = pricing.basePrice;
                            if (updatedData.formData.addOns.drugTest) newTotal += 100;
                            if (updatedData.formData.addOns.drivingHistory) newTotal += 50;
                            updatedData.pricing.totalPrice = newTotal;
                            
                            setApplicationData(updatedData);
                            sessionStorage.setItem('applicationData', JSON.stringify(updatedData));
                          }}
                          className="mr-2"
                        />
                        <label htmlFor="drug-test">10-Panel Drug Test</label>
                      </div>
                      <span>${formData.addOns.drugTest ? '100.00' : '0.00'}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="driving-history"
                          checked={formData.addOns.drivingHistory}
                          onChange={() => {
                            const updatedData = {...applicationData};
                            updatedData.formData.addOns.drivingHistory = !formData.addOns.drivingHistory;
                            
                            // Recalculate total
                            let newTotal = pricing.basePrice;
                            if (updatedData.formData.addOns.drugTest) newTotal += 100;
                            if (updatedData.formData.addOns.drivingHistory) newTotal += 50;
                            updatedData.pricing.totalPrice = newTotal;
                            
                            setApplicationData(updatedData);
                            sessionStorage.setItem('applicationData', JSON.stringify(updatedData));
                          }}
                          className="mr-2"
                        />
                        <label htmlFor="driving-history">Driving History Report</label>
                      </div>
                      <span>${formData.addOns.drivingHistory ? '50.00' : '0.00'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total:</span>
                    <span>${pricing.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
              <div className="bg-gray-100 p-4">
                <h2 className="text-xl font-semibold">Payment Details</h2>
              </div>
              
              <div className="p-6">
                <div className="mb-6">
                  <div className="flex justify-between items-center p-3 border rounded-md bg-gray-50">
                    <div className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                      <span>Secure Payment Processing</span>
                    </div>
                    <div className="flex space-x-2">
                      <div className="w-10 h-6 bg-blue-600 rounded"></div>
                      <div className="w-10 h-6 bg-yellow-500 rounded-full"></div>
                      <div className="w-10 h-6 bg-red-500 rounded"></div>
                    </div>
                  </div>
                </div>
                
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                    <span className="text-red-700">{error}</span>
                  </div>
                )}
                
                <Button 
                  className="w-full bg-nurse-dark hover:bg-primary-700"
                  onClick={handlePayment}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : `Pay $${pricing.totalPrice.toFixed(2)}`}
                </Button>
              </div>
            </div>
            
            <p className="text-center text-gray-500 text-sm">
              By completing this payment, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
