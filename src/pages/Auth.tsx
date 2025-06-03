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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-teal-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-tr from-green-400/10 to-blue-400/10 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-400/5 to-teal-400/5 rounded-full blur-3xl"></div>
      </div>

      <Navbar />
      
      <main className="relative flex items-center justify-center min-h-screen pt-16 pb-8">
        <div className="w-full max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Side - Branding & Features */}
            <div className="hidden lg:flex flex-col justify-center space-y-8">
              {/* Premium Logo */}
              <div className="space-y-6">
                <div className="inline-flex items-center space-x-3">
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-700 to-teal-700 bg-clip-text text-transparent">
                      NurseNest
                    </h1>
                    <p className="text-slate-500 text-sm font-medium tracking-wide">Healthcare Platform</p>
                  </div>
                </div>
                
                <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 leading-tight">
                  {isLogin ? 'Welcome back to' : 'Join'} the future of 
                  <span className="block text-blue-600">healthcare connections</span>
                </h2>
                
                <p className="text-lg text-slate-600 leading-relaxed max-w-md">
                  {isLogin 
                    ? 'Access your secure dashboard and continue providing exceptional care.'
                    : 'Connect with verified healthcare professionals and clients in a trusted, HIPAA-compliant environment.'
                  }
                </p>
              </div>

              {/* Premium Features */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4 group">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <Shield className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Enterprise Security</h3>
                    <p className="text-sm text-slate-600">Bank-level encryption & HIPAA compliance</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 group">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <Award className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Verified Professionals</h3>
                    <p className="text-sm text-slate-600">Rigorous background checks & license verification</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 group">
                  <div className="w-10 h-10 bg-gradient-to-br from-teal-100 to-teal-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <Clock className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">24/7 Support</h3>
                    <p className="text-sm text-slate-600">Round-the-clock assistance when you need it</p>
                  </div>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center space-x-6 pt-4">
                <div className="flex items-center space-x-2 text-sm text-slate-500">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>SOC 2 Certified</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-slate-500">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>HIPAA Compliant</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-slate-500">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>256-bit SSL</span>
                </div>
              </div>
            </div>

            {/* Right Side - Premium Auth Form */}
            <div className="w-full max-w-md mx-auto lg:max-w-lg">
              <div className="relative">
                {/* Glassmorphism card */}
                <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                  
                  {/* Mobile Logo (visible on small screens) */}
                  <div className="lg:hidden text-center pt-8 pb-4">
                    <div className="inline-flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-teal-600 rounded-xl flex items-center justify-center">
                        <Heart className="h-4 w-4 text-white" />
                      </div>
                      <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent">
                        NurseNest
                      </h1>
                    </div>
                  </div>

                  {/* Form Header */}
                  <div className="relative px-8 pt-8 lg:pt-12 pb-6">
                    <div className="text-center space-y-3">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-teal-600 rounded-2xl shadow-xl flex items-center justify-center mx-auto">
                        {isLogin ? (
                          <LogIn className="h-8 w-8 text-white" />
                        ) : (
                          <UserPlus className="h-8 w-8 text-white" />
                        )}
                      </div>
                      
                      <div>
                        <h2 className="text-2xl lg:text-3xl font-bold text-slate-800">
                          {isLogin ? 'Welcome back' : 'Create account'}
                        </h2>
                        <p className="text-slate-600 mt-1">
                          {isLogin 
                            ? 'Sign in to access your dashboard' 
                            : 'Join our healthcare community'
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Form */}
                  <div className="px-8 pb-8">
                    {error && (
                      <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start space-x-3">
                        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <span className="text-red-700 text-sm">{error}</span>
                      </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {!isLogin && (
                        <>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="firstName" className="text-slate-700 font-medium text-sm">
                                First Name
                              </Label>
                              <Input
                                id="firstName"
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl bg-white/50"
                                required
                                placeholder="Enter first name"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="lastName" className="text-slate-700 font-medium text-sm">
                                Last Name
                              </Label>
                              <Input
                                id="lastName"
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl bg-white/50"
                                required
                                placeholder="Enter last name"
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <Label className="text-slate-700 font-medium text-sm">
                              I am a:
                            </Label>
                            <RadioGroup 
                              value={userType} 
                              onValueChange={(val) => setUserType(val as 'nurse' | 'client' | 'admin')}
                              className="space-y-3"
                            >
                              <div className="relative group">
                                <RadioGroupItem value="client" id="client" className="peer sr-only" />
                                <Label 
                                  htmlFor="client" 
                                  className="flex items-center space-x-4 p-4 border-2 border-slate-200 rounded-2xl hover:border-blue-300 hover:bg-blue-50/50 cursor-pointer transition-all peer-checked:border-blue-500 peer-checked:bg-blue-50 group-hover:shadow-lg"
                                >
                                  <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                                    <Building2 className="h-6 w-6 text-green-600" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="font-semibold text-slate-800">Client</div>
                                    <div className="text-sm text-slate-600">I need nursing care services</div>
                                  </div>
                                </Label>
                              </div>
                              
                              <div className="relative group">
                                <RadioGroupItem value="nurse" id="nurse" className="peer sr-only" />
                                <Label 
                                  htmlFor="nurse" 
                                  className="flex items-center space-x-4 p-4 border-2 border-slate-200 rounded-2xl hover:border-blue-300 hover:bg-blue-50/50 cursor-pointer transition-all peer-checked:border-blue-500 peer-checked:bg-blue-50 group-hover:shadow-lg"
                                >
                                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                                    <Stethoscope className="h-6 w-6 text-blue-600" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="font-semibold text-slate-800">Healthcare Professional</div>
                                    <div className="text-sm text-slate-600">I provide nursing care services</div>
                                  </div>
                                </Label>
                              </div>
                              
                              <div className="relative group">
                                <RadioGroupItem value="admin" id="admin" className="peer sr-only" />
                                <Label 
                                  htmlFor="admin" 
                                  className="flex items-center space-x-4 p-4 border-2 border-slate-200 rounded-2xl hover:border-blue-300 hover:bg-blue-50/50 cursor-pointer transition-all peer-checked:border-blue-500 peer-checked:bg-blue-50 group-hover:shadow-lg"
                                >
                                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                                    <Shield className="h-6 w-6 text-purple-600" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="font-semibold text-slate-800 flex items-center">
                                      Administrator
                                      <Sparkles className="h-4 w-4 ml-2 text-purple-600" />
                                    </div>
                                    <div className="text-sm text-slate-600">Platform administration</div>
                                  </div>
                                </Label>
                              </div>
                            </RadioGroup>
                          </div>
                        </>
                      )}
                      
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-slate-700 font-medium text-sm">
                          Email Address
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                          <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="h-12 pl-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl bg-white/50"
                            required
                            placeholder="Enter your email"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password" className="text-slate-700 font-medium text-sm">
                            Password
                          </Label>
                          {isLogin && (
                            <button
                              type="button"
                              className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                              onClick={() => navigate('/auth/reset-password')}
                            >
                              Forgot password?
                            </button>
                          )}
                        </div>
                        <div className="relative">
                          <LockKeyhole className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="h-12 pl-12 pr-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl bg-white/50"
                            required
                            placeholder="Enter your password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                        {!isLogin && (
                          <p className="text-xs text-slate-500 mt-1">
                            Must be at least 8 characters long
                          </p>
                        )}
                      </div>
                      
                      {isLogin && (
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="remember"
                            className="h-4 w-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                          />
                          <Label htmlFor="remember" className="text-sm text-slate-600 cursor-pointer">
                            Remember me for 30 days
                          </Label>
                        </div>
                      )}
                      
                      <Button
                        className="w-full h-12 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
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
                    
                    <div className="mt-8 text-center">
                      {isLogin ? (
                        <p className="text-slate-600">
                          Don't have an account?{' '}
                          <button
                            type="button"
                            className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                            onClick={() => {
                              setIsLogin(false);
                              setError(null);
                            }}
                          >
                            Sign up for free
                          </button>
                        </p>
                      ) : (
                        <p className="text-slate-600">
                          Already have an account?{' '}
                          <button
                            type="button"
                            className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
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

                    {userType === 'admin' && !isLogin && (
                      <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-2xl">
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

                    {/* Security badges */}
                    <div className="mt-8 pt-6 border-t border-slate-200">
                      <div className="flex items-center justify-center space-x-6 text-xs text-slate-500">
                        <div className="flex items-center space-x-1">
                          <Shield className="h-3 w-3 text-green-500" />
                          <span>SSL Secured</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <span>HIPAA Compliant</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Heart className="h-3 w-3 text-blue-500" />
                          <span>Trusted Platform</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating decorative elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-blue-400 to-teal-400 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-br from-green-400 to-blue-400 rounded-full opacity-20 animate-pulse delay-1000"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}