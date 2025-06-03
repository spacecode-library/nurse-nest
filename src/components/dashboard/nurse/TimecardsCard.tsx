// components/dashboard/nurse/TimecardsCard.tsx - UPDATED VERSION
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Clock, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Timer,
  Plus,
  Eye,
  DollarSign,
  TrendingUp,
  Shield,
  CreditCard,
  Zap
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { getNurseTimecards, calculateNurseEarnings } from '@/supabase/api/timecardService';
import { formatCurrency } from '@/supabase/api/stripeConnectService';

// Import the enhanced timecard submission form
import EnhancedTimecardSubmissionForm from './EnhancedTimecardSubmissionForm';

// Import enhanced date formatting
import { 
  formatPremiumDate, 
  formatShortPremiumDate, 
  formatRelativeTime 
} from '@/lib/dateFormatting';

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
  timestamp_approved?: string;
  approval_deadline: string;
  client_profiles: {
    first_name: string;
    last_name: string;
  };
  // NEW: Payment related fields
  stripe_payment_intent_id?: string;
  nurse_net_amount?: number;
  client_total_amount?: number;
  platform_fee_amount?: number;
}

interface TimecardsCardProps {
  nurseId: string;
  onTimecardSubmitted: () => void;
  stripeAccountStatus?: string; // NEW: Added this prop
}

