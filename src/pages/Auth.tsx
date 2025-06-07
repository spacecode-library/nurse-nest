import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  AlertCircle, 
  LockKeyhole, 
  Shield, 
  Mail, 
  Eye, 
  EyeOff,
  Heart,
  Stethoscope,
  UserPlus,
  LogIn,
  CheckCircle,
  Building2,
  ArrowRight,
  Sparkles,
  Award,
  Users,
  Clock
} from 'lucide-react';
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
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is already logged in
    const checkSession = async () => {
      try {
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
      } catch (error) {
        console.error('Error getting current user:', error);
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
            title: "Welcome back!",
            description: "Successfully signed in to your account.",
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
        } else if (data?.user) {
          // Ensure proper account status is set for nurses
          if (userType === 'nurse') {
            await supabase
              .from('user_metadata')
              .update({ account_status: 'pending' })
              .eq('user_id', data.user.id);
          }
          
          toast({
            title: "Account created successfully!",
            description: userType === 'admin' 
              ? "Admin account created successfully!" 
              : userType === 'nurse'
              ? "Account created! Complete your profile to get started."
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
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-white/20">
        <Navbar />
      </div>
      
      {/* Main Content - Single seamless background */}
      <main className="relative min-h-screen pt-16">
        {/* Full width fixed background image that fades naturally to white */}
        <div 
          className="fixed inset-0 w-full h-full bg-cover bg-no-repeat z-0"
          style={{
            backgroundImage: 'url(/lovable-uploads/cd188753-e3a5-419a-ad58-51cd5607d594.png)',
            backgroundPosition: 'left center',
            backgroundAttachment: 'fixed'
          }}
        />
        
        {/* Content overlay without any borders or hard edges */}
        <div className="relative z-10 min-h-screen flex">
          {/* Form container positioned to blend with image's natural fade */}
          <div className="w-full flex items-center justify-end pr-4 sm:pr-8 lg:pr-16">
            {/* Compact form container with no borders or shadows */}
            <div className="w-full max-w-sm bg-white/95 backdrop-blur-sm rounded-2xl p-6 my-8">
              
              {/* Header image - MUCH BIGGER */}
              <div className="mb-4 text-center">
                <img 
                  src="/lovable-uploads/b03954bb-8493-4e23-a285-627ff87efdb8.png" 
                  alt="Healthcare Reimagined" 
                  className="max-w-full h-auto max-h-20 object-contain mx-auto drop-shadow-lg"
                />
              </div>
              
              {/* Compact header section */}
              <div className="text-center mb-4">
                <p className="text-base text-slate-600 mb-1">
                  {isLogin ? 'Sign in to your account' : 'Create your account'}
                </p>
                <p className="text-xs text-slate-500">
                  Healthcare professionals and clients
                </p>
              </div>

              {/* Error Display */}
              {error && (
                <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
                  <AlertCircle className="h-3 w-3 text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="text-red-700 text-xs">{error}</span>
                </div>
              )}
              
              {/* Compact form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                {!isLogin && (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label htmlFor="firstName" className="text-slate-600 text-xs">
                          First Name
                        </Label>
                        <Input
                          id="firstName"
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="h-8 border-slate-200 focus:border-blue-400 rounded-lg bg-white shadow-sm text-xs"
                          required
                          placeholder="First name"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="lastName" className="text-slate-600 text-xs">
                          Last Name
                        </Label>
                        <Input
                          id="lastName"
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="h-8 border-slate-200 focus:border-blue-400 rounded-lg bg-white shadow-sm text-xs"
                          required
                          placeholder="Last name"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-slate-600 text-xs">
                        I am a:
                      </Label>
                      <RadioGroup 
                        value={userType} 
                        onValueChange={(value: string) => setUserType(value as 'nurse' | 'client' | 'admin')}
                        className="space-y-1"
                      >
                        <div className="relative">
                          <div className={`flex items-center space-x-2 p-2 border-2 rounded-lg cursor-pointer transition-all hover:border-blue-400 hover:bg-blue-50/50 ${
                            userType === 'client' 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-slate-200 bg-white'
                          }`} onClick={() => setUserType('client')}>
                            <RadioGroupItem value="client" id="client" className="text-blue-500" />
                            <div className="w-6 h-6 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                              <Building2 className="h-3 w-3 text-green-600" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-slate-800 text-xs">Client</div>
                              <div className="text-xs text-slate-600">Need nursing care</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="relative">
                          <div className={`flex items-center space-x-2 p-2 border-2 rounded-lg cursor-pointer transition-all hover:border-blue-400 hover:bg-blue-50/50 ${
                            userType === 'nurse' 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-slate-200 bg-white'
                          }`} onClick={() => setUserType('nurse')}>
                            <RadioGroupItem value="nurse" id="nurse" className="text-blue-500" />
                            <div className="w-6 h-6 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                              <Stethoscope className="h-3 w-3 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-slate-800 text-xs">Healthcare Professional</div>
                              <div className="text-xs text-slate-600">Provide nursing care</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="relative">
                          <div className={`flex items-center space-x-2 p-2 border-2 rounded-lg cursor-pointer transition-all hover:border-blue-400 hover:bg-blue-50/50 ${
                            userType === 'admin' 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-slate-200 bg-white'
                          }`} onClick={() => setUserType('admin')}>
                            <RadioGroupItem value="admin" id="admin" className="text-blue-500" />
                            <div className="w-6 h-6 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                              <Shield className="h-3 w-3 text-purple-600" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-slate-800 flex items-center text-xs">
                                Administrator
                                <Sparkles className="h-3 w-3 ml-1 text-purple-600" />
                              </div>
                              <div className="text-xs text-slate-600">Platform admin</div>
                            </div>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>
                  </>
                )}
                
                {/* Email Field */}
                <div className="space-y-1">
                  <Label htmlFor="email" className="text-slate-600 text-xs">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-2 top-2 h-3 w-3 text-slate-500" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-8 pl-8 border-slate-200 focus:border-blue-400 rounded-lg bg-white shadow-sm text-xs"
                      required
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                
                {/* Password Field */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-slate-600 text-xs">
                      Password
                    </Label>
                    {isLogin && (
                      <button
                        type="button"
                        className="text-xs text-blue-500 hover:text-blue-600 font-medium"
                        onClick={() => navigate('/auth/reset-password')}
                      >
                        Forgot?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <LockKeyhole className="absolute left-2 top-2 h-3 w-3 text-slate-500" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-8 pl-8 pr-8 border-slate-200 focus:border-blue-400 rounded-lg bg-white shadow-sm text-xs"
                      required
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-2 text-slate-500 hover:text-slate-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-3 w-3" />
                      ) : (
                        <Eye className="h-3 w-3" />
                      )}
                    </button>
                  </div>
                  {!isLogin && (
                    <p className="text-xs text-slate-500 mt-1">
                      At least 8 characters
                    </p>
                  )}
                </div>
                
                {/* Remember Me Checkbox */}
                {isLogin && (
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="remember"
                      className="h-3 w-3 text-blue-500 rounded border-slate-300"
                    />
                    <Label htmlFor="remember" className="text-xs text-slate-600 cursor-pointer">
                      Remember me
                    </Label>
                  </div>
                )}
                
                {/* Submit Button */}
                <Button
                  className="w-full h-8 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 text-xs"
                  disabled={loading}
                  type="submit"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                      <ArrowRight className="h-3 w-3" />
                    </div>
                  )}
                </Button>
              </form>
              
              {/* Footer Links */}
              <div className="mt-4 text-center">
                {isLogin ? (
                  <p className="text-slate-600 text-xs">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      className="text-blue-500 hover:text-blue-600 font-medium"
                      onClick={() => {
                        setIsLogin(false);
                        setError(null);
                      }}
                    >
                      Sign up free
                    </button>
                  </p>
                ) : (
                  <p className="text-slate-600 text-xs">
                    Already have an account?{' '}
                    <button
                      type="button"
                      className="text-blue-500 hover:text-blue-600 font-medium"
                      onClick={() => {
                        setIsLogin(true);
                        setError(null);
                      }}
                    >
                      Sign in
                    </button>
                  </p>
                )}
              </div>

              {/* Admin Notice */}
              {userType === 'admin' && !isLogin && (
                <div className="mt-3 p-2 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Shield className="h-3 w-3 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div className="text-xs">
                      <p className="font-medium text-purple-800 mb-1">Admin Access</p>
                      <p className="text-purple-700">
                        Creating admin account with full platform access.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Badge */}
              <div className="mt-4 text-center">
                <div className="inline-flex items-center space-x-2 text-xs text-slate-600">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span>SSL Secured & HIPAA Compliant</span>
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
