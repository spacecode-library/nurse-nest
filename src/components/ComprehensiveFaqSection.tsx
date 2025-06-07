import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Menu, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import AnimatedSection from './AnimatedSection';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  id: string;
  title: string;
  items: FAQItem[];
}

export default function ComprehensiveFaqSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('getting-started');
  const [expandedItems, setExpandedItems] = useState<{ [key: string]: boolean }>({});
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // FAQ Categories in the new order
  const faqCategories: FAQCategory[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      items: [
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
        }
      ]
    },
    {
      id: 'nurse-matching',
      title: 'Nurse Matching',
      items: [
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
        }
      ]
    },
    {
      id: 'payments-and-fees',
      title: 'Payments & Fees',
      items: [
        {
          question: 'How do payments work?',
          answer: 'Payments are processed securely through our platform via Stripe. Clients pay nurses directly, and Nurse Nest retains a 15% platform fee to manage vetting, support, and admin services.'
        },
        {
          question: 'What is the platform fee?',
          answer: 'Nurse Nest retains a 15% platform fee to manage vetting, support, and admin services. This fee allows us to provide a secure, reliable, and compliant platform for both clients and nurses.'
        },
        {
          question: 'Are there any hidden fees?',
          answer: 'No. We believe in transparent pricing. The platform fee is the only fee charged by Nurse Nest. Clients pay nurses directly, and there are no hidden costs or surprises.'
        },
        {
          question: 'When do I pay the nurse?',
          answer: 'Payment schedules are agreed upon between the client and nurse. Our platform facilitates secure and timely payments according to the agreed-upon terms.'
        },
        {
          question: 'What payment methods are accepted?',
          answer: 'We accept all major credit cards and bank transfers through our secure Stripe payment gateway. This ensures a seamless and secure payment experience for all users.'
        }
      ]
    },
    {
      id: 'safety-and-security',
      title: 'Safety & Security',
      items: [
        {
          question: 'How do you ensure nurse quality?',
          answer: 'We thoroughly vet all nurses through background checks, license verification, and skills assessments. Our platform also allows clients to review nurse profiles and conduct interviews before hiring.'
        },
        {
          question: 'What if I have a problem with a nurse?',
          answer: 'Our support team is available 24/7 to assist with any issues or concerns. We take all complaints seriously and will work to resolve them promptly and fairly.'
        },
        {
          question: 'Is my data secure?',
          answer: 'Yes. We use industry-leading security measures to protect your data and comply with all relevant privacy regulations. Our platform is HIPAA-compliant, ensuring the confidentiality of your health information.'
        },
        {
          question: 'What if a nurse doesn\'t show up?',
          answer: 'We understand that unforeseen circumstances can arise. If a nurse doesn\'t show up, please contact our support team immediately, and we\'ll work to find a replacement as quickly as possible.'
        },
        {
          question: 'How do you handle disputes?',
          answer: 'We have a fair and impartial dispute resolution process. If a dispute arises, we\'ll work with both parties to reach a mutually agreeable solution. Our goal is to ensure a positive experience for all users.'
        }
      ]
    },
    {
      id: 'account-management',
      title: 'Account Management',
      items: [
        {
          question: 'How do I update my profile?',
          answer: 'You can update your profile information in the "Account Settings" section of our platform. This includes your contact information, preferences, and payment details.'
        },
        {
          question: 'How do I cancel my account?',
          answer: 'You can cancel your account at any time by contacting our support team. Please note that cancellation may be subject to certain terms and conditions.'
        },
        {
          question: 'How do I change my email?',
          answer: 'You can change your email address in the "Account Settings" section of our platform. A verification email will be sent to your new address to confirm the change.'
        },
        {
          question: 'How do I close my account?',
          answer: 'To permanently close your account, please contact our support team. We\'ll guide you through the process and ensure that all data is securely removed from our system.'
        },
        {
          question: 'How do I report a bug?',
          answer: 'If you encounter a bug or technical issue, please contact our support team with a detailed description of the problem. We appreciate your help in improving our platform.'
        }
      ]
    }
  ];

  // Filter FAQ items based on search term
  const filteredCategories = faqCategories.map(category => ({
    ...category,
    items: category.items.filter(item =>
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.items.length > 0 || searchTerm === '');

  const toggleExpanded = (categoryId: string, itemIndex: number) => {
    const key = `${categoryId}-${itemIndex}`;
    setExpandedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    setIsMobileSidebarOpen(false);
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  };

  const currentCategory = filteredCategories.find(cat => cat.id === activeCategory) || filteredCategories[0];

  return (
    <section className="w-full bg-gradient-to-br from-[#f0f9ff] via-[#e0f2fe] to-[#bae6fd] py-20">
      <div className="container mx-auto px-4">
        <AnimatedSection animation="fade-up" className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-light text-[#1e293b] mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-[#475569] max-w-3xl mx-auto">
            Find answers to common questions about our platform, services, and processes.
          </p>
        </AnimatedSection>

        {/* Search Bar */}
        <AnimatedSection animation="fade-up" delay={100} className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#64748b] h-5 w-5" />
            <Input
              type="text"
              placeholder="Search frequently asked questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-3 text-base border-2 border-[#e2e8f0] focus:border-[#3b82f6] rounded-lg bg-white"
            />
          </div>
        </AnimatedSection>

        <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-[#e2e8f0] shadow-sm text-[#1e293b] font-medium"
            >
              <Menu className="h-5 w-5" />
              Browse Categories
            </button>
          </div>

          {/* Sidebar Navigation */}
          <div className={`
            fixed inset-0 z-50 lg:relative lg:inset-auto lg:z-auto
            ${isMobileSidebarOpen ? 'block' : 'hidden lg:block'}
          `}>
            {/* Mobile Overlay */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 lg:hidden"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            
            {/* Sidebar Content */}
            <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-lg lg:relative lg:w-64 lg:shadow-none lg:bg-transparent overflow-y-auto">
              {/* Mobile Header */}
              <div className="flex items-center justify-between p-4 border-b lg:hidden">
                <h3 className="text-lg font-semibold text-[#1e293b]">FAQ Categories</h3>
                <button
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="p-2 hover:bg-[#f1f5f9] rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Categories */}
              <nav className="p-4 lg:p-0 space-y-2">
                {filteredCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.id)}
                    className={`
                      w-full text-left px-4 py-3 rounded-lg transition-all duration-200
                      ${activeCategory === category.id
                        ? 'bg-[#3b82f6] text-white shadow-md'
                        : 'bg-white text-[#475569] hover:bg-[#f1f5f9] border border-[#e2e8f0]'
                      }
                    `}
                  >
                    <span className="font-medium">{category.title}</span>
                    <span className="text-sm opacity-75 block">
                      {category.items.length} question{category.items.length !== 1 ? 's' : ''}
                    </span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1" ref={contentRef}>
            <AnimatedSection animation="fade-up" delay={200}>
              <div className="bg-white rounded-2xl shadow-lg border border-[#e2e8f0] overflow-hidden">
                {/* Category Header */}
                <div className="bg-gradient-to-r from-[#f1f5f9] to-[#e2e8f0] px-6 py-4 border-b border-[#e2e8f0]">
                  <h3 className="text-2xl font-semibold text-[#1e293b]">
                    {currentCategory?.title || 'Search Results'}
                  </h3>
                  <p className="text-[#64748b] mt-1">
                    {currentCategory?.items.length || 0} question{(currentCategory?.items.length || 0) !== 1 ? 's' : ''}
                  </p>
                </div>

                {/* FAQ Items */}
                <div className="divide-y divide-[#e2e8f0]">
                  {currentCategory?.items.map((item, index) => {
                    const key = `${activeCategory}-${index}`;
                    const isExpanded = expandedItems[key];
                    
                    return (
                      <div key={index} className="group">
                        <button
                          onClick={() => toggleExpanded(activeCategory, index)}
                          className="w-full px-6 py-5 text-left hover:bg-[#f8fafc] transition-colors duration-200 focus:outline-none focus:bg-[#f8fafc]"
                        >
                          <div className="flex items-center justify-between">
                            <h4 className="text-[#1e293b] font-medium pr-4 group-hover:text-[#3b82f6] transition-colors">
                              {item.question}
                            </h4>
                            <ChevronDown 
                              className={`h-5 w-5 text-[#64748b] flex-shrink-0 transition-transform duration-200 ${
                                isExpanded ? 'rotate-180' : ''
                              }`}
                            />
                          </div>
                        </button>
                        
                        <div className={`
                          overflow-hidden transition-all duration-300 ease-in-out
                          ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                        `}>
                          <div className="px-6 pb-5">
                            <div className="text-[#475569] leading-relaxed whitespace-pre-line">
                              {item.answer}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Empty State */}
                {(!currentCategory || currentCategory.items.length === 0) && searchTerm && (
                  <div className="px-6 py-12 text-center">
                    <Search className="h-12 w-12 text-[#94a3b8] mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-[#1e293b] mb-2">No results found</h4>
                    <p className="text-[#64748b]">
                      Try adjusting your search terms or browse our categories above.
                    </p>
                  </div>
                )}
              </div>
            </AnimatedSection>
          </div>
        </div>

        {/* Contact Section */}
        <AnimatedSection animation="fade-up" delay={300} className="text-center mt-12">
          <div className="bg-white rounded-2xl shadow-lg border border-[#e2e8f0] p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-[#1e293b] mb-4">Still have questions?</h3>
            <p className="text-[#475569] mb-6">
              Our support team is here to help you with any questions not covered in our FAQ.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex items-center gap-2">
                <span className="text-[#475569]">Email:</span>
                <a href="mailto:contact@nursenest.us" className="text-[#3b82f6] hover:text-[#2563eb] font-medium">
                  contact@nursenest.us
                </a>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#475569]">Phone:</span>
                <a href="tel:4259543381" className="text-[#3b82f6] hover:text-[#2563eb] font-medium">
                  (425) 954-3381
                </a>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
