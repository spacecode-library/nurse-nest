
import { CheckIcon } from 'lucide-react';
import { Button } from './ui/button';

export default function WhyChooseUsSection() {
  const benefits = [
    "100% nurse-owned and operated",
    "Nationwide network of licensed RNs",
    "Thorough background checks and credential verification",
    "Quick matching within 48 hours",
    "Long-term and short-term contracts available",
    "No agency markups or hidden fees"
  ];
  
  const trustBadges = [
    { name: "RN Verified", color: "bg-blue-500" },
    { name: "HIPAA Compliant", color: "bg-green-500" },
    { name: "Insured & Vetted", color: "bg-purple-500" },
    { name: "Nurse-Owned", color: "bg-red-500" }
  ];

  return (
    <section className="section-padding bg-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
        <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-primary-100 filter blur-3xl" />
        <div className="absolute bottom-10 right-40 w-48 h-48 rounded-full bg-nurse-light filter blur-3xl" />
      </div>
      
      <div className="container-custom relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image Side */}
          <div className="relative animate-fade-in">
            <img 
              src="https://images.unsplash.com/photo-1612656693463-4259d1b4f06c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Compassionate nurse with patient" 
              className="rounded-xl shadow-xl w-full max-w-lg mx-auto"
            />
            
            {/* Floating Elements */}
            <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-center">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div 
                      key={i} 
                      className="w-10 h-10 rounded-full border-2 border-white overflow-hidden"
                    >
                      <img 
                        src={`https://i.pravatar.cc/150?img=${i + 10}`} 
                        alt="Nurse" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div className="ml-3">
                  <p className="text-xs text-gray-500">Matched with</p>
                  <p className="text-sm font-medium">15+ families this week</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Content Side */}
          <div className="animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Nurses You Can Trust. <span className="text-gradient">Care You Can Feel.</span>
            </h2>
            
            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <div 
                  key={index} 
                  className="flex items-start animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                    <CheckIcon className="h-4 w-4 text-green-600" />
                  </div>
                  <p className="ml-3 text-gray-700">{benefit}</p>
                </div>
              ))}
            </div>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap gap-3 mb-8">
              {trustBadges.map((badge, index) => (
                <div 
                  key={index}
                  className="flex items-center px-4 py-2 rounded-full bg-gray-100 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`h-2 w-2 rounded-full ${badge.color} mr-2`} />
                  <span className="text-sm font-medium">{badge.name}</span>
                </div>
              ))}
            </div>
            
            <Button className="bg-nurse-dark hover:bg-primary-700">
              Request a Nurse
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
