
import { ClipboardCheck, SearchCheck, Users, DollarSign, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import BackgroundElements from './BackgroundElements';
import FastTrackCallout from './FastTrackCallout';

export default function HowItWorksSection() {
  const steps = [
    {
      number: "1",
      title: "Tell Us What You Need",
      description: "Fill out a short form with your preferences and care requirements.",
      icon: <ClipboardCheck className="h-10 w-10 text-white" />,
      bgClass: "bg-primary-500"
    },
    {
      number: "2",
      title: "Pay to Begin Your Search",
      description: "$100 to start. Need a faster match? Add the $500 FastTrack Match to get a nurse within 5 business days.",
      icon: <DollarSign className="h-10 w-10 text-white" />,
      bgClass: "bg-primary-500"
    },
    {
      number: "3",
      title: "We Source and Vet Nurses",
      description: "We tap our nationwide network, run verifications, and present you with hand-selected RNs.",
      icon: <SearchCheck className="h-10 w-10 text-white" />,
      bgClass: "bg-primary-500"
    },
    {
      number: "4",
      title: "You Choose Your Nurse",
      description: "Review profiles and choose who you'd like to move forward with.",
      icon: <Users className="h-10 w-10 text-white" />,
      bgClass: "bg-primary-500"
    },
    {
      number: "5",
      title: "Approve Hours & Pay Seamlessly",
      description: "Your nurse logs hours via our system. You review, approve, and pay directly through our platform—secure and simple.",
      icon: <CheckCircle className="h-10 w-10 text-white" />,
      bgClass: "bg-primary-500"
    }
  ];

  return (
    <section className="section-padding bg-gradient-to-br from-nurse-light to-white relative" id="how-it-works">
      {/* Background Element */}
      <BackgroundElements />

      <div className="container-custom relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            How Nurse Nest <span className="text-primary-500">Works</span>
          </h2>
          <p className="text-lg text-gray-700">
            Our streamlined process makes finding the perfect nurse quick and hassle-free.
          </p>
        </div>
        
        {/* Process Steps - Vertical Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Connection Line */}
          <div className="absolute left-6 top-10 bottom-10 w-1 bg-gray-200 z-0 md:left-1/2 md:transform md:-translate-x-1/2"></div>
          
          <div className="space-y-12">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className={`flex flex-col md:flex-row ${index % 2 === 0 ? 'md:flex-row-reverse' : ''} items-center`}
              >
                <div className="md:w-1/2 px-8">
                  <div 
                    className="bg-white p-6 rounded-lg shadow-md relative flow-card overflow-hidden border-l-4 border-primary-500"
                    data-step={step.number}
                  >
                    <div className="z-10 relative">
                      <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                </div>
                
                <div className="md:w-0 flex justify-center my-4 md:my-0 z-10">
                  <div className={`w-12 h-12 rounded-full ${step.bgClass} flex items-center justify-center text-white font-bold shadow-lg`}>
                    {step.number}
                  </div>
                </div>
                
                <div className="md:w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
        
        {/* FastTrack Callout */}
        <div className="mt-16">
          <FastTrackCallout />
        </div>
        
        {/* Client Dashboard Welcome - Hidden on homepage, shown on dashboard */}
        <div className="hidden dashboard-only">
          <div className="mt-16 bg-white rounded-xl shadow-md p-8">
            <div className="max-w-3xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">Welcome to your Nurse Nest dashboard.</h3>
              <p className="mb-4">From here, you can:</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>View and approve your nurse's timesheets</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Track your current match status</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Access receipts, contracts, and communications</span>
                </li>
              </ul>
              <div className="bg-blue-50 p-4 rounded-md border-l-4 border-blue-500">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      Tip: Approve hours directly to trigger secure payment via Stripe—Nurse Nest handles the details.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <Link to="/apply">
            <Button className="bg-primary-500 hover:bg-primary-600 text-white button-hover-effect">
              Get Started Now
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
