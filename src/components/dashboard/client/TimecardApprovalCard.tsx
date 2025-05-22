// components/dashboard/client/TimecardApprovalCard.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { 
  Clock, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Timer,
  User,
  AlertCircle,
  DollarSign
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { getClientTimecards, approveTimecard, rejectTimecard } from '@/supabase/api/timecardService';

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
        title: "Timecard Approved",
        description: "The timecard has been approved and will be processed for payment"
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
        description: "The nurse has been notified of the rejection"
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
      <Card className={`hover:shadow-md transition-shadow ${isUrgent ? 'border-amber-300 bg-amber-50' : ''}`}>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-semibold text-lg text-gray-900">
                {timecard.nurse_profiles.first_name} {timecard.nurse_profiles.last_name}
              </h3>
              <p className="text-gray-600">{timecard.job_code}</p>
            </div>
            <div className="text-right">
              <Badge className={getStatusColor(timecard.status)}>
                {timecard.status}
              </Badge>
              {timecard.status === 'Submitted' && (
                <p className={`text-xs mt-1 ${isUrgent ? 'text-amber-600 font-medium' : 'text-gray-500'}`}>
                  {timeLeft}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div>
              <div className="flex items-center text-gray-600 mb-1">
                <Calendar className="h-4 w-4 mr-2" />
                {new Date(timecard.shift_date).toLocaleDateString()}
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="h-4 w-4 mr-2" />
                {timecard.rounded_start_time} - {timecard.rounded_end_time}
                {timecard.is_overnight && (
                  <Badge variant="outline" className="ml-2 text-xs">Overnight</Badge>
                )}
              </div>
            </div>
            <div>
              <div className="text-gray-600 mb-1">
                <span className="font-medium">Hours:</span> {timecard.total_hours}
                {timecard.break_minutes > 0 && (
                  <span className="text-xs ml-1">(Break: {timecard.break_minutes}min)</span>
                )}
              </div>
              <div className="flex items-center text-gray-600">
                <DollarSign className="h-4 w-4 mr-1" />
                <span className="font-medium">${cost.total.toFixed(2)}</span>
                <span className="text-xs ml-1 text-gray-500">total</span>
              </div>
            </div>
          </div>

          {timecard.notes && (
            <div className="mb-4 p-3 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Notes:</span> {timecard.notes}
              </p>
            </div>
          )}

          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedTimecard(timecard)}
            >
              View Details
            </Button>
            
            {timecard.status === 'Submitted' && (
              <>
                <Button
                  size="sm"
                  onClick={() => handleApprove(timecard.id)}
                  disabled={actionLoading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedTimecard(timecard)}
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Dispute
                </Button>
              </>
            )}
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
        {/* Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Timecard Approval
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{pendingTimecards.length}</p>
                <p className="text-sm text-gray-600">Pending Approval</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{approvedTimecards.length}</p>
                <p className="text-sm text-gray-600">Approved</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-600">{rejectedTimecards.length}</p>
                <p className="text-sm text-gray-600">Disputed</p>
              </div>
            </div>
            
            {pendingTimecards.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <Timer className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900">Action Required</p>
                    <p className="text-sm text-blue-700">
                      You have {pendingTimecards.length} timecard{pendingTimecards.length !== 1 ? 's' : ''} waiting for approval. 
                      Timecards are auto-approved after 24 hours.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Timecards List */}
        <Card>
          <CardHeader>
            <CardTitle>Timecard History</CardTitle>
          </CardHeader>
          <CardContent>
            {timecards.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Timecards Yet
                </h3>
                <p className="text-gray-600">
                  When your nurses submit timecards, they will appear here for approval.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Pending Timecards First */}
                {pendingTimecards.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                      <Timer className="h-4 w-4 mr-2 text-blue-600" />
                      Pending Approval ({pendingTimecards.length})
                    </h4>
                    <div className="space-y-3">
                      {pendingTimecards.map((timecard) => (
                        <TimecardCard key={timecard.id} timecard={timecard} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Timecards */}
                {timecards.filter(tc => tc.status !== 'Submitted').slice(0, 5).length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Recent Activity
                    </h4>
                    <div className="space-y-3">
                      {timecards
                        .filter(tc => tc.status !== 'Submitted')
                        .slice(0, 5)
                        .map((timecard) => (
                          <TimecardCard key={timecard.id} timecard={timecard} />
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Timecard Details Dialog */}
      <Dialog open={!!selectedTimecard} onOpenChange={() => {
        setSelectedTimecard(null);
        setRejectionReason('');
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Timecard Details</DialogTitle>
          </DialogHeader>
          {selectedTimecard && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Nurse</label>
                  <p className="text-gray-900">
                    {selectedTimecard.nurse_profiles.first_name} {selectedTimecard.nurse_profiles.last_name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Job Code</label>
                  <p className="text-gray-900">{selectedTimecard.job_code}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Shift Date</label>
                  <p className="text-gray-900">
                    {new Date(selectedTimecard.shift_date).toLocaleDateString()}
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

              {/* Cost Breakdown */}
              <Card className="bg-gray-50">
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">Cost Breakdown</h4>
                  {(() => {
                    const cost = calculateCost(selectedTimecard.total_hours);
                    return (
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Nurse Payment ({selectedTimecard.total_hours}h × $50)</span>
                          <span>${cost.nurseEarnings.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Platform Fee (15%)</span>
                          <span>${cost.platformFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-medium border-t pt-1">
                          <span>Total Cost</span>
                          <span>${cost.total.toFixed(2)}</span>
                        </div>
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>

              {selectedTimecard.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Nurse Notes</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                    {selectedTimecard.notes}
                  </p>
                </div>
              )}

              {selectedTimecard.status === 'Submitted' && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Dispute Reason (if rejecting)</label>
                  <Textarea
                    placeholder="Explain why you're disputing this timecard..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows={3}
                  />
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedTimecard(null);
                    setRejectionReason('');
                  }}
                >
                  Close
                </Button>
                
                {selectedTimecard.status === 'Submitted' && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => handleReject(selectedTimecard.id, rejectionReason)}
                      disabled={actionLoading}
                      className="text-red-600 border-red-600 hover:bg-red-50"
                    >
                      {actionLoading ? 'Rejecting...' : 'Dispute Timecard'}
                    </Button>
                    <Button
                      onClick={() => handleApprove(selectedTimecard.id)}
                      disabled={actionLoading}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {actionLoading ? 'Approving...' : 'Approve Timecard'}
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