
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { RefreshCw, LogOut } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { signOut } from '@/supabase/auth/authService';

export default function ActionButtons() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(false);

  const checkApprovalStatus = async () => {
    if (!user?.id) return;

    setChecking(true);
    try {
      const { data: userMetadata, error } = await supabase
        .from('user_metadata')
        .select('account_status')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error checking approval status:', error);
        toast({
          title: "Error checking status",
          description: "Unable to check your approval status. Please try again.",
          variant: "destructive"
        });
        return;
      }

      if (userMetadata?.account_status === 'active') {
        toast({
          title: "🎉 Application Approved!",
          description: "Your application has been approved. Redirecting to dashboard...",
        });
        
        setTimeout(() => {
          navigate('/dashboard/nurse');
        }, 1500);
      } else {
        toast({
          title: "Still pending",
          description: "Your application is still under review. We'll notify you once approved.",
          variant: "default"
        });
      }
    } catch (error) {
      console.error('Error in checkApprovalStatus:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setChecking(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="space-y-4 pt-4 border-t border-medical-border">
      <Button
        onClick={checkApprovalStatus}
        disabled={checking}
        className="w-full bg-medical-primary hover:bg-medical-primary/90 text-white shadow-medical-soft"
        size="lg"
      >
        {checking ? (
          <>
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            Checking Status...
          </>
        ) : (
          <>
            <RefreshCw className="h-4 w-4 mr-2" />
            Check Approval Status
          </>
        )}
      </Button>

      <div className="flex space-x-3">
        <Button
          variant="outline"
          onClick={() => navigate('/contact')}
          className="flex-1 hover:bg-medical-primary/5 hover:border-medical-primary/30"
        >
          Contact Support
        </Button>
        <Button
          variant="outline"
          onClick={handleSignOut}
          className="flex-1 hover:bg-medical-error/5 hover:border-medical-error/30 text-medical-error"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
