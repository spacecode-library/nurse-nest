
import React from "react";

export default function NurseLlcGuideSidebar() {
  return (
    <aside className="w-full lg:max-w-xs flex-shrink-0 pt-2">
      {/* Related Resources */}
      <div className="mb-10 p-6 bg-blue-50 border-l-4 border-[#9bcbff] rounded-lg shadow">
        <h3 className="font-semibold mb-3 text-[#1e293b] text-lg">Related Resources</h3>
        <ul className="space-y-2 text-base text-blue-700">
          <li><a href="/nurse-llc-setup-guide" className="hover:underline">Complete LLC Setup Guide</a></li>
          <li><a href="/get-ein-nurse-business" className="hover:underline">EIN Application Guide</a></li>
          <li><a href="/business-bank-account-for-nurses" className="hover:underline">Business Banking Guide</a></li>
          <li><a href="/malpractice-insurance-for-nurses" className="hover:underline">Insurance Requirements</a></li>
          <li><a href="/blog/ein-vs-ssn-what-nurses-need-to-know" className="hover:underline">EIN vs SSN Guide</a></li>
        </ul>
      </div>
      {/* Professional Services */}
      <div className="p-6 bg-gray-100 rounded-lg shadow">
        <h3 className="font-semibold mb-3 text-[#1e293b] text-lg">Professional Services</h3>
        <div className="flex flex-col gap-3">
          <a href="https://legalzoomcominc.pxf.io/aOYdEN" target="_blank" rel="noopener" className="w-full text-center px-4 py-2 bg-[#9bcbff] text-white rounded-md font-medium transition hover:bg-[#3b82f6]">LegalZoom LLC Services</a>
          <a href="http://shrsl.com/2qj12-1hzb-kp67" target="_blank" rel="noopener" className="w-full text-center px-4 py-2 bg-[#1e293b] text-white rounded-md font-medium transition hover:bg-[#3b82f6]">Northwest Registered Agent</a>
        </div>
      </div>
    </aside>
  );
}
