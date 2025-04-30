
import { ClipboardCheck, SearchCheck, Users } from 'lucide-react';
import { Button } from './ui/button';

export default function HowItWorksSection() {
  const steps = [
    {
      title: "Tell Us What You Need",
      description: "Fill out a quick form describing your ideal nurse (specialty, availability, location).",
      icon: <ClipboardCheck className="h-10 w-10 text-white" />,
      bgClass: "bg-primary-500"
    },
    {
      title: "We Source & Screen Nurses",
      description: "We hand-pick qualified nurses and verify all credentials, licenses, and experience.",
      icon: <SearchCheck className="h-10 w-10 text-white" />,
      bgClass: "bg-nurse-dark"
    },
    {
      title: "Meet Your Match",
      description: "You receive the best options — and we arrange care within 48 hours.",
      icon: <Users className="h-10 w-10 text-white" />,
      bgClass: "bg-primary-700"
    }
  ];

  return (
    <section className="section-padding bg-gradient-to-br from-nurse-light to-white" id="how-it-works">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Simple, <span className="text-gradient">Seamless</span> Nurse Matching
          </h2>
          <p className="text-lg text-gray-700">
            Our streamlined process makes finding the perfect nurse quick and hassle-free.
          </p>
        </div>
        
        {/* Process Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden md:block absolute top-24 left-0 right-0 h-1 bg-gray-200 z-0"></div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className="step-card animate-fade-in"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className={`step-number ${step.bgClass} z-10`}>{index + 1}</div>
                <div className={`w-16 h-16 rounded-full ${step.bgClass} flex items-center justify-center mb-6`}>
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <Button className="bg-nurse-dark hover:bg-primary-700 text-white">
            Get Started Now
          </Button>
        </div>
      </div>
    </section>
  );
}
