
import React from 'react';
import NurseNestNavbar from '@/components/NurseNestNavbar';
import StatusCard from '@/components/pending-approval/StatusCard';
import ReviewItemsList from '@/components/pending-approval/ReviewItemsList';
import ActionButtons from '@/components/pending-approval/ActionButtons';
import NextStepsInfo from '@/components/pending-approval/NextStepsInfo';
import HelpSection from '@/components/pending-approval/HelpSection';

export default function PendingApprovalPage() {
  return (
    <div className="min-h-screen bg-medical-gradient-primary">
      <NurseNestNavbar />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <StatusCard />
            
            <div className="mt-8 p-6 bg-white rounded-xl shadow-medical-soft">
              <ReviewItemsList />
              <ActionButtons />
              <NextStepsInfo />
            </div>

            <HelpSection />
          </div>
        </div>
      </main>
    </div>
  );
}
