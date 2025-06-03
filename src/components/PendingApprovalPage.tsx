// src/components/PendingApprovalPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Clock, 
  CheckCircle, 
  RefreshCw, 
  Shield, 
  FileText, 
  AlertCircle,
  LogOut,
  Sparkles
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { signOut } from '@/supabase/auth/authService';
import Navbar from '@/components/Navbar';

export default function PendingApprovalPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(false);

  const checkApprovalStatus = async () => {
    if (!user?.id) return;

    setChecking(true);
    try {
      // Check current account status
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
        
        // Small delay to let user see the success message
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
    <div className="min-h-screen bg-medical-gradient-primary">
      <Navbar />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {/* Main Status Card */}
            <Card className="border-0 shadow-medical-elevated bg-white overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-medical-warning/10 to-medical-primary/10 border-b border-medical-border">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-medical-warning to-medical-primary rounded-full flex items-center justify-center shadow-medical-soft">
                    <Clock className="h-8 w-8 text-white animate-pulse" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-center text-medical-text-primary">
                  Application Under Review
                </CardTitle>
                <p className="text-center text-medical-text-secondary mt-2">
                  Your nursing profile has been successfully submitted
                </p>
              </CardHeader>
              
              <CardContent className="p-8 space-y-6">
                {/* Status Message */}
                <div className="text-center space-y-4">
                  <div className="p-4 bg-medical-warning/10 border border-medical-warning/20 rounded-xl">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="h-5 w-5 text-medical-warning mt-0.5 flex-shrink-0" />
                      <div className="text-left">
                        <p className="font-semibold text-medical-warning mb-1">
                          Verification in Progress
                        </p>
                        <p className="text-sm text-medical-text-secondary">
                          Our team is currently reviewing your credentials, licenses, and professional qualifications. 
                          This process typically takes 24-48 hours during business days.
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-medical-text-secondary">
                    You'll receive an email notification once your application has been approved 
                    and you can access your nursing dashboard.
                  </p>
                </div>

                {/* What's Being Reviewed */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-medical-text-primary flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-medical-primary" />
                    What We're Reviewing
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { icon: Shield, text: "Nursing license verification", status: "reviewing" },
                      { icon: CheckCircle, text: "Professional certifications", status: "reviewing" },
                      { icon: FileText, text: "Background and credentials", status: "reviewing" },
                      { icon: Sparkles, text: "Profile completeness", status: "complete" }
                    ].map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-medical-neutral-50 rounded-lg">
                          <Icon className={`h-4 w-4 ${
                            item.status === 'complete' 
                              ? 'text-medical-success' 
                              : 'text-medical-warning'
                          }`} />
                          <span className="text-sm text-medical-text-primary flex-1">
                            {item.text}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            item.status === 'complete'
                              ? 'bg-medical-success text-white'
                              : 'bg-medical-warning text-white'
                          }`}>
                            {item.status === 'complete' ? 'Complete' : 'Reviewing'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Action Buttons */}
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

                {/* Next Steps */}
                <div className="p-4 bg-medical-primary/5 border border-medical-primary/20 rounded-xl">
                  <h4 className="font-semibold text-medical-primary mb-2">What happens next?</h4>
                  <ul className="text-sm text-medical-text-secondary space-y-1">
                    <li>• You'll receive an email when your application is approved</li>
                    <li>• Access to your nursing dashboard with job opportunities</li>
                    <li>• Ability to apply for positions and manage contracts</li>
                    <li>• Complete payment setup to start earning</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Additional Help */}
            <div className="mt-6 text-center">
              <p className="text-sm text-medical-text-secondary">
                Questions about your application? 
                <button 
                  onClick={() => navigate('/contact')}
                  className="text-medical-primary hover:underline ml-1 font-medium"
                >
                  Contact our support team
                </button>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}