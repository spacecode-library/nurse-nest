
import { useState } from 'react';
import { ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const isMobile = useIsMobile();
  
  const faqs = [
    {
      question: "How fast does the whole process usually take?",
      answer: "Once your application is submitted and the $100 fee is received, we begin the process immediately. Our team promotes your listing through targeted advertising, job boards, and our professional network to maximize visibility. Typically, it takes up to 7 days to start receiving qualified applicants. If time is not a concern, we're happy to keep the listing active for as long as needed."
    },
    {
      question: "What if no nurse applies to the job listing?",
      answer: "You may need to adjust the pay rate. If you prefer not to increase it, this service may not be the right fit for your current needs."
    },
    {
      question: "Why do nurses start at a high rate?",
      answer: "Nursing rates can vary significantly based on location, specialty, and experience. Listing a position at the lowest rate typically results in limited interest. Offering a more competitive rate increases the likelihood of attracting qualified applicants. Additionally, please note that these are independent contractor roles—nurses are responsible for covering their own health insurance, LLC formation, and malpractice insurance."
    },
    {
      question: "What's a good time frame to request a nurse match?",
      answer: "Nurses generally like to know at least a month ahead. If nurses are free and looking for work, they can start immediately."
    },
    {
      question: "What areas do you serve?",
      answer: "Nurse Nest offers nationwide coverage across the United States. Our extensive network includes nurses in major metropolitan areas as well as many rural communities. During the matching process, we prioritize nurses who are geographically closest to your location."
    }
  ];
  
  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="section-padding bg-white" id="faq">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center mb-8 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Got <span className="text-gradient">Questions</span>? We've Got Answers.
          </h2>
          <p className="text-lg text-gray-700">
            Find answers to commonly asked questions about our nurse matching service.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const animationClass = !isMobile ? "animate-on-scroll opacity-0" : "";
              return (
                <div 
                  key={index} 
                  className={`glass-card ${animationClass}`}
                  style={!isMobile ? { animationDelay: `${index * 100}ms` } : {}}
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="flex justify-between items-center w-full p-4 md:p-6 text-left"
                  >
                    <h3 className="text-base md:text-lg font-medium pr-4">{faq.question}</h3>
                    {openIndex === index ? (
                      <ChevronUp className="h-5 w-5 flex-shrink-0 text-primary-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 flex-shrink-0 text-gray-500" />
                    )}
                  </button>
                  
                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-300",
                      openIndex === index ? "max-h-[500px]" : "max-h-0"
                    )}
                  >
                    <p className="p-4 md:p-6 pt-0 text-gray-600">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="max-w-xl mx-auto mt-8 md:mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Still have questions? We're here to help!
          </p>
          <a 
            href="/contact" 
            className="inline-flex items-center text-primary-500 font-medium hover:text-primary-600"
          >
            Contact our team for more information
            <ArrowRight className="ml-1 h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
