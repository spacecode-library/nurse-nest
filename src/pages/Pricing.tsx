
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PricingCard from '@/components/PricingCard';

export default function Pricing() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <section className="section-padding bg-white">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
              Simple, Transparent <span className="text-nurse-dark">Pricing</span>
            </h1>
            
            <div className="flex justify-center">
              <PricingCard />
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
