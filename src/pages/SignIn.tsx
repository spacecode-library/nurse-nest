
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  AlertCircle, 
  LockKeyhole, 
  Mail, 
  Eye, 
  EyeOff,
  ArrowLeft,
  CheckCircle
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { signIn, getCurrentUser } from '@/supabase/auth/authService';
import { supabase } from '@/integrations/supabase/client';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

      {/* Right Side - Sign In Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h1>
            <p className="text-lg text-gray-600">Your trusted healthcare community awaits</p>
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
                  className="h-12 pl-10 border-gray-200 focus:border-[#9bcbff] rounded-lg bg-white"
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
                <button
                  type="button"
                  className="text-sm text-[#9bcbff] hover:text-blue-700 font-medium transition-colors"
                  onClick={() => navigate('/auth/reset-password')}
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <LockKeyhole className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 pl-10 pr-10 border-gray-200 focus:border-[#9bcbff] rounded-lg bg-white"
                  required
                  placeholder="Enter your password"
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
            </div>
            
            {/* Remember Me Checkbox */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 text-[#9bcbff] rounded border-gray-300 focus:ring-[#9bcbff]"
              />
              <Label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer">
                Remember me for 30 days
              </Label>
            </div>
            
            {/* Sign In Button */}
            <Button
              className="w-full h-12 bg-[#9bcbff] hover:bg-[#7bb3ff] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
              disabled={loading}
              type="submit"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
          
          {/* Footer */}
          <div className="text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/sign-up"
                className="text-[#9bcbff] hover:text-blue-700 font-semibold transition-colors"
              >
                Sign up for free
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
