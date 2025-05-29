// components/dashboard/nurse/QuickActionsCard.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Clock, Briefcase, DollarSign, FileText } from 'lucide-react';
import TimecardSubmissionForm from './TimecardSubmissionForm';

interface QuickActionsCardProps {
  nurseId: string;
  onRefresh: () => void;
}

export default function QuickActionsCard({ nurseId, onRefresh }: QuickActionsCardProps) {
  const [showTimecardForm, setShowTimecardForm] = useState(false);

  const quickActions = [
    {
      id: 'submit-timecard',
      title: 'Submit Timecard',
      description: 'Log your hours for completed shifts',
      icon: Clock,
      color: 'bg-blue-500 hover:bg-blue-600',
      action: () => setShowTimecardForm(true)
    },,
    {
      id: 'browse-jobs',
      title: 'Browse Jobs',
      description: 'Find new opportunities',
      icon: Briefcase,
      color: 'bg-green-500 hover:bg-green-600',
      action: () => {
        // Scroll to jobs tab or activate it
        const jobsTab = document.querySelector('[value="jobs"]') as HTMLElement;
        jobsTab?.click();
      }
    },
    {
      id: 'view-earnings',
      title: 'View Earnings',
      description: 'Check your payment history',
      icon: DollarSign,
      color: 'bg-purple-500 hover:bg-purple-600',
      action: () => {
        // Navigate to earnings/payments section
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    {
      id: 'upload-documents',
      title: 'Upload Documents',
      description: 'Update certifications or licenses',
      icon: FileText,
      color: 'bg-orange-500 hover:bg-orange-600',
      action: () => {
        // Navigate to profile/documents section
        window.location.href = '/profile?tab=documents';
      }
    }
  ];

  const handleTimecardSubmitted = () => {
    setShowTimecardForm(false);
    onRefresh();
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.id}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center space-y-2 hover:shadow-md transition-all"
                  onClick={action.action}
                >
                  <div className={`p-3 rounded-full ${action.color} text-white`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-gray-900">{action.title}</p>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Timecard Submission Dialog */}
      <Dialog open={showTimecardForm} onOpenChange={setShowTimecardForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Submit Weekly Timecard</DialogTitle>
          </DialogHeader>
          <TimecardSubmissionForm 
            nurseId={nurseId}
            onSubmitted={handleTimecardSubmitted}
            onCancel={() => setShowTimecardForm(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}