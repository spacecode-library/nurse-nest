
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';

interface ClickwrapAgreementProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  error?: boolean;
}

export default function ClickwrapAgreement({ 
  checked, 
  onCheckedChange,
  error = false 
}: ClickwrapAgreementProps) {
  return (
    <div className="mb-6 border rounded-md p-4 bg-gray-50">
      <div className="flex items-start space-x-2 mb-3">
        <Checkbox
          id="agreement" 
          checked={checked}
          onCheckedChange={onCheckedChange}
          className={error ? "border-red-500" : ""}
        />
        <div>
          <label 
            htmlFor="agreement" 
            className={`text-sm font-medium ${error ? "text-red-500" : ""}`}
          >
            I have read and agree to the Nurse Nest{" "}
            <Link to="/terms" target="_blank" className="text-primary-500 hover:underline">
              Terms of Service
            </Link>,{" "}
            <Link to="/privacy" target="_blank" className="text-primary-500 hover:underline">
              Privacy Policy
            </Link>, and{" "}
            <Link to="#" className="text-primary-500 hover:underline">
              Client Acknowledgment and Waiver
            </Link>.
          </label>
          {error && <p className="text-xs text-red-500 mt-1">You must agree to the terms to proceed.</p>}
        </div>
      </div>
      
      <Accordion type="single" collapsible className="bg-white rounded-md border mt-4">
        <AccordionItem value="acknowledgment">
          <AccordionTrigger className="px-4 py-2 text-sm">
            View Client Acknowledgment and Waiver
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 text-xs text-gray-600 overflow-auto max-h-60">
            <h3 className="font-bold mb-2">Client Acknowledgment and Waiver</h3>
            <p className="mb-2">Effective Date: May 5, 2025</p>
            <p className="mb-2">By using the Nurse Nest platform (the "Service") and agreeing to this Client Acknowledgment and Waiver ("Acknowledgment"), you ("Client") confirm your understanding of Nurse Nest LLC's ("Nurse Nest") role and your responsibilities as a user of the Service. This Acknowledgment is incorporated into and forms part of the Nurse Nest Terms of Service.</p>
            
            <h4 className="font-semibold mt-3 mb-1">1. Nature of Service</h4>
            <p className="mb-2">Client acknowledges that:</p>
            <ul className="list-disc pl-5 mb-2 space-y-1">
              <li>Nurse Nest is a third-party marketplace that facilitates connections between clients and independent nurses ("Nurses") for potential hiring arrangements.</li>
              <li>Nurse Nest is not a healthcare provider, employer, or staffing agency and does not provide medical care, supervise Nurses, or control the services they provide.</li>
              <li>Nurses are independent contractors or business owners who contract directly with Client, and Nurse Nest is not a party to any agreement between Client and Nurses.</li>
            </ul>
            
            <h4 className="font-semibold mt-3 mb-1">2. Client Responsibilities</h4>
            <p className="mb-2">Client agrees to:</p>
            <ul className="list-disc pl-5 mb-2 space-y-1">
              <li>Provide accurate and complete information during the intake process, including preferences for nurse specialty, location, and shift times.</li>
              <li>Independently verify the qualifications, licensure, and suitability of Nurses beyond the vetting provided by Nurse Nest.</li>
              <li>Assume all risks and responsibilities associated with hiring and working with Nurses, including any harm, injury, or damages resulting from Nurse services.</li>
              <li>Contract directly with Nurses, negotiating terms, compensation, and scope of services independently.</li>
            </ul>
            
            <h4 className="font-semibold mt-3 mb-1">3. Limitation of Nurse Nest's Role</h4>
            <p className="mb-2">Client acknowledges that:</p>
            <ul className="list-disc pl-5 mb-2 space-y-1">
              <li>Nurse Nest's vetting process does not guarantee the accuracy of Nurse information, the suitability of any match, or the quality of Nurse services.</li>
              <li>Nurse Nest does not warrant or guarantee the performance, professionalism, or outcomes of Nurses' services.</li>
              <li>Nurse Nest is not liable for any direct, indirect, incidental, or consequential damages arising from Nurse services, Client-Nurse interactions, or use of the Service.</li>
            </ul>
            
            <h4 className="font-semibold mt-3 mb-1">4. Assumption of Risk</h4>
            <p className="mb-2">Client understands and accepts all risks associated with hiring Nurses through the Service, including but not limited to risks of inadequate care, negligence, or misconduct by Nurses. Client agrees to hold Nurse Nest harmless from any claims, liabilities, or damages arising from such risks.</p>
            
            <h4 className="font-semibold mt-3 mb-1">5. Integration with Terms of Service</h4>
            <p className="mb-2">This Acknowledgment is part of the Nurse Nest Terms of Service. By checking the box or otherwise indicating agreement, Client confirms they have read, understood, and agree to be bound by this Acknowledgment and the Terms of Service.</p>
            
            <h4 className="font-semibold mt-3 mb-1">6. Governing Law</h4>
            <p className="mb-2">This Acknowledgment is governed by the laws of the State of Washington, without regard to conflict of law principles.</p>
            
            <h4 className="font-semibold mt-3 mb-1">7. Contact Information</h4>
            <p className="mb-2">For questions or concerns about this Acknowledgment, contact Nurse Nest at:</p>
            <p>Email: contact@nursenest.us</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
