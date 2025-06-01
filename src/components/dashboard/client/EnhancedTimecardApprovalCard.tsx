// src/components/dashboard/client/EnhancedTimecardApprovalCard.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Clock, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Timer,
  User,
  AlertCircle,
  DollarSign,
  Eye,
  Bell,
  Coffee,
  Moon,
  Sun,
  Zap,
  CreditCard,
  Shield,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { getClientTimecards, approveTimecard, rejectTimecard } from '@/supabase/api/timecardService';
import { 
  calculatePaymentAmounts, 
  processTimecardPayment, 
  getClientPaymentMethods,
  formatCurrency 
} from '@/supabase/api/stripeConnectService';

// Import enhanced date formatting
import { 
  formatPremiumDate, 
  formatShortPremiumDate, 
  formatRelativeTime,
  formatTimeOnly
} from '@/lib/dateFormatting';
import { supabase } from '@/integrations/supabase/client';

interface Timecard {
  id: string;
  job_code: string;
  shift_date: string;
  start_time: string;
  end_time: string;
  rounded_start_time: string;
  rounded_end_time: string;
  break_minutes: number;
  total_hours: number;
  status: string;
  is_overnight: boolean;
  notes?: string;
  timestamp_submitted: string;
  approval_deadline: string;
  nurse_profiles: {
    first_name: string;
    last_name: string;
    profile_photo_url?: string;
    stripe_account_id?: string;
  };
  client_profiles: {
    stripe_customer_id?: string;
  };
}

interface EnhancedTimecardApprovalProps {
  clientId: string;
  onTimecardAction: () => void;
}

