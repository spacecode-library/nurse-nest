
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  
  const faqs = [
    {
      question: "How fast can I get matched with a nurse?",
      answer: "We pride ourselves on quick matching. In most cases, we can connect you with qualified nurses within 48 hours of your request. For urgent needs, please indicate this in your request and we'll prioritize accordingly."
    },
    {
      question: "Are all your nurses licensed?",
      answer: "Yes, absolutely. Every nurse in our network is fully licensed and registered in their respective state(s). We verify credentials, conduct background checks, and ensure all licenses are current before any match is made."
    },
    {
      question: "What areas do you serve?",
      answer: "Nurse Nest offers nationwide coverage across the United States. Our extensive network includes nurses in major metropolitan areas as well as many rural communities. During the matching process, we prioritize nurses who are geographically closest to your location."
    },
    {
      question: "Can I request a specific type of experience (NICU, hospice, etc.)?",
      answer: "Yes, we specialize in matching nurses with specific clinical backgrounds to your needs. Whether you need a NICU-trained nurse for your newborn, a hospice nurse for end-of-life care, or any other specialization, we can accommodate your request. Just specify your requirements when you apply."
    },
    {
      question: "What is the minimum duration for nurse services?",
      answer: "We offer flexible arrangements starting from single shifts (8-12 hours) up to long-term contracts. There's no minimum requirement, though many of our clients find the most value in consistent care arrangements."
    }
  ];
  
  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="section-padding bg-white" id="faq">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Got <span className="text-gradient">Questions</span>? We've Got Answers.
          </h2>
          <p className="text-lg text-gray-700">
            Find answers to commonly asked questions about our nurse matching service.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="glass-card animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="flex justify-between items-center w-full p-6 text-left"
                >
                  <h3 className="text-lg font-medium">{faq.question}</h3>
                  {openIndex === index ? (
                    <ChevronUp className="h-5 w-5 text-primary-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-300",
                    openIndex === index ? "max-h-96" : "max-h-0"
                  )}
                >
                  <p className="p-6 pt-0 text-gray-600">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="max-w-xl mx-auto mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Still have questions? We're here to help!
          </p>
          <a 
            href="/contact" 
            className="inline-flex items-center text-primary-500 font-medium hover:text-primary-600"
          >
            Contact our team for more information
            <ChevronRight className="ml-1 h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
