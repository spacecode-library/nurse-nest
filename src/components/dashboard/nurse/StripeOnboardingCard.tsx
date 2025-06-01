// src/components/dashboard/nurse/StripeOnboardingCard.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CreditCard, 
  ExternalLink, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  Clock,
  DollarSign,
  Calendar,
  RefreshCw,
  Zap,
  Building2,
  User,
  Lock,
  TrendingUp
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { 
  createNurseStripeAccount, 
  updateNurseStripeStatus,
  formatCurrency 
} from '@/supabase/api/stripeConnectService';
import { useAuth } from '@/contexts/AuthContext';

interface StripeOnboardingCardProps {
  nurseId: string;
  nurseEmail: string;
  currentAccountId?: string;
  currentStatus?: string;
  onStatusUpdate?: (status: string) => void;
}

export default function StripeOnboardingCard({ 
  nurseId, 
  nurseEmail, 
  currentAccountId,
  currentStatus = 'not_started',
  onStatusUpdate 
}: StripeOnboardingCardProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [accountId, setAccountId] = useState(currentAccountId);
  const [accountStatus, setAccountStatus] = useState(currentStatus);
  const [onboardingUrl, setOnboardingUrl] = useState<string | null>(null);

  useEffect(() => {
    if (accountId && accountStatus === 'onboarding') {
      // Auto-check status every 30 seconds if onboarding
      const interval = setInterval(checkAccountStatus, 30000);
      return () => clearInterval(interval);
    }
  }, [accountId, accountStatus]);

  const handleCreateAccount = async () => {
    try {
      setLoading(true);
      
      const result = await createNurseStripeAccount(nurseId, nurseEmail);
      
      if (result.error) {
        throw result.error;
      }
      
      setAccountId(result.accountId);
      setOnboardingUrl(result.onboardingUrl);
      setAccountStatus('onboarding');
      
      onStatusUpdate?.('onboarding');
      
      toast({
        title: "🎉 Payment Account Created!",
        description: "Click 'Complete Setup' to finish your payment account configuration",
        duration: 5000
      });
      
    } catch (error) {
      console.error('Error creating Stripe account:', error);
      toast({
        title: "Setup Failed",
        description: (error as Error).message || "Failed to create payment account",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const checkAccountStatus = async () => {
    if (!accountId) return;
    
    try {
      setCheckingStatus(true);
      
      const result = await updateNurseStripeStatus(nurseId, accountId);
      
      if (result.error) {
        throw result.error;
      }
      
      setAccountStatus(result.status);
      onStatusUpdate?.(result.status);
      
      if (result.status === 'active') {
        toast({
          title: "🎉 Payment Account Active!",
          description: "You're now ready to receive payments from clients",
          duration: 5000
        });
      }
      
    } catch (error) {
      console.error('Error checking account status:', error);
      toast({
        title: "Status Check Failed",
        description: "Unable to check account status",
        variant: "destructive"
      });
    } finally {
      setCheckingStatus(false);
    }
  };

  const getStatusInfo = () => {
    switch (accountStatus) {
      case 'not_started':
        return {
          color: 'gray',
          text: 'Not Started',
          icon: Clock,
          description: 'Set up your payment account to receive earnings',
          progress: 0
        };
      case 'onboarding':
        return {
          color: 'blue',
          text: 'Setup in Progress',
          icon: RefreshCw,
          description: 'Complete your Stripe onboarding to start receiving payments',
          progress: 50
        };
      case 'requirements_due':
        return {
          color: 'orange',
          text: 'Additional Info Required',
          icon: AlertCircle,
          description: 'Some additional information is needed to activate your account',
          progress: 75
        };
      case 'active':
        return {
          color: 'green',
          text: 'Ready to Receive Payments',
          icon: CheckCircle,
          description: 'Your payment account is active and ready',
          progress: 100
        };
      default:
        return {
          color: 'gray',
          text: 'Unknown Status',
          icon: AlertCircle,
          description: 'Unable to determine account status',
          progress: 0
        };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-green-50/30">
      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg border-b border-green-100">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center text-xl font-bold text-gray-900">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mr-3">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            Payment Account Setup
          </div>
          <Badge className={`${
            statusInfo.color === 'green' ? 'bg-green-100 text-green-800 border-green-300' :
            statusInfo.color === 'blue' ? 'bg-blue-100 text-blue-800 border-blue-300' :
            statusInfo.color === 'orange' ? 'bg-orange-100 text-orange-800 border-orange-300' :
            'bg-gray-100 text-gray-800 border-gray-300'
          } border`}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {statusInfo.text}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Setup Progress</span>
            <span className="text-sm text-gray-500">{statusInfo.progress}%</span>
          </div>
          <Progress value={statusInfo.progress} className="h-2" />
        </div>

        {/* Status Description */}
        <div className={`p-4 rounded-lg border mb-6 ${
          statusInfo.color === 'green' ? 'bg-green-50 border-green-200' :
          statusInfo.color === 'blue' ? 'bg-blue-50 border-blue-200' :
          statusInfo.color === 'orange' ? 'bg-orange-50 border-orange-200' :
          'bg-gray-50 border-gray-200'
        }`}>
          <div className="flex items-start">
            <StatusIcon className={`h-5 w-5 mr-2 mt-0.5 ${
              statusInfo.color === 'green' ? 'text-green-600' :
              statusInfo.color === 'blue' ? 'text-blue-600' :
              statusInfo.color === 'orange' ? 'text-orange-600' :
              'text-gray-600'
            }`} />
            <div>
              <p className={`font-semibold mb-1 ${
                statusInfo.color === 'green' ? 'text-green-900' :
                statusInfo.color === 'blue' ? 'text-blue-900' :
                statusInfo.color === 'orange' ? 'text-orange-900' :
                'text-gray-900'
              }`}>
                {statusInfo.text}
              </p>
              <p className={`text-sm ${
                statusInfo.color === 'green' ? 'text-green-800' :
                statusInfo.color === 'blue' ? 'text-blue-800' :
                statusInfo.color === 'orange' ? 'text-orange-800' :
                'text-gray-800'
              }`}>
                {statusInfo.description}
              </p>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        {accountStatus !== 'active' && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-green-900 mb-3 flex items-center">
              <Zap className="h-4 w-4 mr-2" />
              Benefits of Setting Up Payments
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-green-800">
              <div className="flex items-center">
                <TrendingUp className="h-3 w-3 mr-2" />
                Instant payment processing
              </div>
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-2" />
                Weekly payouts every Friday
              </div>
              <div className="flex items-center">
                <Shield className="h-3 w-3 mr-2" />
                Bank-level security
              </div>
              <div className="flex items-center">
                <DollarSign className="h-3 w-3 mr-2" />
                Direct bank deposits
              </div>
            </div>
          </div>
        )}

        {/* Earnings Preview (if active) */}
        {accountStatus === 'active' && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-green-900 mb-3 flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Ready to Earn
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-green-700">Example Earnings:</p>
                <p className="font-bold text-green-900">$40/hr × 8hrs = $320</p>
                <p className="text-xs text-green-600">You receive: $304 (after 5% fee)</p>
              </div>
              <div>
                <p className="text-green-700">Payout Schedule:</p>
                <p className="font-bold text-green-900">Every Friday</p>
                <p className="text-xs text-green-600">Automatic bank deposit</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {accountStatus === 'not_started' && (
            <Button
              onClick={handleCreateAccount}
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 shadow-lg h-12"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Set Up Payment Account
                </>
              )}
            </Button>
          )}

          {(accountStatus === 'onboarding' || accountStatus === 'requirements_due') && onboardingUrl && (
            <a
              href={onboardingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-0 shadow-lg h-12 rounded-md flex items-center justify-center font-medium transition-all"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Complete Setup in Stripe
            </a>
          )}

          {accountId && (
            <Button
              onClick={checkAccountStatus}
              disabled={checkingStatus}
              variant="outline"
              className="w-full h-10"
            >
              {checkingStatus ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Checking Status...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Check Status
                </>
              )}
            </Button>
          )}
        </div>

        {/* Security Notice */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <Lock className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-blue-900 mb-1">🔒 Secure & Trusted</p>
              <p className="text-sm text-blue-800">
                Powered by Stripe, trusted by millions of businesses worldwide. 
                Your banking information is encrypted and never stored on our servers.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}