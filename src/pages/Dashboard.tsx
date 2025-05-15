
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import ClientDashboard from "@/components/dashboard/ClientDashboard";
import NurseDashboard from "@/components/dashboard/NurseDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import AccountSettings from "@/components/dashboard/AccountSettings";
import { UserProfile } from "@/types/dashboard";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userRole, setUserRole] = useState<"nurse" | "client" | "admin" | null>(null);
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        
        // Use the role from the database
        const role = data.role || 'client';
        setUserRole(role);
        setProfile({
          ...data,
          role: role
        });
        
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    
    fetchProfile();
  }, [user]);

  if (loading || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-nurse-dark border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container-custom max-w-6xl mx-auto px-4">
          {/* Welcome Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Welcome, {profile.first_name || 'User'}
              </h1>
              <p className="text-gray-600 mt-1">
                Dashboard • <span className="font-medium text-nurse-dark capitalize">{userRole}</span>
              </p>
            </div>
            <Button className="mt-4 md:mt-0 bg-nurse-dark hover:bg-primary-700">
              Edit Account Details
            </Button>
          </div>
          
          {/* Role-specific content */}
          {userRole === 'client' && <ClientDashboard profile={profile} />}
          {userRole === 'nurse' && <NurseDashboard profile={profile} />}
          {userRole === 'admin' && <AdminDashboard profile={profile} />}
          
          {/* Account Settings - shown for all roles */}
          <AccountSettings profile={profile} userRole={userRole} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