export default function TimecardsCard({ 
  nurseId, 
  onTimecardSubmitted,
  stripeAccountStatus = 'not_started' // NEW: Default value
}: TimecardsCardProps) {
  const [timecards, setTimecards] = useState<Timecard[]>([]);
  const [earnings, setEarnings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimecard, setSelectedTimecard] = useState<Timecard | null>(null);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);

  useEffect(() => {
    loadTimecards();
    loadEarnings();
  }, [nurseId]);

  const loadTimecards = async () => {
    try {
      setLoading(true);
      const { data: timecardsData, error } = await getNurseTimecards(nurseId, 50, 0);
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

  const loadEarnings = async () => {
    try {
      // Calculate earnings for current month
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      
      const { earnings, error } = await calculateNurseEarnings(
        nurseId,
        startOfMonth.toISOString().split('T')[0],
        endOfMonth.toISOString().split('T')[0]
      );
      
      if (error) throw error;
      setEarnings(earnings);
    } catch (error: any) {
      console.error('Error loading earnings:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Submitted':
        return <Timer className="h-4 w-4" />;
      case 'Approved':
      case 'Auto-Approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'Rejected':
        return <XCircle className="h-4 w-4" />;
      case 'Paid':
        return <DollarSign className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Submitted':
        return 'bg-blue-100 text-blue-800';
      case 'Approved':
      case 'Auto-Approved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Paid':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isDeadlineApproaching = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const hoursUntilDeadline = (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursUntilDeadline <= 2 && hoursUntilDeadline > 0;
  };

  const isOverdue = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    return now > deadlineDate;
  };

  const handleTimecardSubmitted = () => {
    setShowSubmissionForm(false);
    loadTimecards();
    loadEarnings();
    onTimecardSubmitted();
  };

  const TimecardCard = ({ timecard }: { timecard: Timecard }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-lg text-gray-900">
              {timecard.job_code}
            </h3>
            <p className="text-gray-600">
              {timecard.client_profiles.first_name} {timecard.client_profiles.last_name}
            </p>
          </div>
          <Badge className={`${getStatusColor(timecard.status)} flex items-center`}>
            {getStatusIcon(timecard.status)}
            <span className="ml-1">{timecard.status}</span>
          </Badge>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            {formatShortPremiumDate(timecard.shift_date)}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-2" />
            {timecard.rounded_start_time} - {timecard.rounded_end_time}
            {timecard.is_overnight && (
              <Badge variant="outline" className="ml-2 text-xs">
                Overnight
              </Badge>
            )}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <span className="font-medium">Total Hours: {timecard.total_hours}</span>
            {timecard.break_minutes > 0 && (
              <span className="ml-2 text-xs text-gray-500">
                (Break: {timecard.break_minutes}min)
              </span>
            )}
          </div>
          {/* NEW: Show payment information for paid timecards */}
          {timecard.status === 'Paid' && timecard.nurse_net_amount && (
            <div className="flex items-center text-sm text-green-600 bg-green-50 rounded-lg p-2">
              <DollarSign className="h-4 w-4 mr-2" />
              <span className="font-medium">Earned: {formatCurrency(timecard.nurse_net_amount)}</span>
            </div>
          )}
        </div>

        {timecard.status === 'Submitted' && (
          <div className="mb-4">
            {isOverdue(timecard.approval_deadline) ? (
              <div className="flex items-center text-sm text-green-600">
                <CheckCircle className="h-4 w-4 mr-1" />
                Auto-approval in progress
              </div>
            ) : isDeadlineApproaching(timecard.approval_deadline) ? (
              <div className="flex items-center text-sm text-amber-600">
                <Timer className="h-4 w-4 mr-1" />
                Approval deadline approaching
              </div>
            ) : (
              <div className="flex items-center text-sm text-blue-600">
                <Timer className="h-4 w-4 mr-1" />
                Waiting for client approval
              </div>
            )}
          </div>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedTimecard(timecard)}
        >
          <Eye className="h-4 w-4 mr-1" />
          View Details
        </Button>
      </CardContent>
    </Card>
  );

  const groupTimecardsByStatus = () => {
    const pending = timecards.filter(tc => tc.status === 'Submitted');
    const approved = timecards.filter(tc => 
      tc.status === 'Approved' || tc.status === 'Auto-Approved'
    );
    const paid = timecards.filter(tc => tc.status === 'Paid');
    const rejected = timecards.filter(tc => tc.status === 'Rejected');

    return { pending, approved, paid, rejected };
  };

  const { pending, approved, paid, rejected } = groupTimecardsByStatus();

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading timecards...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Enhanced Summary Card */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50/30">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg border-b border-blue-100">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center text-xl font-bold text-gray-900">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-3">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                Timecard Summary
              </CardTitle>
              <Button onClick={() => setShowSubmissionForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Submit Timecard
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {/* NEW: Payment Setup Status Alert */}
            {stripeAccountStatus !== 'active' && (
              <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-orange-900 mb-1">⚠️ Payment Setup Required</h4>
                    <p className="text-sm text-orange-800 mb-2">
                      Complete your payment account setup to receive earnings when timecards are approved.
                    </p>
                    <div className="flex items-center space-x-2">
                      <p className="text-xs text-orange-700">
                        Status: <strong>{stripeAccountStatus}</strong>
                      </p>
                      {stripeAccountStatus === 'active' && (
                        <Badge className="bg-green-100 text-green-800 border-green-300">
                          <Shield className="h-3 w-3 mr-1" />
                          Ready
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{pending.length}</p>
                <p className="text-sm text-gray-600">Pending Approval</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{approved.length}</p>
                <p className="text-sm text-gray-600">Approved</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{paid.length}</p>
                <p className="text-sm text-gray-600">Paid</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-600">
                  {earnings?.totalHours || 0}
                </p>
                <p className="text-sm text-gray-600">Hours This Month</p>
              </div>
            </div>
            
            {/* Enhanced Earnings Display */}
            {earnings && (
              <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-900">
                      This Month's Earnings:
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">
                    {formatCurrency(earnings.totalEarnings || 0)}
                  </span>
                </div>
                {stripeAccountStatus === 'active' && (
                  <div className="flex items-center space-x-2 mt-2">
                    <Zap className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-700">Instant payments enabled</span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Timecards List */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-t-lg border-b border-gray-100">
            <CardTitle className="text-xl font-bold text-gray-900">Timecard History</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {timecards.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Timecards Yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Start logging your work hours by submitting your first timecard.
                </p>
                <Button onClick={() => setShowSubmissionForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Submit First Timecard
                </Button>
              </div>
            ) : (
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="pending">
                    Pending ({pending.length})
                  </TabsTrigger>
                  <TabsTrigger value="approved">
                    Approved ({approved.length})
                  </TabsTrigger>
                  <TabsTrigger value="paid">
                    Paid ({paid.length})
                  </TabsTrigger>
                  <TabsTrigger value="rejected">
                    Rejected ({rejected.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-6">
                  <div className="grid gap-4">
                    {timecards.map((timecard) => (
                      <TimecardCard key={timecard.id} timecard={timecard} />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="pending" className="mt-6">
                  <div className="grid gap-4">
                    {pending.length === 0 ? (
                      <p className="text-center text-gray-500 py-4">
                        No pending timecards
                      </p>
                    ) : (
                      pending.map((timecard) => (
                        <TimecardCard key={timecard.id} timecard={timecard} />
                      ))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="approved" className="mt-6">
                  <div className="grid gap-4">
                    {approved.length === 0 ? (
                      <p className="text-center text-gray-500 py-4">
                        No approved timecards
                      </p>
                    ) : (
                      approved.map((timecard) => (
                        <TimecardCard key={timecard.id} timecard={timecard} />
                      ))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="paid" className="mt-6">
                  <div className="grid gap-4">
                    {paid.length === 0 ? (
                      <p className="text-center text-gray-500 py-4">
                        No paid timecards
                      </p>
                    ) : (
                      paid.map((timecard) => (
                        <TimecardCard key={timecard.id} timecard={timecard} />
                      ))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="rejected" className="mt-6">
                  <div className="grid gap-4">
                    {rejected.length === 0 ? (
                      <p className="text-center text-gray-500 py-4">
                        No rejected timecards
                      </p>
                    ) : (
                      rejected.map((timecard) => (
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

      {/* Timecard Details Dialog */}
          <Dialog open={!!selectedTimecard} onOpenChange={() => setSelectedTimecard(null)}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Timecard Details</DialogTitle>
          <DialogDescription>
            Review your submitted timecard information and payment status
          </DialogDescription>
        </DialogHeader>
          {selectedTimecard && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Job Code</label>
                  <p className="text-gray-900">{selectedTimecard.job_code}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Client</label>
                  <p className="text-gray-900">
                    {selectedTimecard.client_profiles.first_name} {selectedTimecard.client_profiles.last_name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Shift Date</label>
                  <p className="text-gray-900">
                    {formatShortPremiumDate(selectedTimecard.shift_date)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <Badge className={getStatusColor(selectedTimecard.status)}>
                    {selectedTimecard.status}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Original Times</label>
                  <p className="text-gray-900">
                    {selectedTimecard.start_time} - {selectedTimecard.end_time}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Rounded Times</label>
                  <p className="text-gray-900">
                    {selectedTimecard.rounded_start_time} - {selectedTimecard.rounded_end_time}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Break Time</label>
                  <p className="text-gray-900">{selectedTimecard.break_minutes} minutes</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Total Hours</label>
                  <p className="text-gray-900 font-semibold">{selectedTimecard.total_hours}</p>
                </div>
              </div>
              
              {/* NEW: Payment Information for Paid Timecards */}
              {selectedTimecard.status === 'Paid' && selectedTimecard.nurse_net_amount && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2 flex items-center">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Payment Details
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <label className="text-green-700">Amount Earned</label>
                      <p className="font-bold text-green-900">{formatCurrency(selectedTimecard.nurse_net_amount)}</p>
                    </div>
                    {selectedTimecard.platform_fee_amount && (
                      <div>
                        <label className="text-green-700">Platform Fee (5%)</label>
                        <p className="font-bold text-green-900">{formatCurrency(selectedTimecard.platform_fee_amount * 0.33)}</p>
                      </div>
                    )}
                    {selectedTimecard.stripe_payment_intent_id && (
                      <div className="col-span-2">
                        <label className="text-green-700">Payment ID</label>
                        <p className="font-mono text-xs text-green-800">{selectedTimecard.stripe_payment_intent_id}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {selectedTimecard.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Notes</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                    {selectedTimecard.notes}
                  </p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="text-sm font-medium text-gray-600">Submitted</label>
                  <p className="text-gray-900">
                    {formatRelativeTime(selectedTimecard.timestamp_submitted)}
                  </p>
                </div>
                {selectedTimecard.timestamp_approved && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Approved</label>
                    <p className="text-gray-900">
                      {formatRelativeTime(selectedTimecard.timestamp_approved)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Enhanced Timecard Submission Dialog */}
      <Dialog open={showSubmissionForm} onOpenChange={setShowSubmissionForm}>
  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle>Submit New Timecard</DialogTitle>
      <DialogDescription>
        Log your completed shift hours for client approval and payment
      </DialogDescription>
    </DialogHeader>
          <EnhancedTimecardSubmissionForm
            nurseId={nurseId}
            stripeAccountStatus={stripeAccountStatus}
            onSubmitted={handleTimecardSubmitted}
            onCancel={() => setShowSubmissionForm(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}