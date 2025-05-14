
import { Baby, Heart, Stethoscope } from 'lucide-react';
import AnimatedSection from './AnimatedSection';

export default function WhoWeHelpSection() {
  const categories = [
    {
      title: "Overnight Care for New Parents",
      description: "Get uninterrupted rest with L&D- or NICU-trained night nurses who provide safe, attentive newborn care while you sleep.",
      icon: <Baby className="h-16 w-16 text-primary-500 animate-icon-pulse" />,
      image: "/lovable-uploads/6c21cb4e-2b16-4459-a27e-ff5d3cb6946f.png"
    },
    {
      title: "Support for Aging Loved Ones",
      description: "Weekly check-ins, medication support, fall prevention, and companionship—delivered by compassionate nurses in the comfort of home.",
      icon: <Heart className="h-16 w-16 text-primary-500 animate-icon-rock" />,
      image: "/lovable-uploads/598548b2-a370-469c-86f5-19503d151210.png"
    },
    {
      title: "Licensed Nurses for Clinics & Practices",
      description: "Need help fast? We match medical offices with licensed, vetted RNs—no contracts, no delays, and no HR hassle.",
      icon: <Stethoscope className="h-16 w-16 text-primary-500 animate-icon-pulse" />,
      image: "/lovable-uploads/6ab964b9-97ec-4251-bd6d-8bafe7ce731c.png"
    }
  ];

  return (
    <section className="section-padding bg-nurse-light text-gray-800 relative" id="services">
      <div className="container-custom relative z-10">
        <AnimatedSection animation="fade-up" className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
            Tailored Nursing, <span className="text-primary-500">Where You Need It Most</span>
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            Our licensed nurses specialize in specific care settings—whether at home, bedside, or in private practice. 
            Get matched with an RN who fits your life, not just your checklist.
          </p>
        </AnimatedSection>
        
        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <AnimatedSection 
              key={index}
              animation="fade-up"
              delay={index * 150}
              className="shadow-lg bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
              <div className="p-6 text-center">
                <div className="flex justify-center items-center mb-6">
                  {category.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">{category.title}</h3>
                <p className="text-gray-700">{category.description}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
