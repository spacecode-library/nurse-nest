import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, getUserTypeAndStatus } from '@/supabase/auth/authService';
import { getNurseProfileByUserId } from '@/supabase/api/nurseProfileService';
import { getClientProfileByUserId } from '@/supabase/api/clientProfileService';
import { toast } from '@/hooks/use-toast';

// Import dashboard components
import NurseDashboard from './dashboard/NurseDashboard';
import ClientDashboard from './dashboard/ClientDashboard';
import PendingApprovalPage from './PendingApprovalPage';

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div className="text-center space-y-6">
      <div className="relative">
        <div className="w-16 h-16 bg-white rounded-full shadow-lg mx-auto flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full"></div>
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-gray-800">Loading your dashboard...</h3>
        <p className="text-gray-600">Setting up your personalized experience</p>
      </div>
    </div>
  </div>
);

export default function DashboardRouter() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState<string | null>(null);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [accountStatus, setAccountStatus] = useState<string>('active');

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        setLoading(true);

        // Check if user is authenticated
        const { data: userData, error: userError } = await getCurrentUser();
        
        if (userError || !userData?.user) {
          console.log('No authenticated user found, redirecting to auth');
          navigate('/auth', { replace: true });
          return;
        }

        console.log('Authenticated user found:', userData.user.id);

        // Get user type and status - FIXED: No longer passing userId parameter
        const { userType: type, accountStatus: status, onboardingCompleted: completed, error: metaError } = await getUserTypeAndStatus();
        
        if (metaError) {
          console.error('Error getting user metadata:', metaError);
          
          // If it's a PGRST116 error (no rows returned), this might be a new user
          if (metaError.code === 'PGRST116' || metaError.message?.includes('0 rows')) {
            console.log('No user metadata found, likely new user - redirecting to auth for re-setup');
            toast({
              title: "Account Setup Required",
              description: "Please complete your account setup to continue.",
              variant: "default"
            });
            navigate('/auth', { replace: true });
            return;
          }
          
          // For other errors, show error and redirect to auth
          toast({
            title: "Account Setup Required",
            description: "There was an issue accessing your account. Please sign up again to complete your account setup.",
            variant: "destructive"
          });
          navigate('/auth', { replace: true });
          return;
        }

        if (!type) {
          console.log('No user type found, redirecting to auth for setup');
          toast({
            title: "Account Setup Required",
            description: "Please complete your account setup to continue.",
            variant: "default"
          });
          navigate('/auth', { replace: true });
          return;
        }

        console.log('User metadata retrieved:', { type, status, completed });

        setUserType(type);
        setAccountStatus(status || 'active');
        setOnboardingCompleted(completed || false);

        // Handle different user flows based on type and completion status
        if (type === 'admin') {
          console.log('Admin user detected, redirecting to admin portal');
          navigate('/admin', { replace: true });
          return;
        }

        // Check if onboarding is completed
        if (!completed) {
          console.log('Onboarding not completed, redirecting to onboarding');
          // Route to appropriate onboarding
          if (type === 'nurse') {
            navigate('/onboarding/nurse', { replace: true });
          } else if (type === 'client') {
            navigate('/onboarding/client', { replace: true });
          }
          return;
        }

        // If nurse with pending status, show pending approval page
        if (type === 'nurse' && status === 'pending') {
          console.log('Nurse with pending status, checking profile completion');
          // Check if nurse profile exists and onboarding is actually completed
          const { data: nurseProfile, error: profileError } = await getNurseProfileByUserId(userData.user.id);
          
          if (profileError || !nurseProfile || !nurseProfile.onboarding_completed) {
            console.log('Nurse profile incomplete, redirecting to onboarding');
            navigate('/onboarding/nurse', { replace: true });
            return;
          }
          
          console.log('Nurse profile complete but pending approval, showing pending page');
          // Show pending approval page for nurses awaiting approval
          setLoading(false);
          return; // Stay on this component to show PendingApprovalPage
        }

        // Verify profile exists for completed onboarding
        if (type === 'nurse') {
          const { data: nurseProfile, error: profileError } = await getNurseProfileByUserId(userData.user.id);
          if (profileError || !nurseProfile) {
            console.log('Nurse profile missing, redirecting to onboarding');
            navigate('/onboarding/nurse', { replace: true });
            return;
          }
          
          // For nurses with active status, ensure they're actually approved
          if (status === 'active') {
            console.log('Active nurse, showing nurse dashboard');
          }
        } else if (type === 'client') {
          const { data: clientProfile, error: profileError } = await getClientProfileByUserId(userData.user.id);
          if (profileError || !clientProfile) {
            console.log('Client profile missing, redirecting to onboarding');
            navigate('/onboarding/client', { replace: true });
            return;
          }
          console.log('Client profile found, showing client dashboard');
        }

        // All checks passed, show appropriate dashboard
        console.log('All checks passed, showing dashboard for:', type);
        setLoading(false);

      } catch (error) {
        console.error('Error initializing dashboard:', error);
        toast({
          title: "Error",
          description: "Failed to load dashboard. Please try signing in again.",
          variant: "destructive"
        });
        navigate('/auth', { replace: true });
      }
    };

    initializeDashboard();
  }, [navigate]);

  // Show loading spinner while determining route
  if (loading) {
    return <LoadingSpinner />;
  }

  // Show pending approval page for nurses with pending status
  if (userType === 'nurse' && accountStatus === 'pending') {
    return <PendingApprovalPage />;
  }

  // Show appropriate dashboard based on user type
  if (userType === 'nurse') {
    return <NurseDashboard />;
  } else if (userType === 'client') {
    return <ClientDashboard />;
  }

  // Fallback - should not reach here
  console.error('Unknown user type or state:', { userType, accountStatus, onboardingCompleted });
  toast({
    title: "Error",
    description: "Unable to determine account type. Please sign in again.",
    variant: "destructive"
  });
  navigate('/auth', { replace: true });
  return <LoadingSpinner />;
}