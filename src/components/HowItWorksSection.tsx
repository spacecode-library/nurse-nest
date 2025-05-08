
import { ClipboardCheck, SearchCheck, Users } from 'lucide-react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';

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
      description: "We hand-pick qualified nurses and verify resume before sending in matches to you.",
      icon: <SearchCheck className="h-10 w-10 text-white" />,
      bgClass: "bg-primary-500"
    },
    {
      title: "Meet Your Match",
      description: "You receive the best options - and interview them via zoom or phone and pick your favorite nurse.",
      icon: <Users className="h-10 w-10 text-white" />,
      bgClass: "bg-primary-500"
    }
  ];

  return (
    <section className="section-padding bg-gradient-to-br from-nurse-light to-white relative" id="how-it-works">
      {/* Background Element */}
      <div className="absolute inset-0 overflow-hidden z-0 opacity-10">
        <div className="absolute top-0 right-0 w-full h-full">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path fill="#1E88E5" d="M45.7,-76.5C58.9,-69.1,69.1,-55.3,76.3,-40.8C83.4,-26.3,87.5,-11.2,85.6,3C83.8,17.2,76,30.4,66.3,41.3C56.6,52.3,45,61,32.1,68.4C19.2,75.8,4.9,81.8,-9.4,81.3C-23.6,80.7,-37.9,73.6,-49.3,64C-60.7,54.3,-69.3,42.1,-75.1,28.3C-80.8,14.6,-83.8,-0.7,-80.9,-14.9C-77.9,-29.1,-69.1,-42.3,-57.5,-49.7C-45.8,-57.2,-31.3,-59,-18.2,-65.7C-5.1,-72.5,6.6,-84.3,19.8,-85.2C33,-86,47.6,-75.9,45.7,-76.5Z" transform="translate(100 100)" />
          </svg>
        </div>
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Simple, <span className="text-primary-500">Seamless</span> Nurse Matching
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
                className="bg-white p-8 rounded-lg shadow-md text-center relative step-card"
              >
                <div className={`w-10 h-10 rounded-full ${step.bgClass} absolute -top-5 left-5 flex items-center justify-center text-white font-bold z-10`}>{index + 1}</div>
                <div className={`w-16 h-16 rounded-full ${step.bgClass} flex items-center justify-center mb-6 mx-auto glow-animation`}>
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <Link to="/apply">
            <Button className="bg-primary-500 hover:bg-primary-600 text-white">
              Get Started Now
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
