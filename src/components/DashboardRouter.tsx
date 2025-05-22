// src/components/DashboardRouter.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import NurseDashboard from './dashboard/NurseDashboard';
import ClientDashboard from './dashboard/ClientDashboard';
import AdminPortal from './AdminPortal';

export default function DashboardRouter() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [userType, setUserType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/auth');
        return;
      }
      
      getUserType();
    }
  }, [user, authLoading, navigate]);

  const getUserType = async () => {
    try {
      if (!user) return;

      // Get user type from user_metadata table
      const { data: metadata, error } = await supabase
        .from('user_metadata')
        .select('user_type')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user metadata:', error);
        // If no metadata found, redirect to auth to complete registration
        navigate('/auth');
        return;
      }

      setUserType(metadata.user_type);
      
      // Redirect to specific dashboard based on user type
      switch (metadata.user_type) {
        case 'nurse':
          navigate('/dashboard/nurse', { replace: true });
          break;
        case 'client':
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
      console.error('Error in getUserType:', error);
      navigate('/auth');
    } finally {
      setLoading(false);
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

  // This component should redirect, so we shouldn't reach this point
  // But just in case, render based on user type
  switch (userType) {
    case 'nurse':
      return <NurseDashboard />;
    case 'admin':
      return <AdminPortal />;
    case 'client':
      return <ClientDashboard/>;
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