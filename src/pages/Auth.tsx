
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is already logged in
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/dashboard');
      }
    };
    
    checkSession();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          navigate('/dashboard');
        }
      }
    );
    
    return () => subscription.unsubscribe();
  }, [navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) {
          setError(error.message);
          toast({
            title: "Login failed",
            description: error.message,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Login successful",
            description: "Welcome back!"
          });
        }
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password
        });
        
        if (error) {
          setError(error.message);
          toast({
            title: "Sign up failed",
            description: error.message,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Sign up successful",
            description: "Please check your email to verify your account."
          });
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <main className="flex-1 pt-24">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-nurse-dark to-primary-400 p-6">
              <h1 className="text-2xl font-bold text-white text-center">
                {isLogin ? 'Sign In' : 'Create Account'}
              </h1>
            </div>
            
            <div className="p-6">
              <div className="flex justify-center space-x-4 mb-6">
                <button
                  className={`px-4 py-2 font-medium ${
                    isLogin ? 'text-primary-500 border-b-2 border-primary-500' : 'text-gray-500'
                  }`}
                  onClick={() => setIsLogin(true)}
                >
                  Sign In
                </button>
                <button
                  className={`px-4 py-2 font-medium ${
                    !isLogin ? 'text-primary-500 border-b-2 border-primary-500' : 'text-gray-500'
                  }`}
                  onClick={() => setIsLogin(false)}
                >
                  Sign Up
                </button>
              </div>
              
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                  <span className="text-red-700">{error}</span>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                
                <Button
                  className="w-full bg-nurse-dark hover:bg-primary-700"
                  disabled={loading}
                  type="submit"
                >
                  {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
