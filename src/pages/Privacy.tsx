
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Privacy() {
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
            Privacy <span className="text-nurse-dark">Policy</span>
          </h1>
          
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <p className="text-gray-500 mb-6">Effective Date: May 5, 2025</p>
            
            <p className="mb-6">
              Nurse Nest LLC ("Nurse Nest," "we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and protect your personal information when you use our website, services, or platform (collectively, the "Service"). By using the Service, you consent to the practices described in this Privacy Policy.
            </p>
            
            <h2 className="text-xl font-bold mt-8 mb-4">1. Information We Collect</h2>
            <p className="mb-4">We collect the following types of information:</p>
            
            <h3 className="text-lg font-semibold mt-4 mb-2">a. Client Information</h3>
            <ul className="list-disc ml-6 mb-4">
              <li className="mb-2">Personal Information: Name, email address, phone number, billing information, and preferences (e.g., nurse specialty, location, shift times) provided during the intake process.</li>
              <li>Payment Information: Credit card or other payment details processed through our third-party payment portal.</li>
            </ul>
            
            <h3 className="text-lg font-semibold mt-4 mb-2">b. Nurse Information</h3>
            <ul className="list-disc ml-6 mb-4">
              <li className="mb-2">Professional Information: Name, email address, phone number, nursing license details, qualifications, experience, and references.</li>
              <li>Vetting Information: Background check results, optional screening results (e.g., drug tests, driving history), and professional reference responses.</li>
            </ul>
            
            <h3 className="text-lg font-semibold mt-4 mb-2">c. Automatically Collected Information</h3>
            <ul className="list-disc ml-6 mb-4">
              <li className="mb-2">Usage Data: IP address, browser type, operating system, pages visited, and time spent on the Service, collected via cookies and analytics tools (e.g., Google Analytics).</li>
              <li>Device Information: Information about the device used to access the Service, such as hardware model and settings.</li>
            </ul>
            
            <h2 className="text-xl font-bold mt-8 mb-4">2. How We Use Your Information</h2>
            <p className="mb-2">We use your information to:</p>
            <ul className="list-disc ml-6 mb-6">
              <li className="mb-2">Facilitate nurse matching, including sourcing, vetting, and introducing Nurses to Clients.</li>
              <li className="mb-2">Process payments and issue refunds.</li>
              <li className="mb-2">Communicate with you about your account, matches, or inquiries.</li>
              <li className="mb-2">Improve the Service through analytics and performance tracking.</li>
              <li className="mb-2">Comply with legal obligations, such as tax reporting or law enforcement requests.</li>
              <li>Market our services, including sending promotional emails (with your consent).</li>
            </ul>
            
            <h2 className="text-xl font-bold mt-8 mb-4">3. How We Share Your Information</h2>
            <p className="mb-2">We may share your information with:</p>
            <ul className="list-disc ml-6 mb-6">
              <li className="mb-2">Nurses and Clients: Client preferences are shared with Nurses, and Nurse profiles are shared with Clients to facilitate matching.</li>
              <li className="mb-2">Service Providers: Third-party vendors for payment processing, background checks, drug tests, driving history reports, and analytics (e.g., Stripe, Google Analytics).</li>
              <li className="mb-2">Legal Authorities: When required by law, such as in response to a subpoena or court order.</li>
              <li>Business Transfers: In connection with a merger, acquisition, or sale of Nurse Nest's assets.</li>
            </ul>
            <p className="mb-6">We do not sell your personal information to third parties for marketing purposes.</p>
            
            <h2 className="text-xl font-bold mt-8 mb-4">4. Data Security</h2>
            <p className="mb-6">
              We implement reasonable technical and organizational measures to protect your information, including encryption for payment processing and secure storage for vetting data. However, no system is completely secure, and we cannot guarantee absolute security.
            </p>
            
            <h2 className="text-xl font-bold mt-8 mb-4">5. Data Retention</h2>
            <p className="mb-2">
              We retain personal information only as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer period is required by law. For example:
            </p>
            <ul className="list-disc ml-6 mb-6">
              <li className="mb-2">Client and Nurse profiles are retained for the duration of their active use of the Service.</li>
              <li className="mb-2">Payment information is retained for 7 years to comply with tax laws.</li>
              <li>Vetting data is deleted within 30 days after a match is completed or a refund is issued.</li>
            </ul>
            
            <h2 className="text-xl font-bold mt-8 mb-4">6. Your Rights</h2>
            <p className="mb-2">Depending on your jurisdiction, you may have the right to:</p>
            <ul className="list-disc ml-6 mb-6">
              <li className="mb-2">Access, correct, or delete your personal information.</li>
              <li className="mb-2">Opt out of marketing communications.</li>
              <li>Request a copy of your data in a portable format.</li>
            </ul>
            <p className="mb-6">
              To exercise these rights, contact us at <a href="mailto:contact@nursenest.us" className="text-primary-500">contact@nursenest.us</a>. We will respond within 30 days, subject to verification of your identity.
            </p>
            
            <h2 className="text-xl font-bold mt-8 mb-4">7. Cookies and Tracking</h2>
            <p className="mb-6">
              We use cookies to enhance your experience, analyze usage, and deliver personalized content. You can manage cookie preferences through your browser settings, but disabling cookies may affect the Service's functionality.
            </p>
            
            <h2 className="text-xl font-bold mt-8 mb-4">8. Third-Party Links</h2>
            <p className="mb-6">
              The Service may contain links to third-party websites (e.g., payment processors, job boards). We are not responsible for the privacy practices or content of these sites.
            </p>
            
            <h2 className="text-xl font-bold mt-8 mb-4">9. Children's Privacy</h2>
            <p className="mb-6">
              The Service is not intended for individuals under 18. We do not knowingly collect personal information from children.
            </p>
            
            <h2 className="text-xl font-bold mt-8 mb-4">10. International Users</h2>
            <p className="mb-6">
              The Service is operated from the United States. If you are located outside the U.S., your information may be transferred to and processed in the U.S., where privacy laws may differ. By using the Service, you consent to this transfer.
            </p>
            
            <h2 className="text-xl font-bold mt-8 mb-4">11. Changes to This Privacy Policy</h2>
            <p className="mb-6">
              We may update this Privacy Policy by posting the revised version on the website. Continued use of the Service after changes constitutes acceptance of the new Privacy Policy.
            </p>
            
            <h2 className="text-xl font-bold mt-8 mb-4">12. Contact Information</h2>
            <p className="mb-2">
              For questions or concerns about this Privacy Policy, contact us at:
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
