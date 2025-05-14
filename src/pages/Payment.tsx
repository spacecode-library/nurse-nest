
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Check, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ClickwrapAgreement from '@/components/ClickwrapAgreement';

export default function Payment() {
  const navigate = useNavigate();
  const [applicationData, setApplicationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreementError, setAgreementError] = useState(false);
  
  useEffect(() => {
    // Get stored application data
    const storedData = sessionStorage.getItem('applicationData');
    if (!storedData) {
      navigate('/apply');
      return;
    }
    
    setApplicationData(JSON.parse(storedData));
    
    // Ensure page starts at the top
    window.scrollTo(0, 0);
  }, [navigate]);
  
  const handlePayment = async () => {
    // Validate agreement before proceeding
    if (!agreedToTerms) {
      setAgreementError(true);
      return;
    }
    
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
  
  const { pricing } = applicationData;
  
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
                  <div className="flex justify-between font-semibold">
                    <span>Nurse Search Fee:</span>
                    <span>${pricing.basePrice.toFixed(2)}</span>
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
            
            <ClickwrapAgreement 
              checked={agreedToTerms} 
              onCheckedChange={setAgreedToTerms} 
              error={agreementError}
            />
            
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
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
