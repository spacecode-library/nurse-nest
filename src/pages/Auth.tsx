import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { signIn, signUp, getCurrentUser } from '@/supabase/auth/authService';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { NurseNestLogin } from '@/components/ui/nurse-nest-login';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userType, setUserType] = useState<'nurse' | 'client' | 'admin'>('client');
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
      if (isLogin) {
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
      } else {
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
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  const handleForgotPassword = () => {
    navigate('/auth/reset-password');
  };
  
  return (
    <div className="min-h-screen bg-white relative">
      {/* Navbar */}
      <div className="sticky top-0 z-50 w-full">
        <div 
          className="backdrop-blur-lg bg-white/10 border-b border-white/20"
          style={{ 
            backdropFilter: 'blur(10px)',
            background: 'rgba(255, 255, 255, 0.1)'
          }}
        >
          <Navbar />
        </div>
      </div>
      
      {/* Main Login Component */}
      <main className="flex min-h-screen pt-0">
        <NurseNestLogin
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          loading={loading}
          error={error}
          isLogin={isLogin}
          setIsLogin={setIsLogin}
          onSubmit={handleSubmit}
          onForgotPassword={handleForgotPassword}
        />
      </main>
    </div>
  );
}
