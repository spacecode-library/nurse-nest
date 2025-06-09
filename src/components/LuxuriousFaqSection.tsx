
import { useState } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import AnimatedSection from './AnimatedSection';

interface FAQ {
  question: string;
  answer: string;
}

interface FAQCategory {
  id: string;
  title: string;
  faqs: FAQ[];
}

export default function LuxuriousFaqSection() {
  const [activeCategory, setActiveCategory] = useState('getting-started');
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const faqCategories: FAQCategory[] = [
    {
      id: 'getting-started',
      title: 'Getting Started & Medical Requirements',
      faqs: [
        {
          question: 'When should I request a nurse match?',
          answer: 'We recommend submitting your request 3-4 weeks in advance for the best availability and flexibility. If needed urgently, we\'ll do our best to find a match within 5 business days.'
        },
        {
          question: 'What areas do you serve?',
          answer: 'We operate nationwide across the U.S., serving both cities and rural communities. Our algorithm prioritizes nurses near you, but we also consider skills, specialty, and availability.'
        },
        {
          question: 'Is someone available to help me?',
          answer: 'Absolutely. Our concierge team is here to guide you through the process, help clarify your needs, and recommend the right pay range to attract top-tier candidates.'
        },
        {
          question: 'How do I reset my password?',
          answer: 'Click "Forgot Password" on the login page and enter your email. You\'ll receive a secure link to reset your password. If you don\'t see the email, check your spam folder or contact support.'
        },
        {
          question: 'Is there a mobile app?',
          answer: 'Nurse Nest is designed with a mobile-first approach and works seamlessly on all devices through your web browser. A dedicated mobile app may be available in the future.'
        },
        {
          question: 'Do I need physician orders for nursing care?',
          answer: 'Yes, absolutely. All skilled nursing services require a physician\'s order and written care plan. This is required by law and protects both you and your nurse.'
        },
        {
          question: 'What services require a physician\'s order?',
          answer: 'Your nurse MUST have written orders for:\n\n• Medication administration (unless you can take medications yourself)\n• Wound care and dressing changes\n• Injections (insulin, B12, pain medications, etc.)\n• IV therapy and infusions\n• Medical equipment use (oxygen, catheters, feeding tubes)\n• Blood draws and specimen collection\n• Any medical treatment or intervention\n\nImportant: If you plan to have your nurse give you medications, you need specific medication orders - even for routine pills like blood pressure or diabetes medications.'
        },
        {
          question: 'How can I get physician orders quickly?',
          answer: 'Option 1: Contact Your Primary Care Physician (PCP)\n• Call your doctor\'s office and explain you\'re hiring an independent nurse contractor\n• Request written orders for the specific care you need\n• Ask for a care plan outlining frequency and instructions\n• Usually covered by insurance as part of regular care\n\nOption 2: Use Telehealth (Fast & Convenient)\nMost Affordable Options:\n• Sesame Care - $35-60 per visit\n• CallonDoc - $39.99 per visit\n\n24/7 On-Demand Options:\n• Amwell - $79 per visit\n• MDLive - $82-88 per visit\n• Doctor On Demand - $99 per visit\n\nComprehensive Care Options:\n• Teladoc - $75 per visit\n• HealthTap - $129 per visit (includes 90 days of follow-up messaging)\n• QuickMD - $75 per visit'
        }
      ]
    },
    {
      id: 'finding-hiring',
      title: 'Finding & Hiring Your Nurse',
      faqs: [
        {
          question: 'What if no nurse applies to my job?',
          answer: 'We may suggest increasing your rate, loosening schedule restrictions, or updating preferences. If that\'s not possible, you\'re welcome to pause or stop your request and try again later.'
        },
        {
          question: 'How fast can I get matched?',
          answer: 'Standard matches typically take 5-10 business days. We work diligently to find qualified candidates as quickly as possible while ensuring proper vetting and compatibility.'
        },
        {
          question: 'Can I view nurse profiles before choosing?',
          answer: 'Yes. Once we\'ve favorited qualified nurses, you\'ll receive curated profiles based on your preferences to make the final selection.'
        },
        {
          question: 'Can I repost an expired job listing?',
          answer: 'Yes! You can reactivate expired listings or use our smart form feature to duplicate previous job posts with one click. All fields auto-populate, and you can edit as needed before republishing.'
        },
        {
          question: 'Why am I not getting nurse applicants?',
          answer: 'Common reasons include below-market rates, restrictive scheduling, or very specific requirements. Our algorithm and concierge team can provide suggestions to make your position more attractive to qualified candidates.'
        },
        {
          question: 'Can I interview multiple nurses?',
          answer: 'Absolutely! You can favorite multiple candidates and conduct interviews before making your final hiring decision. This helps ensure the best fit for your specific needs.'
        },
        {
          question: 'Can I hire a nurse directly after matching?',
          answer: 'All work arrangements must go through Nurse Nest to ensure proper insurance coverage, payment processing, and platform protections. Direct hiring outside the platform violates our terms of service.'
        },
        {
          question: 'Why do I need to upload a resume if licenses are verified?',
          answer: 'Your resume provides clients with comprehensive background information about your experience, specializations, and work history that goes beyond basic license verification. It helps clients make informed hiring decisions.'
        },
        {
          question: 'Can I edit my profile after onboarding?',
          answer: 'Yes! You can update your profile, preferences, availability, and documents at any time through your dashboard. Keep your information current to receive the best job matches.'
        }
      ]
    },
    {
      id: 'safety-privacy',
      title: 'Safety & Privacy',
      faqs: [
        {
          question: 'Are nurses vetted?',
          answer: 'Yes. All nurses verify their ID and RN license and agree to our legal terms. Additional screenings are available including background checks, drug screening, and driving history reports (additional fees apply).'
        },
        {
          question: 'Are my health details secure?',
          answer: 'Yes. Nurse Nest follows HIPAA and MHMDA guidelines. All personal and health data is encrypted, securely stored, and only shared when absolutely necessary.'
        },
        {
          question: 'What do I agree to legally?',
          answer: 'When signing up, you accept our Terms of Service, Privacy Policy, and—based on your role—either the Client Waiver or Independent Contractor Agreement. These define roles, expectations, and liabilities for all users.'
        },
        {
          question: 'Are background checks mandatory?',
          answer: 'Basic verification (ID and license) is standard. Background checks are optional add-ons that you can request for additional peace of mind. These services have separate fees.'
        },
        {
          question: 'Who accesses my health data?',
          answer: 'Access is strictly limited to matched nurses and essential platform staff for care coordination. All data is encrypted at rest and in transit, with comprehensive audit trails maintained.'
        },
        {
          question: 'Can I share health information in messages?',
          answer: 'No. Our platform prohibits sharing protected health information (PHI) through messaging to maintain HIPAA compliance. The messaging system is designed for communication during the hiring phase. For ongoing care coordination involving health information, please communicate directly with your nurse outside the platform.'
        },
        {
          question: 'What\'s your data retention policy?',
          answer: 'We retain user data according to HIPAA requirements and applicable state laws. Personal health information is purged according to regulatory timelines, while basic account information may be retained for legitimate business purposes.'
        }
      ]
    },
    {
      id: 'time-payment',
      title: 'Time Tracking & Getting Paid',
      faqs: [
        {
          question: 'How do invoice verifications work?',
          answer: 'After your nurse logs hours, you review and verify them. Invoices are processed via Stripe and sent directly to the nurse. We retain a 10% platform fee for operations, support, and compliance.'
        },
        {
          question: 'How are shift hours calculated when they cross midnight?',
          answer: 'Nurses can enter shifts that cross midnight as single entries. For example, 10:00 PM Monday to 6:00 AM Tuesday. The system automatically calculates total hours and properly allocates them across dates.'
        },
        {
          question: 'Why were my hours rounded to 15-minute increments?',
          answer: 'Hour rounding follows federal guidelines for fair labor practices. Clock-in and clock-out times round to the nearest 15-minute interval, consistently applied and documented for transparency.'
        },
        {
          question: 'Can I dispute verified hours?',
          answer: 'Yes. Contact our support team immediately if you believe there\'s an error in the hour verification. Upload supporting evidence (shift logs, screenshots) directly through your dashboard for review.'
        },
        {
          question: 'What happens if a nurse cancels?',
          answer: 'We\'ll create a new job posting and begin a fresh search right away to find you a replacement nurse as quickly as possible.'
        },
        {
          question: 'How do I use the dispute resolution center?',
          answer: 'Upload supporting evidence (shift logs, screenshots) directly through your dashboard. Our team reviews disputes within 3 business days and provides resolution. You\'ll receive updates throughout the process.'
        },
        {
          question: 'What if I need to pause care temporarily?',
          answer: 'You can pause active job postings without canceling. This maintains your position in the queue and allows you to resume when ready, rather than starting the matching process over.'
        },
        {
          question: 'What are "Verified Elite Nurse" benefits?',
          answer: 'Nurses who complete 3+ successful contracts totaling 1,400+ hours worked (equivalent to 3 full-time travel nursing contracts) earn Elite status. Once achieved, message contact@nursenest.us and we will remove the 5% platform fee - you\'ll take home 100% of your earnings!'
        }
      ]
    },
    {
      id: 'costs-policies',
      title: 'Costs & Policies',
      faqs: [
        {
          question: 'What fees do clients pay?',
          answer: 'Clients pay a 10% platform fee on all nurse payments. This covers operations, support, compliance, insurance, and secure payment processing. No upfront or search fees.'
        },
        {
          question: 'What fees do nurses pay?',
          answer: 'Nurses pay a 5% platform fee deducted from earnings. This provides access to vetted clients, secure payments, support services, and all platform features.'
        },
        {
          question: 'Why do nurses charge high hourly rates?',
          answer: 'Our nurses are independent professionals who manage their own business operations. Their rates reflect clinical expertise, malpractice insurance, and the cost of self-employment. Higher rates typically attract more qualified applicants.'
        },
        {
          question: 'Can I negotiate nurse rates?',
          answer: 'Nurses set their own rates as independent contractors. While you can discuss compensation during the hiring process, respect their professional pricing which reflects their expertise and business costs.'
        },
        {
          question: 'What if a nurse doesn\'t show up?',
          answer: 'No-shows are taken seriously. We\'ll immediately search for a replacement and may apply penalties to the nurse\'s account. You won\'t be charged for hours not worked, and we\'ll prioritize finding you a reliable substitute.'
        },
        {
          question: 'What is your refund policy?',
          answer: 'Since there are no upfront fees for clients, refunds don\'t typically apply. Add-on services (background checks, screenings) are non-refundable after initiation. Platform fees are non-refundable once services are verified.'
        },
        {
          question: 'Are nurses employees or contractors?',
          answer: 'All nurses are independent contractors (1099). Nurse Nest does not dictate hours, work conditions, or provide employee benefits. This is clearly stated in all agreements and hour submissions.'
        },
        {
          question: 'What happens to my data if I delete my account?',
          answer: 'Most personal data is removed within 30 days. Some information may be retained for legal compliance, safety, or fraud prevention as outlined in our Privacy Policy and applicable healthcare regulations.'
        }
      ]
    },
    {
      id: 'help-rewards',
      title: 'Help & Rewards',
      faqs: [
        {
          question: 'I\'m having trouble uploading documents. What should I do?',
          answer: 'Ensure your files are in PDF, JPG, or PNG format and under the size limit (5MB for photos, 10MB for documents). Try a different browser or clear your cache. Contact support if issues persist.'
        },
        {
          question: 'Why isn\'t my profile saving changes?',
          answer: 'This usually indicates a connection issue or missing required fields. Check your internet connection, complete all required fields marked with asterisks, and try again. Our support team can assist with persistent issues.'
        },
        {
          question: 'How do I contact customer support?',
          answer: 'Use the messaging center in your dashboard, email contact@nursenest.us, or call (425) 954-3381. Our concierge team is available during business hours to assist with any questions or issues.'
        },
        {
          question: 'How do I earn Verified Elite Nurse status?',
          answer: 'Complete 3 successful contracts totaling 1,400+ hours worked (equivalent to 3 full-time travel nursing contracts of 13 weeks each at 36 hours/week). Once achieved, message contact@nursenest.us and we will remove the 5% platform fee - you\'ll take home 100% of your earnings!'
        },
        {
          question: 'Can I see my earnings and statistics?',
          answer: 'Yes! Your dashboard includes an analytics section showing total earnings, hours worked, client ratings, and progress toward Elite status (1,400 hours). Export reports for tax purposes anytime.'
        },
        {
          question: 'What happens when I reach Elite status?',
          answer: 'Once you complete 1,400+ hours across 3+ contracts, message contact@nursenest.us and we will remove the 5% platform fee permanently. You\'ll keep 100% of your earnings going forward!'
        },
        {
          question: 'How do client success ratings work?',
          answer: 'Clients can rate their experience after each contract. These ratings help build your reputation and increase your visibility to future clients. Consistently high ratings contribute to your professional standing on the platform.'
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

  return (
    <section className="py-16 bg-[#f0f9ff]" id="faq">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection animation="fade-up" className="text-center mb-12">
          <h2 className="text-[2.5rem] font-light text-[#1e293b] mb-6" style={{ fontFamily: 'Arial, Helvetica, sans-serif', letterSpacing: '2px' }}>
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-[#475569] mb-8 max-w-3xl mx-auto" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
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
              className="pl-10 pr-4 py-3 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#3b82f6] focus:border-[#3b82f6] transition-all"
              style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </AnimatedSection>

        {/* Category Tabs - Hidden when searching */}
        {!searchTerm && (
          <AnimatedSection animation="fade-up" delay={100} className="mb-8">
            <div className="relative">
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {faqCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setActiveCategory(category.id);
                      setOpenQuestion(null);
                    }}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 min-h-[44px]",
                      "focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:ring-offset-2",
                      activeCategory === category.id
                        ? "bg-[#1e293b] text-white shadow-md"
                        : "bg-white text-[#475569] hover:bg-[#f1f5f9] border border-gray-200"
                    )}
                    style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                  >
                    {category.title}
                  </button>
                ))}
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* FAQ Content */}
        <div className="max-w-4xl mx-auto">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-[#64748b]" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
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
                  <div 
                    className="bg-[#f1f5f9] rounded-lg shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md"
                    style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}
                  >
                    <button
                      onClick={() => handleQuestionClick(index)}
                      className="w-full px-6 py-5 text-left hover:bg-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:ring-inset"
                      style={{ minHeight: '44px' }}
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-[1rem] font-medium text-[#1e293b] pr-4" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                          {faq.question}
                        </h3>
                        <div className="flex-shrink-0">
                          {openQuestion === index ? (
                            <ChevronUp className="h-5 w-5 text-[#3b82f6] transition-transform duration-300" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-[#64748b] transition-transform duration-300" />
                          )}
                        </div>
                      </div>
                    </button>
                    
                    <div 
                      className={cn(
                        "overflow-hidden transition-all duration-300 ease-in-out",
                        openQuestion === index ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                      )}
                    >
                      <div className="px-6 pb-6 pt-1">
                        <div 
                          className="text-[1rem] text-[#475569] leading-relaxed whitespace-pre-line"
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

        <AnimatedSection animation="fade-up" delay={500} className="max-w-xl mx-auto mt-12 text-center">
          <p className="text-[#64748b] mb-5" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
            Still have questions? We're here to help!
          </p>
          <a 
            href="mailto:contact@nursenest.us" 
            className="inline-flex items-center bg-[#9bcbff] text-[#1e293b] font-medium px-6 py-3 rounded-lg hover:bg-[#7dd3fc] transition-colors shadow-lg hover:shadow-xl min-h-[44px]"
            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
          >
            Contact our team
          </a>
        </AnimatedSection>
      </div>
    </section>
  );
}
