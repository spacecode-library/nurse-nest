
import React from 'react';
import { Shield, Users, Clock, CreditCard, MessageCircle, Star, Smartphone, DollarSign } from 'lucide-react';
import { BackgroundBeams } from '@/components/ui/background-beams';

export default function WhatIsNurseNestSection() {
  return (
    <section id="what-is" className="py-20 relative overflow-hidden bg-slate-900">
      {/* Background Beams with 70% opacity */}
      <div className="absolute inset-0 opacity-70">
        <BackgroundBeams />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            <div className="text-white">Nationwide Nurse Placement by a</div>
            <div className="text-primary-500">Nurse-Owned Agency</div>
            <div className="text-white">You Can Trust</div>
          </h2>
          
          {/* Slightly bigger image */}
          <div className="flex justify-center mb-8">
            <img
              src="/lovable-uploads/89138824-7217-49ac-bcf7-52d26a067082.png"
              alt="When staying home isn't just a preference"
              className="h-36 md:h-52 w-auto max-w-full object-contain"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Start Free, Pay When Needed */}
            <div className="bg-white p-6 rounded-lg shadow-md service-card relative overflow-hidden">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 text-primary-500">
                  <DollarSign className="h-16 w-16" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Start Free, Pay When Needed</h3>
              <p className="text-gray-600">
                No setup fees, monthly charges, or hidden costs. Browse qualified nurses free—pay our small platform fee only when booking completed care.
              </p>
            </div>

            {/* Founded by Nurses */}
            <div className="bg-white p-6 rounded-lg shadow-md service-card relative overflow-hidden">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 text-primary-500">
                  <Users className="h-16 w-16" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Founded by Nurses</h3>
              <p className="text-gray-600">
                Nurse-owned platform built by healthcare professionals who understand your needs. Our nursing team ensures every feature serves both families and caregivers.
              </p>
            </div>

            {/* Handpicked Professionals */}
            <div className="bg-white p-6 rounded-lg shadow-md service-card relative overflow-hidden">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 text-primary-500">
                  <Star className="h-16 w-16" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Handpicked Professionals</h3>
              <p className="text-gray-600">
                Every nurse personally recruited and vetted by our nursing team. We know each healthcare professional individually—no automated matching systems.
              </p>
            </div>

            {/* Flexible Background Screening */}
            <div className="bg-white p-6 rounded-lg shadow-md service-card relative overflow-hidden">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 text-primary-500">
                  <Shield className="h-16 w-16" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Flexible Background Screening</h3>
              <p className="text-gray-600">
                Choose your vetting level from basic license verification to comprehensive background checks. You control the screening requirements that fit your comfort level.
              </p>
            </div>

            {/* Bank-Level Payment Security */}
            <div className="bg-white p-6 rounded-lg shadow-md service-card relative overflow-hidden">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 text-primary-500">
                  <CreditCard className="h-16 w-16" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Bank-Level Payment Security</h3>
              <p className="text-gray-600">
                Powered by Stripe, the same secure platform trusted by Amazon, Google, and Shopify. Review invoices confidently with industry-leading payment protection.
              </p>
            </div>

            {/* Private Platform Communication */}
            <div className="bg-white p-6 rounded-lg shadow-md service-card relative overflow-hidden">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 text-primary-500">
                  <MessageCircle className="h-16 w-16" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Private Platform Communication</h3>
              <p className="text-gray-600">
                Message and video call nurses directly through our secure platform. No need to share personal contact information.
              </p>
            </div>

            {/* Specialized Nursing Expertise */}
            <div className="bg-white p-6 rounded-lg shadow-md service-card relative overflow-hidden">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 text-primary-500">
                  <Users className="h-16 w-16" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Specialized Nursing Expertise</h3>
              <p className="text-gray-600">
                Find nurses with exact specializations: newborn care, elderly support, wound care, post-op recovery, and more. Every nursing specialty covered.
              </p>
            </div>

            {/* 24/7 Mobile Access */}
            <div className="bg-white p-6 rounded-lg shadow-md service-card relative overflow-hidden">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 text-primary-500">
                  <Smartphone className="h-16 w-16" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">24/7 Mobile Access</h3>
              <p className="text-gray-600">
                Manage your nursing care anytime, anywhere. Stay connected to your healthcare team around the clock from any device.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
