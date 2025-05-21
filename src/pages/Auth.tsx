import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AlertCircle, LockKeyhole, Shield } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { signIn, signUp, getCurrentUser } from '@/supabase/auth/authService';
import { supabase } from '@/integrations/supabase/client';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userType, setUserType] = useState<'nurse' | 'client' | 'admin'>('client');
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is already logged in
    const checkSession = async () => {
      const { data } = await getCurrentUser();
      if (data?.user) {
        // Check user type and redirect accordingly
        const { data: userMetadata } = await supabase
          .from('user_metadata')
          .select('user_type')
          .eq('user_id', data.user.id)
          .single();
        
        if (userMetadata?.user_type === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }
    };
    
    checkSession();
  }, [navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (isLogin) {
        // Sign in existing user
        const { data, error } = await signIn(email, password);
        
        if (error) {
          setError(error.message);
          toast({
            title: "Login failed",
            description: error.message,
            variant: "destructive"
          });
        } else if (data?.user) {
          // Check user type and redirect accordingly
          const { data: userMetadata } = await supabase
            .from('user_metadata')
            .select('user_type')
            .eq('user_id', data.user.id)
            .single();
          
          toast({
            title: "Login successful",
            description: "Welcome back!"
          });
          
          if (userMetadata?.user_type === 'admin') {
            navigate('/admin');
          } else {
            navigate('/dashboard');
          }
        }
      } else {
        // Sign up new user with proper metadata
        const metadata = {
          first_name: firstName,
          last_name: lastName
        };
        
        const { data, error } = await signUp(
          email,
          password,
          userType,
          metadata
        );
        
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
            description: userType === 'admin' 
              ? "Admin account created successfully!" 
              : "Please check your email to verify your account."
          });
          
          // Redirect based on user type
          if (userType === 'nurse') {
            navigate('/onboarding/nurse');
          } else if (userType === 'client') {
            navigate('/onboarding/client');
          } else if (userType === 'admin') {
            navigate('/admin');
          }
        }
      }
    } catch (error: any) {
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
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-5xl mx-auto overflow-hidden rounded-xl shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Left section - Blue gradient with message */}
              <div className="bg-gradient-to-br from-nurse-dark to-primary-400 p-12 flex flex-col justify-center relative overflow-hidden">
                <div className="relative z-10">
                  <h2 className="text-4xl font-bold text-white mb-4">
                    Your nursing journey
                    <br />starts here
                  </h2>
                  <p className="text-white/90 text-lg mb-6">
                    Join our community of healthcare professionals today
                  </p>
                </div>
                {/* Decorative elements */}
                <div className="absolute top-10 left-10 w-16 h-16 bg-white/10 rounded-full"></div>
                <div className="absolute bottom-40 right-10 w-24 h-24 bg-white/10 rounded-full"></div>
                <div className="absolute bottom-10 left-20 w-32 h-32 bg-white/5 rounded-full"></div>
              </div>
              
              {/* Right section - Auth form */}
              <div className="bg-white p-10">
                <div className="flex justify-center mb-6">
                  <div className="rounded-full bg-primary-100 p-4">
                    {userType === 'admin' ? (
                      <Shield className="h-8 w-8 text-primary-500" />
                    ) : (
                      <LockKeyhole className="h-8 w-8 text-primary-500" />
                    )}
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-center text-gray-800 mb-2">
                  {isLogin ? 'Welcome back' : 'Create your account'}
                </h3>
                <p className="text-gray-500 text-center mb-8">
                  {isLogin ? 'Sign in to access your account' : 'Please fill in your information below'}
                </p>
                
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                    <span className="text-red-700">{error}</span>
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLogin && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="mt-1"
                            required
                            placeholder="First Name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="mt-1"
                            required
                            placeholder="Last Name"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="userType" className="block mb-2">I am a:</Label>
                        <RadioGroup 
                          value={userType} 
                          onValueChange={(val) => setUserType(val as 'nurse' | 'client' | 'admin')}
                          className="flex flex-col space-y-2"
                        >
                          <div className="flex items-center space-x-2 p-3 border rounded-md hover:bg-gray-50">
                            <RadioGroupItem value="client" id="client" />
                            <Label htmlFor="client" className="flex-1 cursor-pointer">
                              <div className="font-medium">Client</div>
                              <div className="text-sm text-gray-500">I need nursing care</div>
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 p-3 border rounded-md hover:bg-gray-50">
                            <RadioGroupItem value="nurse" id="nurse" />
                            <Label htmlFor="nurse" className="flex-1 cursor-pointer">
                              <div className="font-medium">Nurse</div>
                              <div className="text-sm text-gray-500">I provide nursing care</div>
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 p-3 border rounded-md hover:bg-gray-50 bg-blue-50">
                            <RadioGroupItem value="admin" id="admin" />
                            <Label htmlFor="admin" className="flex-1 cursor-pointer">
                              <div className="font-medium flex items-center">
                                <Shield className="h-4 w-4 mr-2 text-blue-600" />
                                Administrator
                              </div>
                              <div className="text-sm text-gray-500">Platform administration access</div>
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </>
                  )}
                  
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1"
                      required
                      placeholder="your.email@example.com"
                    />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      {isLogin && (
                        <span 
                          className="text-sm text-primary-500 cursor-pointer hover:underline"
                          onClick={() => navigate('/auth/reset-password')}
                        >
                          Reset Password
                        </span>
                      )}
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="mt-1"
                      required
                      placeholder="••••••••••"
                    />
                  </div>
                  
                  {isLogin && (
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="remember"
                        className="h-4 w-4 text-primary-500 rounded border-gray-300 focus:ring-primary-500"
                      />
                      <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                        Remember me
                      </label>
                    </div>
                  )}
                  
                  <Button
                    className={`w-full ${userType === 'admin' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-primary-500 hover:bg-primary-600'}`}
                    disabled={loading}
                    type="submit"
                  >
                    {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
                  </Button>
                </form>
                
                <div className="mt-6 text-center">
                  {isLogin ? (
                    <p className="text-sm text-gray-600">
                      Don't have an account?{' '}
                      <button
                        type="button"
                        className="text-primary-500 hover:underline font-medium"
                        onClick={() => setIsLogin(false)}
                      >
                        Create Account
                      </button>
                    </p>
                  ) : (
                    <p className="text-sm text-gray-600">
                      Already have an account?{' '}
                      <button
                        type="button"
                        className="text-primary-500 hover:underline font-medium"
                        onClick={() => setIsLogin(true)}
                      >
                        Sign In
                      </button>
                    </p>
                  )}
                </div>

                {userType === 'admin' && !isLogin && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <div className="flex items-start">
                      <Shield className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">Admin Account</p>
                        <p>You are creating an administrator account with full platform access. This should only be used by authorized personnel.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}