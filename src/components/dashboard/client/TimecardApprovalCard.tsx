// components/dashboard/client/TimecardApprovalCard.tsx
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
  Sparkles,
  TrendingUp,
  Bell,
  Coffee,
  Moon,
  Sun,
  Zap,
  Award,
  Shield
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { getClientTimecards, approveTimecard, rejectTimecard } from '@/supabase/api/timecardService';

// Import enhanced date formatting
import { 
  formatPremiumDate, 
  formatShortPremiumDate, 
  formatRelativeTime,
  formatTimeOnly
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
  approval_deadline: string;
  nurse_profiles: {
    first_name: string;
    last_name: string;
    profile_photo_url?: string;
  };
}

interface TimecardApprovalCardProps {
  clientId: string;
  onTimecardAction: () => void;
}

export default function TimecardApprovalCard({ 
  clientId, 
  onTimecardAction 
}: TimecardApprovalCardProps) {
  const [timecards, setTimecards] = useState<Timecard[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimecard, setSelectedTimecard] = useState<Timecard | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadTimecards();
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

  const handleApprove = async (timecardId: string) => {
    try {
      setActionLoading(true);
      const { error } = await approveTimecard(timecardId, clientId);
      if (error) throw error;

      toast({
        title: "✅ Timecard Approved!",
        description: "The timecard has been approved and will be processed for payment",
        duration: 4000
      });

      loadTimecards();
      setSelectedTimecard(null);
      onTimecardAction();
    } catch (error: any) {
      toast({
        title: "Approval Failed",
        description: error.message || "Failed to approve timecard",
        variant: "destructive"
      });
    } finally {
      setActionLoading(false);
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
      case 'Paid': return <Award className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getTimeUntilDeadline = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const hoursLeft = Math.max(0, (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60));
    
    if (hoursLeft <= 0) return 'Auto-approved';
    if (hoursLeft < 1) return `${Math.round(hoursLeft * 60)}m left`;
    if (hoursLeft < 24) return `${Math.round(hoursLeft)}h left`;
    return `${Math.round(hoursLeft / 24)}d left`;
  };

  const isDeadlineApproaching = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const hoursLeft = (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursLeft <= 2 && hoursLeft > 0;
  };

  const calculateCost = (hours: number, hourlyRate = 50) => {
    const nurseEarnings = hours * hourlyRate;
    const platformFee = nurseEarnings * 0.15; // 15% platform fee
    return {
      nurseEarnings,
      platformFee,
      total: nurseEarnings + platformFee
    };
  };

  const TimecardCard = ({ timecard }: { timecard: Timecard }) => {
    const cost = calculateCost(timecard.total_hours);
    const timeLeft = getTimeUntilDeadline(timecard.approval_deadline);
    const isUrgent = isDeadlineApproaching(timecard.approval_deadline);

    return (
      <Card className={`group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50 ${
        isUrgent ? 'ring-2 ring-amber-500 ring-opacity-50 shadow-amber-100' : ''
      }`}>
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
              {/* Status indicator */}
              <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                timecard.status === 'Submitted' ? 'bg-blue-500' : 
                timecard.status === 'Approved' ? 'bg-green-500' : 
                timecard.status === 'Rejected' ? 'bg-red-500' : 'bg-gray-500'
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
                  {timecard.status === 'Submitted' && (
                    <p className={`text-xs font-medium ${isUrgent ? 'text-amber-600 animate-pulse' : 'text-gray-500'}`}>
                      ⏰ {timeLeft}
                    </p>
                  )}
                </div>
              </div>

              {/* Enhanced Shift Details */}
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
                        Original: {formatTimeOnly(timecard.start_time)} - {formatTimeOnly(timecard.end_time)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-sm bg-green-50 rounded-lg p-3">
                    <Timer className="h-4 w-4 mr-2 text-green-600" />
                    <div>
                      <p className="font-bold text-lg text-green-700">{timecard.total_hours} hours</p>
                      {timecard.break_minutes > 0 && (
                        <p className="text-xs text-gray-500">
                          <Coffee className="h-3 w-3 inline mr-1" />
                          {timecard.break_minutes}min break deducted
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center text-sm bg-blue-50 rounded-lg p-3">
                    <DollarSign className="h-4 w-4 mr-2 text-blue-600" />
                    <div>
                      <p className="font-bold text-lg text-blue-700">${cost.total.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">
                        Nurse: ${cost.nurseEarnings.toFixed(2)} + Fee: ${cost.platformFee.toFixed(2)}
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

              {/* Urgent Warning */}
              {isUrgent && timecard.status === 'Submitted' && (
                <div className="mb-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 rounded-lg">
                  <div className="flex items-center">
                    <Bell className="h-5 w-5 text-amber-600 mr-2 animate-pulse" />
                    <div>
                      <p className="font-semibold text-amber-900">⚡ Urgent: Auto-approval soon!</p>
                      <p className="text-sm text-amber-700">This timecard will be automatically approved in {timeLeft}</p>
                    </div>
                  </div>
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
                      onClick={() => handleApprove(timecard.id)}
                      disabled={actionLoading}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 shadow-md transition-all"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      {actionLoading ? 'Approving...' : 'Approve'}
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
                <Clock className="h-6 w-6 text-white" />
              </div>
              Timecard Management Center
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
                  <Bell className="h-5 w-5 text-blue-600 mr-2 mt-0.5 animate-pulse" />
                  <div>
                    <p className="font-semibold text-blue-900">⚡ Action Required</p>
                    <p className="text-sm text-blue-700">
                      You have {pendingTimecards.length} timecard{pendingTimecards.length !== 1 ? 's' : ''} waiting for approval. 
                      Remember: Timecards are auto-approved after 72 hours.
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
                  When your nurses submit timecards, they will appear here for approval.
                </p>
              </div>
            ) : (
              <Tabs defaultValue="pending" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-8 h-12 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-1">
                  <TabsTrigger value="all" className="rounded-lg font-medium">All ({timecards.length})</TabsTrigger>
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
                  <TabsTrigger value="rejected" className="rounded-lg font-medium">
                    Disputed ({rejectedTimecards.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-6">
                  <div className="space-y-6">
                    {timecards.map((timecard) => (
                      <TimecardCard key={timecard.id} timecard={timecard} />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="pending" className="mt-6">
                  {pendingTimecards.length > 0 && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
                      <div className="flex items-center">
                        <Timer className="h-5 w-5 text-blue-600 mr-2" />
                        <span className="font-semibold text-blue-900">
                          {pendingTimecards.length} timecard{pendingTimecards.length !== 1 ? 's' : ''} awaiting your approval
                        </span>
                      </div>
                    </div>
                  )}
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
              Timecard Review
            </DialogTitle>
          </DialogHeader>
          {selectedTimecard && (
            <div className="space-y-6">
              {/* Enhanced Nurse Info */}
              <div className="flex items-center space-x-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                <div className="w-16 h-16 rounded-full overflow-hidden ring-4 ring-white shadow-lg">
                  {selectedTimecard.nurse_profiles.profile_photo_url ? (
                    <img
                      src={selectedTimecard.nurse_profiles.profile_photo_url}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                      {selectedTimecard.nurse_profiles.first_name.charAt(0)}{selectedTimecard.nurse_profiles.last_name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {selectedTimecard.nurse_profiles.first_name} {selectedTimecard.nurse_profiles.last_name}
                  </h3>
                  <p className="text-gray-600">Job Code: {selectedTimecard.job_code}</p>
                  <Badge className={getStatusColor(selectedTimecard.status)}>
                    {selectedTimecard.status}
                  </Badge>
                </div>
              </div>

              {/* Enhanced Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-0 shadow-md">
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Shift Date</label>
                        <p className="text-gray-900 font-medium text-lg">
                          {formatPremiumDate(selectedTimecard.shift_date)}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Original Times</label>
                        <p className="text-gray-900 font-medium">
                          {formatTimeOnly(selectedTimecard.start_time)} - {formatTimeOnly(selectedTimecard.end_time)}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Rounded Times</label>
                        <p className="text-gray-900 font-bold text-lg">
                          {selectedTimecard.rounded_start_time} - {selectedTimecard.rounded_end_time}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md">
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Break Time</label>
                        <p className="text-gray-900 font-medium">{selectedTimecard.break_minutes} minutes</p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Hours</label>
                        <p className="text-gray-900 font-bold text-2xl">{selectedTimecard.total_hours}</p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Shift Type</label>
                        <div className="flex items-center">
                          {selectedTimecard.is_overnight ? (
                            <Badge className="bg-indigo-100 text-indigo-800">
                              <Moon className="h-3 w-3 mr-1" />
                              Overnight
                            </Badge>
                          ) : (
                            <Badge className="bg-amber-100 text-amber-800">
                              <Sun className="h-3 w-3 mr-1" />
                              Day Shift
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Enhanced Cost Breakdown */}
              <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
                <CardContent className="p-6">
                  <h4 className="font-bold text-lg text-green-900 mb-4 flex items-center">
                    <DollarSign className="h-5 w-5 mr-2" />
                    Cost Breakdown
                  </h4>
                  {(() => {
                    const cost = calculateCost(selectedTimecard.total_hours);
                    return (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-green-700">Nurse Payment ({selectedTimecard.total_hours}h × $50)</span>
                          <span className="font-semibold text-green-800">${cost.nurseEarnings.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-green-700">Platform Fee (15%)</span>
                          <span className="font-semibold text-green-800">${cost.platformFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center font-bold text-lg border-t border-green-300 pt-3">
                          <span className="text-green-900">Total Cost</span>
                          <span className="text-green-900">${cost.total.toFixed(2)}</span>
                        </div>
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>

              {/* Notes Section */}
              {selectedTimecard.notes && (
                <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
                  <CardContent className="p-6">
                    <label className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Nurse Notes</label>
                    <p className="text-blue-900 mt-2 text-lg leading-relaxed bg-white/80 p-4 rounded-lg">
                      {selectedTimecard.notes}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Dispute Section */}
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
                      onClick={() => handleApprove(selectedTimecard.id)}
                      disabled={actionLoading}
                      className="px-8 h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 shadow-lg"
                    >
                      {actionLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                          Approving...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-5 w-5 mr-2" />
                          Approve Timecard
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