import { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronRight, Search } from 'lucide-react';
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

  const filteredFaqTabs = (() => {
    if (searchTerm.trim() === "") return faqTabs;
    return faqTabs.map(tab => ({
      ...tab,
      faqs: tab.faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })).filter(tab => tab.faqs.length > 0);
  })();

  // Helper: get active tab index for navigation highlight
  const getNavTabIndex = () => faqTabs.findIndex(tab => tab.id === activeTab);

  // Desktop: Table of Contents sidebar
  function SidebarNav() {
    return (
      <nav className="rounded-xl mb-8 md:mb-0 bg-white md:bg-transparent shadow md:shadow-none px-0 py-6">
        <div className="text-lg font-semibold px-6 mb-2 text-gray-800">Table of Contents</div>
        <ul className="space-y-1">
          {faqTabs.map((tab, idx) => (
            <li key={tab.id}>
              <button
                className={cn(
                  "w-full flex items-center px-6 py-2.5 text-left rounded-lg transition-colors",
                  activeTab === tab.id
                    ? "bg-blue-50 text-blue-700 font-bold"
                    : "text-gray-700 hover:bg-gray-100"
                )}
                style={{
                  fontWeight: activeTab === tab.id ? 700 : 400
                }}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="mr-3 text-base">{tab.icon}</span>
                <span className={activeTab === tab.id ? "underline underline-offset-4" : ""}>
                  {tab.title}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    );
  }

  // Desktop: FAQ List for active category
  function FaqList({ tab }: { tab: FaqTab }) {
    return (
      <div>
        {tab.faqs.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            No results found. Try a different search.
          </div>
        ) : (
          <dl className="divide-y divide-gray-200">
            {tab.faqs.map((faq, faqIdx) => (
              <details key={faq.question} className="group py-5">
                <summary className={cn(
                  "flex items-center cursor-pointer list-none outline-none focus:outline-none select-none transition-colors px-2",
                  "hover:bg-blue-50 rounded-md"
                )}>
                  <span className="flex-1 text-lg md:text-xl font-semibold text-gray-900">
                    {faq.question}
                  </span>
                  <span className="ml-3 transition-transform text-blue-500 group-open:rotate-45 group-open:text-blue-700">
                    <ChevronRight
                      className={
                        "w-6 h-6 transition-transform group-open:rotate-90 group-open:text-blue-700"
                      }
                    />
                  </span>
                </summary>
                <div className="mt-3 pl-1 md:pl-2 text-base text-gray-700">
                  {faq.answer}
                </div>
              </details>
            ))}
          </dl>
        )}
      </div>
    );
  }

  // -- MAIN RETURN --
  return (
    <section className="bg-white py-14 md:py-24" id="faq" ref={scrollRef}>
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-2 tracking-tight">Questions? Look here.</h2>
          <div className="text-lg text-gray-500 mb-0">
            Can’t find an answer? Call us at <a href="tel:8556925326" className="underline hover:text-blue-700">(855) 692-5326</a> or email <a href="mailto:contact@myclean.com" className="underline hover:text-blue-700">contact@myclean.com</a>!
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:gap-10">
          {/* Sidebar: Table of Contents (Desktop) */}
          <div className="hidden md:block md:w-1/4">
            <SidebarNav />
          </div>

          {/* FAQ Main Area */}
          <div className="w-full md:w-3/4">
            {/* Search input */}
            <div className="relative max-w-lg mb-8">
              <div className="absolute top-1/2 left-3 -translate-y-1/2 pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="pl-10 pr-4 py-3 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search questions..."
                aria-label="Search questions"
              />
            </div>

            {/* Desktop: Show only active tab (category) */}
            <div className="hidden md:block">
              {faqTabs.filter(tab => tab.id === activeTab).map(tab => (
                <FaqList key={tab.id} tab={tab} />
              ))}
            </div>

            {/* Mobile: One-long accordion, sticky TOC at top */}
            <div className="md:hidden">
              {/* Mobile TOC */}
              <div className="flex gap-2 overflow-x-auto mb-5 pb-2 sticky -top-2 bg-white z-10">
                {faqTabs.map(tab => (
                  <button
                    key={tab.id}
                    className={cn(
                      "px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap",
                      activeTab === tab.id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-blue-50"
                    )}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.title}
                  </button>
                ))}
              </div>
              {/* Mobile: Show only FAQs for active tab */}
              {faqTabs.filter(tab => tab.id === activeTab).map(tab => (
                <FaqList key={tab.id} tab={tab} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
