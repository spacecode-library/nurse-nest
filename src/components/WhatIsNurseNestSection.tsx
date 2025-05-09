
import React from 'react';
import { Shield, Users, Clock } from 'lucide-react';
import BackgroundElements from './BackgroundElements';

export default function WhatIsNurseNestSection() {
  return (
    <section id="what-is" className="py-20 bg-nurse-light relative">
      {/* Background Elements with improved visibility */}
      <BackgroundElements />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            <div className="text-black">Nationwide Nurse Placement by a</div>
            <div className="text-primary-500">Nurse-Owned Agency</div>
            <div className="text-black">You Can Trust</div>
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            We connect families and healthcare providers with licensed, background-checked nurses 
            for in-home or in-practice support. Whether you need a NICU-trained night nurse, a 
            postpartum caregiver, or an elder care nurse — we find the right match, fast.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md service-card relative overflow-hidden">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 text-primary-500">
                  <Shield className="h-16 w-16" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Licensed & Verified</h3>
              <p className="text-gray-600">
                Every nurse in our network is licensed, background-checked, and credential-verified.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md service-card relative overflow-hidden">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 text-primary-500">
                  <Users className="h-16 w-16" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Perfect Matching</h3>
              <p className="text-gray-600">
                We match your unique needs with nurses who have the right specialization and experience.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md service-card relative overflow-hidden">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 text-primary-500">
                  <Clock className="h-16 w-16" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Quick Response</h3>
              <p className="text-gray-600">
                We understand urgency and work to match you with the right nurse as quickly as possible.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
