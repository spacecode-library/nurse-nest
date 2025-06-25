
import React from 'react';
import { Shield, CheckCircle, FileText, Sparkles } from 'lucide-react';

const reviewItems = [
  { icon: Shield, text: "Nursing license verification", status: "reviewing" },
  { icon: CheckCircle, text: "Professional certifications", status: "reviewing" },
  { icon: FileText, text: "Background and credentials", status: "reviewing" },
  { icon: Sparkles, text: "Profile completeness", status: "complete" }
];

export default function ReviewItemsList() {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-medical-text-primary flex items-center">
        <FileText className="h-5 w-5 mr-2 text-medical-primary" />
        What We're Reviewing
      </h3>
      <div className="grid grid-cols-1 gap-3">
        {reviewItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="flex items-center space-x-3 p-3 bg-medical-neutral-50 rounded-lg">
              <Icon className={`h-4 w-4 ${
                item.status === 'complete' 
                  ? 'text-medical-success' 
                  : 'text-medical-warning'
              }`} />
              <span className="text-sm text-medical-text-primary flex-1">
                {item.text}
              </span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                item.status === 'complete'
                  ? 'bg-medical-success text-white'
                  : 'bg-medical-warning text-white'
              }`}>
                {item.status === 'complete' ? 'Complete' : 'Reviewing'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
