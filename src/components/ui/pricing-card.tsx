
"use client";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface PricingFeature {
  title: string;
  items: string[];
}

interface PricingCardProps {
  title: string;
  description: string;
  price: string | number;
  originalPrice?: string | number;
  features: PricingFeature[];
}

export function PricingCard({
  title,
  description,
  price,
  originalPrice,
  features,
}: PricingCardProps) {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [isInView, hasAnimated]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
      },
    },
  };

  const listItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return (
    <motion.div
      ref={containerRef}
      className="w-full"
      initial="hidden"
      animate={hasAnimated ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <Card className="relative mx-auto w-full overflow-hidden shadow-lg border-[#e2e8f0]">
        <div className="flex flex-col lg:flex-row">
          <motion.div
            className="flex flex-col justify-between p-8 lg:w-2/5 lg:p-12 bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9]"
            variants={itemVariants}
          >
            <div>
              <CardHeader className="p-0">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-3xl font-light text-[#1e293b] mb-3">{title}</CardTitle>
                    <CardDescription className="text-[#475569] text-lg">{description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <motion.div className="mt-8 space-y-4" variants={itemVariants}>
                <div className="flex items-baseline">
                  <span className="text-5xl font-light text-[#1e293b]">${price}</span>
                  {originalPrice && (
                    <span className="ml-2 text-xl text-[#64748b] line-through">
                      ${originalPrice}
                    </span>
                  )}
                </div>
                <span className="block text-sm text-[#64748b]">
                  per screening package
                </span>
              </motion.div>
            </div>
          </motion.div>
          <Separator className="lg:my-6 lg:hidden" />
          <motion.div
            className="bg-white p-8 lg:w-3/5 lg:p-12"
            variants={itemVariants}
          >
            <div className="space-y-8">
              {features.map((feature, featureIndex) => (
                <div key={featureIndex}>
                  <h3 className="mb-4 text-lg font-medium text-[#1e293b]">{feature.title}</h3>
                  <ul className="grid grid-cols-1 gap-3">
                    {feature.items.map((item, index) => (
                      <motion.li
                        key={index}
                        className="flex items-center"
                        variants={listItemVariants}
                        custom={index + featureIndex * feature.items.length}
                      >
                        <Check className="mr-3 h-4 w-4 text-[#3b82f6] flex-shrink-0" />
                        <span className="text-[#475569]">{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                  {featureIndex < features.length - 1 && <Separator className="my-6" />}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
}
