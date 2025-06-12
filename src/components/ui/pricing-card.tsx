
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
  price?: number;
  originalPrice?: number;
  features: PricingFeature[];
  savings?: string;
}

export function PricingCard({
  title,
  description,
  price,
  originalPrice,
  features,
  savings,
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
      <Card className="relative w-full overflow-hidden h-full">
        <div className="flex flex-col lg:flex-row h-full">
          <motion.div
            className="flex flex-col justify-between p-6 lg:w-2/5 lg:p-8"
            variants={itemVariants}
          >
            <div>
              <CardHeader className="p-0">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold">{title}</CardTitle>
                    <CardDescription className="mt-2">{description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              {price && (
                <motion.div className="mt-6 space-y-4" variants={itemVariants}>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-extrabold">${price}</span>
                    {originalPrice && (
                      <span className="ml-2 text-xl text-muted-foreground line-through">
                        ${originalPrice}
                      </span>
                    )}
                  </div>
                  {savings && (
                    <span className="block text-sm text-green-600 font-medium">
                      {savings}
                    </span>
                  )}
                </motion.div>
              )}
              {!price && (
                <motion.div className="mt-6" variants={itemVariants}>
                  <div className="text-2xl font-bold text-primary">
                    {title.includes("10%") ? "10%" : "5%"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {title.includes("Clients") ? "Added to nurse's hourly rate" : "Deducted from earnings"}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
          <Separator className="lg:my-6 lg:hidden" />
          <motion.div
            className="bg-muted/50 p-6 lg:w-3/5 lg:p-8 flex-1"
            variants={itemVariants}
          >
            <div className="space-y-6">
              {features.map((feature, featureIndex) => (
                <div key={featureIndex}>
                  <h3 className="mb-4 text-lg font-semibold">{feature.title}:</h3>
                  <ul className="grid grid-cols-1 gap-3">
                    {feature.items.map((item, index) => (
                      <motion.li
                        key={index}
                        className="flex items-start"
                        variants={listItemVariants}
                        custom={index + featureIndex * feature.items.length}
                      >
                        <Check className="mr-2 h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{item}</span>
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
