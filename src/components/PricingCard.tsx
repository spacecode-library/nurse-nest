
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Check, CircleDollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PricingCard() {
  return (
    <motion.div 
      className="max-w-md w-full rounded-xl shadow-xl overflow-hidden bg-white border border-gray-100"
      whileHover={{ 
        scale: 1.05,
        transition: { duration: 0.5 }
      }}
      style={{ maxHeight: '650px' }} // Make the card smaller to avoid scrolling
    >
      <div className="bg-gradient-to-r from-nurse-dark to-primary-400 p-6 text-white text-center">
        <h3 className="text-xl font-bold">Nurse Matching Service</h3>
        <div className="mt-4">
          <p className="text-lg opacity-75 line-through">Regular Price: $1,333.33</p>
          <div className="mt-1">
            <span className="text-sm font-medium px-2 py-1 bg-white text-primary-500 rounded-full">
              Limited Time Offer: 25% Off
            </span>
          </div>
          <p className="text-4xl font-bold mt-2">$1,000</p>
        </div>
      </div>
      
      <div className="p-6">
        <div className="mb-5">
          <h4 className="text-lg font-semibold mb-2">What's Included:</h4>
          <ul className="space-y-2">
            {[
              "Nationwide background check", 
              "License verification (active and in good standing)", 
              "Professional reference check (verified past employment)"
            ].map((item, index) => (
              <li key={index} className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="mb-5">
          <h4 className="text-lg font-semibold mb-2">Optional Add-Ons:</h4>
          <ul className="space-y-2">
            <li className="flex items-start">
              <CircleDollarSign className="h-5 w-5 text-primary-500 mr-2 flex-shrink-0 mt-0.5" />
              <span>10-Panel Drug Test: <span className="font-medium">+$100</span></span>
            </li>
            <li className="flex items-start">
              <CircleDollarSign className="h-5 w-5 text-primary-500 mr-2 flex-shrink-0 mt-0.5" />
              <span>Driving History Report: <span className="font-medium">+$50</span></span>
            </li>
          </ul>
          <p className="text-gray-500 text-sm mt-2 italic">
            (Recommended for nurses providing transportation or for added peace of mind)
          </p>
        </div>
        
        <div className="mb-5">
          <h4 className="text-lg font-semibold mb-2">How It Works:</h4>
          <p className="text-gray-600">
            Once you've selected a nurse you would like to proceed with, we initiate the screening process — including all verifications and background checks — to ensure they meet your standards.
          </p>
        </div>
        
        <div className="mb-5">
          <h4 className="text-lg font-semibold mb-2">Our Guarantee:</h4>
          <p className="text-gray-600">
            If no suitable match is found, you'll receive a refund minus a $100 advertising fee.
          </p>
        </div>
        
        <div className="mt-4">
          <Link to="/apply">
            <Button className="w-full bg-nurse-dark hover:bg-primary-700 text-white py-3">
              Get Started Now
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
