import { Baby, Heart, Stethoscope, ArrowRight, Users, Clock, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import AnimatedSection from './AnimatedSection';

export default function WhoWeHelpSection() {
  const categories = [
    {
      title: "New Parents & Families",
      description: "Find specialized postpartum and pediatric nurses for overnight care, newborn support, and family guidance during those crucial early days.",
      icon: <Baby className="h-12 w-12 text-blue-600" />,
      features: ["Postpartum support", "Overnight care", "Lactation guidance", "Newborn care"],
      cta: "Find Family Nurses",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      title: "Senior Care & Families",
      description: "Connect with compassionate nurses specializing in elderly care, medication management, and providing dignity-focused support at home.",
      icon: <Heart className="h-12 w-12 text-rose-600" />,
      features: ["Medication management", "Companionship", "Health monitoring", "Mobility assistance"],
      cta: "Find Senior Care",
      gradient: "from-rose-500 to-pink-500"
    },
    {
      title: "Healthcare Facilities",
      description: "Quickly staff your practice or facility with verified, licensed nurses. No contracts, no long-term commitments, just quality care when you need it.",
      icon: <Stethoscope className="h-12 w-12 text-green-600" />,
      features: ["Per diem staffing", "Emergency coverage", "Specialized skills", "Immediate availability"],
      cta: "Find Staff Nurses",
      gradient: "from-green-500 to-emerald-500"
    }
  ];

  return (
    <section className="py-20 md:py-32 bg-gradient-to-br from-slate-50 to-blue-50/30 relative overflow-hidden" id="services">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-teal-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 left-16 w-48 h-48 bg-gradient-to-tr from-rose-400/10 to-pink-400/10 rounded-full blur-2xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <AnimatedSection animation="fade-up" className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-700 text-sm font-medium mb-6">
            <Users className="h-4 w-4 mr-2" />
            Trusted by Families & Healthcare Professionals
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-800 via-blue-700 to-teal-700 bg-clip-text text-transparent">
            Who We Connect
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Whether you need specialized nursing care for your family or you're a healthcare facility seeking qualified staff, 
            our platform connects you with the right professionals.
          </p>
        </AnimatedSection>
        
        {/* Services Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {categories.map((category, index) => (
            <AnimatedSection 
              key={index}
              animation="fade-up"
              delay={index * 150}
              className="group relative"
            >
              <div className="bg-white rounded-3xl shadow-xl border border-slate-200/50 overflow-hidden hover:shadow-2xl transition-all duration-500 h-full">
                {/* Header with gradient */}
                <div className={`bg-gradient-to-r ${category.gradient} p-8 text-white relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-4 backdrop-blur-sm">
                      {category.icon}
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{category.title}</h3>
                    <p className="text-white/90 leading-relaxed">{category.description}</p>
                  </div>
                </div>
                
                {/* Features List */}
                <div className="p-8">
                  <ul className="space-y-3 mb-6">
                    {category.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-slate-700">
                        <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full mr-3"></div>
                        <span className="font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full bg-gradient-to-r ${category.gradient} hover:shadow-lg transform hover:scale-105 transition-all duration-300 group`}
                    asChild
                  >
                    <Link to="/apply">
                      {category.cta}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Platform Benefits */}
        <AnimatedSection animation="fade-up" delay={400}>
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200/50 p-8 md:p-12">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-slate-800 mb-4">Why Choose NurseNest?</h3>
              <p className="text-xl text-slate-600">The trusted platform that puts quality and safety first</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <h4 className="text-xl font-semibold text-slate-800 mb-2">Verified Professionals</h4>
                <p className="text-slate-600">Every nurse is thoroughly vetted with license verification, background checks, and skill assessments.</p>
              </div>
              
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Clock className="h-8 w-8 text-green-600" />
                </div>
                <h4 className="text-xl font-semibold text-slate-800 mb-2">Quick Connections</h4>
                <p className="text-slate-600">Get matched with qualified nurses quickly. Most requests receive responses within hours.</p>
              </div>
              
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Heart className="h-8 w-8 text-purple-600" />
                </div>
                <h4 className="text-xl font-semibold text-slate-800 mb-2">Compassionate Care</h4>
                <p className="text-slate-600">Our nurses are selected not just for their skills, but for their dedication to providing caring, professional service.</p>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}