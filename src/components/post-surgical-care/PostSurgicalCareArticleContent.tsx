
import React from 'react';
import { Shield, Pill, Activity, CheckCircle } from 'lucide-react';

export default function PostSurgicalCareArticleContent() {
  return (
    <div className="prose prose-lg max-w-none">
      <p className="lead text-xl text-gray-600">
        Effective post-surgical care is crucial for a smooth and speedy recovery. A dedicated nurse ensures that patients receive the professional medical attention, support, and monitoring they need after a procedure, right in the comfort of their own home.
      </p>

      <section id="what-is-post-surgical-care" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800">What is Post-Surgical Care?</h2>
        <p>
          Post-surgical care, or post-operative care, is the care a patient receives after a surgical procedure. The goal is to monitor for complications, manage pain and symptoms, and support the body’s healing process. This care is critical in preventing infections and ensuring the best possible outcome.
        </p>
      </section>

      <section id="key-responsibilities" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800">Key Responsibilities of a Post-Surgical Nurse</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center gap-3 mb-3">
              <Pill className="w-6 h-6 text-blue-500" />
              <h3 className="text-lg font-semibold">Pain & Medication Management</h3>
            </div>
            <p className="text-gray-600">Administering medications on schedule, monitoring for side effects, and managing pain levels effectively.</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center gap-3 mb-3">
              <Shield className="w-6 h-6 text-green-500" />
              <h3 className="text-lg font-semibold">Wound Care & Infection Prevention</h3>
            </div>
            <p className="text-gray-600">Properly cleaning and dressing surgical wounds, and monitoring for signs of infection like redness or swelling.</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center gap-3 mb-3">
              <Activity className="w-6 h-6 text-red-500" />
              <h3 className="text-lg font-semibold">Monitoring Vital Signs</h3>
            </div>
            <p className="text-gray-600">Regularly checking blood pressure, heart rate, temperature, and breathing to ensure stability.</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle className="w-6 h-6 text-purple-500" />
              <h3 className="text-lg font-semibold">Patient & Family Education</h3>
            </div>
            <p className="text-gray-600">Instructing on proper recovery techniques, dietary needs, and when to contact a doctor.</p>
          </div>
        </div>
      </section>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-8">
        <p className="text-gray-700">
          <strong>Key Insight:</strong> In-home post-surgical nursing care can significantly reduce the risk of hospital readmission by providing professional oversight during the critical initial recovery period.
        </p>
      </div>

       <section id="finding-care" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800">Finding the Right Care</h2>
        <p>
          When looking for a post-surgical care nurse, it's important to find someone with experience relevant to the specific type of surgery performed. Platforms like Nurse Nest connect families with qualified, vetted nurses who specialize in providing compassionate and skilled post-operative support.
        </p>
      </section>
    </div>
  );
}
