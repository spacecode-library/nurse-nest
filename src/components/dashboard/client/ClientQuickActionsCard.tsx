// components/dashboard/client/ClientQuickActionsCard.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Users, Clock, FileText, DollarSign, Briefcase, Search } from 'lucide-react';
import JobPostingForm from './JobPostingForm';

interface ClientQuickActionsCardProps {
  clientId: string;
  onRefresh: () => void;
}

export default function ClientQuickActionsCard({ clientId, onRefresh }: ClientQuickActionsCardProps) {
  const [showJobForm, setShowJobForm] = useState(false);

  const quickActions = [
    {
      id: 'post-job',
      title: 'Post New Job',
      description: 'Create a new job posting',
      icon: Plus,
      color: 'bg-blue-500 hover:bg-blue-600',
      action: () => setShowJobForm(true)
    },
    {
      id: 'browse-nurses',
      title: 'Browse Nurses',
      description: 'Find qualified nurses',
      icon: Search,
      color: 'bg-emerald-500 hover:bg-emerald-600',
      action: () => {
        // Navigate to browse nurses tab
        const browseTab = document.querySelector('[value="browse"]') as HTMLElement;
        browseTab?.click();
      }
    },
    {
      id: 'review-applicants',
      title: 'Review Applicants',
      description: 'Check new applications',
      icon: Users,
      color: 'bg-green-500 hover:bg-green-600',
      action: () => {
        // Scroll to applicants tab
        const applicantsTab = document.querySelector('[value="applicants"]') as HTMLElement;
        applicantsTab?.click();
      }
    },
    {
      id: 'approve-timecards',
      title: 'Approve Timecards',
      description: 'Review pending hours',
      icon: Clock,
      color: 'bg-amber-500 hover:bg-amber-600',
      action: () => {
        // Scroll to timecards tab
        const timecardsTab = document.querySelector('[value="timecards"]') as HTMLElement;
        timecardsTab?.click();
      }
    },
    {
      id: 'manage-contracts',
      title: 'Manage Contracts',
      description: 'View active agreements',
      icon: FileText,
      color: 'bg-purple-500 hover:bg-purple-600',
      action: () => {
        // Scroll to contracts tab
        const contractsTab = document.querySelector('[value="contracts"]') as HTMLElement;
        contractsTab?.click();
      }
    },
    {
      id: 'view-billing',
      title: 'View Billing',
      description: 'Check payments & invoices',
      icon: DollarSign,
      color: 'bg-indigo-500 hover:bg-indigo-600',
      action: () => {
        // Scroll to billing tab
        const billingTab = document.querySelector('[value="billing"]') as HTMLElement;
        billingTab?.click();
      }
    }
  ];

  const handleJobCreated = () => {
    setShowJobForm(false);
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
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

      {/* Job Posting Dialog */}
      <Dialog open={showJobForm} onOpenChange={setShowJobForm}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Job Posting</DialogTitle>
          </DialogHeader>
          <JobPostingForm 
            clientId={clientId}
            onJobCreated={handleJobCreated}
            onCancel={() => setShowJobForm(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}