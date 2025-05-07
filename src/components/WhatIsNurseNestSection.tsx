
import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCheck, Shield, Users } from 'lucide-react';

export default function WhatIsNurseNestSection() {
  return (
    <section id="what-is" className="py-20 bg-nurse-light">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Nationwide Nurse Placement by a Nurse-Owned Agency You Can Trust</h2>
          <p className="text-lg text-gray-700 mb-8">
            Nurse Nest connects families and facilities with qualified private duty nurses for personalized care. Our platform is trusted by families seeking reliable healthcare professionals for in-home nursing care and medical facilities looking for specialized staff.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-nurse-dark rounded-full flex items-center justify-center">
                  <CheckCheck className="h-6 w-6 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Experienced Nurses</h3>
              <p className="text-gray-600">All our nurses have a minimum of 2 years clinical experience and undergo thorough screening.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Custom Matching</h3>
              <p className="text-gray-600">We carefully match nurses to your specific needs for the best possible care experience.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-nurse-dark rounded-full flex items-center justify-center">
                  <Shield className="h-6 w-6 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Rapid Response</h3>
              <p className="text-gray-600">Our platform accelerates the matching process so you can receive care sooner.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
