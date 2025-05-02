
import { Button } from './ui/button';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Hero Image Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/lovable-uploads/8f74e0c5-9c2c-45c8-8588-e7b4fa1b1440.png" 
          alt="Nurse in a box delivered to doorstep" 
          className="w-full h-full object-cover"
        />
        {/* Dark overlay for better text visibility */}
        <div className="absolute inset-0 bg-black/20"></div>
      </div>
      
      {/* Hero Content */}
      <div className="container-custom relative z-10 pt-24 pb-16 md:pt-32">
        <div className="max-w-xl">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-white drop-shadow-lg">
              Specialized Nurses <span className="block">Delivered</span> to Your Doorstep
            </h1>
            <p className="text-lg md:text-xl text-white mb-8 max-w-lg drop-shadow-md">
              Nationwide nurse-matching for newborns, elderly loved ones, and private practices — all backed by real clinical experience.
            </p>
            <div>
              <Button className="bg-nurse-dark hover:bg-primary-700 text-white shadow-lg">
                Request a Nurse
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Trust Badge */}
      <div className="absolute top-4 right-4 md:top-8 md:right-8 bg-white px-4 py-2 rounded-full shadow-lg border border-gray-100 flex items-center z-10">
        <svg className="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
        </svg>
        <span className="text-sm font-medium">100% Nurse Owned</span>
      </div>
      
      {/* Remove wave divider as it doesn't work well with the image */}
    </section>
  );
}
