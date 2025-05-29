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
  Sparkles,
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
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="h-10 w-10 text-amber-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          No Active Contracts
        </h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          You need an active contract to submit timecards. Please apply for jobs and get hired first.
        </p>
        <Button variant="outline" onClick={onCancel} className="px-8">
          Close
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Timer className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Submit Timecard</h2>
        <p className="text-gray-600">Log your hours for completed shifts</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Job Selection */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50/30">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
            <CardTitle className="flex items-center text-lg">
              <FileText className="h-5 w-5 mr-2 text-blue-600" />
              Contract Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div>
              <Label htmlFor="jobCode" className="text-base font-semibold mb-3 block">
                Select Active Contract *
              </Label>
              <Select value={selectedJobCode} onValueChange={setSelectedJobCode}>
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder="Choose an active contract" />
                </SelectTrigger>
                <SelectContent>
                  {activeContracts.map((contract) => (
                    <SelectItem key={contract.id} value={contract.job_postings.job_code}>
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{contract.job_postings.job_code}</span>
                        <span className="text-sm text-gray-500">
                          {contract.job_postings.care_type} • {contract.client_profiles.first_name} {contract.client_profiles.last_name}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Shift Details */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-green-50/30">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
            <CardTitle className="flex items-center text-lg">
              <Calendar className="h-5 w-5 mr-2 text-green-600" />
              Shift Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Shift Date */}
            <div>
              <Label htmlFor="shiftDate" className="text-base font-semibold mb-3 block">
                Shift Date *
              </Label>
              <Input
                id="shiftDate"
                type="date"
                value={shiftDate}
                onChange={(e) => setShiftDate(e.target.value)}
                max={formatDateForInput(new Date())} // Can't be future date
                className="h-12 text-base"
                required
              />
              {shiftDate && (
                <p className="text-sm text-gray-600 mt-2">
                  📅 {formatShortPremiumDate(shiftDate)}
                </p>
              )}
            </div>

            {/* Time Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="startTime" className="text-base font-semibold mb-3 block">
                  Start Time *
                </Label>
                <div className="relative">
                  <Input
                    id="startTime"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="h-12 text-base pl-12"
                    required
                  />
                  <Sun className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-amber-500" />
                </div>
              </div>
              <div>
                <Label htmlFor="endTime" className="text-base font-semibold mb-3 block">
                  End Time *
                </Label>
                <div className="relative">
                  <Input
                    id="endTime"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="h-12 text-base pl-12"
                    required
                  />
                  {isOvernight ? (
                    <Moon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-indigo-500" />
                  ) : (
                    <Sun className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-amber-500" />
                  )}
                </div>
              </div>
            </div>

            {/* Break and Overnight */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="breakMinutes" className="text-base font-semibold mb-3 block">
                  Break Time (minutes)
                </Label>
                <Input
                  id="breakMinutes"
                  type="number"
                  min="0"
                  max="480"
                  value={breakMinutes}
                  onChange={(e) => setBreakMinutes(Number(e.target.value))}
                  className="h-12 text-base"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Default 30 minutes • Maximum 8 hours
                </p>
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
                  <Switch
                    id="isOvernight"
                    checked={isOvernight}
                    onCheckedChange={setIsOvernight}
                  />
                  <div className="flex items-center space-x-2">
                    <Moon className="h-5 w-5 text-indigo-600" />
                    <Label htmlFor="isOvernight" className="font-medium text-indigo-900">
                      Overnight Shift
                    </Label>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Enable if shift crosses midnight
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hours Calculation Display */}
        {calculatedHours > 0 && (
          <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-green-100 border-emerald-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center">
                    <Calculator className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-xl text-emerald-900">
                      {calculatedHours} hours total
                    </p>
                    <p className="text-sm text-emerald-700">
                      Times rounded to nearest 15 minutes
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-emerald-600" />
                    <span className="text-2xl font-bold text-emerald-800">
                      ${estimatedEarnings.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-emerald-600">Estimated earnings</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notes */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <FileText className="h-5 w-5 mr-2 text-gray-600" />
              Additional Notes
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div>
              <Label htmlFor="notes" className="text-base font-semibold mb-3 block">
                Shift Notes (Optional)
              </Label>
              <Textarea
                id="notes"
                placeholder="Any additional notes about this shift... (e.g., special tasks performed, client updates, etc.)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="text-base resize-none"
              />
              <p className="text-sm text-gray-500 mt-2">
                These notes will be visible to the client when reviewing your timecard
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Important Information */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Info className="h-4 w-4 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">Important Reminders</h4>
                <ul className="space-y-1 text-sm text-blue-800">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                    Times are automatically rounded to nearest 15 minutes in your favor
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                    Client has 72 hours to approve (auto-approved after deadline)
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                    Payment processing begins after approval
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                    You'll receive notifications about approval status
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
            className="h-12 px-8 text-base"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading || calculatedHours <= 0}
            className="h-12 px-8 text-base bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-0 shadow-lg"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                Submitting...
              </>
            ) : (
              <>
                <Zap className="h-5 w-5 mr-2" />
                Submit Timecard
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}