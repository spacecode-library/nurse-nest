import React from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  AlertCircle, LockKeyhole, Mail, Eye, EyeOff, Stethoscope, Building2, Shield, Sparkles, CheckCircle 
} from "lucide-react";
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { UserTypeSelector } from "./UserTypeSelector";

interface Props {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  userType: 'nurse' | 'client' | 'admin';
  loading: boolean;
  error: string | null;
  showPassword: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  setEmail: (v: string) => void;
  setPassword: (v: string) => void;
  setFirstName: (v: string) => void;
  setLastName: (v: string) => void;
  setUserType: (v: 'nurse' | 'client' | 'admin') => void;
  setShowPassword: (v: boolean) => void;
}

const SignUpDesktopCard: React.FC<Props> = ({
  email,
  password,
  firstName,
  lastName,
  userType,
  loading,
  error,
  showPassword,
  handleSubmit,
  setEmail,
  setPassword,
  setFirstName,
  setLastName,
  setUserType,
  setShowPassword
}) => (
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
      <div className="w-full py-6 px-8 space-y-4 relative z-10">
        <div className="text-center mb-0.5">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Join Nurse Nest</h1>
          <p className="text-base text-gray-600">Your healthcare journey starts here</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
            <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
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
          <div className="space-y-1.5">
            <Label className="text-gray-700 font-medium text-sm">
              I am a:
            </Label>
            <UserTypeSelector
              value={userType}
              onChange={setUserType}
              size="desktop"
            />
          </div>
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
        <div className="text-center mt-2">
          <p className="text-gray-600 text-sm mb-1">
            Already have an account?{' '}
            <a
              href="/sign-in"
              className="text-[#9bcbff] hover:text-blue-700 font-semibold transition-colors"
            >
              Sign in
            </a>
          </p>
          <div className="inline-flex items-center space-x-1 text-xs text-gray-500">
            <CheckCircle className="h-3 w-3 text-green-500" />
            <span>SSL Secured</span>
          </div>
        </div>
      </div>
    </Card>
  </div>
);

export default SignUpDesktopCard;
