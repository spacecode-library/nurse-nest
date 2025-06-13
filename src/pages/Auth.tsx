import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  AlertCircle, 
  LockKeyhole, 
  Shield, 
  Mail, 
  Eye, 
  EyeOff,
  Stethoscope,
  Building2,
  ArrowRight,
  Sparkles,
  CheckCircle
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { signIn, signUp, getCurrentUser } from '@/supabase/auth/authService';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';

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
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await getCurrentUser();
      if (data?.user) {
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
        const { data, error } = await signIn(email, password);
        
        if (error) {
          setError(error.message);
          toast({
            title: "Login failed",
            description: error.message,
            variant: "destructive"
          });
        } else if (data?.user) {
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
    <div className="min-h-screen bg-white relative">
      {/* Glassmorphism Sticky Header */}
      <div className="sticky top-0 z-50 w-full">
        <div 
          className="backdrop-blur-lg bg-white/10 border-b border-white/20"
          style={{ 
            backdropFilter: 'blur(10px)',
            background: 'rgba(255, 255, 255, 0.1)'
          }}
        >
          <Navbar />
        </div>
      </div>
      
      <main className="flex min-h-screen pt-0">
        {/* Split Screen Layout */}
        <div className="flex w-full min-h-screen">
          
          {/* Left Side - Hero Image */}
          <div 
            className="hidden lg:flex lg:w-3/5 relative overflow-hidden"
            style={{
              backgroundImage: `url('/lovable-uploads/fc1c7286-bbd4-4988-8a79-523abf980eb2.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center center'
            }}
          >
            {/* Gradient overlay for better contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/30"></div>
            
            {/* Optional content overlay */}
            <div className="absolute inset-0 flex items-end justify-start p-12">
              <div className="text-white max-w-lg">
                <h2 className="text-4xl font-light mb-4 leading-tight">
                  Professional Healthcare
                </h2>
                <p className="text-lg opacity-90">
                  Modern, reliable nursing care delivered with excellence and compassion.
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full lg:w-2/5 bg-white flex items-center justify-center relative min-h-screen">
            <div className="w-full max-w-md px-6 py-12 lg:px-12">
              
              {/* Header Section */}
              <div className="text-center mb-8">
                <img
                  src="/lovable-uploads/4833d6fb-c7e4-4dc3-86a5-2b6da1365e6a.png"
                  alt="Healthcare Reimagined"
                  className="h-16 md:h-20 w-auto mb-6 mx-auto"
                />
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                  {isLogin ? 'Welcome back' : 'Get started'}
                </h1>
                <p className="text-base text-gray-600 mb-2">
                  {isLogin ? 'Sign in to your account' : 'Create your account'}
                </p>
                <p className="text-sm text-gray-500">
                  Nurses and clients
                </p>
              </div>

              {/* Error Display */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="text-red-700 text-sm">{error}</span>
                </div>
              )}
              
              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {!isLogin && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-gray-700 font-medium">
                          First Name
                        </Label>
                        <Input
                          id="firstName"
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="h-12 border-gray-200 focus:border-[#9bcbff] focus:ring-[#9bcbff] rounded-xl bg-white transition-colors"
                          required
                          placeholder="Enter first name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-gray-700 font-medium">
                          Last Name
                        </Label>
                        <Input
                          id="lastName"
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="h-12 border-gray-200 focus:border-[#9bcbff] focus:ring-[#9bcbff] rounded-xl bg-white transition-colors"
                          required
                          placeholder="Enter last name"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Label className="text-gray-700 font-medium">
                        I am a:
                      </Label>
                      <RadioGroup 
                        value={userType} 
                        onValueChange={(value: string) => setUserType(value as 'nurse' | 'client' | 'admin')}
                        className="space-y-3"
                      >
                        <div className="relative">
                          <div className={`flex items-center space-x-3 p-4 border-2 rounded-xl cursor-pointer transition-all hover:border-[#9bcbff] hover:bg-blue-50/50 ${
                            userType === 'client' 
                              ? 'border-[#9bcbff] bg-blue-50' 
                              : 'border-gray-200'
                          }`} onClick={() => setUserType('client')}>
                            <RadioGroupItem value="client" id="client" className="text-[#9bcbff]" />
                            <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                              <Building2 className="h-5 w-5 text-green-600" />
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900">Client</div>
                              <div className="text-sm text-gray-600">I need nursing care services</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="relative">
                          <div className={`flex items-center space-x-3 p-4 border-2 rounded-xl cursor-pointer transition-all hover:border-[#9bcbff] hover:bg-blue-50/50 ${
                            userType === 'nurse' 
                              ? 'border-[#9bcbff] bg-blue-50' 
                              : 'border-gray-200'
                          }`} onClick={() => setUserType('nurse')}>
                            <RadioGroupItem value="nurse" id="nurse" className="text-[#9bcbff]" />
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                              <Stethoscope className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900">Healthcare Professional</div>
                              <div className="text-sm text-gray-600">I provide nursing care services</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="relative">
                          <div className={`flex items-center space-x-3 p-4 border-2 rounded-xl cursor-pointer transition-all hover:border-[#9bcbff] hover:bg-blue-50/50 ${
                            userType === 'admin' 
                              ? 'border-[#9bcbff] bg-blue-50' 
                              : 'border-gray-200'
                          }`} onClick={() => setUserType('admin')}>
                            <RadioGroupItem value="admin" id="admin" className="text-[#9bcbff]" />
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                              <Shield className="h-5 w-5 text-purple-600" />
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900 flex items-center">
                                Administrator
                                <Sparkles className="h-3 w-3 ml-1 text-purple-600" />
                              </div>
                              <div className="text-sm text-gray-600">Platform administration</div>
                            </div>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>
                  </>
                )}
                
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 pl-12 border-gray-200 focus:border-[#9bcbff] focus:ring-[#9bcbff] rounded-xl bg-white transition-colors"
                      required
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                
                {/* Password Field */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-gray-700 font-medium">
                      Password
                    </Label>
                    {isLogin && (
                      <button
                        type="button"
                        className="text-sm text-[#9bcbff] hover:text-blue-600 font-medium transition-colors"
                        onClick={() => navigate('/auth/reset-password')}
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <LockKeyhole className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 pl-12 pr-12 border-gray-200 focus:border-[#9bcbff] focus:ring-[#9bcbff] rounded-xl bg-white transition-colors"
                      required
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {!isLogin && (
                    <p className="text-xs text-gray-500 mt-1">
                      Must be at least 8 characters long
                    </p>
                  )}
                </div>
                
                {/* Remember Me Checkbox */}
                {isLogin && (
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="remember"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 text-[#9bcbff] rounded border-gray-300 focus:ring-[#9bcbff]"
                    />
                    <Label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer">
                      Remember me for 30 days
                    </Label>
                  </div>
                )}
                
                {/* Submit Button */}
                <Button
                  className="w-full h-12 bg-[#9bcbff] hover:bg-blue-400 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                  disabled={loading}
                  type="submit"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  )}
                </Button>
              </form>
              
              {/* Footer Links */}
              <div className="mt-6 text-center">
                {isLogin ? (
                  <p className="text-gray-600">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      className="text-[#9bcbff] hover:text-blue-600 font-semibold transition-colors"
                      onClick={() => {
                        setIsLogin(false);
                        setError(null);
                      }}
                    >
                      Sign up for free
                    </button>
                  </p>
                ) : (
                  <p className="text-gray-600">
                    Already have an account?{' '}
                    <button
                      type="button"
                      className="text-[#9bcbff] hover:text-blue-600 font-semibold transition-colors"
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

              {/* Security Badge */}
              <div className="mt-6 text-center">
                <div className="inline-flex items-center space-x-2 text-sm text-gray-500">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>SSL Secured</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
