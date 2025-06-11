
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MoveRight, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";

function Hero() {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["reliable", "professional", "compassionate", "qualified", "trusted"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="w-full">
      <div className="container mx-auto">
        <div className="flex gap-8 py-20 lg:py-40 items-start justify-start flex-col text-left">
          <div>
            <Button variant="secondary" size="sm" className="gap-4 bg-blue-100 text-blue-800 hover:bg-blue-200">
              Nationwide Coverage <MoveRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex gap-4 flex-col max-w-3xl">
            <h1 className="text-5xl md:text-7xl tracking-tighter text-left font-regular text-white">
              <span className="text-white">Need a</span>
              <span className="relative flex w-full justify-start overflow-hidden text-left md:pb-4 md:pt-1">
                &nbsp;
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-semibold text-blue-300"
                    initial={{ opacity: 0, y: "-100" }}
                    transition={{ type: "spring", stiffness: 50 }}
                    animate={
                      titleNumber === index
                        ? {
                            y: 0,
                            opacity: 1,
                          }
                        : {
                            y: titleNumber > index ? -150 : 150,
                            opacity: 0,
                          }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
              <span className="text-white"> nurse?</span>
            </h1>

            <p className="text-lg md:text-xl leading-relaxed tracking-tight text-blue-100 max-w-2xl text-left">
              We provide nationwide concierge nursing services delivered directly to your doorstep. 
              Our licensed professionals ensure worry-free, quality care when you need it most.
            </p>
          </div>
          <div className="flex flex-row gap-3">
            <Button size="lg" className="gap-4 bg-blue-600 hover:bg-blue-700 text-white">
              Request a Nurse <PhoneCall className="w-4 h-4" />
            </Button>
            <Button size="lg" className="gap-4 bg-white text-blue-600 hover:bg-blue-50" variant="outline">
              Join as a Nurse <MoveRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Hero };
