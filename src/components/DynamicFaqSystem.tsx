import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import FaqTriggerButton from './FaqTriggerButton';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type FaqCategory = {
  id: string;
  title: string;
  icon: string;
  faqs: {
    question: string;
    answer: string;
  }[];
};

export default function DynamicFaqSystem() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("getting-started");
  const triggerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const faqCategories: FaqCategory[] = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: "🚀",
      faqs: [
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
        }
      ]
    },
    {
      id: "account-security",
      title: "Account & Security",
      icon: "🔒",
      faqs: [
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
          question: "Are nurses vetted?",
          answer: "Yes. All nurses verify their ID and RN license and agree to our legal terms. Additional screenings are available including background checks, drug screening, and driving history reports (additional fees apply)."
        },
        {
          question: "Are my health details secure?",
          answer: "Yes. Nurse Nest follows HIPAA and MHMDA guidelines. All personal and health data is encrypted, securely stored, and only shared when absolutely necessary."
        }
      ]
    },
    {
      id: "nurse-services",
      title: "Nurse Services",
      icon: "👩‍⚕️",
      faqs: [
        {
          question: "What if no nurse applies to my job?",
          answer: "We may suggest increasing your rate, loosening schedule restrictions, or updating preferences. If that's not possible, you're welcome to pause or stop your request and try again later."
        },
        {
          question: "How fast can I get matched?",
          answer: "Standard matches typically take 5-10 business days. We work diligently to find qualified candidates as quickly as possible while ensuring proper vetting and compatibility."
        },
        {
          question: "Can I view nurse profiles before choosing?",
          answer: "Yes. Once we've favorited qualified nurses, you'll receive curated profiles based on your preferences to make the final selection."
        },
        {
          question: "How do I earn Verified Elite Nurse status?",
          answer: "Complete 3 successful contracts totaling 1,400+ hours worked (equivalent to 3 full-time travel nursing contracts of 13 weeks each at 36 hours/week). Once achieved, message contact@nursenest.us and we will remove the 5% platform fee - you'll take home 100% of your earnings!"
        }
      ]
    },
    {
      id: "billing-payments",
      title: "Billing & Payments",
      icon: "💳",
      faqs: [
        {
          question: "How do invoice verifications work?",
          answer: "After your nurse logs hours, you review and verify them. Invoices are processed via Stripe and sent directly to the nurse. We retain a 10% platform fee for operations, support, and compliance."
        },
        {
          question: "What fees do clients pay?",
          answer: "Clients pay a 10% platform fee on all nurse payments. This covers operations, support, compliance, insurance, and secure payment processing. No upfront or search fees."
        },
        {
          question: "Why do nurses charge high hourly rates?",
          answer: "Our nurses are independent professionals who manage their own business operations. Their rates reflect clinical expertise, malpractice insurance, and the cost of self-employment. Higher rates typically attract more qualified applicants."
        }
      ]
    },
    {
      id: "care-management",
      title: "Care Management",
      icon: "🩺",
      faqs: [
        {
          question: "Do I need physician orders for nursing care?",
          answer: "Yes, absolutely. All skilled nursing services require a physician's order and written care plan. This is required by law and protects both you and your nurse."
        },
        {
          question: "What services require a physician's order?",
          answer: "Your nurse MUST have written orders for:\n• Medication administration (unless you can take medications yourself)\n• Wound care and dressing changes\n• Injections (insulin, B12, pain medications, etc.)\n• IV therapy and infusions\n• Medical equipment use (oxygen, catheters, feeding tubes)\n• Blood draws and specimen collection\n• Any medical treatment or intervention\n\nImportant: If you plan to have your nurse give you medications, you need specific medication orders - even for routine pills like blood pressure or diabetes medications."
        }
      ]
    },
    {
      id: "support-legal",
      title: "Support & Legal",
      icon: "⚖️",
      faqs: [
        {
          question: "How do I contact customer support?",
          answer: "Use the messaging center in your dashboard, email contact@nursenest.us, or call (425) 954-3381. Our concierge team is available during business hours to assist with any questions or issues."
        },
        {
          question: "What is your refund policy?",
          answer: "Since there are no upfront fees for clients, refunds don't typically apply. Add-on services (background checks, screenings) are non-refundable after initiation. Platform fees are non-refundable once services are verified."
        }
      ]
    }
  ];

  // Filter FAQs based on search term
  const getFilteredCategories = () => {
    if (searchTerm.trim() === "") return faqCategories;
    
    return faqCategories.map(category => ({
      ...category,
      faqs: category.faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })).filter(category => category.faqs.length > 0);
  };

  const filteredCategories = getFilteredCategories();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const triggerPoint = 400; // Show button after 400px scroll
      
      setIsVisible(scrollPosition > triggerPoint);
    };

    // Listen for custom openFAQ event
    const handleOpenFAQ = () => {
      setIsExpanded(true);
      setTimeout(() => {
        if (sectionRef.current) {
          // Get header height to calculate proper offset
          const headerHeight = 80; // Approximate header height
          const rect = sectionRef.current.getBoundingClientRect();
          const offsetTop = window.pageYOffset + rect.top;
          window.scrollTo({ 
            top: offsetTop - headerHeight, // Position blue section directly under header
            behavior: 'smooth'
          });
        }
      }, 100);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('openFAQ', handleOpenFAQ);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('openFAQ', handleOpenFAQ);
    };
  }, []);

  const handleExpand = () => {
    setIsExpanded(true);
    
    // Scroll to the FAQ section after expansion with proper positioning
    setTimeout(() => {
      if (sectionRef.current) {
        const headerHeight = 80; // Approximate header height
        const rect = sectionRef.current.getBoundingClientRect();
        const offsetTop = window.pageYOffset + rect.top;
        window.scrollTo({ 
          top: offsetTop - headerHeight, // Position blue section directly under header
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  const handleCollapse = () => {
    setIsExpanded(false);
  };

  if (!isVisible && !isExpanded) {
    return null;
  }

  if (!isExpanded) {
    return (
      <div ref={triggerRef}>
        <FaqTriggerButton onClick={handleExpand} />
      </div>
    );
  }

  return (
    <section 
      ref={sectionRef}
      className="section-padding pb-24" // Increased bottom padding significantly
      id="faq"
      style={{
        background: 'linear-gradient(180deg, #dbeafe 0%, #bfdbfe 100%)'
      }}
    >
      <div className="container-custom">
        {/* FAQ Header with larger image and closer positioning */}
        <div className="text-center mb-8 relative">
          <div className="mb-6">
            <img
              src="/lovable-uploads/436bcb1e-c141-4cd8-b1ed-beae8896e1d7.png"
              alt="Frequently Asked Questions"
              className="mx-auto h-32 md:h-40 object-contain drop-shadow-lg"
            />
          </div>
          
          {/* Close button */}
          <button
            onClick={handleCollapse}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/20 transition-colors duration-300 text-[#1e293b]"
            aria-label="Close FAQ"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md mx-auto mb-8">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search questions..."
            className="pl-10 pr-4 py-3 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all duration-300 bg-white/80 backdrop-blur-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Categories */}
          <div className="lg:w-1/4">
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-white/30 shadow-sm sticky top-8">
              <h3 className="font-semibold text-lg text-[#1e293b] mb-4">Categories</h3>
              <nav className="space-y-2">
                {faqCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={cn(
                      "w-full text-left p-3 rounded-lg transition-all duration-300 flex items-center gap-3",
                      activeCategory === category.id
                        ? "bg-[#3b82f6] text-white shadow-md"
                        : "hover:bg-white/40 text-[#475569]"
                    )}
                  >
                    <span className="text-lg">{category.icon}</span>
                    <span className="font-medium text-sm">{category.title}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* FAQ Content */}
          <div className="lg:w-3/4">
            {filteredCategories.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-[#64748b]">No results found. Try a different search term.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredCategories.map((category) => (
                  <div
                    key={category.id}
                    className={cn(
                      (!searchTerm && category.id !== activeCategory) ? "hidden" : ""
                    )}
                  >
                    {/* Category Header */}
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">{category.icon}</span>
                      <h3 className="font-semibold text-xl text-[#1e293b]">{category.title}</h3>
                    </div>

                    {/* FAQ Questions - Simple accordion with smooth transitions */}
                    <div className="space-y-3">
                      {category.faqs.map((faq, faqIndex) => (
                        <Accordion key={`${category.id}-${faqIndex}`} type="single" collapsible>
                          <AccordionItem
                            value={`${category.id}-${faqIndex}`}
                            className="bg-white/60 backdrop-blur-sm rounded-lg border border-white/30 shadow-sm overflow-hidden"
                          >
                            <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-white/50 transition-all duration-300 border-0">
                              <span className="text-base md:text-lg font-medium text-[#1e293b] text-left">
                                {faq.question}
                              </span>
                            </AccordionTrigger>
                            <AccordionContent className="px-5 pb-5 pt-1 text-[#475569] whitespace-pre-line leading-relaxed border-0">
                              {faq.answer}
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
