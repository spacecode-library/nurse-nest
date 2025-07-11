import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  AlertCircle, LockKeyhole, Mail, Eye, EyeOff, Stethoscope, Building2, Shield, ArrowLeft, Sparkles, CheckCircle 
} from "lucide-react";
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Link } from "react-router-dom";
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

const SignUpMobileCard: React.FC<Props> = ({
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
  <div className="flex-1 flex flex-col lg:hidden items-center justify-center relative z-10">
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
          <div className="text-center mb-1">
            <h1 className="text-xl font-bold text-gray-900 mb-0.5">Join Nurse Nest</h1>
            <p className="text-sm text-gray-600">Your healthcare journey starts here</p>
          </div>
          {error && (
            <div className="p-2 bg-red-50 border border-red-200 rounded flex items-start space-x-2">
              <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
              <span className="text-red-700 text-xs">{error}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-3">
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
            <div className="space-y-1">
              <Label className="text-gray-700 font-medium text-xs">
                I am a:
              </Label>
              <UserTypeSelector
                value={userType}
                onChange={setUserType}
                size="mobile"
              />
            </div>
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
);

export default SignUpMobileCard;
// NOTE: This file is over 250 lines. You should consider asking me to break this file into smaller, more maintainable components.
