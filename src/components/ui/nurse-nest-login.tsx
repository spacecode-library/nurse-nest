
import React, { useState } from 'react';
import { SunIcon as Sunburst, Eye, EyeOff, Mail, LockKeyhole } from "lucide-react";

interface NurseNestLoginProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  loading: boolean;
  error: string | null;
  isLogin: boolean;
  setIsLogin: (isLogin: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  onForgotPassword: () => void;
}

export const NurseNestLogin = ({
  email,
  setEmail,
  password,
  setPassword,
  loading,
  error,
  isLogin,
  setIsLogin,
  onSubmit,
  onForgotPassword
}: NurseNestLoginProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden p-4">
      <div className="w-full relative max-w-5xl overflow-hidden flex flex-col md:flex-row shadow-xl rounded-3xl">
        {/* Left side - Image */}
        <div className="bg-black text-white p-8 md:p-12 md:w-1/2 relative rounded-bl-3xl overflow-hidden">
          {/* Background image will be added here - no text overlay */}
          <div className="w-[15rem] h-[15rem] bg-[#9bcbff] absolute z-1 rounded-full bottom-0 left-0"></div>
          <div className="w-[8rem] h-[5rem] bg-white absolute z-1 rounded-full bottom-10 left-20"></div>
        </div>
 
        {/* Right side - Form */}
        <div className="p-8 md:p-12 md:w-1/2 flex flex-col bg-white">
          <div className="flex flex-col items-left mb-8">
            <div className="text-[#9bcbff] mb-4">
              <Sunburst className="h-10 w-10" />
            </div>
            <h2 className="text-3xl font-medium mb-2 tracking-tight text-gray-900">
              {isLogin ? 'Welcome Back' : 'Get Started'}
            </h2>
            <p className="text-left opacity-80 text-gray-600">
              {isLogin ? 'Sign in to your account' : 'Create your account'}
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}
 
          <form className="flex flex-col gap-4" onSubmit={onSubmit} noValidate>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm mb-2 text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  className="text-sm w-full py-2 pl-10 pr-3 border rounded-lg focus:outline-none focus:ring-1 bg-white text-black focus:ring-[#9bcbff] border-gray-300"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
 
            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="text-sm text-gray-700">
                  Password
                </label>
                {isLogin && (
                  <button
                    type="button"
                    className="text-sm text-[#9bcbff] hover:text-[#8bb9ee] font-medium transition-colors"
                    onClick={onForgotPassword}
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <LockKeyhole className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter your password"
                  className="text-sm w-full py-2 pl-10 pr-10 border rounded-lg focus:outline-none focus:ring-1 bg-white text-black focus:ring-[#9bcbff] border-gray-300"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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
            {isLogin && (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-[#9bcbff] rounded border-gray-300 focus:ring-[#9bcbff]"
                />
                <label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer">
                  Remember me for 30 days
                </label>
              </div>
            )}
 
            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#9bcbff] hover:bg-[#8bb9ee] text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
 
            {/* Toggle Login/Signup */}
            <div className="text-center text-gray-600 text-sm">
              {isLogin ? (
                <>
                  Don't have an account?{" "}
                  <button
                    type="button"
                    className="text-[#9bcbff] font-medium hover:text-[#8bb9ee] transition-colors"
                    onClick={() => setIsLogin(false)}
                  >
                    Sign up for free
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="text-[#9bcbff] font-medium hover:text-[#8bb9ee] transition-colors"
                    onClick={() => setIsLogin(true)}
                  >
                    Sign in
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
