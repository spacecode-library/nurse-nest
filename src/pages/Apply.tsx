
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ClientApplicationSection from '@/components/ClientApplicationSection';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

export default function Apply() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Ensure we're at the top of the page
    window.scrollTo(0, 0);
    
    // Redirect to auth page if not logged in and loading is complete
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);
  
  // Show loading or redirect to login if not authenticated
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-1 pt-24">
          <div className="container mx-auto px-4 py-12 flex justify-center items-center">
            <p className="text-xl">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-1 pt-24">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-md mx-auto text-center">
              <h1 className="text-3xl font-bold mb-4">Authentication Required</h1>
              <p className="mb-6">Please sign in or create an account to request a nurse.</p>
              <Button onClick={() => navigate('/auth')}>Sign In / Create Account</Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
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
