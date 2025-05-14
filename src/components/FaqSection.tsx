import { useState } from 'react';
import { ChevronDown, ChevronUp, Search, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import AnimatedSection from './AnimatedSection';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FaqSection() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const faqs = [
    {
      question: "When should I request a nurse match?",
      answer: "We recommend submitting your request 3–4 weeks in advance for the best availability.",
      icon: "🕒"
    },
    {
      question: "Why do nurses start at higher hourly rates?",
      answer: "Our nurses are independent contractors who:\n\n• Carry their own malpractice insurance\n\n• Operate LLCs or sole proprietorships\n\n• Have specialized clinical experience\n\nCompetitive rates attract better candidates. Underpaying often results in no applicants.",
      icon: "💵"
    },
    {
      question: "What areas do you serve?",
      answer: "Nurse Nest is nationwide, serving both urban and rural areas across the U.S. We prioritize nurses who are geographically close, while balancing schedule and specialty fit.",
      icon: "📍"
    },
    {
      question: "What if no nurse applies to my job?",
      answer: "If your listing doesn't get responses, we'll advise you to:\n\n• Raise the rate\n\n• Adjust availability\n\n• Modify preferences\n\nIf no changes can be made, you may pause or discontinue the search at no charge.",
      icon: "📉"
    },
    {
      question: "How fast can I expect a match?",
      answer: "Once your application and $100 fee are submitted:\n\n• We create your job listing\n\n• Promote it across our network\n\n• Start vetting applicants\n\nTypical matching time is 5–10 business days.",
      icon: "⚡"
    },
    {
      question: "What does the $100 search fee cover?",
      answer: "It covers:\n\n• A custom job listing\n\n• Ad placements and outreach\n\n• Applicant screening\n\n• Concierge support\n\nIf we can't find a suitable match, you'll receive a full refund.",
      icon: "🧾"
    },
    {
      question: "Are nurses vetted and verified?",
      answer: "Yes, every nurse must:\n\n• Upload a valid ID\n\n• Submit and verify their license\n\n• Agree to our Terms and Policies\n\nOptional screenings (extra cost):\n✔️ Background check\n✔️ Drug screening\n✔️ Driving record check",
      icon: "🧑‍⚕️"
    },
    {
      question: "Do you employ the nurses?",
      answer: "No. Nurse Nest is a marketplace, not an employer. You contract directly with your nurse, who is fully independent.",
      icon: "💼"
    },
    {
      question: "How do payments work?",
      answer: "Nurses submit hours through our system. You:\n\n• Review and approve hours\n\n• Pay securely via Stripe\n\n• Nurse receives payment directly\n\nNurse Nest collects a 15% platform fee to support our operations, vetting tools, and customer support. All transactions are encrypted and PCI-compliant via Stripe.",
      icon: "💳"
    },
    {
      question: "What if the nurse cancels before the start date?",
      answer: "We'll re-prioritize your listing and begin a new search immediately. If we can't match you in time, you'll receive a full refund or may choose to keep your listing active for a future date.",
      icon: "⏳"
    },
    {
      question: "I'm overwhelmed. Can someone help me?",
      answer: "Yes! Our support team can:\n\n• Help you define your care needs\n\n• Suggest a competitive rate\n\n• Guide you through the process\n\nWe're here to simplify everything.",
      icon: "🧠"
    },
    {
      question: "Is my information secure?",
      answer: "Yes. We use:\n\n• HIPAA-compliant data systems\n\n• Encrypted document storage\n\n• Limited access permissions\n\nWe're fully compliant with Washington State laws and the My Health My Data Act (MHMDA).",
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
    <section className="section-padding bg-nurse-light" id="faq">
      <div className="container-custom">
        <AnimatedSection animation="fade-up" className="max-w-3xl mx-auto text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            <span className="text-primary-500">Frequently</span> Asked Questions
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Find answers to commonly asked questions about our nurse matching service.
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto mb-8">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search questions..."
              className="pl-10 pr-4 py-3 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-300 focus:border-primary-300 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </AnimatedSection>
        
        <div className="max-w-3xl mx-auto">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-lg text-gray-600">No results found. Try a different search term.</p>
            </div>
          ) : (
            <Accordion type="single" collapsible className="space-y-4">
              {filteredFaqs.map((faq, index) => (
                <AnimatedSection 
                  key={index}
                  animation="fade-up"
                  delay={index * 100}
                >
                  <AccordionItem value={`item-${index}`} className="glass-card border-none rounded-lg overflow-hidden">
                    <AccordionTrigger className="px-4 py-4 md:py-5 hover:no-underline hover:bg-white/50 transition-colors">
                      <div className="flex items-center text-left">
                        <span className="text-xl mr-3">{faq.icon}</span>
                        <span className="text-base md:text-lg font-medium">{faq.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 md:pb-6 pt-1 text-gray-600 whitespace-pre-line">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </AnimatedSection>
              ))}
            </Accordion>
          )}
        </div>
        
        <AnimatedSection animation="fade-up" delay={500} className="max-w-xl mx-auto mt-10 md:mt-14 text-center">
          <p className="text-gray-600 mb-5">
            Still have questions? We're here to help!
          </p>
          <a 
            href="/contact" 
            className="inline-flex items-center bg-primary-500 text-white font-medium px-6 py-3 rounded-md hover:bg-primary-600 transition-colors shadow-lg hover:shadow-xl"
          >
            Contact our team
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </AnimatedSection>
        
        {/* Sticky CTA for desktop */}
        <div className="hidden md:block fixed bottom-8 right-8 z-30">
          <a 
            href="/apply" 
            className="inline-flex items-center bg-primary-500 text-white font-medium px-6 py-3 rounded-full hover:bg-primary-600 transition-colors shadow-lg hover:shadow-xl animate-button-glow"
          >
            Request a Nurse Match
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
