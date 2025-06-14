
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, AlertCircle } from 'lucide-react';

export default function StatusCard() {
  return (
    <Card className="border-0 shadow-medical-elevated bg-white overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-medical-warning/10 to-medical-primary/10 border-b border-medical-border">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-medical-warning to-medical-primary rounded-full flex items-center justify-center shadow-medical-soft">
            <Clock className="h-8 w-8 text-white animate-pulse" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-center text-medical-text-primary">
          Application Under Review
        </CardTitle>
        <p className="text-center text-medical-text-secondary mt-2">
          Your nursing profile has been successfully submitted
        </p>
      </CardHeader>
      
      <CardContent className="p-8 space-y-6">
        <div className="text-center space-y-4">
          <div className="p-4 bg-medical-warning/10 border border-medical-warning/20 rounded-xl">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-medical-warning mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <p className="font-semibold text-medical-warning mb-1">
                  Verification in Progress
                </p>
                <p className="text-sm text-medical-text-secondary">
                  Our team is currently reviewing your credentials, licenses, and professional qualifications. 
                  This process typically takes 24-48 hours during business days.
                </p>
              </div>
            </div>
          </div>

          <p className="text-medical-text-secondary">
            You'll receive an email notification once your application has been approved 
            and you can access your nursing dashboard.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
