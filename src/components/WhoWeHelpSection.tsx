
import { Baby, Users, Stethoscope } from 'lucide-react';

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
      <div className="absolute inset-0 overflow-hidden z-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path fill="#1E88E5" d="M52.8,-75.2C68.7,-67.3,81.9,-53.1,88.4,-36.5C94.9,-19.9,94.7,-1,89.8,15.7C84.9,32.3,75.3,46.7,62.8,58.4C50.3,70.1,35,79.1,18.4,83.1C1.7,87.2,-16.3,86.3,-32.1,80.1C-47.9,73.8,-61.5,62.3,-70.3,48C-79.2,33.6,-83.3,16.8,-83.9,-0.4C-84.5,-17.5,-81.6,-34.9,-72.1,-47.8C-62.6,-60.7,-46.4,-69.1,-30.9,-76.6C-15.4,-84.2,-0.6,-91,15.1,-90.7C30.7,-90.5,36.8,-83.2,52.8,-75.2Z" transform="translate(100 100)" />
          </svg>
        </div>
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Tailored Care for <span className="text-primary-500">Every Situation</span>
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
              className="shadow-lg bg-white rounded-xl overflow-hidden border border-gray-200"
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
