
import { ArrowRight } from 'lucide-react';
import { Button } from './ui/button';

export default function CtaSection() {
  return (
    <section className="section-padding bg-gradient-to-r from-nurse-dark to-primary-700 text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-20">
          <svg width="400" height="400" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path fill="white" d="M12.3,-17.7C15.9,-12.8,18.7,-9.3,20.9,-4.9C23,0.5,24.4,5.7,22.8,10.2C21.2,14.7,16.7,18.5,11.3,21.1C6,23.8,-0.2,25.2,-6.5,24.2C-12.9,23.1,-19.5,19.5,-22.4,14.2C-25.4,8.9,-24.7,1.8,-23.2,-6C-21.6,-13.9,-19.2,-22.5,-14.4,-27.1C-9.5,-31.7,-2.4,-32.1,2,-30C6.4,-27.9,8.8,-22.5,12.3,-17.7Z" transform="translate(50 50)" />
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 w-1/3 h-full opacity-20">
          <svg width="400" height="400" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path fill="white" d="M14.4,-23.1C18.5,-19.1,21.5,-14.7,24.2,-9.8C26.8,-4.9,29.2,0.5,28.8,5.8C28.3,11.1,25,16.2,20.5,19.9C16,23.6,10.2,25.7,4.3,26.2C-1.5,26.7,-7.4,25.5,-12.4,22.6C-17.4,19.7,-21.5,15.1,-25.2,9.6C-28.8,4.1,-32,-2.4,-31.2,-8.4C-30.4,-14.4,-25.7,-19.9,-20,-23.8C-14.4,-27.7,-7.2,-30,-0.8,-28.8C5.6,-27.7,11.2,-23,14.4,-23.1Z" transform="translate(50 50)" />
          </svg>
        </div>
      </div>
      
      <div className="container-custom relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Find Your Perfect Nurse Match?
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Take the first step toward quality care that fits your exact needs.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button className="bg-white text-nurse-dark hover:bg-gray-100 text-lg px-8 py-6">
              Request a Nurse
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 py-6 group">
              Learn More
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
