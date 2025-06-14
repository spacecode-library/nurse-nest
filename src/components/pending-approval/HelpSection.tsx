
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function HelpSection() {
  const navigate = useNavigate();

  return (
    <div className="mt-6 text-center">
      <p className="text-sm text-medical-text-secondary">
        Questions about your application? 
        <button 
          onClick={() => navigate('/contact')}
          className="text-medical-primary hover:underline ml-1 font-medium"
        >
          Contact our support team
        </button>
      </p>
    </div>
  );
}
