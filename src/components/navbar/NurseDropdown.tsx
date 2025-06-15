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
import { nurseDropdownSections, NavLink } from "@/config/navigation";
import { useStaggeredReveal } from "@/hooks/use-staggered-reveal";

interface NurseDropdownProps {
  shouldUseDarkText: boolean;
  handleApplyNowClick: () => void;
}

export default function NurseDropdown({ shouldUseDarkText, handleApplyNowClick }: NurseDropdownProps) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const prefersReducedMotion = typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Calculate total items for staggered reveal (including Apply Now button)
  const totalItems = nurseDropdownSections.reduce((acc, section) => acc + section.links.length, 0);
  const itemReveal = useStaggeredReveal(totalItems, { step: 80, initialDelay: 100, disabled: prefersReducedMotion || !isOpen });

  const highlightClass = shouldUseDarkText
    ? "hover:text-[#3b82f6] focus:text-[#3b82f6]"
    : "hover:text-[#9bcbff] focus:text-[#9bcbff]";

  const itemClass =
    "cursor-pointer py-3 bg-transparent hover:bg-gray-50 focus:bg-gray-50 border-none outline-none ring-0 focus:ring-0 focus-visible:outline-none focus:outline-none focus:border-none shadow-none transition-all duration-200 hover-lux-scale";

  const textClass =
    "font-medium text-gray-900 transition-colors duration-200 " + highlightClass;

  const applyButtonClass =
    "w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover-lux-scale shine-on-hover";

  const handleItemClick = (item: NavLink) => {
    setIsOpen(false);
    if (item.external) {
      window.open(item.path, "_blank", "noopener noreferrer");
    } else {
      navigate(item.path);
    }
  };

  const handleApplyClick = () => {
    setIsOpen(false);
    handleApplyNowClick();
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
          For Nurses <ChevronDown className="ml-1 h-4 w-4 transition-transform duration-200" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 z-[99] bg-white shadow-2xl rounded-xl border border-gray-200/50">
        {/* Apply Now Button */}
        <div className="p-3">
          <button
            onClick={handleApplyClick}
            className={cn(
              applyButtonClass,
              !prefersReducedMotion && isOpen ? 
                `transition-all duration-500 ease-[cubic-bezier(.32,2,.55,.98)] ${
                  itemReveal[0] ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                }` : ""
            )}
            style={!prefersReducedMotion && isOpen ? { transitionDelay: '100ms' } : {}}
          >
            Apply Now
          </button>
        </div>
        
        <DropdownMenuSeparator />
        
        {/* Other Links */}
        {nurseDropdownSections.map((section) => (
          <div key={section.title}>
            {section.links.slice(1).map((item) => { // Skip first item (Apply Now) as it's handled above
              const currentIndex = itemIndex++;
              return (
                <DropdownMenuItem
                  key={item.name}
                  className={cn(
                    itemClass,
                    !prefersReducedMotion && isOpen ? 
                      `transition-all duration-500 ease-[cubic-bezier(.32,2,.55,.98)] ${
                        itemReveal[currentIndex + 1] ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                      }` : ""
                  )}
                  onClick={() => handleItemClick(item)}
                  tabIndex={0}
                  style={!prefersReducedMotion && isOpen ? { transitionDelay: `${(currentIndex + 1) * 80}ms` } : {}}
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
