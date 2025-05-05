
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ClientApplicationSection from '@/components/ClientApplicationSection';

export default function Apply() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Request a <span className="text-nurse-dark">Nurse</span>
          </h1>
          
          <ClientApplicationSection />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
