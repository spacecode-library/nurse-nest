
import React from 'react';
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

interface CareServicesDropdownProps {
  shouldUseDarkText: boolean;
}

export default function CareServicesDropdown({ shouldUseDarkText }: CareServicesDropdownProps) {
  const navigate = useNavigate();

  const highlightClass = shouldUseDarkText
    ? "hover:text-[#3b82f6] focus:text-[#3b82f6]"
    : "hover:text-[#9bcbff] focus:text-[#9bcbff]";

  const itemClass =
    "cursor-pointer py-3 bg-transparent hover:bg-transparent focus:bg-transparent border-none outline-none ring-0 focus:ring-0 focus-visible:outline-none focus:outline-none focus:border-none shadow-none";

  const textClass =
    "font-medium text-gray-900 transition-colors duration-200 " + highlightClass;
  
  const sectionLabelClass =
    "text-xs font-bold uppercase tracking-wider px-3 pt-3 pb-1 select-none pointer-events-none"
    + " text-[#9bcbff] drop-shadow-sm";

  const handleItemClick = (item: NavLink) => {
    if (item.external) {
      window.open(item.path, "_blank", "noopener noreferrer");
    } else {
      navigate(item.path);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "font-medium flex items-center transition-colors duration-300 ease-in-out hover:scale-105 focus:outline-none focus-visible:outline-none bg-transparent",
            shouldUseDarkText
              ? "text-gray-700 hover:text-[#3b82f6]"
              : "text-white hover:text-[#9bcbff]"
          )}
        >
          Care Services <ChevronDown className="ml-1 h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 z-[99] bg-white shadow-2xl">
        {careServicesDropdownSections.map((section, secIdx) => (
          <div key={section.title}>
            {secIdx > 0 && <DropdownMenuSeparator />}
            <div className={sectionLabelClass}>{section.title}</div>
            {section.links.map((item) => (
              <DropdownMenuItem
                key={item.name}
                className={itemClass}
                onClick={() => handleItemClick(item)}
                tabIndex={0}
              >
                <span className={textClass}>
                  {item.name}
                </span>
              </DropdownMenuItem>
            ))}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
