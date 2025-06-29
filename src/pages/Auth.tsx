import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { 
  AlertCircle, 
  LockKeyhole, 
  Mail, 
  Eye, 
  EyeOff,
  ArrowRight,
  CheckCircle,
  User,
  ArrowLeft,
  Clock,
  Stethoscope,
  HeartHandshake
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { signIn, signUp, getCurrentUser } from '@/supabase/auth/authService';
import { supabase } from '@/integrations/supabase/client';
import ClickwrapAgreement from '@/components/ui/ClickwrapAgreement';

export default function Auth() {
  // Form state
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userType, setUserType] = useState<'nurse' | 'client' | 'admin'>('client');
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registeredUserType, setRegisteredUserType] = useState<string>('');
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Check if user is already authenticated or if this is email verification
  useEffect(() => {
    const checkSession = async () => {
      // Check for email verification parameters
      const emailConfirmed = searchParams.get('email_confirmed');
      const accessToken = searchParams.get('access_token');
      
      // if (emailConfirmed === 'true' || accessToken) {
      //   // This is an email verification redirect - let DashboardRouter handle it
      //   navigate('/dashboard', { replace: true });
      //   return;
      // }

      // Check for existing session
      try {
        const { data } = await getCurrentUser();
        if (data?.user) {
          // Try to get user metadata, but don't fail if it doesn't exist
          const { data: userMetadata } = await supabase
            .from('user_metadata')
            .select('user_type')
            .eq('user_id', data.user.id)
            .maybeSingle(); // Use maybeSingle() to avoid errors when no row exists
          
          if (userMetadata?.user_type === 'admin') {
            navigate('/admin');
          } else {
            navigate('/dashboard');
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
        // Continue to auth page if there's an error
      }
    };
    checkSession();
  }, [navigate, searchParams]);

  // Reset form when switching between login/signup
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
    setUserType('client');
    setShowTerms(false);
    setTermsAccepted(false);
    setRegistrationSuccess(false);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (isLogin) {
        // Handle login
        const { data, error } = await signIn(email, password);
        
        if (error) {
          setError(error.message);
          toast({
            title: "Login failed",
            description: error.message,
            variant: "destructive"
          });
        } else if (data?.user) {
          // Try to get user metadata, but don't fail if it doesn't exist
          try {
            const { data: userMetadata } = await supabase
              .from('user_metadata')
              .select('user_type')
              .eq('user_id', data.user.id)
              .maybeSingle();
            
            toast({
              title: "Welcome back!",
              description: "Successfully signed in to your account.",
            });
            
            if (userMetadata?.user_type === 'admin') {
              navigate('/admin');
            } else {
              navigate('/dashboard');
            }
          } catch (metadataError) {
            console.error('Error fetching user metadata on login:', metadataError);
            // Still proceed to dashboard - DashboardRouter will handle missing metadata
            navigate('/dashboard');
          }
        }
      } else {
        // Handle signup - check if terms need to be accepted first
        if (!termsAccepted) {
          setShowTerms(true);
          setLoading(false);
          return;
        }

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
          
          // Show success state instead of immediate redirect
          setRegistrationSuccess(true);
          setRegisteredUserType(userType);
          
          toast({
            title: "Account created successfully!",
            description: userType === 'admin' 
              ? "Admin account created successfully!" 
              : "Welcome! Please check your email to verify your account and complete your profile.",
          });
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError('An unexpected error occurred. Please try again.');
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle terms acceptance
  const handleTermsAccepted = (accepted: boolean) => {
    setTermsAccepted(accepted);
    if (accepted) {
      setShowTerms(false);
      // Automatically submit the form after terms are accepted
      handleSubmit(new Event('submit') as any);
    }
  };

  // Registration success screen
  if (registrationSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4">
                  {registeredUserType === 'nurse' ? (
                    <Stethoscope className="h-8 w-8 text-green-600" />
                  ) : (
                    <HeartHandshake className="h-8 w-8 text-green-600" />
                  )}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Welcome to Nurse<span className="text-sky-500">Nest</span>!
                </h2>
                <p className="text-gray-600">
                  Your account has been created successfully.
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-left">
                      <p className="font-semibold text-blue-900 text-sm">Check Your Email</p>
                      <p className="text-blue-700 text-sm">
                        We've sent a verification email to <strong>{email}</strong>. 
                        Click the link in the email to verify your account.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <ArrowRight className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div className="text-left">
                      <p className="font-semibold text-green-900 text-sm">Next Steps</p>
                      <p className="text-green-700 text-sm">
                        {registeredUserType === 'nurse' 
                          ? "After verifying your email, you'll complete your professional profile including licenses, certifications, and work preferences."
                          : "After verifying your email, you'll set up your care needs and preferences to find the perfect nursing professional."
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() => navigate('/dashboard')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Continue to Profile Setup
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => setRegistrationSuccess(false)}
                  className="w-full"
                >
                  Back to Sign In
                </Button>
              </div>

              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">
                  Didn't receive the email? Check your spam folder or{' '}
                  <button 
                    className="text-blue-600 hover:text-blue-700 font-medium"
                    onClick={() => {
                      // Could implement resend email functionality here
                      toast({
                        title: "Email resent",
                        description: "We've sent another verification email to your inbox.",
                      });
                    }}
                  >
                    resend verification email
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show terms of service for signup
  if (showTerms && !isLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <div className="mb-6 flex items-center">
            <Button
              variant="ghost"
              onClick={() => setShowTerms(false)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Sign Up</span>
            </Button>
          </div>
          
          <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
            <CardContent className="p-8">
              <ClickwrapAgreement
                userType={userType}
                onAllAccepted={handleTermsAccepted}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">N</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">
                Nurse<span className="text-sky-500">Nest</span>
              </span>
            </div>
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isLogin ? 'Welcome back!' : 'Create your account'}
          </h1>
          <p className="text-gray-600">
            {isLogin 
              ? 'Sign in to access your healthcare community' 
              : 'Join the trusted healthcare marketplace'
            }
          </p>
        </div>

        {/* Main Form Card */}
        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          <CardContent className="p-8">
            {/* Error Display */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Fields - Only for Signup */}
              {!isLogin && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-gray-700 font-medium">
                      First Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="firstName"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="h-11 pl-10 border-gray-200 focus:border-blue-500 rounded-lg bg-white"
                        required={!isLogin}
                        placeholder="First name"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-gray-700 font-medium">
                      Last Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="lastName"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="h-11 pl-10 border-gray-200 focus:border-blue-500 rounded-lg bg-white"
                        required={!isLogin}
                        placeholder="Last name"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* User Type - Only for Signup */}
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="userType" className="text-gray-700 font-medium">
                    I am a...
                  </Label>
                  <select
                    id="userType"
                    value={userType}
                    onChange={(e) => setUserType(e.target.value as 'nurse' | 'client' | 'admin')}
                    className="w-full h-11 px-3 border border-gray-200 focus:border-blue-500 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    required={!isLogin}
                  >
                    <option value="client">Client looking for nursing care</option>
                    <option value="nurse">Nurse seeking opportunities</option>
                    <option value="admin">Administrator</option>
                  </select>
                  
                  {/* User type descriptions */}
                  <div className="mt-3 space-y-2">
                    {userType === 'client' && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-700">
                          <strong>Client Account:</strong> Find qualified nurses for yourself or a family member. 
                          Post your care needs and connect with verified healthcare professionals.
                        </p>
                      </div>
                    )}
                    {userType === 'nurse' && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-700">
                          <strong>Nurse Account:</strong> Join our network of healthcare professionals. 
                          Find flexible opportunities and connect with clients who need your expertise.
                        </p>
                      </div>
                    )}
                    {userType === 'admin' && (
                      <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                        <p className="text-sm text-purple-700">
                          <strong>Administrator Account:</strong> Manage the NurseNest platform, 
                          review applications, and oversee operations.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 pl-10 border-gray-200 focus:border-blue-500 rounded-lg bg-white"
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
                    <Link
                      to="/auth/reset-password"
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                      Forgot password?
                    </Link>
                  )}
                </div>
                <div className="relative">
                  <LockKeyhole className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 pl-10 pr-10 border-gray-200 focus:border-blue-500 rounded-lg bg-white"
                    required
                    placeholder="Enter your password"
                    minLength={!isLogin ? 8 : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {!isLogin && (
                  <p className="text-xs text-gray-500">
                    Must be at least 8 characters long
                  </p>
                )}
              </div>
              
              {/* Submit Button */}
              <Button
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
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
                    className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                    onClick={toggleMode}
                  >
                    Sign up for free
                  </button>
                </p>
              ) : (
                <p className="text-gray-600">
                  Already have an account?{' '}
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                    onClick={toggleMode}
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
                <span>SSL Secured & HIPAA Compliant</span>
              </div>
            </div>

            {/* Terms Notice for Signup */}
            {!isLogin && (
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  By creating an account, you agree to our{' '}
                  <Link to="/terms" className="text-blue-600 hover:text-blue-700">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-blue-600 hover:text-blue-700">
                    Privacy Policy
                  </Link>
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Links */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-gray-600 hover:text-gray-800 transition-colors flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
