// src/components/DashboardRouter.tsx - Enhanced with better onboarding resume logic
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import NurseDashboard from './dashboard/NurseDashboard';
import ClientDashboard from './dashboard/ClientDashboard';
import AdminPortal from './AdminPortal';
import PendingApprovalPage from './PendingApprovalPage';
import { Loader2, Heart, CheckCircle, ArrowRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function DashboardRouter() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [userType, setUserType] = useState<string | null>(null);
  const [accountStatus, setAccountStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [onboardingStatus, setOnboardingStatus] = useState<{
    completed: boolean;
    percentage: number;
    step: number;
    userType: string;
  } | null>(null);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/auth');
        return;
      }
      
      // Check if this is an email verification redirect
      const emailConfirmed = searchParams.get('email_confirmed');
      const accessToken = searchParams.get('access_token');
      
      if (emailConfirmed === 'true' || accessToken) {
        handleEmailVerification();
      } else {
        getUserTypeAndStatus();
      }
    }
  }, [user, authLoading, navigate, searchParams]);

  const handleEmailVerification = async () => {
    try {
      // Show success message for email verification
      toast({
        title: "✅ Email verified!",
        description: "Your email has been successfully verified. Let's complete your profile.",
        variant: "default"
      });

      // Get user type and continue with onboarding
      await getUserTypeAndStatus(true);
    } catch (error) {
      console.error('Error handling email verification:', error);
      toast({
        title: "Verification Error",
        description: "There was an issue with email verification. Please try signing in.",
        variant: "destructive"
      });
      navigate('/auth');
    }
  };

  const getUserTypeAndStatus = async (fromEmailVerification = false) => {
    try {
      if (!user) return;

      // Get user type and account status from user_metadata table
      const { data: metadata, error } = await supabase
        .from('user_metadata')
        .select('user_type, account_status')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user metadata:', error);
        // If no metadata found, redirect to auth to complete registration
        navigate('/auth');
        return;
      }

      setUserType(metadata.user_type);
      setAccountStatus(metadata.account_status);
      
      // Handle routing based on user type and status
      await handleUserRouting(metadata.user_type, metadata.account_status, fromEmailVerification);
      
    } catch (error) {
      console.error('Error in getUserTypeAndStatus:', error);
      navigate('/auth');
    } finally {
      setLoading(false);
    }
  };

  const calculateCurrentStep = (percentage: number, totalSteps: number): number => {
    if (percentage === 0) return 0;
    const stepPercentage = 100 / totalSteps;
    return Math.floor(percentage / stepPercentage);
  };

  const handleUserRouting = async (userType: string, accountStatus: string, fromEmailVerification = false) => {
    try {
      switch (userType) {
        case 'nurse':
          const { data: nurseProfile } = await supabase
            .from('nurse_profiles')
            .select('onboarding_completed, onboarding_completion_percentage, first_name, last_name')
            .eq('user_id', user?.id)
            .single();

          if (!nurseProfile) {
            // No nurse profile exists, send to onboarding start
            setOnboardingStatus({
              completed: false,
              percentage: 0,
              step: 0,
              userType: 'nurse'
            });
            
            if (fromEmailVerification) {
              // Small delay to show verification success
              setTimeout(() => {
                navigate('/onboarding/nurse', { 
                  replace: true,
                  state: { fromEmailVerification: true }
                });
              }, 2000);
            } else {
              navigate('/onboarding/nurse', { replace: true });
            }
            return;
          }

          if (!nurseProfile.onboarding_completed) {
            // Calculate current step (6 total steps for nurse)
            const currentStep = calculateCurrentStep(nurseProfile.onboarding_completion_percentage, 6);
            
            setOnboardingStatus({
              completed: false,
              percentage: nurseProfile.onboarding_completion_percentage,
              step: currentStep,
              userType: 'nurse'
            });

            // Show resume message
            const stepNames = [
              'Personal Information',
              'Professional Qualifications', 
              'Work Preferences',
              'Documents & Verification',
              'Legal Agreements',
              'Review & Submit'
            ];

            toast({
              title: fromEmailVerification ? "Welcome back!" : "Continue your profile",
              description: `You can resume from step ${currentStep + 1}: ${stepNames[currentStep]}`,
              variant: "default"
            });

            if (fromEmailVerification) {
              setTimeout(() => {
                navigate('/onboarding/nurse', { 
                  replace: true,
                  state: { 
                    resumeOnboarding: true, 
                    progress: nurseProfile.onboarding_completion_percentage,
                    currentStep: currentStep,
                    fromEmailVerification: true
                  }
                });
              }, 2000);
            } else {
              navigate('/onboarding/nurse', { 
                replace: true,
                state: { 
                  resumeOnboarding: true, 
                  progress: nurseProfile.onboarding_completion_percentage,
                  currentStep: currentStep
                }
              });
            }
            return;
          }

          // Onboarding completed, check approval status
          if (accountStatus !== 'active') {
            return; // Will show pending approval page
          }

          // Fully approved - dashboard will render
          break;

        case 'client':
          const { data: clientProfile } = await supabase
            .from('client_profiles')
            .select('onboarding_completed, onboarding_completion_percentage, first_name, last_name')
            .eq('user_id', user?.id)
            .single();

          if (!clientProfile) {
            setOnboardingStatus({
              completed: false,
              percentage: 0,
              step: 0,
              userType: 'client'
            });

            if (fromEmailVerification) {
              setTimeout(() => {
                navigate('/onboarding/client', { 
                  replace: true,
                  state: { fromEmailVerification: true }
                });
              }, 2000);
            } else {
              navigate('/onboarding/client', { replace: true });
            }
            return;
          }

          if (!clientProfile.onboarding_completed) {
            // Calculate current step (7 total steps for client)
            const currentStep = calculateCurrentStep(clientProfile.onboarding_completion_percentage, 7);
            
            setOnboardingStatus({
              completed: false,
              percentage: clientProfile.onboarding_completion_percentage,
              step: currentStep,
              userType: 'client'
            });

            const stepNames = [
              'Client Type',
              'Personal Information',
              'Care Location', 
              'Care Needs',
              'Payment Info',
              'Legal Agreements',
              'Review & Submit'
            ];

            toast({
              title: fromEmailVerification ? "Welcome back!" : "Continue your profile",
              description: `You can resume from step ${currentStep + 1}: ${stepNames[currentStep]}`,
              variant: "default"
            });

            if (fromEmailVerification) {
              setTimeout(() => {
                navigate('/onboarding/client', { 
                  replace: true,
                  state: { 
                    resumeOnboarding: true, 
                    progress: clientProfile.onboarding_completion_percentage,
                    currentStep: currentStep,
                    fromEmailVerification: true
                  }
                });
              }, 2000);
            } else {
              navigate('/onboarding/client', { 
                replace: true,
                state: { 
                  resumeOnboarding: true, 
                  progress: clientProfile.onboarding_completion_percentage,
                  currentStep: currentStep
                }
              });
            }
            return;
          }

          // Client onboarding completed - dashboard will render
          break;

        case 'admin':
          // Admin users go directly to admin portal
          break;

        default:
          navigate('/auth', { replace: true });
          break;
      }
    } catch (error) {
      console.error('Error in handleUserRouting:', error);
      navigate('/auth');
    }
  };

  // Enhanced loading screen with onboarding status
  if (authLoading || loading) {
    const isEmailVerification = searchParams.get('email_confirmed') === 'true' || searchParams.get('access_token');
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto p-6">
          <div className="relative">
            <div className="w-20 h-20 bg-white rounded-full shadow-xl mx-auto flex items-center justify-center border border-blue-100">
              {isEmailVerification ? (
                <CheckCircle className="w-8 h-8 text-green-600" />
              ) : (
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              )}
            </div>
            {!isEmailVerification && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Heart className="w-6 h-6 text-blue-600 animate-pulse" fill="currentColor" />
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            {isEmailVerification ? (
              <>
                <h3 className="text-xl font-semibold text-green-900">Email Verified!</h3>
                <p className="text-green-700">
                  Great! Your email has been verified. Redirecting you to continue your profile setup.
                </p>
              </>
            ) : onboardingStatus && !onboardingStatus.completed ? (
              <>
                <h3 className="text-xl font-semibold text-gray-900">Welcome back!</h3>
                <p className="text-gray-600">
                  Preparing to resume your {onboardingStatus.userType} profile setup from step {onboardingStatus.step + 1}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${onboardingStatus.percentage}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500">{onboardingStatus.percentage}% completed</p>
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold text-gray-900">Preparing your workspace</h3>
                <p className="text-gray-600">
                  Setting up your personalized healthcare management experience
                </p>
              </>
            )}
          </div>
          
          {isEmailVerification && (
            <div className="flex items-center justify-center text-green-600">
              <ArrowRight className="w-5 h-5 animate-pulse" />
              <span className="ml-2 text-sm">Continuing to profile setup...</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Special case: Nurse with completed onboarding but not approved
  if (userType === 'nurse' && accountStatus !== 'active') {
    return <PendingApprovalPage />;
  }

  // Render the appropriate dashboard component based on user type
  switch (userType) {
    case 'nurse':
      return <NurseDashboard />;
    case 'admin':
      return <AdminPortal />;
    case 'client':
      return <ClientDashboard />;
    default:
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
          <div className="text-center space-y-4 max-w-md mx-auto p-6">
            <div className="w-16 h-16 bg-red-100 rounded-full mx-auto flex items-center justify-center">
              <Heart className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Account Access Issue
            </h2>
            <p className="text-gray-600">
              We're unable to determine your account type. Please sign in again to continue.
            </p>
            <button
              onClick={() => navigate('/auth')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Return to Sign In
            </button>
          </div>
        </div>
      );
  }
}