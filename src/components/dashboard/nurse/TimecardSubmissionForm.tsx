// components/dashboard/nurse/TimecardSubmissionForm.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, Calendar, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { submitTimecard, calculateTotalHours } from '@/supabase/api/timecardService';
import { getNurseContracts } from '@/supabase/api/contractService';

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

  useEffect(() => {
    loadActiveContracts();
  }, [nurseId]);

  useEffect(() => {
    // Calculate hours when times change
    if (startTime && endTime) {
      const hours = calculateTotalHours(startTime, endTime, isOvernight, breakMinutes);
      setCalculatedHours(hours);
    }
  }, [startTime, endTime, isOvernight, breakMinutes]);

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

  const getWeekDates = (date: string) => {
    const shiftDateObj = new Date(date);
    const dayOfWeek = shiftDateObj.getDay();
    
    // Calculate week start (Sunday)
    const weekStart = new Date(shiftDateObj);
    weekStart.setDate(shiftDateObj.getDate() - dayOfWeek);
    
    // Calculate week end (Saturday)
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    
    return {
      weekStart: weekStart.toISOString().split('T')[0],
      weekEnd: weekEnd.toISOString().split('T')[0]
    };
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
      const { weekStart, weekEnd } = getWeekDates(shiftDate);
      
      // Find the selected contract to get client_id
      const selectedContract = activeContracts.find(
        contract => contract.job_postings.job_code === selectedJobCode
      );

      if (!selectedContract) {
        throw new Error('Selected job not found');
      }

      const timecardData = {
        nurse_id: nurseId,
        client_id: selectedContract.client_profiles.id, // This should be client_id from the contract
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
        title: "Timecard Submitted",
        description: `Your timecard for ${calculatedHours} hours has been submitted for approval`,
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
        <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No Active Contracts
        </h3>
        <p className="text-gray-600 mb-4">
          You need an active contract to submit timecards. Please apply for jobs and get hired first.
        </p>
        <Button variant="outline" onClick={onCancel}>
          Close
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Job Selection */}
      <div>
        <Label htmlFor="jobCode">Select Job *</Label>
        <Select value={selectedJobCode} onValueChange={setSelectedJobCode}>
          <SelectTrigger>
            <SelectValue placeholder="Choose an active contract" />
          </SelectTrigger>
          <SelectContent>
            {activeContracts.map((contract) => (
              <SelectItem key={contract.id} value={contract.job_postings.job_code}>
                {contract.job_postings.job_code} - {contract.job_postings.care_type} 
                ({contract.client_profiles.first_name} {contract.client_profiles.last_name})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Shift Date */}
      <div>
        <Label htmlFor="shiftDate">Shift Date *</Label>
        <Input
          id="shiftDate"
          type="date"
          value={shiftDate}
          onChange={(e) => setShiftDate(e.target.value)}
          max={new Date().toISOString().split('T')[0]} // Can't be future date
          required
        />
      </div>

      {/* Time Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startTime">Start Time *</Label>
          <Input
            id="startTime"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="endTime">End Time *</Label>
          <Input
            id="endTime"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Break and Overnight */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="breakMinutes">Break Time (minutes)</Label>
          <Input
            id="breakMinutes"
            type="number"
            min="0"
            max="480"
            value={breakMinutes}
            onChange={(e) => setBreakMinutes(Number(e.target.value))}
          />
        </div>
        <div className="flex items-center space-x-2 pt-6">
          <Switch
            id="isOvernight"
            checked={isOvernight}
            onCheckedChange={setIsOvernight}
          />
          <Label htmlFor="isOvernight">Overnight Shift</Label>
        </div>
      </div>

      {/* Hours Calculation Display */}
      {calculatedHours > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-blue-900">
                Total Hours: {calculatedHours} hours
              </span>
              <span className="text-sm text-blue-700">
                (Times will be rounded to nearest 15 minutes)
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notes */}
      <div>
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea
          id="notes"
          placeholder="Any additional notes about this shift..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />
      </div>

      {/* Submit Buttons */}
      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading || calculatedHours <= 0}
        >
          {loading ? 'Submitting...' : 'Submit Timecard'}
        </Button>
      </div>
    </form>
  );
}