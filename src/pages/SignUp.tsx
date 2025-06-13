
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
    } catch (error: any) {
      console.error('Auth error:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Architectural Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div 
          className="w-full h-full bg-cover bg-center relative"
          style={{
            backgroundImage: `url('/lovable-uploads/f3390946-3574-4e5c-8994-49d192f98a10.png')`
          }}
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/30"></div>
          
          {/* Return to Home Button */}
          <div className="absolute top-8 left-8 z-10">
            <Link to="/">
              <div className="relative group">
                {/* Glow effect */}
                <div className="absolute -inset-2 bg-white/50 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                
                {/* Button */}
                <Button
                  variant="ghost"
                  className="relative bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 hover:text-white transition-all duration-300 rounded-xl px-6 py-3 shadow-lg"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Return to Home
                </Button>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Sign Up Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Join Nurse Nest</h1>
            <p className="text-lg text-gray-600">Your healthcare journey starts here</p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* First Name & Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-gray-700 font-medium">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="h-11 border-gray-200 focus:border-[#9bcbff] rounded-lg bg-white"
                  required
                  placeholder="First name"
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
                  className="h-11 border-gray-200 focus:border-[#9bcbff] rounded-lg bg-white"
                  required
                  placeholder="Last name"
                />
              </div>
            </div>
            
            {/* User Type Selection */}
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
                  <div className={`flex items-center space-x-3 p-3 border-2 rounded-lg cursor-pointer transition-all hover:border-[#9bcbff] hover:bg-blue-50/50 ${
                    userType === 'client' 
                      ? 'border-[#9bcbff] bg-blue-50' 
                      : 'border-gray-200'
                  }`} onClick={() => setUserType('client')}>
                    <RadioGroupItem value="client" id="client" className="text-[#9bcbff]" />
                    <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                      <Building2 className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 text-sm">Client</div>
                      <div className="text-xs text-gray-600">I need nursing care services</div>
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <div className={`flex items-center space-x-3 p-3 border-2 rounded-lg cursor-pointer transition-all hover:border-[#9bcbff] hover:bg-blue-50/50 ${
                    userType === 'nurse' 
                      ? 'border-[#9bcbff] bg-blue-50' 
                      : 'border-gray-200'
                  }`} onClick={() => setUserType('nurse')}>
                    <RadioGroupItem value="nurse" id="nurse" className="text-[#9bcbff]" />
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                      <Stethoscope className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 text-sm">Healthcare Professional</div>
                      <div className="text-xs text-gray-600">I provide nursing care services</div>
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <div className={`flex items-center space-x-3 p-3 border-2 rounded-lg cursor-pointer transition-all hover:border-[#9bcbff] hover:bg-blue-50/50 ${
                    userType === 'admin' 
                      ? 'border-[#9bcbff] bg-blue-50' 
                      : 'border-gray-200'
                  }`} onClick={() => setUserType('admin')}>
                    <RadioGroupItem value="admin" id="admin" className="text-[#9bcbff]" />
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                      <Shield className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 text-sm flex items-center">
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
                  className="h-11 pl-10 border-gray-200 focus:border-[#9bcbff] rounded-lg bg-white"
                  required
                  placeholder="Enter your email"
                />
              </div>
            </div>
            
            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">
                Password
              </Label>
              <div className="relative">
                <LockKeyhole className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 pl-10 pr-10 border-gray-200 focus:border-[#9bcbff] rounded-lg bg-white"
                  required
                  placeholder="Create a password"
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
              <p className="text-xs text-gray-500">
                Must be at least 8 characters long
              </p>
            </div>
            
            {/* Create Account Button */}
            <Button
              className="w-full h-12 bg-[#9bcbff] hover:bg-[#7bb3ff] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
              disabled={loading}
              type="submit"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Creating account...</span>
                </div>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>
          
          {/* Footer */}
          <div className="text-center">
            <p className="text-gray-600">
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
            <div className="inline-flex items-center space-x-2 text-sm text-gray-500">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>SSL Secured</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
