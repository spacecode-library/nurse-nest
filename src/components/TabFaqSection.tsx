import { useState, useRef } from "react";
import { Plus, Minus, Search } from "lucide-react";
import { cn } from "@/lib/utils";

// Reusable simple QuestionItem
function QuestionItem({
  question,
  answer,
  isOpen,
  onClick,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <div className="border-b last:border-b-0">
      <button
        className={cn(
          "w-full text-left flex items-start py-5 px-0 md:px-1 focus:outline-none transition-colors",
          isOpen ? "text-blue-700" : "text-gray-900 hover:text-blue-600"
        )}
        onClick={onClick}
        aria-expanded={isOpen}
      >
        <span className="mr-4 mt-0.5">
          {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        </span>
        <span className={cn("text-base md:text-lg font-semibold", isOpen && "underline underline-offset-4 text-blue-700")}>
          {question}
        </span>
      </button>
      {isOpen && (
        <div className="text-gray-700 px-9 pb-6 -mt-2 text-base whitespace-pre-line">
          {answer}
        </div>
      )}
    </div>
  );
}

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
  // Open state per-question, keyed by `${tabId}_${faqIdx}`
  const [open, setOpen] = useState<{ [key: string]: boolean }>({});

  const faqTabs: FaqTab[] = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: "🕐",
      faqs: [
        {
          question: "When should I request a nurse match?",
          answer:
            "We recommend submitting your request 3–4 weeks in advance for the best availability and flexibility. If needed urgently, FastTrack Match guarantees a nurse within 5 business days—or your money back.",
        },
        {
          question: "What areas do you serve?",
          answer:
            "We operate nationwide across the U.S., serving both cities and rural communities. Our algorithm prioritizes nurses near you, but we also consider skills, specialty, and availability.",
        },
        {
          question: "Is someone available to help me?",
          answer:
            "Absolutely. Our concierge team is here to guide you through the process, help clarify your needs, and recommend the right pay range to attract top-tier candidates.",
        },
      ],
    },
    {
      id: "pricing",
      title: "Pricing & Refunds",
      icon: "💸",
      faqs: [
        {
          question: "Why do nurses charge high hourly rates?",
          answer:
            "Our nurses are independent professionals who manage their own business operations. Their rates reflect clinical expertise, malpractice insurance, and the cost of self-employment. Higher rates typically attract more qualified applicants.",
        },
        {
          question: "What does the $100 search fee cover?",
          answer:
            "It includes custom job listing creation, targeted advertising, nurse outreach, and concierge support. If no match is found, you're fully refunded.",
        },
        {
          question: "What's your refund policy?",
          answer:
            "The $100 search fee is refundable if no match is found within 14 days. FastTrack's $500 fee is refundable if no match is found within 5 days. Add-ons (e.g., screenings) are non-refundable after initiation. Payments to nurses and platform fees are non-refundable once approved.",
        },
      ],
    },
    {
      id: "nurse-matching",
      title: "Nurse Matching",
      icon: "👩‍⚕️",
      faqs: [
        {
          question: "What if no nurse applies to my job?",
          answer:
            "We may suggest increasing your rate, loosening schedule restrictions, or updating preferences. If that's not possible, you're welcome to pause or stop your request.",
        },
        {
          question: "How fast can I get matched?",
          answer:
            "Standard matches typically take 5–10 business days. FastTrack Match guarantees a nurse in 5 business days or less, or your money back.",
        },
        {
          question: "Can I view nurse profiles before choosing?",
          answer:
            "Yes. Once we've shortlisted qualified nurses, you'll receive curated profiles based on your preferences to make the final selection.",
        },
      ],
    },
    {
      id: "verification",
      title: "Verification & Security",
      icon: "🔒",
      faqs: [
        {
          question: "Are nurses vetted?",
          answer:
            "Yes. All nurses verify their ID and RN license and agree to our legal terms. Additional screenings are available.\n\nOptional add-ons (additional fees):\n✔️ Background check\n✔️ Drug screening\n✔️ Driving history report",
        },
        {
          question: "Are my health details secure?",
          answer:
            "Yes. Nurse Nest follows HIPAA and MHMDA guidelines. All personal and health data is encrypted, securely stored, and only shared when absolutely necessary.",
        },
        {
          question: "What do I agree to legally?",
          answer:
            "When signing up, you accept our Terms of Service, Privacy Policy, and—based on your role—either the Client Waiver or Independent Contractor Agreement. These define roles, expectations, and liabilities for all users.",
        },
      ],
    },
    {
      id: "payments",
      title: "Payments & Platform",
      icon: "💳",
      faqs: [
        {
          question: "How do payments work?",
          answer:
            "After your nurse logs hours, you review and approve them. Payments are processed via Stripe and sent directly to the nurse. We retain a 15% platform fee for operations, support, and compliance.",
        },
        {
          question: "What happens if a nurse cancels?",
          answer:
            "We'll prioritize your listing and begin a new search right away. If we can't find a replacement in time, you'll receive a full refund or can keep your listing open for a future match.",
        },
        {
          question: "Does Nurse Nest use cookies?",
          answer:
            "Yes. We use essential cookies for platform functionality and may use analytics cookies to improve performance. We never track health-related data. You can manage cookie preferences via our banner.",
        },
      ],
    },
  ];

  // Search logic
  const filteredFaqTabs =
    searchTerm.trim() === ""
      ? faqTabs
      : faqTabs
          .map((tab) => ({
            ...tab,
            faqs: tab.faqs.filter(
              (faq) =>
                faq.question
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||
                faq.answer
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
            ),
          }))
          .filter((tab) => tab.faqs.length > 0);

  // Layout
  return (
    <section
      className="bg-white py-14 md:py-24 border-t border-gray-100"
      id="faq"
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* Updated Header */}
        <div className="max-w-2xl mx-auto text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-2 tracking-tight">
            Got Questions?
          </h2>
          <div className="text-lg text-gray-500 mb-0">
            Can’t find an answer? Call us at{" "}
            <a
              href="tel:8556925326"
              className="underline hover:text-blue-700"
            >
              (855) 692-5326
            </a>{" "}
            or email{" "}
            <a
              href="mailto:contact@myclean.com"
              className="underline hover:text-blue-700"
            >
              contact@myclean.com
            </a>
            !
          </div>
        </div>

        {/* Layout: Sidebar + Main */}
        <div className="flex flex-col md:flex-row md:gap-8">
          {/* SIDEBAR (TABLE OF CONTENTS - Desktop) */}
          <div className="hidden md:block md:w-1/4 md:pr-4">
            <nav aria-label="Table of Contents" className="sticky top-28">
              <div className="text-base font-bold mb-3 text-gray-900">
                Table of Contents
              </div>
              <ul className="space-y-1">
                {faqTabs.map((tab) => (
                  <li key={tab.id}>
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "w-full text-left py-2 px-3 rounded transition-colors",
                        activeTab === tab.id
                          ? "bg-blue-50 text-blue-700 font-semibold underline underline-offset-4"
                          : "hover:bg-gray-100 text-gray-700"
                      )}
                      aria-current={activeTab === tab.id ? "page" : undefined}
                    >
                      <span className="mr-2">{tab.icon}</span>
                      {tab.title}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* FAQ MAIN AREA */}
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
                data-testid="faq-search"
              />
            </div>

            {/* DESKTOP: Only show active category */}
            <div className="hidden md:block">
              {filteredFaqTabs
                .filter((tab) => tab.id === activeTab)
                .map((tab) =>
                  tab.faqs.length === 0 ? (
                    <div
                      key={tab.id}
                      className="py-12 text-center text-gray-500"
                    >
                      No results found. Try a different search.
                    </div>
                  ) : (
                    <div key={tab.id} className="bg-white">
                      <ul className="divide-y divide-gray-200">
                        {tab.faqs.map((faq, qIdx) => {
                          const key = `${tab.id}_${qIdx}`;
                          return (
                            <li key={key}>
                              <QuestionItem
                                question={faq.question}
                                answer={faq.answer}
                                isOpen={open[key] || false}
                                onClick={() =>
                                  setOpen((prev) => ({
                                    ...prev,
                                    [key]: !prev[key],
                                  }))
                                }
                              />
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )
                )}
            </div>

            {/* MOBILE: Top horizontal TOC, show only one category */}
            <div className="md:hidden">
              {/* Mobile TOC */}
              <div className="flex gap-2 overflow-x-auto mb-5 pb-2 sticky -top-2 bg-white z-10">
                {faqTabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={cn(
                      "px-3 py-2 rounded text-sm font-medium transition-colors whitespace-nowrap",
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
              {/* Show only active tab's FAQs */}
              {filteredFaqTabs
                .filter((tab) => tab.id === activeTab)
                .map((tab) =>
                  tab.faqs.length === 0 ? (
                    <div
                      key={tab.id}
                      className="py-10 text-center text-gray-500"
                    >
                      No results found. Try a different search.
                    </div>
                  ) : (
                    <ul
                      key={tab.id}
                      className="divide-y divide-gray-200 bg-white"
                    >
                      {tab.faqs.map((faq, qIdx) => {
                        const key = `${tab.id}_${qIdx}`;
                        return (
                          <li key={key}>
                            <QuestionItem
                              question={faq.question}
                              answer={faq.answer}
                              isOpen={open[key] || false}
                              onClick={() =>
                                setOpen((prev) => ({
                                  ...prev,
                                  [key]: !prev[key],
                                }))
                              }
                            />
                          </li>
                        );
                      })}
                    </ul>
                  )
                )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
