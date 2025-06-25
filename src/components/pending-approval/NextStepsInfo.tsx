
import React from 'react';

export default function NextStepsInfo() {
  return (
    <div className="p-4 bg-medical-primary/5 border border-medical-primary/20 rounded-xl">
      <h4 className="font-semibold text-medical-primary mb-2">What happens next?</h4>
      <ul className="text-sm text-medical-text-secondary space-y-1">
        <li>• You'll receive an email when your application is approved</li>
        <li>• Access to your nursing dashboard with job opportunities</li>
        <li>• Ability to apply for positions and manage contracts</li>
        <li>• Complete payment setup to start earning</li>
      </ul>
    </div>
  );
}
