import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  ArrowLeft,
  Sparkles,
  CheckCircle
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { signUp, getCurrentUser } from '@/supabase/auth/authService';
import { supabase } from '@/integrations/supabase/client';
import { BeamsBackground } from '@/components/ui/beams-background';
import DiagonalSplitBackground from '@/components/DiagonalSplitBackground';
import { Card, CardContent } from '@/components/ui/card';
import DesktopSignInImage from "@/components/DesktopSignInImage";

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userType, setUserType] = useState<'nurse' | 'client' | 'admin'>('client');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
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
            : "Welcome! Let's set up your profile."
        });
        
        // Wait a moment for the auth state to update, then navigate
        setTimeout(() => {
          if (userType === 'nurse') {
            navigate('/onboarding/nurse');
          } else if (userType === 'client') {
            navigate('/onboarding/client');
          } else if (userType === 'admin') {
            navigate('/admin');
          }
        }, 1000);
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-white flex relative">
      {/* Diagonal background only for mobile */}
      <div className="absolute inset-0 z-0 lg:hidden">
        <DiagonalSplitBackground />
      </div>

      {/* Mobile - Card design overlay */}
      <div className="flex-1 flex flex-col lg:hidden items-center justify-center relative z-10">
        {/* Mobile Return to Home Button */}
        <div className="absolute top-6 left-4 z-20">
          <Link to="/">
            <Button
              variant="ghost"
              className="bg-white/90 border border-gray-200 text-gray-700 hover:bg-white hover:text-gray-900 rounded-xl px-4 py-2 shadow group"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Home
            </Button>
          </Link>
        </div>
        <Card
          className="
            w-full max-w-xs mx-auto mt-4 py-6 px-3 rounded-2xl 
            border border-white/60
            glass-card
            shadow-lg
            hover:scale-[1.025] transition-all duration-300
            backdrop-blur-md
            relative
            "
          style={{
            boxShadow:
              "0 12px 40px 0 rgba(40,131,201,0.14), 0 2px 8px 0 rgba(30,41,59,0.08), 0 0px 0.5px 0px #9bcbff55",
            border: "1.25px solid rgba(155,203,255,0.38)",
          }}
        >
          <CardContent className="p-0">
            <div className="w-full space-y-5">
              {/* Header */}
              <div className="text-center mb-1">
                <h1 className="text-xl font-bold text-gray-900 mb-0.5">Join Nurse Nest</h1>
                <p className="text-sm text-gray-600">Your healthcare journey starts here</p>
              </div>
              {/* Error Display */}
              {error && (
                <div className="p-2 bg-red-50 border border-red-200 rounded flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="text-red-700 text-xs">{error}</span>
                </div>
              )}
              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                {/* First Name & Last Name */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="firstName" className="text-gray-700 font-medium text-xs">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="h-9 border-gray-200 focus:border-[#9bcbff] rounded-lg bg-white text-xs"
                      required
                      placeholder="First name"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <Label htmlFor="lastName" className="text-gray-700 font-medium text-xs">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="h-9 border-gray-200 focus:border-[#9bcbff] rounded-lg bg-white text-xs"
                      required
                      placeholder="Last name"
                    />
                  </div>
                </div>
                {/* User Type Selection */}
                <div className="space-y-1">
                  <Label className="text-gray-700 font-medium text-xs">
                    I am a:
                  </Label>
                  <RadioGroup
                    value={userType}
                    onValueChange={(value: string) => setUserType(value as 'nurse' | 'client' | 'admin')}
                    className="space-y-1"
                  >
                    <div>
                      <div className={`flex items-center space-x-2 p-2 border rounded-lg cursor-pointer transition-all hover:border-[#9bcbff] hover:bg-blue-50/50 ${
                        userType === 'client' 
                          ? 'border-[#9bcbff] bg-blue-50' 
                          : 'border-gray-200'
                      }`}>
                        <RadioGroupItem value="client" id="client" className="text-[#9bcbff]" />
                        <Building2 className="h-4 w-4 text-green-600" />
                        <div>
                          <div className="font-medium text-gray-900 text-xs">Client</div>
                          <div className="text-[10px] text-gray-600">Needs care services</div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className={`flex items-center space-x-2 p-2 border rounded-lg cursor-pointer transition-all hover:border-[#9bcbff] hover:bg-blue-50/50 ${
                        userType === 'nurse' 
                          ? 'border-[#9bcbff] bg-blue-50' 
                          : 'border-gray-200'
                      }`}>
                        <RadioGroupItem value="nurse" id="nurse" className="text-[#9bcbff]" />
                        <Stethoscope className="h-4 w-4 text-blue-600" />
                        <div>
                          <div className="font-medium text-gray-900 text-xs">Professional</div>
                          <div className="text-[10px] text-gray-600">Care provider</div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className={`flex items-center space-x-2 p-2 border rounded-lg cursor-pointer transition-all hover:border-[#9bcbff] hover:bg-blue-50/50 ${
                        userType === 'admin' 
                          ? 'border-[#9bcbff] bg-blue-50' 
                          : 'border-gray-200'
                      }`}>
                        <RadioGroupItem value="admin" id="admin" className="text-[#9bcbff]" />
                        <Shield className="h-4 w-4 text-purple-600" />
                        <div>
                          <div className="font-medium text-gray-900 text-xs flex items-center">
                            Admin
                            <Sparkles className="h-3 w-3 ml-1 text-purple-600" />
                          </div>
                          <div className="text-[10px] text-gray-600">Admin access</div>
                        </div>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
                {/* Email Field */}
                <div className="space-y-0.5">
                  <Label htmlFor="email" className="text-gray-700 font-medium text-xs">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-9 pl-9 border-gray-200 focus:border-[#9bcbff] rounded-lg bg-white text-xs"
                      required
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                {/* Password Field */}
                <div className="space-y-0.5">
                  <Label htmlFor="password" className="text-gray-700 font-medium text-xs">
                    Password
                  </Label>
                  <div className="relative">
                    <LockKeyhole className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-9 pl-9 pr-9 border-gray-200 focus:border-[#9bcbff] rounded-lg bg-white text-xs"
                      required
                      placeholder="Create a password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-500">
                    Min. 8 characters
                  </p>
                </div>
                {/* Create Account Button */}
                <Button
                  className="w-full h-9 bg-[#9bcbff] hover:bg-[#7bb3ff] text-white font-semibold rounded-lg shadow-md text-xs"
                  disabled={loading}
                  type="submit"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Creating...</span>
                    </div>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>
              {/* Footer */}
              <div className="text-center">
                <p className="text-gray-600 text-xs">
                  Already have an account?{' '}
                  <Link
                    to="/sign-in"
                    className="text-[#9bcbff] hover:text-blue-700 font-semibold"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
              {/* Security Badge */}
              <div className="text-center">
                <div className="inline-flex items-center space-x-1 text-[10px] text-gray-500">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span>SSL Secured</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Desktop Layout - match SignIn visual style */}
      <div className="hidden lg:flex w-full">
        {/* Left Side - Architectural Image and Home button */}
        <DesktopSignInImage />

        {/* Right Side - Sign Up Form with 3D "glass" Card */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 overflow-hidden relative bg-white">
          <Card
            className={`
              w-full max-w-md mx-auto p-0
              border border-white/60 bg-white/95
              glass-card
              shadow-lg
              transition-all duration-300
              backdrop-blur-md
              relative
            `}
            style={{
              borderRadius: "1rem",
              boxShadow:
                "0 18px 48px 0 rgba(30,41,59,0.14), 0 4px 12px 0 rgba(30,41,59,0.10), 0 2px 8px 0 rgba(40,40,60,0.07)",
              border: "1.5px solid rgba(155,203,255,0.13)",
              background: "rgba(255,255,255,0.98)"
            }}
          >
            <div className="w-full py-10 px-8 space-y-6 relative z-10">
              {/* Header */}
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Join Nurse Nest</h1>
                <p className="text-base text-gray-600">Your healthcare journey starts here</p>
              </div>

              {/* Error Display */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                  <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="text-red-700 text-sm">{error}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* First Name & Last Name */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="firstName" className="text-gray-700 font-medium text-sm">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="h-9 border-gray-200 focus:border-[#9bcbff] rounded-lg bg-white text-sm"
                      required
                      placeholder="First name"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="lastName" className="text-gray-700 font-medium text-sm">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="h-9 border-gray-200 focus:border-[#9bcbff] rounded-lg bg-white text-sm"
                      required
                      placeholder="Last name"
                    />
                  </div>
                </div>
                {/* User Type Selection - Compact Design */}
                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium text-sm">
                    I am a:
                  </Label>
                  <RadioGroup 
                    value={userType} 
                    onValueChange={(value: string) => setUserType(value as 'nurse' | 'client' | 'admin')}
                    className="space-y-2"
                  >
                    <div className="relative">
                      <div className={`flex items-center space-x-2 p-2 border rounded-lg cursor-pointer transition-all hover:border-[#9bcbff] hover:bg-blue-50/50 ${
                        userType === 'client' 
                          ? 'border-[#9bcbff] bg-blue-50' 
                          : 'border-gray-200'
                      }`}>
                        <RadioGroupItem value="client" id="client" className="text-[#9bcbff]" />
                        <Building2 className="h-4 w-4 text-green-600" />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 text-sm">Client</div>
                          <div className="text-xs text-gray-600">I need nursing care services</div>
                        </div>
                      </div>
                    </div>
                    <div className="relative">
                      <div className={`flex items-center space-x-2 p-2 border rounded-lg cursor-pointer transition-all hover:border-[#9bcbff] hover:bg-blue-50/50 ${
                        userType === 'nurse' 
                          ? 'border-[#9bcbff] bg-blue-50' 
                          : 'border-gray-200'
                      }`}>
                        <RadioGroupItem value="nurse" id="nurse" className="text-[#9bcbff]" />
                        <Stethoscope className="h-4 w-4 text-blue-600" />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 text-sm">Healthcare Professional</div>
                          <div className="text-xs text-gray-600">I provide nursing care services</div>
                        </div>
                      </div>
                    </div>
                    <div className="relative">
                      <div className={`flex items-center space-x-2 p-2 border rounded-lg cursor-pointer transition-all hover:border-[#9bcbff] hover:bg-blue-50/50 ${
                        userType === 'admin' 
                          ? 'border-[#9bcbff] bg-blue-50' 
                          : 'border-gray-200'
                      }`}>
                        <RadioGroupItem value="admin" id="admin" className="text-[#9bcbff]" />
                        <Shield className="h-4 w-4 text-purple-600" />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 text-sm flex items-center">
                            Administrator
                            <Sparkles className="h-3 w-3 ml-1 text-purple-600" />
                          </div>
                          <div className="text-xs text-gray-600">Platform administration</div>
                        </div>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
                {/* Email Field */}
                <div className="space-y-1">
                  <Label htmlFor="email" className="text-gray-700 font-medium text-sm">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-9 pl-9 border-gray-200 focus:border-[#9bcbff] rounded-lg bg-white text-sm"
                      required
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                {/* Password Field */}
                <div className="space-y-1">
                  <Label htmlFor="password" className="text-gray-700 font-medium text-sm">
                    Password
                  </Label>
                  <div className="relative">
                    <LockKeyhole className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-9 pl-9 pr-9 border-gray-200 focus:border-[#9bcbff] rounded-lg bg-white text-sm"
                      required
                      placeholder="Create a password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Must be at least 8 characters long
                  </p>
                </div>
                {/* Create Account Button */}
                <Button
                  className="w-full h-10 bg-[#9bcbff] hover:bg-[#7bb3ff] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-sm"
                  disabled={loading}
                  type="submit"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Creating account...</span>
                    </div>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>
              
              {/* Footer */}
              <div className="text-center">
                <p className="text-gray-600 text-sm">
                  Already have an account?{' '}
                  <Link
                    to="/sign-in"
                    className="text-[#9bcbff] hover:text-blue-700 font-semibold transition-colors"
                  >
                    Sign in
                  </Link>
                </p>
              </div>

              {/* Security Badge */}
              <div className="text-center">
                <div className="inline-flex items-center space-x-2 text-xs text-gray-500">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span>SSL Secured</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
