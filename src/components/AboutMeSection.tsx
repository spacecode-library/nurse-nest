
import React from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

export default function AboutMeSection() {
  const isMobile = useIsMobile();

  return (
    <section className="section-padding bg-white" id="about-me">
      <div className="container-custom">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-12 gap-8 items-center">
            {/* Image Column */}
            <div className="md:col-span-4 lg:col-span-3 flex justify-center md:justify-end">
              <div className={cn("relative", !isMobile && "animate-on-scroll opacity-0")}>
                <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-nurse-light shadow-xl">
                  <img
                    src="/lovable-uploads/f3cbf40a-482a-4324-a5a2-46eb796d4775.png"
                    alt="Jayson Minagawa"
                    className="w-full h-full object-cover"
                  />
                </div>
                {!isMobile && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="absolute -bottom-4 -right-4 bg-white px-4 py-2 rounded-lg shadow-lg"
                  >
                    <p className="text-nurse-dark font-bold">Founder</p>
                  </motion.div>
                )}
              </div>
            </div>
            
            {/* Content Column */}
            <div className="md:col-span-8 lg:col-span-9">
              <div className={cn(!isMobile && "animate-on-scroll opacity-0")}>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Jayson Minagawa
                </h2>
                <h3 className="text-xl mb-6 text-nurse-dark font-semibold">
                  Founder of Nurse Nest
                </h3>
                
                <div className="prose prose-lg max-w-none">
                  <p className="mb-4">
                    Hi, I'm Jayson — thank you so much for being here.
                  </p>
                  <p className="mb-4">
                    My nursing journey has been anything but linear, and for that, I'm incredibly grateful. I began my nursing path in 2008, but it didn't start off smoothly — I actually failed my very first semester of nursing school. Some friends even suggested I change majors. But I stayed the course, graduated, and began my career in the ICU. After three years of critical care experience, I transitioned into travel nursing in 2016 — a path I continue to this day.
                  </p>
                  <p className="mb-4">
                    Over the years, I've worked in a wide range of environments: ICU, correctional facilities, psychiatry, telehealth, and independent contracting. I've seen firsthand how different healthcare systems operate — and more importantly, where they often fall short, especially when individuals or families need to hire a nurse for specialized in-home care.
                  </p>
                  <p className="mb-4">
                    I created this platform to help make that process easier, more transparent, and less overwhelming. Having personally gone through countless background checks, drug screenings, and credentialing requirements, I know exactly what the process entails — and I'm here to streamline it for you.
                  </p>
                  <p>
                    Thank you again for visiting my site. If you have any questions or just want to connect, don't hesitate to reach out. I'd love to help!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
