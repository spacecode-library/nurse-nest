
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { careServicesDropdownSections, NavLink } from "@/config/navigation";
import { useStaggeredReveal } from "@/hooks/use-staggered-reveal";

interface CareServicesDropdownProps {
  shouldUseDarkText: boolean;
}

export default function CareServicesDropdown({ shouldUseDarkText }: CareServicesDropdownProps) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const prefersReducedMotion = typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Calculate total items for staggered reveal
  const totalItems = careServicesDropdownSections.reduce((acc, section) => acc + section.links.length, 0);
  const itemReveal = useStaggeredReveal(totalItems, { step: 80, initialDelay: 100, disabled: prefersReducedMotion || !isOpen });

  const highlightClass = shouldUseDarkText
    ? "hover:text-[#3b82f6] focus:text-[#3b82f6]"
    : "hover:text-[#9bcbff] focus:text-[#9bcbff]";

  const itemClass =
    "cursor-pointer py-3 bg-transparent hover:bg-gray-50 focus:bg-gray-50 border-none outline-none ring-0 focus:ring-0 focus-visible:outline-none focus:outline-none focus:border-none shadow-none transition-all duration-200 hover-lux-scale";

  const textClass =
    "font-medium text-gray-900 transition-colors duration-200 " + highlightClass;
  
  const sectionLabelClass =
    "text-xs font-bold uppercase tracking-wider px-3 pt-3 pb-1 select-none pointer-events-none"
    + " text-[#9bcbff] drop-shadow-sm";

  const handleItemClick = (item: NavLink) => {
    setIsOpen(false);
    if (item.external) {
      window.open(item.path, "_blank", "noopener noreferrer");
    } else {
      navigate(item.path);
    }
  };

  let itemIndex = 0;

  return (
    <DropdownMenu onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "font-medium flex items-center transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus-visible:outline-none bg-transparent hover-lux-scale",
            shouldUseDarkText
              ? "text-gray-700 hover:text-[#3b82f6]"
              : "text-white hover:text-[#9bcbff]"
          )}
        >
          Care Services <ChevronDown className="ml-1 h-4 w-4 transition-transform duration-200" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 z-[99] bg-white shadow-2xl rounded-xl border border-gray-200/50">
        {careServicesDropdownSections.map((section, secIdx) => (
          <div key={section.title}>
            {secIdx > 0 && <DropdownMenuSeparator />}
            <div className={sectionLabelClass}>{section.title}</div>
            {section.links.map((item) => {
              const currentIndex = itemIndex++;
              return (
                <DropdownMenuItem
                  key={item.name}
                  className={cn(
                    itemClass,
                    !prefersReducedMotion && isOpen ? 
                      `transition-all duration-500 ease-[cubic-bezier(.32,2,.55,.98)] ${
                        itemReveal[currentIndex] ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                      }` : ""
                  )}
                  onClick={() => handleItemClick(item)}
                  tabIndex={0}
                  style={!prefersReducedMotion && isOpen ? { transitionDelay: `${currentIndex * 80}ms` } : {}}
                >
                  <span className={textClass}>
                    {item.name}
                  </span>
                </DropdownMenuItem>
              );
            })}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
