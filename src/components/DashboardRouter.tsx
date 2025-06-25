// src/components/DashboardRouter.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import NurseDashboard from './dashboard/NurseDashboard';
import ClientDashboard from './dashboard/ClientDashboard';
import AdminPortal from './AdminPortal';
import PendingApprovalPage from './PendingApprovalPage';

export default function DashboardRouter() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [userType, setUserType] = useState<string | null>(null);
  const [accountStatus, setAccountStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/auth');
        return;
      }
      
      getUserTypeAndStatus();
    }
  }, [user, authLoading, navigate]);

  const getUserTypeAndStatus = async () => {
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
      await handleUserRouting(metadata.user_type, metadata.account_status);
      
    } catch (error) {
      console.error('Error in getUserTypeAndStatus:', error);
      navigate('/auth');
    } finally {
      setLoading(false);
    }
  };

  const handleUserRouting = async (userType: string, accountStatus: string) => {
    try {
      switch (userType) {
        case 'nurse':
          // Check if nurse has completed onboarding
          const { data: nurseProfile } = await supabase
            .from('nurse_profiles')
            .select('onboarding_completed')
            .eq('user_id', user?.id)
            .single();

          if (!nurseProfile) {
            // No nurse profile exists, send to onboarding
            navigate('/onboarding/nurse', { replace: true });
            return;
          }

          if (!nurseProfile.onboarding_completed) {
            // Onboarding not completed, send to onboarding
            navigate('/onboarding/nurse', { replace: true });
            return;
          }

          // Onboarding completed, check approval status
          if (accountStatus !== 'active') {
            // Onboarding done but not approved by admin - show pending page
            // Don't navigate, just let the component render the pending page
            return;
          }

          // Fully approved - redirect to nurse dashboard
          navigate('/dashboard/nurse', { replace: true });
          break;

        case 'client':
          
          const { data: clientProfile } = await supabase
            .from('client_profiles')
            .select('onboarding_completed')
            .eq('user_id', user?.id)
            .single();

          if(!clientProfile){
            navigate('/onboarding/client',{replace:true})
            return;
          }

          if(!clientProfile.onboarding_completed){
            navigate('/onboarding/client',{replace:true})
            return;
          }

          navigate('/dashboard/client', { replace: true });
          break;

        case 'admin':
          navigate('/admin', { replace: true });
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

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
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
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Access Denied
            </h2>
            <p className="text-gray-600 mb-4">
              Unable to determine your account type. Please sign in again.
            </p>
            <button
              onClick={() => navigate('/auth')}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Sign In
            </button>
          </div>
        </div>
      );
  }
}