
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
          {/* Image Only with larger size */}
          <div className={cn("relative w-full max-w-4xl", !isMobile && "animate-on-scroll opacity-0")}>
            <img 
              src="/lovable-uploads/598548b2-a370-469c-86f5-19503d151210.png"
              alt="Nurse with baby and happy family" 
              className="rounded-xl shadow-xl w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
