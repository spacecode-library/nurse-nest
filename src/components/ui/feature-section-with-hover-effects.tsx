
import { cn } from "@/lib/utils";
import {
  IconAdjustmentsBolt,
  IconCloud,
  IconCurrencyDollar,
  IconEaseInOut,
  IconHeart,
  IconHelp,
  IconRouteAltLeft,
  IconTerminal2,
} from "@tabler/icons-react";

export function FeaturesSectionWithHoverEffects() {
  const features = [
    {
      title: "Start Free, Pay When Needed",
      description:
        "No setup fees, monthly charges, or hidden costs. Browse qualified nurses free—pay our small platform fee only when booking completed care.",
      icon: <IconCurrencyDollar />,
    },
    {
      title: "Founded by Nurses",
      description:
        "Nurse-owned platform built by healthcare professionals who understand your needs. Our nursing team ensures every feature serves both families and caregivers.",
      icon: <IconHeart />,
    },
    {
      title: "Handpicked Professionals",
      description:
        "Every nurse personally recruited and vetted by our nursing team. We know each healthcare professional individually—no automated matching systems.",
      icon: <IconTerminal2 />,
    },
    {
      title: "Flexible Background Screening",
      description:
        "Choose your vetting level from basic license verification to comprehensive background checks. You control the screening requirements that fit your comfort level.",
      icon: <IconAdjustmentsBolt />,
    },
    {
      title: "Bank-Level Payment Security",
      description:
        "Powered by Stripe, the same secure platform trusted by Amazon, Google, and Shopify. Review invoices confidently with industry-leading payment protection.",
      icon: <IconCloud />,
    },
    {
      title: "Private Platform Communication",
      description:
        "Message and video call nurses directly through our secure platform. No need to share personal contact information.",
      icon: <IconHelp />,
    },
    {
      title: "Specialized Nursing Expertise",
      description:
        "Find nurses with exact specializations: newborn care, elderly support, wound care, post-op recovery, and more. Every nursing specialty covered.",
      icon: <IconEaseInOut />,
    },
    {
      title: "24/7 Mobile Access",
      description:
        "Manage your nursing care anytime, anywhere. Stay connected to your healthcare team around the clock from any device.",
      icon: <IconRouteAltLeft />,
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-6 max-w-7xl mx-auto">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r py-6 relative group/feature border-white/20",
        (index === 0 || index === 4) && "lg:border-l border-white/20",
        index < 4 && "lg:border-b border-white/20"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-white/10 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
      )}
      <div className="mb-3 relative z-10 px-6 text-white/80">
        {icon}
      </div>
      <div className="text-base font-bold mb-2 relative z-10 px-6">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-white/30 group-hover/feature:bg-blue-400 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-white">
          {title}
        </span>
      </div>
      <p className="text-sm text-white/70 max-w-xs relative z-10 px-6">
        {description}
      </p>
    </div>
  );
};
