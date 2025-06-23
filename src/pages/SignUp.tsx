import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { signUp, getCurrentUser } from '@/supabase/auth/authService';
import { supabase } from '@/integrations/supabase/client';
import DiagonalSplitBackground from '@/components/DiagonalSplitBackground';
import DesktopSignInImage from "@/components/DesktopSignInImage";
import SignUpDesktopCard from '@/components/auth/SignUpDesktopCard';
import SignUpMobileCard from '@/components/auth/SignUpMobileCard';

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
      {/* Mobile sign up card */}
      <SignUpMobileCard
        email={email}
        password={password}
        firstName={firstName}
        lastName={lastName}
        userType={userType}
        loading={loading}
        error={error}
        showPassword={showPassword}
        handleSubmit={handleSubmit}
        setEmail={setEmail}
        setPassword={setPassword}
        setFirstName={setFirstName}
        setLastName={setLastName}
        setUserType={setUserType}
        setShowPassword={setShowPassword}
      />
      {/* Desktop layout */}
      <div className="hidden lg:flex w-full">
        {/* Left-side image and home button */}
        <DesktopSignInImage />
        {/* Desktop sign up card */}
        <SignUpDesktopCard
          email={email}
          password={password}
          firstName={firstName}
          lastName={lastName}
          userType={userType}
          loading={loading}
          error={error}
          showPassword={showPassword}
          handleSubmit={handleSubmit}
          setEmail={setEmail}
          setPassword={setPassword}
          setFirstName={setFirstName}
          setLastName={setLastName}
          setUserType={setUserType}
          setShowPassword={setShowPassword}
        />
      </div>
    </div>
  );
}