export default function EnhancedTimecardApprovalCard({ 
  clientId, 
  onTimecardAction 
}: EnhancedTimecardApprovalProps) {
  const [timecards, setTimecards] = useState<Timecard[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimecard, setSelectedTimecard] = useState<Timecard | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);

  useEffect(() => {
    loadTimecards();
    loadPaymentMethods();
  }, [clientId]);

  const loadTimecards = async () => {
    try {
      setLoading(true);
      const { data: timecardsData, error } = await getClientTimecards(clientId, 100, 0);
      if (error) throw error;
      setTimecards(timecardsData || []);
    } catch (error: any) {
      console.error('Error loading timecards:', error);
      toast({
        title: "Error",
        description: "Failed to load timecards",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadPaymentMethods = async () => {
    try {
      // Get client's Stripe customer ID from the first timecard
      const { data: clientProfile } = await supabase
        .from('client_profiles')
        .select('stripe_customer_id')
        .eq('id', clientId)
        .single();

      if (clientProfile?.stripe_customer_id) {
        const { paymentMethods: methods } = await getClientPaymentMethods(clientProfile.stripe_customer_id);
        setPaymentMethods(methods);
      }
    } catch (error) {
      console.error('Error loading payment methods:', error);
    }
  };

  const handleApproveWithPayment = async (timecardId: string, timecard: Timecard) => {
    if (paymentMethods.length === 0) {
      toast({
        title: "Payment Method Required",
        description: "Please add a payment method before approving timecards.",
        variant: "destructive"
      });
      return;
    }

    if (!timecard.nurse_profiles.stripe_account_id) {
      toast({
        title: "Nurse Payment Setup Required",
        description: "The nurse must complete their payment setup before receiving payments.",
        variant: "destructive"
      });
      return;
    }

    try {
      setActionLoading(true);
      setPaymentProcessing(true);

      // Step 1: Approve the timecard
      const { error: approvalError } = await approveTimecard(timecardId, clientId);
      if (approvalError) throw approvalError;

      // Step 2: Calculate payment amounts
      const nurseRate = 50; // You'll need to get this from your contract/rate system
      const amounts = calculatePaymentAmounts(nurseRate, timecard.total_hours);

      // Step 3: Process payment automatically
      const paymentResult = await processTimecardPayment(
        timecardId,
        timecard.nurse_profiles.stripe_account_id!,
        paymentMethods[0].id, // Use default payment method
        nurseRate,
        timecard.total_hours
      );

      if (paymentResult.error) {
        // Payment failed, but timecard is still approved
        toast({
          title: "⚠️ Timecard Approved, Payment Processing Failed",
          description: `Timecard approved but payment failed: ${paymentResult.error.message}`,
          variant: "destructive",
          duration: 8000
        });
      } else {
        // Success!
        toast({
          title: "✅ Timecard Approved & Payment Processed!",
          description: (
            <div className="space-y-1">
              <p>Timecard approved and payment processed successfully</p>
              <p className="text-sm">
                💳 Charged: {formatCurrency(amounts.clientTotalAmount)} | 
                👩‍⚕️ Nurse receives: {formatCurrency(amounts.nurseNetAmount)}
              </p>
            </div>
          ),
          duration: 6000
        });
      }

      loadTimecards();
      setSelectedTimecard(null);
      onTimecardAction();

    } catch (error: any) {
      console.error('Error in approval/payment process:', error);
      toast({
        title: "Process Failed",
        description: error.message || "Failed to approve timecard and process payment",
        variant: "destructive"
      });
    } finally {
      setActionLoading(false);
      setPaymentProcessing(false);
    }
  };

  const handleReject = async (timecardId: string, reason: string) => {
    if (!reason.trim()) {
      toast({
        title: "Rejection Reason Required",
        description: "Please provide a reason for rejecting this timecard",
        variant: "destructive"
      });
      return;
    }

    try {
      setActionLoading(true);
      const { error } = await rejectTimecard(timecardId, clientId, reason);
      if (error) throw error;

      toast({
        title: "Timecard Rejected",
        description: "The nurse has been notified of the rejection",
        duration: 4000
      });

      loadTimecards();
      setSelectedTimecard(null);
      setRejectionReason('');
      onTimecardAction();
    } catch (error: any) {
      toast({
        title: "Rejection Failed",
        description: error.message || "Failed to reject timecard",
        variant: "destructive"
      });
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Submitted':
        return 'bg-gradient-to-r from-blue-100 to-cyan-200 text-blue-800 border-blue-300';
      case 'Approved':
      case 'Auto-Approved':
        return 'bg-gradient-to-r from-green-100 to-emerald-200 text-emerald-800 border-emerald-300';
      case 'Rejected':
        return 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300';
      case 'Paid':
        return 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-purple-300';
      default:
        return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Submitted': return <Timer className="h-4 w-4" />;
      case 'Approved':
      case 'Auto-Approved': return <CheckCircle className="h-4 w-4" />;
      case 'Rejected': return <XCircle className="h-4 w-4" />;
      case 'Paid': return <DollarSign className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const TimecardCard = ({ timecard }: { timecard: Timecard }) => {
    const nurseRate = 50; // You'll need to get this from your contract/rate system
    const amounts = calculatePaymentAmounts(nurseRate, timecard.total_hours);
    
    return (
      <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            {/* Enhanced Profile Picture */}
            <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 ring-4 ring-white shadow-lg">
              {timecard.nurse_profiles.profile_photo_url ? (
                <img 
                  src={timecard.nurse_profiles.profile_photo_url} 
                  alt="Nurse" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg">
                  {timecard.nurse_profiles.first_name.charAt(0)}{timecard.nurse_profiles.last_name.charAt(0)}
                </div>
              )}
              <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                timecard.status === 'Submitted' ? 'bg-blue-500' : 
                timecard.status === 'Approved' ? 'bg-green-500' : 
                timecard.status === 'Rejected' ? 'bg-red-500' : 
                timecard.status === 'Paid' ? 'bg-purple-500' : 'bg-gray-500'
              }`}></div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-xl text-gray-900 group-hover:text-blue-900 transition-colors">
                    {timecard.nurse_profiles.first_name} {timecard.nurse_profiles.last_name}
                  </h3>
                  <p className="text-gray-600 font-medium">{timecard.job_code}</p>
                </div>
                <div className="text-right">
                  <Badge className={`${getStatusColor(timecard.status)} flex items-center border shadow-sm mb-2`}>
                    {getStatusIcon(timecard.status)}
                    <span className="ml-2 font-medium">{timecard.status}</span>
                  </Badge>
                </div>
              </div>

              {/* Enhanced Payment Preview */}
              {timecard.status === 'Submitted' && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-green-900 mb-2 flex items-center">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Payment Preview
                  </h4>
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div className="text-center">
                      <p className="text-green-700">You Pay</p>
                      <p className="font-bold text-green-900">{formatCurrency(amounts.clientTotalAmount)}</p>
                      <p className="text-xs text-green-600">Rate + 10% fee</p>
                    </div>
                    <div className="text-center">
                      <p className="text-green-700">Nurse Gets</p>
                      <p className="font-bold text-green-900">{formatCurrency(amounts.nurseNetAmount)}</p>
                      <p className="text-xs text-green-600">After 5% fee</p>
                    </div>
                    <div className="text-center">
                      <p className="text-green-700">Platform Fee</p>
                      <p className="font-bold text-green-900">{formatCurrency(amounts.platformTotalFee)}</p>
                      <p className="text-xs text-green-600">15% total</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Shift Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-3">
                  <div className="flex items-center text-sm bg-gray-50 rounded-lg p-3">
                    <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                    <div>
                      <p className="font-medium text-gray-800">Shift Date</p>
                      <p className="text-gray-600">{formatShortPremiumDate(timecard.shift_date)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center mr-2">
                      {timecard.is_overnight ? 
                        <Moon className="h-4 w-4 text-indigo-500" /> : 
                        <Sun className="h-4 w-4 text-amber-500" />
                      }
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {timecard.rounded_start_time} - {timecard.rounded_end_time}
                      </p>
                      <p className="text-xs text-gray-500">
                        {timecard.total_hours} hours
                        {timecard.break_minutes > 0 && ` (${timecard.break_minutes}min break)`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {timecard.notes && (
                <div className="mb-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
                  <p className="text-sm font-medium text-indigo-900 mb-1">Shift Notes:</p>
                  <p className="text-sm text-indigo-800 italic">"{timecard.notes}"</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedTimecard(timecard)}
                  className="hover:bg-blue-50 hover:border-blue-300 transition-all"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View Details
                </Button>
                
                {timecard.status === 'Submitted' && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => handleApproveWithPayment(timecard.id, timecard)}
                      disabled={actionLoading || paymentProcessing}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 shadow-md transition-all min-w-[140px]"
                    >
                      {paymentProcessing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4 mr-1" />
                          Approve & Pay
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedTimecard(timecard)}
                      className="text-red-600 border-red-300 hover:bg-red-50 transition-all"
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Dispute
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const pendingTimecards = timecards.filter(tc => tc.status === 'Submitted');
  const approvedTimecards = timecards.filter(tc => tc.status === 'Approved' || tc.status === 'Auto-Approved');
  const paidTimecards = timecards.filter(tc => tc.status === 'Paid');
  const rejectedTimecards = timecards.filter(tc => tc.status === 'Rejected');

  if (loading) {
    return (
      <Card className="border-0 shadow-xl">
        <CardContent className="p-6">
          <div className="text-center py-12">
            <div className="relative mb-6">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent mx-auto"></div>
              <Clock className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-indigo-600" />
            </div>
            <p className="text-gray-600 font-medium">Loading timecards...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-8">
        {/* Enhanced Summary Card */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-indigo-50/30">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-lg border-b border-indigo-100">
            <CardTitle className="flex items-center text-2xl font-bold text-gray-900">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                <Zap className="h-6 w-6 text-white" />
              </div>
              Instant Payment Center
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {/* Payment Method Status */}
            {paymentMethods.length === 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 text-orange-600 mr-2" />
                  <div>
                    <p className="font-semibold text-orange-900">💳 Payment Method Required</p>
                    <p className="text-sm text-orange-700">Add a payment method to enable instant payments when approving timecards</p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-cyan-50">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Timer className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-3xl font-bold text-blue-700 mb-1">{pendingTimecards.length}</p>
                  <p className="text-sm font-medium text-blue-600">Pending Approval</p>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-emerald-50">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-3xl font-bold text-green-700 mb-1">{approvedTimecards.length}</p>
                  <p className="text-sm font-medium text-green-600">Approved</p>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-pink-50">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-3xl font-bold text-purple-700 mb-1">{paidTimecards.length}</p>
                  <p className="text-sm font-medium text-purple-600">Paid</p>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-md bg-gradient-to-br from-red-50 to-pink-50">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <XCircle className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-3xl font-bold text-red-700 mb-1">{rejectedTimecards.length}</p>
                  <p className="text-sm font-medium text-red-600">Disputed</p>
                </CardContent>
              </Card>
            </div>
            
            {pendingTimecards.length > 0 && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start">
                  <Zap className="h-5 w-5 text-blue-600 mr-2 mt-0.5 animate-pulse" />
                  <div>
                    <p className="font-semibold text-blue-900">⚡ Instant Payment Ready</p>
                    <p className="text-sm text-blue-700">
                      Click "Approve & Pay" to instantly approve timecards and process payments. 
                      Money is immediately transferred to nurses!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enhanced Timecards List */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50/30">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-t-lg border-b border-gray-100">
            <CardTitle className="text-xl font-bold text-gray-900">Timecard History</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {timecards.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Clock className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                  No Timecards Yet
                </h3>
                <p className="text-gray-600 text-lg">
                  When your nurses submit timecards, they will appear here for instant approval and payment.
                </p>
              </div>
            ) : (
              <Tabs defaultValue="pending" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-8 h-12 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-1">
                  <TabsTrigger value="pending" className="rounded-lg font-medium">
                    Pending ({pendingTimecards.length})
                    {pendingTimecards.length > 0 && (
                      <Badge className="ml-2 bg-blue-600 text-white text-xs animate-pulse">
                        {pendingTimecards.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="approved" className="rounded-lg font-medium">
                    Approved ({approvedTimecards.length})
                  </TabsTrigger>
                  <TabsTrigger value="paid" className="rounded-lg font-medium">
                    Paid ({paidTimecards.length})
                  </TabsTrigger>
                  <TabsTrigger value="rejected" className="rounded-lg font-medium">
                    Disputed ({rejectedTimecards.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="pending" className="mt-6">
                  <div className="space-y-6">
                    {pendingTimecards.length === 0 ? (
                      <div className="text-center py-12">
                        <Timer className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No pending timecards</p>
                      </div>
                    ) : (
                      pendingTimecards.map((timecard) => (
                        <TimecardCard key={timecard.id} timecard={timecard} />
                      ))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="approved" className="mt-6">
                  <div className="space-y-6">
                    {approvedTimecards.length === 0 ? (
                      <div className="text-center py-12">
                        <CheckCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No approved timecards</p>
                      </div>
                    ) : (
                      approvedTimecards.map((timecard) => (
                        <TimecardCard key={timecard.id} timecard={timecard} />
                      ))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="paid" className="mt-6">
                  <div className="space-y-6">
                    {paidTimecards.length === 0 ? (
                      <div className="text-center py-12">
                        <DollarSign className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No paid timecards</p>
                      </div>
                    ) : (
                      paidTimecards.map((timecard) => (
                        <TimecardCard key={timecard.id} timecard={timecard} />
                      ))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="rejected" className="mt-6">
                  <div className="space-y-6">
                    {rejectedTimecards.length === 0 ? (
                      <div className="text-center py-12">
                        <XCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No disputed timecards</p>
                      </div>
                    ) : (
                      rejectedTimecards.map((timecard) => (
                        <TimecardCard key={timecard.id} timecard={timecard} />
                      ))
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Timecard Details Dialog */}
      <Dialog open={!!selectedTimecard} onOpenChange={() => {
        setSelectedTimecard(null);
        setRejectionReason('');
      }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-gray-50/50">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center">
              <Shield className="h-6 w-6 mr-2 text-indigo-600" />
              Instant Payment Review
            </DialogTitle>
          </DialogHeader>
          {selectedTimecard && (
            <div className="space-y-6">
              {/* Payment processing notice if processing */}
              {paymentProcessing && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <Loader2 className="h-5 w-5 text-blue-600 mr-2 animate-spin" />
                    <div>
                      <p className="font-semibold text-blue-900">Processing Payment...</p>
                      <p className="text-sm text-blue-700">Approving timecard and processing payment automatically</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Dispute Section for pending timecards */}
              {selectedTimecard.status === 'Submitted' && (
                <Card className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200">
                  <CardContent className="p-6">
                    <div>
                      <label className="text-sm font-semibold text-red-600 uppercase tracking-wide mb-3 block">
                        Dispute Reason (if rejecting)
                      </label>
                      <Textarea
                        placeholder="Explain why you're disputing this timecard... (e.g., incorrect hours, unauthorized break time, etc.)"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        rows={4}
                        className="resize-none"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Enhanced Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedTimecard(null);
                    setRejectionReason('');
                  }}
                  className="px-8 h-12"
                >
                  Close
                </Button>
                
                {selectedTimecard.status === 'Submitted' && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => handleReject(selectedTimecard.id, rejectionReason)}
                      disabled={actionLoading}
                      className="px-8 h-12 text-red-600 border-red-300 hover:bg-red-50"
                    >
                      {actionLoading ? 'Disputing...' : 'Dispute Timecard'}
                    </Button>
                    <Button
                      onClick={() => handleApproveWithPayment(selectedTimecard.id, selectedTimecard)}
                      disabled={actionLoading || paymentProcessing || paymentMethods.length === 0}
                      className="px-8 h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 shadow-lg min-w-[180px]"
                    >
                      {paymentProcessing ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Zap className="h-5 w-5 mr-2" />
                          Approve & Pay Instantly
                        </>
                      )}
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}