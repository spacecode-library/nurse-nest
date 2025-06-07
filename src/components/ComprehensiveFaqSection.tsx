
import { useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function ComprehensiveFaqSection() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const faqs = [
    {
      question: "When should I request a nurse match?",
      answer: "We recommend submitting your request 3–4 weeks in advance for the best availability and flexibility. If needed urgently, we'll do our best to find a match within 5 business days.",
      icon: "🕒"
    },
    {
      question: "Why do nurses charge high hourly rates?",
      answer: "Our nurses are independent professionals who manage their own business operations. Their rates reflect clinical expertise, malpractice insurance, and the cost of self-employment. Higher rates typically attract more qualified applicants.",
      icon: "💵"
    },
    {
      question: "What areas do you serve?",
      answer: "We operate nationwide across the U.S., serving both cities and rural communities. Our algorithm prioritizes nurses near you, but we also consider skills, specialty, and availability.",
      icon: "📍"
    },
    {
      question: "What if no nurse applies to my job?",
      answer: "We may suggest increasing your rate, loosening schedule restrictions, or updating preferences. If that's not possible, you're welcome to pause or stop your request and try again later.",
      icon: "📉"
    },
    {
      question: "How fast can I get matched?",
      answer: "Standard matches typically take 5-10 business days. We work diligently to find qualified candidates as quickly as possible while ensuring proper vetting and compatibility.",
      icon: "⚡"
    },
    {
      question: "Are nurses vetted and verified?",
      answer: "Yes. All nurses verify their ID and RN license and agree to our legal terms. Additional screenings are available including background checks, drug screening, and driving history reports (additional fees apply).",
      icon: "🧑‍⚕️"
    },
    {
      question: "How do payments work?",
      answer: "After your nurse logs hours, you review and verify the hours worked. Payments are processed via Stripe and sent directly to the nurse. We retain a 10% platform fee for operations, support, and compliance.",
      icon: "💳"
    },
    {
      question: "Are my health details secure?",
      answer: "Yes. Nurse Nest follows HIPAA and MHMDA guidelines. All personal and health data is encrypted, securely stored, and only shared when absolutely necessary.",
      icon: "🔐"
    }
  ];
  
  // Filter FAQs based on search term
  const filteredFaqs = searchTerm.trim() === "" 
    ? faqs 
    : faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
      );

  return (
    <section className="section-padding bg-gradient-to-br from-[#f0f9ff] to-[#e2e8f0]" id="faq">
      <div className="container-custom">
        <AnimatedSection animation="fade-up" className="max-w-3xl mx-auto text-center mb-8 md:mb-12">
          {/* Use the correct FAQ header image */}
          <div className="flex justify-center mb-6">
            <img
              src="/lovable-uploads/436bcb1e-c141-4cd8-b1ed-beae8896e1d7.png"
              alt="Frequently Asked Questions"
              className="h-16 md:h-20 w-auto max-w-full object-contain"
            />
          </div>
          <p className="text-lg text-[#475569] mb-8">
            Find answers to commonly asked questions about our nurse matching service.
          </p>
          
          {/* Search Bar */}
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
        
        <div className="max-w-3xl mx-auto">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-lg text-[#64748b]">No results found. Try a different search term.</p>
            </div>
          ) : (
            <Accordion type="single" collapsible className="space-y-4">
              {filteredFaqs.map((faq, index) => (
                <AnimatedSection 
                  key={index}
                  animation="fade-up"
                  delay={index * 100}
                >
                  <AccordionItem value={`item-${index}`} className="bg-white/60 backdrop-blur-sm border border-white/30 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
                    <AccordionTrigger className="px-4 py-4 md:py-5 hover:no-underline hover:bg-white/40 transition-colors">
                      <div className="flex items-center text-left">
                        <span className="text-xl mr-3">{faq.icon}</span>
                        <span className="text-base md:text-lg font-medium text-[#1e293b]">{faq.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 md:pb-6 pt-1 text-[#475569] whitespace-pre-line">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </AnimatedSection>
              ))}
            </Accordion>
          )}
        </div>
        
        <AnimatedSection animation="fade-up" delay={500} className="max-w-xl mx-auto mt-10 md:mt-14 text-center">
          <p className="text-[#64748b] mb-5">
            Still have questions? We're here to help!
          </p>
          <a 
            href="/contact" 
            className="inline-flex items-center bg-[#3b82f6] text-white font-medium px-6 py-3 rounded-md hover:bg-[#2563eb] transition-colors shadow-lg hover:shadow-xl"
          >
            Contact our team
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </AnimatedSection>
      </div>
    </section>
  );
}
