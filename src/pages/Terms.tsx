
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Terms() {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <main className="flex-1 pt-24">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Terms of <span className="text-nurse-dark">Service</span>
          </h1>
          
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <p className="text-gray-500 mb-6">Effective Date: May 5, 2025</p>
            
            <p className="mb-6">
              Welcome to Nurse Nest, a third-party nurse matching marketplace operated by Nurse Nest LLC ("Nurse Nest," "we," "us," or "our"). By accessing or using our website, services, or platform (collectively, the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree with these Terms, do not use the Service.
            </p>
            
            <h2 className="text-xl font-bold mt-8 mb-4">1. Nature of Service</h2>
            <p className="mb-6">
              Nurse Nest operates as a marketplace that connects clients ("Clients") with independent nurses ("Nurses") for potential hiring arrangements. We provide matching services, including nurse sourcing, license verification, background checks, and optional add-on screenings (e.g., drug tests, driving history reports). Nurse Nest is not a healthcare provider, employer, or staffing agency. Clients and Nurses contract directly with each other, and Nurse Nest does not control, supervise, or direct the services provided by Nurses.
            </p>
            
            <h2 className="text-xl font-bold mt-8 mb-4">2. Eligibility</h2>
            <p className="mb-2">To use the Service, you must:</p>
            <ul className="list-disc ml-6 mb-6">
              <li className="mb-2">Be at least 18 years old.</li>
              <li className="mb-2">Have the legal capacity to enter into contracts.</li>
              <li>Comply with all applicable laws and regulations. Nurses must be licensed professionals in good standing and carry their own malpractice insurance.</li>
            </ul>
            
            <h2 className="text-xl font-bold mt-8 mb-4">3. Client Responsibilities</h2>
            <p className="mb-2">Clients agree to:</p>
            <ul className="list-disc ml-6 mb-6">
              <li className="mb-2">Provide accurate and complete information during the intake process, including preferences for nurse specialty, location, and shift times.</li>
              <li className="mb-2">Pay the applicable fees (base match fee of $1000 and any optional add-ons) upfront via the payment portal.</li>
              <li className="mb-2">Independently review and contract with Nurses introduced through the Service.</li>
              <li>Assume all risks and responsibilities associated with hiring and working with Nurses, including verifying their qualifications and suitability beyond the vetting provided by Nurse Nest.</li>
            </ul>
            
            <h2 className="text-xl font-bold mt-8 mb-4">4. Nurse Responsibilities</h2>
            <p className="mb-2">Nurses agree to:</p>
            <ul className="list-disc ml-6 mb-6">
              <li className="mb-2">Provide accurate and current information regarding licensure, qualifications, and experience.</li>
              <li className="mb-2">Maintain active and valid nursing licensure and malpractice insurance.</li>
              <li className="mb-2">Comply with all applicable laws, regulations, and professional standards.</li>
              <li>Contract directly with Clients and assume full responsibility for the care or services provided.</li>
            </ul>
            
            <h2 className="text-xl font-bold mt-8 mb-4">5. Fees and Refunds</h2>
            <ul className="list-disc ml-6 mb-6">
              <li className="mb-2">Match Fee: Clients pay a flat $1000 match fee (discounted from $1333 for a limited time) for nurse matching services.</li>
              <li className="mb-2">Optional Add-Ons: Clients may purchase a 10-panel drug test ($100) and/or driving history report ($50).</li>
              <li className="mb-2">Refund Policy: If no suitable match is found or the Client is not satisfied and chooses not to proceed with any Nurse, Nurse Nest will refund the match fee minus a $100 non-refundable advertising and sourcing fee. Refunds are processed within 7 business days. No refunds are available once a Client contracts with a Nurse.</li>
              <li>All payments are processed securely through our third-party payment portal. Nurse Nest is not responsible for payment disputes or errors caused by third-party processors.</li>
            </ul>
            
            <h2 className="text-xl font-bold mt-8 mb-4">6. Vetting and Matching Process</h2>
            <p className="mb-2">Nurse Nest facilitates matching by:</p>
            <ul className="list-disc ml-6 mb-6">
              <li className="mb-2">Sourcing Nurses through advertising, job boards, and internal networks.</li>
              <li className="mb-2">Verifying Nurse licensure, conducting background checks, and contacting professional references.</li>
              <li className="mb-2">Performing optional screenings (if purchased).</li>
              <li>Providing Clients with Nurse profiles for review. Nurse Nest does not guarantee the accuracy of information provided by Nurses or the suitability of any match. Clients are solely responsible for evaluating and selecting Nurses.</li>
            </ul>
            
            <h2 className="text-xl font-bold mt-8 mb-4">7. Independent Contractor Status</h2>
            <p className="mb-2">
              Nurses are independent contractors or business owners, not employees, agents, or representatives of Nurse Nest. Nurse Nest does not:
            </p>
            <ul className="list-disc ml-6 mb-6">
              <li className="mb-2">Employ, supervise, or control Nurses.</li>
              <li className="mb-2">Provide healthcare services or medical advice.</li>
              <li>Guarantee the quality, safety, or outcome of services provided by Nurses. Clients and Nurses are solely responsible for their contractual agreements, including terms, compensation, and performance.</li>
            </ul>
            
            <h2 className="text-xl font-bold mt-8 mb-4">8. Limitation of Liability</h2>
            <p className="mb-6">
              To the fullest extent permitted by law, Nurse Nest, its affiliates, officers, directors, employees, and agents shall not be liable for:
            </p>
            <ul className="list-disc ml-6 mb-6">
              <li className="mb-2">Any direct, indirect, incidental, special, consequential, or punitive damages arising from the use of the Service, including but not limited to damages for loss of profits, goodwill, data, or other intangible losses.</li>
              <li className="mb-2">The actions, omissions, or performance of Nurses or Clients, including any harm, injury, or damages caused by Nurse services.</li>
              <li className="mb-2">The accuracy, completeness, or reliability of information provided by Nurses or Clients.</li>
              <li>Any delays, errors, or interruptions in the Service. Nurse Nest's total liability for any claim arising from these Terms or the Service shall not exceed the amount paid by the Client for the specific service giving rise to the claim.</li>
            </ul>
            
            <h2 className="text-xl font-bold mt-8 mb-4">9. Disclaimer of Warranties</h2>
            <p className="mb-6">
              The Service is provided "as is" and "as available" without warranties of any kind, express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement. Nurse Nest does not warrant that:
            </p>
            <ul className="list-disc ml-6 mb-6">
              <li className="mb-2">The Service will be uninterrupted, error-free, or secure.</li>
              <li className="mb-2">Nurses will meet Client expectations or perform satisfactorily.</li>
              <li>Information provided through the Service is accurate or complete.</li>
            </ul>
            
            <h2 className="text-xl font-bold mt-8 mb-4">10. Indemnification</h2>
            <p className="mb-6">
              You agree to indemnify, defend, and hold harmless Nurse Nest, its affiliates, officers, directors, employees, and agents from any claims, liabilities, damages, losses, or expenses (including reasonable attorneys' fees) arising from:
            </p>
            <ul className="list-disc ml-6 mb-6">
              <li className="mb-2">Your use of the Service.</li>
              <li className="mb-2">Your violation of these Terms.</li>
              <li className="mb-2">Any disputes between Clients and Nurses.</li>
              <li>Any harm, injury, or damages caused by Nurses or Clients.</li>
            </ul>
            
            <h2 className="text-xl font-bold mt-8 mb-4">11. Intellectual Property</h2>
            <p className="mb-6">
              All content on the Service, including the Nurse Pay Rate Calculator, website design, logos, and text, is owned by Nurse Nest or its licensors and is protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, or create derivative works without prior written consent.
            </p>
            
            <h2 className="text-xl font-bold mt-8 mb-4">12. Termination</h2>
            <p className="mb-6">
              Nurse Nest may suspend or terminate your access to the Service at any time, with or without cause, including for violation of these Terms. Upon termination, your right to use the Service ceases, but these Terms' provisions on liability, indemnification, and intellectual property survive.
            </p>
            
            <h2 className="text-xl font-bold mt-8 mb-4">13. Governing Law and Dispute Resolution</h2>
            <p className="mb-6">
              These Terms are governed by the laws of the State of Washington, without regard to conflict of law principles. Any disputes arising from these Terms or the Service shall be resolved through binding arbitration in Seattle, Washington, conducted by a single arbitrator under the rules of the American Arbitration Association. You waive any right to participate in a class action lawsuit or class-wide arbitration.
            </p>
            
            <h2 className="text-xl font-bold mt-8 mb-4">14. Changes to Terms</h2>
            <p className="mb-6">
              Nurse Nest may update these Terms at any time by posting the revised version on the website. Continued use of the Service after changes constitutes acceptance of the new Terms.
            </p>
            
            <h2 className="text-xl font-bold mt-8 mb-4">15. Contact Information</h2>
            <p className="mb-6">
              For questions or concerns about these Terms, contact us at:
            </p>
            <ul className="list-disc ml-6 mb-6">
              <li>Email: <a href="mailto:contact@nursenest.us" className="text-primary-500">contact@nursenest.us</a></li>
              <li>Phone: <a href="tel:4259543381" className="text-primary-500">(425) 954-3381</a></li>
            </ul>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
