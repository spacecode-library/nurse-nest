
import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Check } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';

export default function FastTrackCallout() {
  return (
    <motion.div 
      className="relative overflow-hidden bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl shadow-lg border border-amber-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-16 -translate-y-8">
        <div className="absolute inset-0 bg-amber-500 opacity-20 rounded-full"></div>
      </div>
      
      <div className="p-8 md:p-10 relative">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="md:w-2/3">
            <div className="flex items-center mb-4">
              <div className="bg-amber-500 text-white p-2 rounded-full mr-3">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold text-amber-800">🚨 Need a Nurse Fast? Choose FastTrack Match</h3>
            </div>
            
            <p className="text-gray-700 mb-6">
              Add FastTrack Match for $500 to your search, and we guarantee to present a qualified RN within 5 business days.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="bg-white border-t-4 border-green-500">
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span className="font-medium">Peace of mind</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white border-t-4 border-green-500">
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span className="font-medium">Priority sourcing</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white border-t-4 border-green-500">
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span className="font-medium">Money-back guarantee</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="bg-white p-4 rounded-lg border-l-4 border-amber-500 mb-6 md:mb-0">
              <p className="italic text-gray-700">
                "FastTrack saved us during our first week home with the baby." – Emma, Los Angeles
              </p>
            </div>
          </div>
          
          <div className="md:w-1/3 flex justify-center">
            <Link to="/apply">
              <Button className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-6 h-auto text-lg">
                Get FastTrack Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
