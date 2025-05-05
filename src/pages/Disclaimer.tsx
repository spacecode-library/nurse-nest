
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Disclaimer() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <main className="flex-1 pt-24">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
            <span className="text-nurse-dark">Disclaimer</span>
          </h1>
          
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <p className="text-gray-500 mb-6">Effective Date: May 5, 2025</p>
            
            <p className="mb-6">
              Nurse Nest LLC ("Nurse Nest") provides the following disclaimers to clarify the nature of our services and limitations. By accessing or using our website, platform, or services (collectively, the "Service"), you acknowledge and agree to these disclaimers, which are incorporated into the Nurse Nest Terms of Service.
            </p>
            
            <h2 className="text-xl font-bold mt-8 mb-4">1. Not a Healthcare Provider</h2>
            <p className="mb-6">
              Nurse Nest is a third-party marketplace that connects clients with independent nurses for potential hiring arrangements. Nurse Nest is not a healthcare provider, medical facility, or staffing agency. We do not provide medical care, medical advice, or healthcare services, and we do not supervise, direct, or control the services provided by nurses.
            </p>
            
            <h2 className="text-xl font-bold mt-8 mb-4">2. Independent Contractor Status</h2>
            <p className="mb-6">
              Nurses matched through Nurse Nest are independent contractors or business owners, not employees, agents, or representatives of Nurse Nest. Clients contract directly with nurses, and Nurse Nest is not a party to any agreement between clients and nurses. Nurse Nest does not guarantee the quality, safety, or outcome of services provided by nurses.
            </p>
            
            <h2 className="text-xl font-bold mt-8 mb-4">3. Limited Role of Vetting</h2>
            <p className="mb-6">
              Nurse Nest conducts vetting, including license verification, background checks, professional reference checks, and optional screenings (e.g., drug tests, driving history reports). However, Nurse Nest does not guarantee the accuracy, completeness, or reliability of information provided by nurses or the suitability of any nurse for a client's needs. Clients are solely responsible for independently verifying nurse qualifications, licensure, and suitability before entering into any agreement.
            </p>
            
            <h2 className="text-xl font-bold mt-8 mb-4">4. No Liability for Nurse Services</h2>
            <p className="mb-6">
              Nurse Nest is not liable for any harm, injury, damages, or losses arising from the services provided by nurses, including but not limited to negligence, misconduct, or inadequate care. Clients assume all risks associated with hiring and working with nurses matched through the Service. Nurses are required to carry their own professional malpractice insurance, and clients should verify such coverage.
            </p>
            
            <h2 className="text-xl font-bold mt-8 mb-4">5. No Warranties</h2>
            <p className="mb-6">
              The Service is provided "as is" and "as available" without warranties of any kind, express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement. Nurse Nest does not warrant that the Service will be uninterrupted, error-free, or secure, or that nurses will meet client expectations.
            </p>
            
            <h2 className="text-xl font-bold mt-8 mb-4">6. Client Responsibility</h2>
            <p className="mb-2">Clients are responsible for:</p>
            <ul className="list-disc ml-6 mb-6">
              <li className="mb-2">Providing accurate and complete information during the intake process.</li>
              <li className="mb-2">Negotiating and entering into direct agreements with nurses, including terms, compensation, and scope of services.</li>
              <li className="mb-2">Ensuring a safe working environment for nurses.</li>
              <li>Complying with all applicable laws and regulations.</li>
            </ul>
            
            <h2 className="text-xl font-bold mt-8 mb-4">7. No Endorsement</h2>
            <p className="mb-6">
              Nurse Nest does not endorse or recommend any specific nurse. The inclusion of a nurse on our platform does not imply approval or certification beyond the vetting process described in our Terms of Service.
            </p>
            
            <h2 className="text-xl font-bold mt-8 mb-4">8. Third-Party Links and Services</h2>
            <p className="mb-6">
              The Service may include links to third-party websites or services (e.g., payment processors, job boards). Nurse Nest is not responsible for the content, accuracy, or practices of these third parties, and their inclusion does not imply endorsement.
            </p>
            
            <h2 className="text-xl font-bold mt-8 mb-4">9. Contact Information</h2>
            <p className="mb-2">
              For questions or concerns about these disclaimers, contact us at:
            </p>
            <ul className="list-disc ml-6 mb-6">
              <li>Email: <a href="mailto:contact@nursenest.us" className="text-primary-500">contact@nursenest.us</a></li>
            </ul>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
