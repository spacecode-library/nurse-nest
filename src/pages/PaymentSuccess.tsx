
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PaymentSuccess() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <main className="flex-1 pt-24">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden">
            <div className="bg-green-100 p-6 flex flex-col items-center">
              <div className="bg-green-500 rounded-full p-3 mb-4">
                <Check className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-center mb-2">Payment Successful!</h1>
              <p className="text-gray-600 text-center">
                Thank you for choosing Nurse Nest. Your payment has been processed successfully.
              </p>
            </div>
            
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">What happens next?</h2>
              
              <ol className="list-decimal list-inside space-y-3 text-gray-700 mb-6">
                <li>Our team will review your application within 24-48 hours.</li>
                <li>We'll begin our search for nurses matching your requirements.</li>
                <li>You'll receive profiles of suitable candidates by email.</li>
                <li>Once you select a nurse, we'll complete the verification process.</li>
              </ol>
              
              <p className="text-gray-600 mb-6">
                If you have any questions, please contact us at <a href="mailto:contact@nursenest.us" className="text-primary-500 font-semibold">contact@nursenest.us</a> or call <a href="tel:4259543381" className="text-primary-500 font-semibold">(425) 954-3381</a>.
              </p>
              
              <Link to="/">
                <Button className="w-full">
                  Return to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
