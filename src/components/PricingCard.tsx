
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Check, CircleDollarSign, Shield, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from './ui/card';

export default function PricingCard() {
  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Transparent, Upfront Pricing</h2>
        <p className="text-lg text-gray-700">We believe in clarity, not surprises.</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Main Service Cards */}
        <motion.div 
          className="rounded-xl shadow-lg overflow-hidden bg-white border border-gray-100"
          whileHover={{ 
            scale: 1.02,
            transition: { duration: 0.3 }
          }}
        >
          <div className="bg-gradient-to-r from-nurse-dark to-primary-500 p-5 text-white">
            <h3 className="text-xl font-bold flex items-center">
              <Shield className="h-5 w-5 mr-2" /> Nurse Search Fee
            </h3>
          </div>
          <div className="p-6">
            <div className="text-3xl font-bold mb-4 text-primary-600">$100</div>
            <p className="mb-4 text-gray-700">
              Start your personalized RN match with a fully refundable search fee 
              (if we don't match you in 14 days).
            </p>
            <div className="mt-6">
              <Link to="/apply">
                <Button className="w-full bg-primary-500 hover:bg-primary-600 text-white">
                  Start Your Search
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="rounded-xl shadow-lg overflow-hidden bg-white border border-gray-100"
          whileHover={{ 
            scale: 1.02,
            transition: { duration: 0.3 }
          }}
        >
          <div className="bg-gradient-to-r from-nurse-accent to-orange-500 p-5 text-white">
            <h3 className="text-xl font-bold flex items-center">
              <Clock className="h-5 w-5 mr-2" /> FastTrack Match
            </h3>
          </div>
          <div className="p-6">
            <div className="text-3xl font-bold mb-4 text-orange-500">$500</div>
            <p className="mb-4 text-gray-700">
              Want care fast? Get matched with a nurse in 5 business days or your money back.
            </p>
            <div className="mt-6">
              <Link to="/apply">
                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                  Get Fast-Tracked
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Optional Add-ons */}
      <div className="bg-gray-50 rounded-xl p-8 mb-12">
        <h3 className="text-xl font-bold mb-4">Optional Add-ons</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-white">
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
          
          <Card className="bg-white">
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
        </div>
      </div>
      
      {/* Payment Info */}
      <div className="bg-white rounded-xl shadow-md p-8 border-l-4 border-primary-500">
        <div className="flex items-start">
          <CircleDollarSign className="h-8 w-8 text-primary-500 mr-4 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-xl font-bold mb-2">Secure Payment Process</h3>
            <p className="text-gray-700">
              Pay your nurse directly through our secure Stripe-powered checkout. 
              We simply take care of the details and deduct a 15% platform fee.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
