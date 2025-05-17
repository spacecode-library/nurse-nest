
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function NurseApplication() {
  const [jobCode, setJobCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Redirect to auth page if not logged in and loading is complete
    if (!loading && !user) {
      navigate('/auth', { state: { redirectAfterAuth: '/nurse-application' } });
    }
  }, [user, loading, navigate]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!jobCode.trim()) {
      toast.error("Please enter a valid job code.");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate validation (in a real app, you'd verify this with your backend)
    setTimeout(() => {
      toast.success("Job code accepted! Redirecting to onboarding...");
      setIsSubmitting(false);
      // In a real implementation, you would redirect to the onboarding flow
      // For now, we'll just reset the form
      setJobCode('');
    }, 1500);
  };
  
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
    return null; // This shouldn't render as useEffect will redirect
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <main className="flex-1 pt-24">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-3">
              Nurse <span className="text-primary-500">Application</span>
            </h1>
            <p className="text-gray-600 text-center mb-8">
              Enter your job code to begin the onboarding process
            </p>
            
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label htmlFor="jobCode" className="block text-sm font-medium text-gray-700 mb-2">
                    Job Code
                  </label>
                  <Input
                    id="jobCode"
                    type="text"
                    placeholder="Enter your job code"
                    value={jobCode}
                    onChange={(e) => setJobCode(e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-primary-500 hover:bg-primary-600"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Submit"}
                </Button>
              </form>
            </div>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-amber-800 text-sm">
                <span className="font-bold">⚠️ Note:</span> Job codes are required to begin onboarding. Contact the client directly or support for your code.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
