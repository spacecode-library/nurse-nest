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
import { signIn, signUp, getCurrentUser, getUserTypeAndStatus } from '@/supabase/auth/authService';

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
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registeredUserType, setRegisteredUserType] = useState<string>('');
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Check if user is already authenticated or if this is email verification
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await getCurrentUser();
        if (data?.user) {
          console.log('User already authenticated, checking metadata...');
          const { userType, onboardingCompleted, error: metaError } = await getUserTypeAndStatus();
          
          if (metaError) {
            console.error('Error getting user metadata:', metaError);
            // Let them stay on auth page to handle the issue
            return;
          }
          
          if (userType === 'admin') {
            navigate('/admin');
          } else if (onboardingCompleted) {
            navigate('/dashboard');
          } else {
            // User exists but hasn't completed onboarding
            if (userType === 'nurse') {
              navigate('/onboarding/nurse');
            } else if (userType === 'client') {
              navigate('/onboarding/client');
            } else {
              navigate('/dashboard');
            }
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
          console.log('Login successful, getting user metadata...');
          const { userType, onboardingCompleted, accountStatus, error: metaError } = await getUserTypeAndStatus();
          
          if (metaError) {
            console.error('Error getting user metadata after login:', metaError);
            toast({
              title: "Account Setup Required",
              description: "There was an issue accessing your account. Please try again or contact support.",
              variant: "destructive"
            });
            return;
          }
          
          // Check account status
          if (accountStatus === 'suspended') {
            toast({
              title: "Account Suspended",
              description: "Your account has been suspended. Please contact support.",
              variant: "destructive"
            });
            return;
          } else if (accountStatus === 'pending') {
            toast({
              title: "Account Pending Approval",
              description: "Your account is pending approval. You will be notified once approved.",
              variant: "default"
            });
            // Still allow access to dashboard for pending users
          }

          toast({
            title: "Welcome back!",
            description: "Successfully signed in to your account.",
          });
          
          // Route based on user type and onboarding status
          if (userType === 'admin') {
            navigate('/admin');
          } else if (onboardingCompleted) {
            navigate('/dashboard');
          } else {
            // Redirect to appropriate onboarding
            if (userType === 'nurse') {
              navigate('/onboarding/nurse');
            } else if (userType === 'client') {
              navigate('/onboarding/client');
            } else {
              navigate('/dashboard');
            }
          }
        }
      } else {
        // Handle signup - Validation
        if (!firstName.trim() || !lastName.trim()) {
          setError('First name and last name are required');
          toast({
            title: "Missing Information",
            description: "Please enter your first and last name.",
            variant: "destructive"
          });
          return;
        }

        if (password.length < 6) {
          setError('Password must be at least 6 characters long');
          toast({
            title: "Password Too Short",
            description: "Password must be at least 6 characters long.",
            variant: "destructive"
          });
          return;
        }

        const metadata = {
          first_name: firstName.trim(),
          last_name: lastName.trim()
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
          // Show success state instead of immediate redirect
          setRegistrationSuccess(true);
          setRegisteredUserType(userType);
          
          toast({
            title: "Account created successfully!",
            description: userType === 'admin' 
              ? "Admin account created successfully!" 
              : "Welcome! Please check your email to verify your account and then login to complete your profile.",
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

  // Show registration success page
  if (registrationSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="space-y-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            
            <div className="space-y-3">
              <h1 className="text-2xl font-bold text-gray-900">
                Account Created Successfully!
              </h1>
              <p className="text-gray-600">
                {registeredUserType === 'admin' 
                  ? "Your admin account has been created and you can now sign in."
                  : "We've sent a verification email to your inbox. Please check your email and click the verification link to activate your account."
                }
              </p>
            </div>

            {registeredUserType !== 'admin' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2 text-blue-800">
                  <Mail className="w-5 h-5" />
                  <span className="font-medium">Next Steps:</span>
                </div>
                <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside text-left">
                  <li>Check your email inbox (and spam folder)</li>
                  <li>Click the verification link in the email</li>
                  <li>Return here to sign in and complete your profile</li>
                </ol>
              </div>
            )}

            <div className="space-y-3">
              <Button
                onClick={() => {
                  setRegistrationSuccess(false);
                  setIsLogin(true);
                  setEmail('');
                  setPassword('');
                  setFirstName('');
                  setLastName('');
                }}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Continue to Sign In
              </Button>
              
              <p className="text-sm text-gray-500">
                Didn't receive the email? Check your spam folder or{' '}
                <button
                  onClick={() => setRegistrationSuccess(false)}
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  try again
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6">
        <Link to="/" className="flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-blue-600 hover:text-blue-700">Back to Home</span>
        </Link>
      </nav>

      {/* Main Content */}
      <div className="flex items-center justify-center px-4 pb-12">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              {isLogin ? (
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <LockKeyhole className="w-8 h-8 text-blue-600" />
                </div>
              ) : (
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-green-600" />
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">
                {isLogin ? 'Welcome Back' : 'Create Your Account'}
              </h1>
              <p className="text-gray-600">
                {isLogin 
                  ? 'Sign in to access your dashboard and continue your journey'
                  : 'Join Nurse Nest and start your healthcare staffing journey'
                }
              </p>
            </div>
          </div>

          {/* Auth Form */}
          <Card className="shadow-lg border-0">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* User Type Selection - Only for signup */}
                {!isLogin && (
                  <div className="space-y-3">
                    <Label className="text-base font-medium">I am a:</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setUserType('client')}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          userType === 'client'
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <HeartHandshake className="w-6 h-6 mx-auto mb-2" />
                        <div className="text-sm font-medium">Client</div>
                        <div className="text-xs text-gray-500">Need care services</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setUserType('nurse')}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          userType === 'nurse'
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Stethoscope className="w-6 h-6 mx-auto mb-2" />
                        <div className="text-sm font-medium">Nurse</div>
                        <div className="text-xs text-gray-500">Provide care services</div>
                      </button>
                    </div>
                  </div>
                )}

                {/* Name fields - Only for signup */}
                {!isLogin && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        placeholder="Enter first name"
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        placeholder="Enter last name"
                        className="h-12"
                      />
                    </div>
                  </div>
                )}

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
                    className="h-12"
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder={isLogin ? "Enter your password" : "Create a password (min. 6 characters)"}
                      className="h-12 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-medium"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{isLogin ? 'Signing In...' : 'Creating Account...'}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </Button>

                {/* Forgot Password Link */}
                {isLogin && (
                  <div className="text-center">
                    <Link
                      to="/auth?reset=true"
                      className="text-sm text-blue-600 hover:text-blue-700 underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Toggle Auth Mode */}
          <div className="text-center space-y-4">
            <p className="text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={toggleMode}
              className="w-full border-2 hover:bg-gray-50"
            >
              {isLogin ? 'Create New Account' : 'Sign In Instead'}
            </Button>
          </div>

          {/* Terms Notice - Only for signup */}
          {!isLogin && (
            <div className="text-center text-xs text-gray-500 space-y-1">
              <p>
                By creating an account, you agree to complete the onboarding process
              </p>
              <p>
                where you will review and accept our{' '}
                <Link to="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}