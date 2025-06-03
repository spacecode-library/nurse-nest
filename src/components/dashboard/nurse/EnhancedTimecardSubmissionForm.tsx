// src/components/dashboard/nurse/EnhancedTimecardSubmissionForm.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  AlertCircle, 
  Calendar, 
  Clock, 
  CheckCircle, 
  Info, 
  Moon, 
  Sun,
  Calculator,
  Timer,
  DollarSign,
  FileText,
  Zap,
  Shield,
  CreditCard,
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { submitTimecard, calculateTotalHours } from '@/supabase/api/timecardService';
import { getNurseContracts } from '@/supabase/api/contractService';
import { calculatePaymentAmounts, formatCurrency } from '@/supabase/api/stripeConnectService';
import { supabase } from '@/integrations/supabase/client';

// Import enhanced date formatting
import { 
  formatShortPremiumDate, 
  formatDateForInput, 
  getWeekDates 
} from '@/lib/dateFormatting';

interface TimecardSubmissionFormProps {
  nurseId: string;
  onSubmitted: () => void;
  onCancel: () => void;
  stripeAccountStatus?: string;
}

interface ActiveContract {
  id: string;
  job_postings: {
    job_code: string;
    care_type: string;
  };
  client_profiles: {
    id: any;
    first_name: string;
    last_name: string;
  };
}

