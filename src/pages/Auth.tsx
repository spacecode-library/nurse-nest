
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AlertCircle, LockKeyhole } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState<'nurse' | 'client'>('client');
  const [adminCode, setAdminCode] = useState('');
  const [showAdminField, setShowAdminField] = useState(false);
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
            variant: "destructive",
          });
        } else {
          toast({
            title: "Login successful",
            description: "Welcome back!",
          });
        }
      } else {
        // Parse name into first and last name
        const nameParts = fullName.trim().split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
        
        // Determine final role (if admin code matches)
        const finalRole = showAdminField && adminCode === "ADMIN123" ? "admin" : role;
        
        // Sign up the user
        const { error, data } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName,
              dob: dob,
              address: address,
              role: finalRole
            }
          }
        });
        
        if (error) {
          setError(error.message);
          toast({
            title: "Sign up failed",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Sign up successful",
            description: "Please check your email to verify your account.",
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

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/dashboard'
        }
      });
      
      if (error) {
        toast({
          title: "Google Sign In Failed",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Google auth error:', error);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: window.location.origin + '/dashboard'
        }
      });
      
      if (error) {
        toast({
          title: "Apple Sign In Failed",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Apple auth error:', error);
    }
  };

  const toggleAdminField = () => {
    setShowAdminField(!showAdminField);
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
                    <LockKeyhole className="h-8 w-8 text-primary-500" />
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
                      <div>
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="mt-1"
                          required={!isLogin}
                          placeholder="John Doe"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="dob">Date of Birth</Label>
                        <Input
                          id="dob"
                          type="date"
                          value={dob}
                          onChange={(e) => setDob(e.target.value)}
                          className="mt-1"
                          required={!isLogin}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          type="text"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="mt-1"
                          required={!isLogin}
                          placeholder="123 Main St, City, State, ZIP"
                        />
                      </div>

                      <div>
                        <Label className="mb-2 block">I am signing up as a:</Label>
                        <RadioGroup 
                          value={role} 
                          onValueChange={(value) => setRole(value as 'nurse' | 'client')}
                          className="flex flex-col space-y-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="nurse" id="role-nurse" />
                            <Label htmlFor="role-nurse" className="flex items-center">
                              <span className="mr-2">👩‍⚕️</span> Nurse
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="client" id="role-client" />
                            <Label htmlFor="role-client" className="flex items-center">
                              <span className="mr-2">👨‍💼</span> Client
                            </Label>
                          </div>
                        </RadioGroup>
                        <div className="mt-2">
                          <button 
                            type="button" 
                            onClick={toggleAdminField} 
                            className="text-xs text-primary-500 hover:underline"
                          >
                            {showAdminField ? 'Hide admin options' : 'Have an admin code?'}
                          </button>
                        </div>
                        
                        {showAdminField && (
                          <div className="mt-2">
                            <Label htmlFor="adminCode">Admin Code</Label>
                            <Input
                              id="adminCode"
                              type="text"
                              value={adminCode}
                              onChange={(e) => setAdminCode(e.target.value)}
                              className="mt-1"
                              placeholder="Enter admin code"
                            />
                          </div>
                        )}
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
                        <span className="text-sm text-primary-500 cursor-pointer hover:underline">
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
                    className="w-full bg-primary-500 hover:bg-primary-600"
                    disabled={loading}
                    type="submit"
                  >
                    {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
                  </Button>
                </form>
                
                <div className="mt-6 text-center">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleGoogleSignIn}
                      className="inline-flex justify-center items-center"
                    >
                      <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                      Google
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAppleSignIn}
                      className="inline-flex justify-center items-center"
                    >
                      <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
                      </svg>
                      Apple
                    </Button>
                  </div>
                </div>
                
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
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
