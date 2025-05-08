
import { Baby, Users, Stethoscope } from 'lucide-react';
import BackgroundElements from './BackgroundElements';

export default function WhoWeHelpSection() {
  const categories = [
    {
      title: "New Parents",
      description: "Sleep easy with NICU or L&D-trained night nurses who care for your newborn overnight.",
      icon: <Baby className="h-12 w-12 text-primary-500" />,
      image: "/lovable-uploads/6c21cb4e-2b16-4459-a27e-ff5d3cb6946f.png"
    },
    {
      title: "Busy Families with Elderly Loved Ones",
      description: "Weekly check-ins, medication management, and fall prevention from licensed nurses.",
      icon: <Users className="h-12 w-12 text-primary-500" />,
      image: "/lovable-uploads/598548b2-a370-469c-86f5-19503d151210.png"
    },
    {
      title: "Doctor Offices & Clinics",
      description: "We staff your practice with experienced, credentialed nurses — without the HR hassle.",
      icon: <Stethoscope className="h-12 w-12 text-primary-500" />,
      image: "/lovable-uploads/6ab964b9-97ec-4251-bd6d-8bafe7ce731c.png"
    }
  ];

  return (
    <section className="section-padding bg-white text-gray-800 relative" id="services">
      {/* Background Element */}
      <BackgroundElements />

      <div className="container-custom relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Tailored Care for <span className="text-primary-500 pulse-text">Every Situation</span>
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
              className="shadow-lg bg-white rounded-xl overflow-hidden border border-gray-200 service-card-pulse"
            >
              <div className="h-56 overflow-hidden">
                <img 
                  src={category.image} 
                  alt={category.title} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
              <div className="p-8">
                <div className="flex items-start mb-4">
                  {category.icon}
                  <h3 className="text-xl font-semibold ml-4 text-gray-800">{category.title}</h3>
                </div>
                <p className="text-gray-700">{category.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
