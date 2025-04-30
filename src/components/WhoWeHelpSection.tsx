
import { Baby, Users, Stethoscope } from 'lucide-react';
import { Button } from './ui/button';

export default function WhoWeHelpSection() {
  const categories = [
    {
      title: "New Parents",
      description: "Sleep easy with NICU or L&D-trained night nurses who care for your newborn overnight.",
      icon: <Baby className="h-12 w-12 text-nurse-dark" />,
      image: "https://images.unsplash.com/photo-1590649880765-91b1956b8276?w=500&auto=format&fit=crop&q=80"
    },
    {
      title: "Busy Families with Elderly Loved Ones",
      description: "Weekly check-ins, medication management, and fall prevention from licensed nurses.",
      icon: <Users className="h-12 w-12 text-nurse-dark" />,
      image: "https://images.unsplash.com/photo-1568658179908-beac99f98845?w=500&auto=format&fit=crop&q=80"
    },
    {
      title: "Doctor Offices & Clinics",
      description: "We staff your practice with experienced, credentialed nurses — without the HR hassle.",
      icon: <Stethoscope className="h-12 w-12 text-nurse-dark" />,
      image: "https://images.unsplash.com/photo-1587367871134-bf3189aa1aba?w=500&auto=format&fit=crop&q=80"
    }
  ];

  return (
    <section className="section-padding bg-gradient-to-br from-nurse-light to-white" id="services">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Tailored Care for <span className="text-gradient">Every Situation</span>
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            Our specialized nursing services are customized for different needs and situations, providing expert care when and where you need it most.
          </p>
        </div>
        
        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <div 
              key={index} 
              className="glass-card overflow-hidden rounded-xl animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={category.image} 
                  alt={category.title} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
              <div className="p-8">
                <div className="flex items-start mb-4">
                  {category.icon}
                  <h3 className="text-xl font-semibold ml-4">{category.title}</h3>
                </div>
                <p className="text-gray-600 mb-6">{category.description}</p>
                <Button variant="outline" className="w-full">
                  Learn More
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button className="bg-nurse-dark hover:bg-primary-700">
            Request a Nurse
          </Button>
        </div>
      </div>
    </section>
  );
}
