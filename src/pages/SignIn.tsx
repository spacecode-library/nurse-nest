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
import DiagonalSplitBackground from '@/components/DiagonalSplitBackground';
import { Card, CardContent } from '@/components/ui/card';
import { OptimizedBackground } from '@/components/ui/optimized-background';
import DesktopSignInImage from '@/components/DesktopSignInImage';

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
    <div className="min-h-screen bg-white flex relative">

      {/* Diagonal split background, only mobile */}
      <div className="absolute inset-0 z-0 lg:hidden">
        <DiagonalSplitBackground />
      </div>

      {/* Mobile layout - Card design overlay */}
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
            transition-all duration-300
            backdrop-blur-md
            relative
          "
          style={{
            boxShadow:
              "0 12px 32px 0 rgba(30,41,59,0.10), 0 2px 8px 0 rgba(30,41,59,0.07), 0 1.5px 4px 0 rgba(20,20,40,0.07)",
            border: "1.25px solid rgba(155,203,255,0.16)",
            background: "rgba(255,255,255,0.95)",
            borderRadius: "1.25rem"
          }}
        >
          <CardContent className="p-0">
            <div className="w-full space-y-5">
              {/* Header */}
              <div className="text-center mb-1">
                <h1 className="text-xl font-bold text-gray-900 mb-0.5">Welcome back!</h1>
                <p className="text-sm text-gray-600">Your trusted healthcare community awaits</p>
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
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-gray-700 font-medium text-xs">
                      Password
                    </Label>
                    <button
                      type="button"
                      className="text-xs text-[#3989d1] hover:text-blue-700 font-medium"
                      onClick={() => navigate('/auth/reset-password')}
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <LockKeyhole className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-9 pl-9 pr-9 border-gray-200 focus:border-[#9bcbff] rounded-lg bg-white text-xs"
                      required
                      placeholder="Enter your password"
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
                </div>
                {/* Remember Me */}
                <div className="flex items-center space-x-2 pt-1">
                  <input
                    type="checkbox"
                    id="remember"
                    className="h-3 w-3 text-[#9bcbff] rounded border-gray-300"
                  />
                  <Label htmlFor="remember" className="text-xs text-gray-600 cursor-pointer">
                    Remember me for 30 days
                  </Label>
                </div>
                {/* Sign In Button */}
                <Button
                  className="w-full h-9 bg-[#9bcbff] hover:bg-[#7bb3ff] text-white font-semibold rounded-lg shadow-md text-xs"
                  disabled={loading}
                  type="submit"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
              {/* Footer */}
              <div className="text-center">
                <p className="text-gray-600 text-xs">
                  Don't have an account?{' '}
                  <Link
                    to="/sign-up"
                    className="text-[#9bcbff] hover:text-blue-700 font-semibold"
                  >
                    Sign up
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
      
      {/* Desktop Layout only visible at lg+ */}
      <div className="hidden lg:flex w-full">
        {/* Refactored: Desktop left-side image & overlay as its own component */}
        <DesktopSignInImage />

        {/* Right Side - Sign In Form */}
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
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back!</h1>
                <p className="text-base text-gray-600">Your trusted healthcare community awaits</p>
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
                      className="h-10 pl-9 border-gray-200 focus:border-[#9bcbff] rounded-lg bg-white text-sm"
                      required
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                
                {/* Password Field */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-gray-700 font-medium text-sm">
                      Password
                    </Label>
                    <button
                      type="button"
                      className="text-xs text-[#9bcbff] hover:text-blue-700 font-medium transition-colors"
                      onClick={() => navigate('/auth/reset-password')}
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <LockKeyhole className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-10 pl-9 pr-9 border-gray-200 focus:border-[#9bcbff] rounded-lg bg-white text-sm"
                      required
                      placeholder="Enter your password"
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
                </div>
                
                {/* Remember Me Checkbox */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="remember"
                    className="h-3 w-3 text-[#9bcbff] rounded border-gray-300 focus:ring-[#9bcbff]"
                  />
                  <Label htmlFor="remember" className="text-xs text-gray-600 cursor-pointer">
                    Remember me for 30 days
                  </Label>
                </div>
                
                {/* Sign In Button */}
                <Button
                  className="w-full h-10 bg-[#9bcbff] hover:bg-[#7bb3ff] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-sm"
                  disabled={loading}
                  type="submit"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
              
              {/* Footer */}
              <div className="text-center">
                <p className="text-gray-600 text-sm">
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
