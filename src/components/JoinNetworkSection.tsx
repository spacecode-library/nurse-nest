
import { CheckCircle } from 'lucide-react';
import { Button } from './ui/button';

export default function JoinNetworkSection() {
  const benefits = [
    "Flexible scheduling that works around your life",
    "Competitive pay with no middleman taking a huge cut",
    "Professional growth opportunities and specialization",
    "Support network of fellow nurses"
  ];

  return (
    <section className="section-padding bg-nurse-dark text-white relative overflow-hidden" id="for-nurses">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-primary-700/30 filter blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-primary-500/20 filter blur-3xl" />
      </div>
      
      <div className="container-custom relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Are You a Compassionate, Experienced Nurse? <span className="text-primary-300">Join the Nest.</span>
            </h2>
            <p className="text-lg text-white/80 mb-8">
              We support independent nurses with steady job opportunities, flexible hours, and a nurse-first approach.
            </p>
            
            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <div 
                  key={index} 
                  className="flex items-start animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CheckCircle className="h-6 w-6 text-primary-300 flex-shrink-0 mt-0.5" />
                  <p className="ml-3 text-white/90">{benefit}</p>
                </div>
              ))}
            </div>
            
            <Button className="bg-white text-nurse-dark hover:bg-gray-100">
              Apply to Join Our Network
            </Button>
          </div>
          
          <div className="relative animate-fade-in">
            <div className="relative z-10 bg-white p-6 rounded-xl shadow-xl">
              <div className="absolute -top-3 -right-3 bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                Now Recruiting
              </div>
              
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Nurse Application
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Your name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input 
                    type="email" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="your.email@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option>Choose your specialty</option>
                    <option>NICU</option>
                    <option>L&D</option>
                    <option>Geriatric Care</option>
                    <option>Pediatric</option>
                    <option>Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                  <input 
                    type="number" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Years of experience"
                    min="1"
                  />
                </div>
                
                <Button className="w-full bg-primary-500 hover:bg-primary-600">
                  Submit Application
                </Button>
              </div>
            </div>
            
            {/* Decoration */}
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary-400/20 rounded-full"></div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary-400/20 rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
