
import { useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function SimpleFaqSection() {
  const [searchTerm, setSearchTerm] = useState("");

  const allFaqs = [
    // Getting Started
    {
      question: "When should I request a nurse match?",
      answer: "We recommend submitting your request 3-4 weeks in advance for the best availability and flexibility. If needed urgently, we'll do our best to find a match within 5 business days."
    },
    {
      question: "What areas do you serve?",
      answer: "We operate nationwide across the U.S., serving both cities and rural communities. Our algorithm prioritizes nurses near you, but we also consider skills, specialty, and availability."
    },
    {
      question: "Is someone available to help me?",
      answer: "Absolutely. Our concierge team is here to guide you through the process, help clarify your needs, and recommend the right pay range to attract top-tier candidates."
    },
    {
      question: "How do I reset my password?",
      answer: "Click \"Forgot Password\" on the login page and enter your email. You'll receive a secure link to reset your password. If you don't see the email, check your spam folder or contact support."
    },
    {
      question: "Is there a mobile app?",
      answer: "Nurse Nest is designed with a mobile-first approach and works seamlessly on all devices through your web browser. A dedicated mobile app may be available in the future."
    },
    // Onboarding & Profiles
    {
      question: "Why do I need to upload a resume if licenses are verified?",
      answer: "Your resume provides clients with comprehensive background information about your experience, specializations, and work history that goes beyond basic license verification. It helps clients make informed hiring decisions."
    },
    {
      question: "Can I edit my profile after onboarding?",
      answer: "Yes! You can update your profile, preferences, availability, and documents at any time through your dashboard. Keep your information current to receive the best job matches."
    },
    {
      question: "What happens if my nursing license expires?",
      answer: "You must maintain current, valid licensing to work through our platform. Update your license information immediately upon renewal. Expired licenses will temporarily suspend your ability to receive new job matches."
    },
    {
      question: "Do I need malpractice insurance?",
      answer: "Malpractice insurance is optional but highly recommended. You can upload proof during onboarding, and many clients prefer nurses with coverage. It's part of running your independent contractor business professionally."
    },
    {
      question: "How does the travel radius affect my matches?",
      answer: "Our algorithm prioritizes jobs within your specified travel radius. A larger radius increases your job opportunities, while a smaller radius focuses on nearby positions. You can adjust this setting anytime."
    },
    // Add more FAQs as needed - truncated for brevity
  ];

  const filteredFaqs = searchTerm.trim() === "" 
    ? allFaqs 
    : allFaqs.filter(faq => 
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
      );

  return (
    <section className="section-padding bg-gradient-to-br from-[#f0f9ff] to-[#e2e8f0]" id="faq">
      <div className="container-custom max-w-4xl mx-auto">
        {/* Large FAQ Header Image */}
        <div className="text-center mb-16">
          <img
            src="/lovable-uploads/436bcb1e-c141-4cd8-b1ed-beae8896e1d7.png"
            alt="Frequently Asked Questions"
            className="w-full max-w-4xl mx-auto h-auto object-contain drop-shadow-lg"
          />
        </div>

        {/* Search Bar */}
        <AnimatedSection animation="fade-up" className="text-center mb-12">
          <div className="relative max-w-md mx-auto mb-8">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-[#64748b]" />
            </div>
            <input
              type="text"
              placeholder="Search questions..."
              className="pl-10 pr-4 py-3 w-full rounded-lg border border-white/30 bg-white/60 backdrop-blur-sm focus:ring-2 focus:ring-[#9bcbff] focus:border-[#9bcbff] transition-all text-[#1e293b] placeholder-[#64748b]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </AnimatedSection>

        {/* FAQ List */}
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-[#64748b]">No results found. Try a different search term.</p>
          </div>
        ) : (
          <AnimatedSection animation="fade-up" delay={100}>
            <Accordion type="single" collapsible className="space-y-3">
              {filteredFaqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`faq-${index}`} 
                  className="bg-white/60 backdrop-blur-sm border-0 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <AccordionTrigger className="px-4 py-4 hover:no-underline hover:bg-white/40 transition-colors border-0">
                    <span className="text-base md:text-lg font-medium text-[#1e293b] text-left">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 md:pb-6 pt-1 text-[#475569] whitespace-pre-line border-0">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </AnimatedSection>
        )}

        {/* Contact Information */}
        <AnimatedSection animation="fade-up" delay={500} className="max-w-xl mx-auto mt-10 md:mt-14 text-center">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-8 border border-white/30 shadow-lg">
            <h4 className="font-semibold text-xl text-[#1e293b] mb-6">Contact Information</h4>
            <div className="space-y-4 text-[#475569] mb-6">
              <div className="flex items-center justify-center gap-3">
                <span className="font-medium">Email:</span>
                <span>contact@nursenest.us</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <span className="font-medium">Phone:</span>
                <span>(425) 954-3381</span>
              </div>
              <div className="text-center">
                <span className="font-medium">Support:</span>
                <span className="block mt-1">Available through dashboard messaging center during business hours</span>
              </div>
            </div>
            <a 
              href="/contact" 
              className="inline-flex items-center bg-[#3b82f6] text-white font-medium px-6 py-3 rounded-md hover:bg-[#2563eb] transition-colors shadow-lg hover:shadow-xl"
            >
              Contact our team
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