export default function EnhancedTimecardSubmissionForm({ 
  nurseId, 
  onSubmitted, 
  onCancel,
  stripeAccountStatus = 'not_started'
}: TimecardSubmissionFormProps) {
  const [loading, setLoading] = useState(false);
  const [loadingRate, setLoadingRate] = useState(true);
  const [activeContracts, setActiveContracts] = useState<ActiveContract[]>([]);
  const [selectedJobCode, setSelectedJobCode] = useState('');
  const [selectedContract, setSelectedContract] = useState<ActiveContract | null>(null);
  const [shiftDate, setShiftDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [breakMinutes, setBreakMinutes] = useState(30);
  const [isOvernight, setIsOvernight] = useState(false);
  const [notes, setNotes] = useState('');
  const [calculatedHours, setCalculatedHours] = useState(0);
  const [paymentPreview, setPaymentPreview] = useState<any>(null);
  const [nurseHourlyRate, setNurseHourlyRate] = useState(50); // NEW: Dynamic hourly rate

  useEffect(() => {
    loadActiveContracts();
    loadNurseHourlyRate();
  }, [nurseId]);

  useEffect(() => {
    // Calculate hours and payment preview when times change
    if (startTime && endTime) {
      const hours = calculateTotalHours(startTime, endTime, isOvernight, breakMinutes);
      setCalculatedHours(hours);
      
      // Calculate payment amounts using actual nurse rate
      const amounts = calculatePaymentAmounts(nurseHourlyRate, hours);
      setPaymentPreview(amounts);
    }
  }, [startTime, endTime, isOvernight, breakMinutes, nurseHourlyRate]);

  useEffect(() => {
    // Update selected contract when job code changes
    if (selectedJobCode) {
      const contract = activeContracts.find(c => c.job_postings.job_code === selectedJobCode);
      setSelectedContract(contract || null);
    }
  }, [selectedJobCode, activeContracts]);

  // NEW: Load nurse's actual hourly rate from preferences
  const loadNurseHourlyRate = async () => {
    try {
      setLoadingRate(true);
      
      const { data: preferences, error } = await supabase
        .from('nurse_preferences')
        .select('desired_hourly_rate')
        .eq('nurse_id', nurseId)
        .single();

      if (error) {
        console.warn('Error fetching nurse preferences:', error);
        // Keep default rate of $50 if preferences not found
        return;
      }

      if (preferences?.desired_hourly_rate) {
        setNurseHourlyRate(preferences.desired_hourly_rate);
        console.log('Loaded nurse hourly rate:', preferences.desired_hourly_rate);
      }
    } catch (error) {
      console.error('Error loading nurse hourly rate:', error);
      // Keep default rate of $50 on error
    } finally {
      setLoadingRate(false);
    }
  };

  const loadActiveContracts = async () => {
    try {
      const { data: contracts, error } = await getNurseContracts(nurseId, 50, 0);
      
      if (error) throw error;

      const activeContracts = contracts?.filter(contract => 
        contract.status === 'active'
      ) || [];

      setActiveContracts(activeContracts);

      if (activeContracts.length === 1) {
        setSelectedJobCode(activeContracts[0].job_postings.job_code);
      }
    } catch (error: any) {
      console.error('Error loading active contracts:', error);
      toast({
        title: "Error",
        description: "Failed to load active contracts",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedJobCode || !shiftDate || !startTime || !endTime) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (calculatedHours <= 0) {
      toast({
        title: "Invalid Hours",
        description: "Please check your start and end times",
        variant: "destructive"
      });
      return;
    }

    // Check if payment setup is complete
    if (stripeAccountStatus !== 'active') {
      toast({
        title: "Payment Setup Required",
        description: "Please complete your payment account setup before submitting timecards",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { weekStart, weekEnd } = getWeekDates(shiftDate);
      
      if (!selectedContract) {
        throw new Error('Selected contract not found');
      }

      const timecardData = {
        nurse_id: nurseId,
        client_id: selectedContract.client_profiles.id,
        week_start_date: weekStart,
        week_end_date: weekEnd,
        job_code: selectedJobCode,
        shift_date: shiftDate,
        start_time: startTime,
        end_time: endTime,
        is_overnight: isOvernight,
        break_minutes: breakMinutes,
        notes: notes.trim() || null
      };

      const { data, error } = await submitTimecard(timecardData);
      
      if (error) throw error;

      toast({
        title: "✨ Timecard Submitted Successfully!",
        description: (
          <div className="space-y-1">
            <p>Your timecard for {calculatedHours} hours has been submitted</p>
            <p className="text-sm">
              💰 Expected earnings: {formatCurrency(paymentPreview?.nurseNetAmount || 0)} at {formatCurrency(nurseHourlyRate)}/hr
            </p>
          </div>
        ),
        duration: 6000
      });

      onSubmitted();
    } catch (error: any) {
      console.error('Error submitting timecard:', error);
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit timecard. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (activeContracts.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="h-8 w-8 text-amber-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No Active Contracts
        </h3>
        <p className="text-gray-600 mb-4 max-w-md mx-auto text-sm">
          You need an active contract to submit timecards. Please apply for jobs and get hired first.
        </p>
        <Button variant="outline" onClick={onCancel} className="px-6">
          Close
        </Button>
      </div>
    );
  }

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <div className="space-y-4 p-1">
        {/* Enhanced Header */}
        <div className="text-center pb-2">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Timer className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-bold text-gray-900">Submit Timecard</h2>
          </div>
          <p className="text-sm text-gray-600">Log your hours for completed shifts</p>
          
          {/* Payment Status and Rate Indicator */}
          <div className="mt-3 flex items-center justify-center space-x-2">
            {stripeAccountStatus === 'active' ? (
              <Badge className="bg-green-100 text-green-800 border-green-300">
                <Shield className="h-3 w-3 mr-1" />
                Payment Ready
              </Badge>
            ) : (
              <Badge className="bg-orange-100 text-orange-800 border-orange-300">
                <AlertCircle className="h-3 w-3 mr-1" />
                Payment Setup Required
              </Badge>
            )}
            
            {/* NEW: Display actual hourly rate */}
            <Badge className="bg-blue-100 text-blue-800 border-blue-300">
              {loadingRate ? (
                <>
                  <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                  Loading rate...
                </>
              ) : (
                <>
                  <DollarSign className="h-3 w-3 mr-1" />
                  {formatCurrency(nurseHourlyRate)}/hr
                </>
              )}
            </Badge>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Contract & Shift Details */}
          <Card className="border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-base">
                <FileText className="h-4 w-4 mr-2 text-blue-600" />
                Contract & Shift Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {/* Job Selection */}
              <div>
                <Label htmlFor="jobCode" className="text-sm font-medium mb-2 block">
                  Active Contract *
                </Label>
                <Select value={selectedJobCode} onValueChange={setSelectedJobCode}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Choose an active contract" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeContracts.map((contract) => (
                      <SelectItem key={contract.id} value={contract.job_postings.job_code}>
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{contract.job_postings.job_code}</span>
                          <span className="text-xs text-gray-500">
                            {contract.job_postings.care_type} • {contract.client_profiles.first_name} {contract.client_profiles.last_name}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {/* Contract Info */}
                {selectedContract && (
                  <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-blue-600 mr-2" />
                      <span className="text-blue-900">
                        Working for: <strong>{selectedContract.client_profiles.first_name} {selectedContract.client_profiles.last_name}</strong>
                      </span>
                    </div>
                    <p className="text-xs text-blue-700 mt-1">
                      Care Type: {selectedContract.job_postings.care_type}
                    </p>
                  </div>
                )}
              </div>

              {/* Shift Date */}
              <div>
                <Label htmlFor="shiftDate" className="text-sm font-medium mb-2 block">
                  Shift Date *
                </Label>
                <Input
                  id="shiftDate"
                  type="date"
                  value={shiftDate}
                  onChange={(e) => setShiftDate(e.target.value)}
                  max={formatDateForInput(new Date())}
                  className="h-10"
                  required
                />
                {shiftDate && (
                  <p className="text-xs text-gray-600 mt-1">
                    📅 {formatShortPremiumDate(shiftDate)}
                  </p>
                )}
              </div>

              {/* Time Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startTime" className="text-sm font-medium mb-2 block">
                    Start Time *
                  </Label>
                  <div className="relative">
                    <Input
                      id="startTime"
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="h-10 pl-10"
                      required
                    />
                    <Sun className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-500" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="endTime" className="text-sm font-medium mb-2 block">
                    End Time *
                  </Label>
                  <div className="relative">
                    <Input
                      id="endTime"
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="h-10 pl-10"
                      required
                    />
                    {isOvernight ? (
                      <Moon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-indigo-500" />
                    ) : (
                      <Sun className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-500" />
                    )}
                  </div>
                </div>
              </div>

              {/* Break and Overnight */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="breakMinutes" className="text-sm font-medium mb-2 block">
                    Break Time (minutes)
                  </Label>
                  <Input
                    id="breakMinutes"
                    type="number"
                    min="0"
                    max="480"
                    value={breakMinutes}
                    onChange={(e) => setBreakMinutes(Number(e.target.value))}
                    className="h-10"
                  />
                </div>
                <div className="flex flex-col justify-end">
                  <div className="flex items-center space-x-3 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                    <Switch
                      id="isOvernight"
                      checked={isOvernight}
                      onCheckedChange={setIsOvernight}
                    />
                    <div className="flex items-center space-x-2">
                      <Moon className="h-4 w-4 text-indigo-600" />
                      <Label htmlFor="isOvernight" className="text-sm font-medium text-indigo-900">
                        Overnight
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Hours & Earnings Preview */}
          {calculatedHours > 0 && paymentPreview && !loadingRate && (
            <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-base text-green-900">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Earnings Preview - {formatCurrency(nurseHourlyRate)}/hr × {calculatedHours}h
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Timer className="h-6 w-6 text-white" />
                    </div>
                    <p className="font-bold text-xl text-green-900">{calculatedHours}</p>
                    <p className="text-sm text-green-700">Hours Worked</p>
                    <p className="text-xs text-green-600">Rounded to 15min</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <DollarSign className="h-6 w-6 text-white" />
                    </div>
                    <p className="font-bold text-xl text-blue-900">
                      {formatCurrency(paymentPreview.nurseGrossAmount)}
                    </p>
                    <p className="text-sm text-blue-700">Base Earnings</p>
                    <p className="text-xs text-blue-600">{formatCurrency(nurseHourlyRate)}/hr rate</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <CreditCard className="h-6 w-6 text-white" />
                    </div>
                    <p className="font-bold text-xl text-emerald-900">
                      {formatCurrency(paymentPreview.nurseNetAmount)}
                    </p>
                    <p className="text-sm text-emerald-700">You Receive</p>
                    <p className="text-xs text-emerald-600">After 5% fee</p>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-white/60 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-700">Platform Fee (5%):</span>
                    <span className="font-medium text-green-800">
                      {formatCurrency(paymentPreview.nurseFee)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-1">
                    <span className="text-green-700">Client Pays (rate + 10% fee):</span>
                    <span className="font-medium text-green-800">
                      {formatCurrency(paymentPreview.clientTotalAmount)}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-green-600">
                    💰 Payment processed instantly when client approves
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Loading Rate Indicator */}
          {loadingRate && (
            <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <RefreshCw className="h-5 w-5 text-blue-600 animate-spin" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Loading your hourly rate...</p>
                    <p className="text-xs text-blue-700">Fetching rate from your preferences</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          <Card className="border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-base">
                <FileText className="h-4 w-4 mr-2 text-gray-600" />
                Notes (Optional)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <Textarea
                id="notes"
                placeholder="Any additional notes about this shift..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </CardContent>
          </Card>

          {/* Payment Setup Warning */}
          {stripeAccountStatus !== 'active' && (
            <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-red-50">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-orange-900 mb-1">⚠️ Payment Setup Required</h4>
                    <p className="text-sm text-orange-800 mb-2">
                      Complete your payment account setup to receive earnings when timecards are approved.
                    </p>
                    <p className="text-xs text-orange-700">
                      Status: <strong>{stripeAccountStatus}</strong>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Enhanced Important Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-blue-900 text-sm mb-1">💡 How It Works</h4>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• Times automatically rounded to 15min intervals (in your favor)</li>
                  <li>• Client has 72 hours to approve (then auto-approved)</li>
                  <li>• Payment processed instantly upon approval</li>
                  <li>• Money deposited to your bank every Friday</li>
                  <li>• Your rate: {formatCurrency(nurseHourlyRate)}/hr (from your preferences)</li>
                </ul>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Sticky Submit Buttons */}
      <div className="sticky bottom-0 bg-white border-t pt-4 mt-4">
        <div className="flex justify-end space-x-3 px-1">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
            className="h-10 px-6"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={loading || calculatedHours <= 0 || stripeAccountStatus !== 'active' || loadingRate}
            className="h-10 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Submitting...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Submit Timecard
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}