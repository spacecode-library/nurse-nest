
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import ClientDashboard from "@/components/dashboard/ClientDashboard";
import NurseDashboard from "@/components/dashboard/NurseDashboard";
import AccountSettings from "@/components/dashboard/AccountSettings";
import { UserProfile } from "@/types/dashboard";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userRole, setUserRole] = useState<"nurse" | "client" | null>(null);
  
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
        // Fetch from nurse_profiles first
        const { data: nurseProfile, error: nurseError } = await supabase
          .from('nurse_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        if (nurseProfile) {
          setUserRole('nurse');
          setProfile({
            id: user.id,
            first_name: nurseProfile.first_name,
            last_name: nurseProfile.last_name,
            email: user.email || '',
            role: 'nurse',
            bio: nurseProfile.bio || '' // Use the bio field if available
          });
          return;
        }
        
        // If not a nurse, check if client
        const { data: clientProfile, error: clientError } = await supabase
          .from('client_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        if (clientProfile) {
          setUserRole('client');
          setProfile({
            id: user.id,
            first_name: clientProfile.first_name,
            last_name: clientProfile.last_name,
            email: user.email || '',
            role: 'client',
            bio: '' // Clients might not have bio field
          });
          return;
        }
        
        // Fallback for demo purposes if no profile exists yet
        // In a real app, you might want to redirect to a profile creation page
        if (!nurseProfile && !clientProfile) {
          setUserRole(user.email?.includes('nurse') ? 'nurse' : 'client');
          setProfile({
            id: user.id,
            first_name: 'Demo',
            last_name: 'User',
            email: user.email || '',
            role: user.email?.includes('nurse') ? 'nurse' : 'client',
            bio: '' // Default empty bio
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    
    fetchProfile();
  }, [user]);

  if (loading || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-light">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand-navy border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg text-brand-gray">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-light">
      <div className="main-navigation">
        <Navbar />
      </div>
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container-custom max-w-6xl">
          {/* Welcome Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 padding-md">
            <div>
              <h1 className="heading-primary text-brand-navy">
                Welcome, {profile.first_name || 'User'}
              </h1>
              <p className="text-body text-brand-gray mt-2">
                Dashboard • <span className="font-medium text-brand-navy capitalize">{userRole}</span>
              </p>
            </div>
            <Button className="mt-4 md:mt-0">
              Edit Account Details
            </Button>
          </div>
          
          {/* Role-specific content */}
          {userRole === 'client' && <ClientDashboard />}
          {userRole === 'nurse' && <NurseDashboard />}
          
          {/* Account Settings - shown for all roles */}
          {profile && userRole && <AccountSettings profile={profile} userRole={userRole} />}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
