
import React from 'react';
import { Shield, Users, Clock } from 'lucide-react';

export default function WhatIsNurseNestSection() {
  return (
    <section id="what-is" className="py-20 bg-nurse-light relative">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden opacity-10">
        <div className="absolute -top-20 -left-20 w-1/2 h-full">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path fill="#1E88E5" d="M39.5,-68.4C52.9,-62.1,66.8,-54.1,75.3,-42C83.8,-29.9,86.8,-14.9,85.6,-0.7C84.4,13.6,79,27.1,70.6,38.5C62.2,49.8,50.7,59,38,65.4C25.2,71.8,11.1,75.4,-1.9,78.2C-14.9,81.1,-27.9,83.1,-41.4,79.2C-54.8,75.3,-68.7,65.5,-75.1,52.2C-81.6,38.9,-80.5,22.1,-75.8,8.8C-71,-4.5,-62.6,-14.2,-56.3,-25.3C-50,-36.3,-45.9,-48.7,-37.4,-57.7C-28.8,-66.7,-15.7,-72.3,-1.4,-70.2C12.9,-68.2,26.1,-74.6,39.5,-68.4Z" transform="translate(100 100)" />
          </svg>
        </div>
        <div className="absolute -bottom-20 -right-20 w-1/2 h-full">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path fill="#1E88E5" d="M45.7,-76.5C58.9,-69.1,69.1,-55.3,76.3,-40.8C83.4,-26.3,87.5,-11.2,85.6,3C83.8,17.2,76,30.4,66.3,41.3C56.6,52.3,45,61,32.1,68.4C19.2,75.8,4.9,81.8,-9.4,81.3C-23.6,80.7,-37.9,73.6,-49.3,64C-60.7,54.3,-69.3,42.1,-75.1,28.3C-80.8,14.6,-83.8,-0.7,-80.9,-14.9C-77.9,-29.1,-69.1,-42.3,-57.5,-49.7C-45.8,-57.2,-31.3,-59,-18.2,-65.7C-5.1,-72.5,6.6,-84.3,19.8,-85.2C33,-86,47.6,-75.9,45.7,-76.5Z" transform="translate(100 100)" />
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            <span className="text-black">Nationwide Nurse Placement by a </span>
            <span className="text-primary-500">Nurse-Owned Agency</span>
            <span className="text-black"> You Can Trust</span>
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            We connect families and healthcare providers with licensed, background-checked nurses 
            for in-home or in-practice support. Whether you need a NICU-trained night nurse, a 
            postpartum caregiver, or an elder care nurse — we find the right match, fast.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
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
            <div className="bg-white p-6 rounded-lg shadow-md">
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
            <div className="bg-white p-6 rounded-lg shadow-md">
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
