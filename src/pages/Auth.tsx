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
      {/* Enhanced Navbar with glassmorphism effect */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20">
        <Navbar />
      </div>
      
      <main className="relative flex min-h-screen pt-16">
        {/* Split Screen Layout */}
        <div className="flex w-full">
          
          {/* Left Side - Artistic Background (50% on desktop) */}
          <div className="hidden lg:flex lg:w-[50%] relative overflow-hidden">
            {/* Artistic Healthcare Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#1e293b] via-[#334155] to-white/30">
              {/* Main Healthcare Professional Image */}
              <div className="absolute inset-0 flex items-center justify-start">
                <img 
                  src="/lovable-uploads/cd188753-e3a5-419a-ad58-51cd5607d594.png" 
                  alt="Healthcare Professional" 
                  className="w-full h-full object-cover object-left"
                />
              </div>
              
              {/* Ethereal Particle Effects Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/40"></div>
              
              {/* Digital Network Effects */}
              <div className="absolute inset-0 opacity-30">
                {/* Floating particles */}
                <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-[#9bcbff] rounded-full animate-pulse"></div>
                <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white rounded-full animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 right-1/5 w-3 h-3 bg-[#3b82f6] rounded-full animate-pulse delay-500"></div>
                <div className="absolute top-2/3 right-2/5 w-1.5 h-1.5 bg-[#9bcbff] rounded-full animate-pulse delay-1500"></div>
                <div className="absolute top-3/4 right-1/6 w-2 h-2 bg-white rounded-full animate-pulse delay-2000"></div>
              </div>
            </div>
          </div>

          {/* Right Side - Centered Login Form (50% on desktop) */}
          <div className="w-full lg:w-[50%] bg-white/95 backdrop-blur-sm flex items-center justify-center relative">
            <div className="w-full max-w-md px-6 lg:px-8 py-12 mx-auto ml-8 lg:ml-16">
              
              {/* Header Image - Above Login Form */}
              <div className="mb-8 text-center">
                <img 
                  src="/lovable-uploads/b03954bb-8493-4e23-a285-627ff87efdb8.png" 
                  alt="Healthcare Reimagined" 
                  className="max-w-full h-auto max-h-20 object-contain mx-auto drop-shadow-lg"
                />
              </div>
              
              {/* Header Section */}
              <div className="text-left mb-8">
                <p className="text-lg text-[#475569] mb-2">
                  {isLogin ? 'Sign in to access your dashboard' : 'Create your account'}
                </p>
                <p className="text-sm text-[#64748b]">
                  For healthcare professionals and clients
                </p>
              </div>

              {/* Error Display */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3 shadow-sm">
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="text-red-700 text-sm">{error}</span>
                </div>
              )}
              
              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {!isLogin && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-[#475569] font-medium">
                          First Name
                        </Label>
                        <Input
                          id="firstName"
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="h-12 border-[#f1f5f9] focus:border-[#9bcbff] rounded-lg bg-white shadow-sm"
                          required
                          placeholder="Enter first name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-[#475569] font-medium">
                          Last Name
                        </Label>
                        <Input
                          id="lastName"
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="h-12 border-[#f1f5f9] focus:border-[#9bcbff] rounded-lg bg-white shadow-sm"
                          required
                          placeholder="Enter last name"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <Label className="text-[#475569] font-medium">
                        I am a:
                      </Label>
                      <RadioGroup 
                        value={userType} 
                        onValueChange={(value: string) => setUserType(value as 'nurse' | 'client' | 'admin')}
                        className="space-y-3"
                      >
                        {/* Radio group options - keep existing code */}
                        <div className="relative">
                          <div className={`flex items-center space-x-4 p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-[#3b82f6] hover:bg-blue-50/50 hover:shadow-md ${
                            userType === 'client' 
                              ? 'border-[#3b82f6] bg-blue-50 shadow-md' 
                              : 'border-[#f1f5f9] shadow-sm'
                          }`} onClick={() => setUserType('client')}>
                            <RadioGroupItem value="client" id="client" className="text-[#3b82f6]" />
                            <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center shadow-sm">
                              <Building2 className="h-5 w-5 text-green-600" />
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-[#1e293b]">Client</div>
                              <div className="text-sm text-[#64748b]">I need nursing care services</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="relative">
                          <div className={`flex items-center space-x-4 p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-[#3b82f6] hover:bg-blue-50/50 hover:shadow-md ${
                            userType === 'nurse' 
                              ? 'border-[#3b82f6] bg-blue-50 shadow-md' 
                              : 'border-[#f1f5f9] shadow-sm'
                          }`} onClick={() => setUserType('nurse')}>
                            <RadioGroupItem value="nurse" id="nurse" className="text-[#3b82f6]" />
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center shadow-sm">
                              <Stethoscope className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-[#1e293b]">Healthcare Professional</div>
                              <div className="text-sm text-[#64748b]">I provide nursing care services</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="relative">
                          <div className={`flex items-center space-x-4 p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-[#3b82f6] hover:bg-blue-50/50 hover:shadow-md ${
                            userType === 'admin' 
                              ? 'border-[#3b82f6] bg-blue-50 shadow-md' 
                              : 'border-[#f1f5f9] shadow-sm'
                          }`} onClick={() => setUserType('admin')}>
                            <RadioGroupItem value="admin" id="admin" className="text-[#3b82f6]" />
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center shadow-sm">
                              <Shield className="h-5 w-5 text-purple-600" />
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-[#1e293b] flex items-center">
                                Administrator
                                <Sparkles className="h-4 w-4 ml-2 text-purple-600" />
                              </div>
                              <div className="text-sm text-[#64748b]">Platform administration</div>
                            </div>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>
                  </>
                )}
                
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#475569] font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-4 h-5 w-5 text-[#64748b]" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 pl-12 border-[#f1f5f9] focus:border-[#9bcbff] rounded-lg bg-white shadow-sm"
                      required
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                
                {/* Password Field */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-[#475569] font-medium">
                      Password
                    </Label>
                    {isLogin && (
                      <button
                        type="button"
                        className="text-sm text-[#3b82f6] hover:text-[#2563eb] font-medium transition-colors"
                        onClick={() => navigate('/auth/reset-password')}
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <LockKeyhole className="absolute left-4 top-4 h-5 w-5 text-[#64748b]" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 pl-12 pr-12 border-[#f1f5f9] focus:border-[#9bcbff] rounded-lg bg-white shadow-sm"
                      required
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-4 text-[#64748b] hover:text-[#475569] transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {!isLogin && (
                    <p className="text-xs text-[#64748b] mt-1">
                      Must be at least 8 characters long
                    </p>
                  )}
                </div>
                
                {/* Remember Me Checkbox */}
                {isLogin && (
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="remember"
                      className="h-4 w-4 text-[#3b82f6] rounded border-[#f1f5f9] focus:ring-[#9bcbff]"
                    />
                    <Label htmlFor="remember" className="text-sm text-[#64748b] cursor-pointer">
                      Remember me for 30 days
                    </Label>
                  </div>
                )}
                
                {/* Sign In Button */}
                <Button
                  className="w-full h-12 bg-[#9bcbff] hover:bg-[#3b82f6] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
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
              <div className="mt-8 text-left">
                {isLogin ? (
                  <p className="text-[#64748b]">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      className="text-[#3b82f6] hover:text-[#2563eb] font-semibold transition-colors"
                      onClick={() => {
                        setIsLogin(false);
                        setError(null);
                      }}
                    >
                      Sign up for free
                    </button>
                  </p>
                ) : (
                  <p className="text-[#64748b]">
                    Already have an account?{' '}
                    <button
                      type="button"
                      className="text-[#3b82f6] hover:text-[#2563eb] font-semibold transition-colors"
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
                <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg shadow-sm">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-semibold text-purple-800 mb-1">Administrator Access</p>
                      <p className="text-purple-700">
                        You're creating an admin account with full platform access. 
                        Only authorized personnel should use this option.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Badge */}
              <div className="mt-8 text-left">
                <div className="inline-flex items-center space-x-2 text-sm text-[#64748b]">
                  <CheckCircle className="h-4 w-4 text-[#10b981]" />
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
