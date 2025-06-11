
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
      title: "Free to Start",
      description:
        "**No upfront costs or hidden fees** - Create your profile and browse qualified nurses completely free. Our small platform fee only applies when you pay nurses for completed care - no membership fees, setup costs, or monthly charges.",
      icon: <IconCurrencyDollar />,
    },
    {
      title: "Nurse-Owned & Operated",
      description:
        "**By nurses, for better care** - Founded and run by nursing professionals who understand your needs. Our nurse-led team ensures every aspect of our platform serves both caregivers and families with expertise.",
      icon: <IconHeart />,
    },
    {
      title: "Hand-Selected Professionals",
      description:
        "**Personally sourced, not algorithms** - Every nurse on our platform is manually recruited and vetted by our nursing team. We don't rely on automated systems - we personally know and approve each healthcare professional.",
      icon: <IconTerminal2 />,
    },
    {
      title: "Flexible Vetting Options",
      description:
        "**Choose your comfort level** - Select the level of background screening that fits your needs - from basic license verification to comprehensive background checks. You control the vetting requirements.",
      icon: <IconAdjustmentsBolt />,
    },
    {
      title: "Secure Payment Processing",
      description:
        "**Trusted by millions worldwide** - All payments are processed through Stripe, the same secure payment platform used by companies like Amazon, Google, and Shopify. Review and approve nurse invoices with confidence knowing your financial information is protected by industry-leading security.",
      icon: <IconCloud />,
    },
    {
      title: "Built-In Communication",
      description:
        "**Message and video call safely** - Connect with nurses directly through our platform via messaging and video calls - no need to share personal phone numbers or contact information.",
      icon: <IconHelp />,
    },
    {
      title: "Specialized Care Matching",
      description:
        "**Experts in every nursing specialty** - From newborn night nursing to elderly care, wound care to post-operative recovery - find nurses with the exact specializations your situation requires.",
      icon: <IconEaseInOut />,
    },
    {
      title: "24/7 Platform Access",
      description:
        "**Care coordination around the clock** - Manage your nursing care from anywhere, anytime. Our mobile-optimized platform ensures you're always connected to your healthcare team when you need them.",
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
