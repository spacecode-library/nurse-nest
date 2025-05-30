// components/dashboard/nurse/TimecardSubmissionForm.tsx
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
  Zap
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { submitTimecard, calculateTotalHours } from '@/supabase/api/timecardService';
import { getNurseContracts } from '@/supabase/api/contractService';

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

export default function TimecardSubmissionForm({ 
  nurseId, 
  onSubmitted, 
  onCancel 
}: TimecardSubmissionFormProps) {
  const [loading, setLoading] = useState(false);
  const [activeContracts, setActiveContracts] = useState<ActiveContract[]>([]);
  const [selectedJobCode, setSelectedJobCode] = useState('');
  const [shiftDate, setShiftDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [breakMinutes, setBreakMinutes] = useState(30);
  const [isOvernight, setIsOvernight] = useState(false);
  const [notes, setNotes] = useState('');
  const [calculatedHours, setCalculatedHours] = useState(0);
  const [estimatedEarnings, setEstimatedEarnings] = useState(0);

  useEffect(() => {
    loadActiveContracts();
  }, [nurseId]);

  useEffect(() => {
    // Calculate hours when times change
    if (startTime && endTime) {
      const hours = calculateTotalHours(startTime, endTime, isOvernight, breakMinutes);
      setCalculatedHours(hours);
      setEstimatedEarnings(hours * 50); // Assuming $50/hour base rate
    }
  }, [startTime, endTime, isOvernight, breakMinutes]);

  const loadActiveContracts = async () => {
    try {
      const { data: contracts, error } = await getNurseContracts(nurseId, 50, 0);
      console.log( "Here is a contract :", error);
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

    setLoading(true);

    try {
      const { weekStart, weekEnd } = getWeekDates(new Date(shiftDate));
      
      // Find the selected contract to get client_id
      const selectedContract = activeContracts.find(
        contract => contract.job_postings.job_code === selectedJobCode
      );

      if (!selectedContract) {
        throw new Error('Selected job not found');
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
        description: `Your timecard for ${calculatedHours} hours has been submitted for approval`,
        duration: 5000
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
        {/* Compact Header */}
        <div className="text-center pb-2">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Timer className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-bold text-gray-900">Submit Timecard</h2>
          </div>
          <p className="text-sm text-gray-600">Log your hours for completed shifts</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Contract & Shift Details - Combined */}
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

          {/* Hours Calculation Display */}
          {calculatedHours > 0 && (
            <Card className="border-emerald-200 bg-emerald-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                      <Calculator className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-lg text-emerald-900">
                        {calculatedHours} hours
                      </p>
                      <p className="text-xs text-emerald-700">
                        Rounded to 15 min
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-4 w-4 text-emerald-600" />
                      <span className="text-lg font-bold text-emerald-800">
                        ${estimatedEarnings.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-emerald-600">Est. earnings</p>
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

          {/* Compact Important Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-blue-900 text-sm mb-1">Key Points</h4>
                <p className="text-xs text-blue-800">
                  Times rounded to 15min • 72hr approval deadline • Auto-approved if overdue • Payment after approval
                </p>
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
            disabled={loading || calculatedHours <= 0}
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
                Submit
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}