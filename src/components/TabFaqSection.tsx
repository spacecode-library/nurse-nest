
import { useState, useRef, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ChevronUp, Search, ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import AnimatedSection from './AnimatedSection';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type FaqTab = {
  id: string;
  title: string;
  icon: string;
  faqs: {
    question: string;
    answer: string;
  }[];
};

export default function TabFaqSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("getting-started");
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const faqTabs: FaqTab[] = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: "🕐",
      faqs: [
        {
          question: "When should I request a nurse match?",
          answer: "We recommend submitting your request 3–4 weeks in advance for the best availability and flexibility. If needed urgently, FastTrack Match guarantees a nurse within 5 business days—or your money back."
        },
        {
          question: "What areas do you serve?",
          answer: "We operate nationwide across the U.S., serving both cities and rural communities. Our algorithm prioritizes nurses near you, but we also consider skills, specialty, and availability."
        },
        {
          question: "Is someone available to help me?",
          answer: "Absolutely. Our concierge team is here to guide you through the process, help clarify your needs, and recommend the right pay range to attract top-tier candidates."
        }
      ]
    },
    {
      id: "pricing",
      title: "Pricing & Refunds",
      icon: "💸",
      faqs: [
        {
          question: "Why do nurses charge high hourly rates?",
          answer: "Our nurses are independent professionals who manage their own business operations. Their rates reflect clinical expertise, malpractice insurance, and the cost of self-employment. Higher rates typically attract more qualified applicants."
        },
        {
          question: "What does the $100 search fee cover?",
          answer: "It includes custom job listing creation, targeted advertising, nurse outreach, and concierge support. If no match is found, you're fully refunded."
        },
        {
          question: "What's your refund policy?",
          answer: "The $100 search fee is refundable if no match is found within 14 days. FastTrack's $500 fee is refundable if no match is found within 5 days. Add-ons (e.g., screenings) are non-refundable after initiation. Payments to nurses and platform fees are non-refundable once approved."
        }
      ]
    },
    {
      id: "nurse-matching",
      title: "Nurse Matching",
      icon: "👩‍⚕️",
      faqs: [
        {
          question: "What if no nurse applies to my job?",
          answer: "We may suggest increasing your rate, loosening schedule restrictions, or updating preferences. If that's not possible, you're welcome to pause or stop your request."
        },
        {
          question: "How fast can I get matched?",
          answer: "Standard matches typically take 5–10 business days. FastTrack Match guarantees a nurse in 5 business days or less, or your money back."
        },
        {
          question: "Can I view nurse profiles before choosing?",
          answer: "Yes. Once we've shortlisted qualified nurses, you'll receive curated profiles based on your preferences to make the final selection."
        }
      ]
    },
    {
      id: "verification",
      title: "Verification & Security",
      icon: "🔒",
      faqs: [
        {
          question: "Are nurses vetted?",
          answer: "Yes. All nurses verify their ID and RN license and agree to our legal terms. Additional screenings are available.\n\nOptional add-ons (additional fees):\n✔️ Background check\n✔️ Drug screening\n✔️ Driving history report"
        },
        {
          question: "Are my health details secure?",
          answer: "Yes. Nurse Nest follows HIPAA and MHMDA guidelines. All personal and health data is encrypted, securely stored, and only shared when absolutely necessary."
        },
        {
          question: "What do I agree to legally?",
          answer: "When signing up, you accept our Terms of Service, Privacy Policy, and—based on your role—either the Client Waiver or Independent Contractor Agreement. These define roles, expectations, and liabilities for all users."
        }
      ]
    },
    {
      id: "payments",
      title: "Payments & Platform",
      icon: "💳",
      faqs: [
        {
          question: "How do payments work?",
          answer: "After your nurse logs hours, you review and approve them. Payments are processed via Stripe and sent directly to the nurse. We retain a 15% platform fee for operations, support, and compliance."
        },
        {
          question: "What happens if a nurse cancels?",
          answer: "We'll prioritize your listing and begin a new search right away. If we can't find a replacement in time, you'll receive a full refund or can keep your listing open for a future match."
        },
        {
          question: "Does Nurse Nest use cookies?",
          answer: "Yes. We use essential cookies for platform functionality and may use analytics cookies to improve performance. We never track health-related data. You can manage cookie preferences via our banner."
        }
      ]
    }
  ];
  
  // Filter FAQs based on search term
  const getFilteredFaqs = () => {
    if (searchTerm.trim() === "") return faqTabs;
    
    return faqTabs.map(tab => ({
      ...tab,
      faqs: tab.faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })).filter(tab => tab.faqs.length > 0);
  };

  const filteredFaqTabs = getFilteredFaqs();
  
  // Scroll to top function for mobile
  const scrollToTop = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="section-padding bg-nurse-light" id="faq" ref={scrollRef}>
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
        
        {/* Desktop Tabs */}
        <div className="max-w-4xl mx-auto">
          {/* Show regular tabs on desktop, hide on mobile */}
          <div className="hidden md:block">
            <Tabs 
              defaultValue="getting-started" 
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <AnimatedSection animation="fade-up" delay={100}>
                <TabsList className="w-full bg-white/80 backdrop-blur-sm rounded-lg p-1.5">
                  {faqTabs.map((tab) => (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className="text-sm py-2.5 px-3 data-[state=active]:bg-primary-500 data-[state=active]:text-white transition-all duration-300"
                    >
                      <span className="mr-2">{tab.icon}</span>
                      <span>{tab.title}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </AnimatedSection>
              
              {faqTabs.map((tab, tabIndex) => (
                <TabsContent key={tab.id} value={tab.id} className="mt-6">
                  <div className="space-y-4">
                    {filteredFaqTabs.some(t => t.id === tab.id) ? (
                      tab.faqs.filter(faq => 
                        !searchTerm.trim() || 
                        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
                      ).map((faq, faqIndex) => (
                        <AnimatedSection 
                          key={`desktop-${tab.id}-${faqIndex}`} 
                          animation="fade-up" 
                          delay={faqIndex * 100}
                        >
                          <div className="glass-card border-none rounded-lg overflow-hidden">
                            <div className="p-5">
                              <h3 className="text-lg font-medium flex items-start gap-3 mb-3">
                                <span className="text-xl">{tab.icon}</span>
                                <span>{faq.question}</span>
                              </h3>
                              <p className="text-gray-600 pl-9 whitespace-pre-line">
                                {faq.answer}
                              </p>
                            </div>
                          </div>
                        </AnimatedSection>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <p>No results found. Try a different search term.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
          
          {/* Mobile Accordion View */}
          <div className="md:hidden">
            {filteredFaqTabs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-lg text-gray-600">No results found. Try a different search term.</p>
              </div>
            ) : (
              <>
                {filteredFaqTabs.map((tab, tabIndex) => (
                  <div key={`mobile-tab-${tab.id}`} className="mb-6">
                    <AnimatedSection 
                      animation="fade-up" 
                      delay={tabIndex * 100}
                    >
                      <div className="flex items-center gap-2 bg-primary-500 text-white px-4 py-3 rounded-lg mb-3">
                        <span className="text-xl">{tab.icon}</span>
                        <h3 className="font-medium">{tab.title}</h3>
                      </div>
                      
                      <Accordion type="single" collapsible className="space-y-3">
                        {tab.faqs.filter(faq => 
                          !searchTerm.trim() || 
                          faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
                        ).map((faq, faqIndex) => (
                          <AnimatedSection 
                            key={`mobile-${tab.id}-${faqIndex}`} 
                            animation="fade-up" 
                            delay={(tabIndex + faqIndex + 1) * 100}
                          >
                            <AccordionItem value={`${tab.id}-${faqIndex}`} className="glass-card border-none rounded-lg overflow-hidden">
                              <AccordionTrigger className="px-4 py-4 hover:no-underline hover:bg-white/50 transition-colors">
                                <div className="flex items-center text-left gap-2">
                                  <span className="text-lg mr-1">{tab.icon}</span>
                                  <span className="text-base font-medium">{faq.question}</span>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="px-4 pb-4 pt-1 text-gray-600 whitespace-pre-line">
                                <div className="space-y-4">
                                  <div>{faq.answer}</div>
                                  <div className="pt-2">
                                    <button 
                                      onClick={scrollToTop}
                                      className="flex items-center text-primary-500 text-sm font-medium"
                                    >
                                      <ArrowUp className="h-4 w-4 mr-1" />
                                      Back to top
                                    </button>
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </AnimatedSection>
                        ))}
                      </Accordion>
                    </AnimatedSection>
                  </div>
                ))}
              </>
            )}
          </div>
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
            <ArrowUp className="ml-2 h-4 w-4 rotate-45" />
          </a>
        </AnimatedSection>
        
        {/* Sticky CTA for desktop */}
        <div className="hidden md:block fixed bottom-8 right-8 z-30">
          <a 
            href="/apply" 
            className="inline-flex items-center bg-primary-500 text-white font-medium px-6 py-3 rounded-full hover:bg-primary-600 transition-colors shadow-lg hover:shadow-xl animate-button-glow"
          >
            Request a Nurse Match
            <ArrowUp className="ml-2 h-4 w-4 rotate-45" />
          </a>
        </div>
      </div>
    </section>
  );
}
