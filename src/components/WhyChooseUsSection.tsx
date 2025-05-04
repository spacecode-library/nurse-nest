
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

export default function WhyChooseUsSection() {
  const isMobile = useIsMobile();

  return (
    <section className="section-padding bg-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
        <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-primary-100 filter blur-3xl" />
        <div className="absolute bottom-10 right-40 w-48 h-48 rounded-full bg-nurse-light filter blur-3xl" />
      </div>
      
      <div className="container-custom relative z-10">
        <div className="flex justify-center">
          {/* Image Only */}
          <div className={cn("relative", !isMobile && "animate-on-scroll opacity-0")}>
            <img 
              src="/lovable-uploads/49fc5184-fdc8-4f1d-bdb4-99bdb010c7e2.png"
              alt="Nurse with baby and happy family" 
              className="rounded-xl shadow-xl w-full max-w-2xl mx-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
