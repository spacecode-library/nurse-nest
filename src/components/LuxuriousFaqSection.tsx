
import { useState } from 'react';
import { Search, ChevronDown, ChevronUp, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import AnimatedSection from './AnimatedSection';

interface FAQ {
  question: string;
  answer: string;
}

interface FAQCategory {
  id: string;
  title: string;
  icon: string;
  faqs: FAQ[];
}

interface LuxuriousFaqSectionProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function LuxuriousFaqSection({ isVisible, onClose }: LuxuriousFaqSectionProps) {
  const [activeCategory, setActiveCategory] = useState('getting-started');
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const faqCategories: FAQCategory[] = [
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
      icon: "💊",
      faqs: [
        {
          question: "What if no nurse applies to my job?",
          answer: "We may suggest increasing your rate, loosening schedule restrictions, or updating preferences. If that's not possible, you're welcome to pause or stop your request and try again later."
        },
        {
          question: "How fast can I get matched?",
          answer: "Standard matches typically take 5-10 business days. We work diligently to find qualified candidates as quickly as possible while ensuring proper vetting and compatibility."
        }
      ]
    },
    {
      id: "billing-payments",
      title: "Billing & Payments",
      icon: "💳",
      faqs: [
        {
          question: "How do payments work?",
          answer: "After your nurse logs hours, you review and verify them. Payments are processed via Stripe and sent directly to the nurse. We retain a 10% platform fee for operations, support, and compliance."
        }
      ]
    },
    {
      id: "care-management",
      title: "Care Management",
      icon: "⚕️",
      faqs: [
        {
          question: "What happens if a nurse cancels?",
          answer: "We'll create a new job posting and begin a fresh search right away to find you a replacement nurse as quickly as possible."
        }
      ]
    },
    {
      id: "support-legal",
      title: "Support & Legal",
      icon: "⚖️",
      faqs: [
        {
          question: "What do I agree to legally?",
          answer: "When signing up, you accept our Terms of Service, Privacy Policy, and—based on your role—either the Client Waiver or Independent Contractor Agreement. These define roles, expectations, and liabilities for all users."
        }
      ]
    }
  ];

  const activeTab = faqCategories.find(cat => cat.id === activeCategory);
  
  const filteredFaqs = searchTerm.trim() === "" 
    ? activeTab?.faqs || []
    : faqCategories
        .flatMap(cat => cat.faqs)
        .filter(faq => 
          faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
          faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
        );

  const handleQuestionClick = (index: number) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  if (!isVisible) return null;

  return (
    <section className="py-16 px-4" style={{ backgroundColor: '#e6f3ff' }}>
      <div className="max-w-7xl mx-auto">
        <AnimatedSection animation="fade-up" className="text-center mb-8">
          {/* FAQ Header Image */}
          <div className="flex justify-center mb-6">
            <img
              src="/lovable-uploads/8bdf9bf9-cc64-4ae1-8e4f-581597497307.png"
              alt="Frequently Asked Questions"
              className="h-16 md:h-20 w-auto max-w-full object-contain"
            />
          </div>
          
          {/* Close Button */}
          <div className="flex justify-end mb-4">
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/50 transition-colors"
              aria-label="Close FAQ"
            >
              <X size={24} className="text-gray-600" />
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
              className="pl-10 pr-4 py-3 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Category Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4">
              <h3 className="font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                Categories
              </h3>
              <nav className="space-y-2">
                {faqCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setActiveCategory(category.id);
                      setOpenQuestion(null);
                      setSearchTerm('');
                    }}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-3",
                      activeCategory === category.id
                        ? "bg-blue-500 text-white shadow-sm"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                    style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                  >
                    <span className="text-lg">{category.icon}</span>
                    <span>{category.title}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* FAQ Content */}
          <div className="lg:col-span-3">
            {filteredFaqs.length === 0 ? (
              <div className="bg-white rounded-lg p-8 text-center">
                <p className="text-lg text-gray-600" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                  No results found. Try a different search term.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFaqs.map((faq, index) => (
                  <AnimatedSection 
                    key={`${activeCategory}-${index}`}
                    animation="fade-up"
                    delay={index * 50}
                  >
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                      <button
                        onClick={() => handleQuestionClick(index)}
                        className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium text-gray-900 pr-4" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                            {faq.question}
                          </h3>
                          <div className="flex-shrink-0">
                            {openQuestion === index ? (
                              <ChevronUp className="h-5 w-5 text-blue-500 transition-transform duration-200" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-400 transition-transform duration-200" />
                            )}
                          </div>
                        </div>
                      </button>
                      
                      <div 
                        className={cn(
                          "overflow-hidden transition-all duration-300 ease-in-out",
                          openQuestion === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                        )}
                      >
                        <div className="px-6 pb-4">
                          <div 
                            className="text-gray-700 leading-relaxed whitespace-pre-line"
                            style={{ fontFamily: 'Arial, Helvetica, sans-serif', lineHeight: '1.6' }}
                          >
                            {faq.answer}
                          </div>
                        </div>
                      </div>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            )}
          </div>
        </div>

        <AnimatedSection animation="fade-up" delay={500} className="max-w-xl mx-auto mt-12 text-center">
          <p className="text-gray-600 mb-5" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
            Still have questions? We're here to help!
          </p>
          <a 
            href="mailto:contact@nursenest.us" 
            className="inline-flex items-center bg-blue-500 text-white font-medium px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors shadow-lg hover:shadow-xl"
            style={{ fontFamily: 'Arial, Helvetica, sans-serif', minHeight: '44px' }}
          >
            Contact our team
          </a>
        </AnimatedSection>
      </div>
    </section>
  );
}
