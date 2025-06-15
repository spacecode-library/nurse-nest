
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { nurseDropdownSections, NavLink } from "@/config/navigation";

interface NurseDropdownProps {
  shouldUseDarkText: boolean;
  handleApplyNowClick: () => void;
}

export default function NurseDropdown({ shouldUseDarkText, handleApplyNowClick }: NurseDropdownProps) {
  const navigate = useNavigate();

  // Text highlight color
  const highlightClass = shouldUseDarkText
    ? "hover:text-[#3b82f6] focus:text-[#3b82f6]"
    : "hover:text-[#9bcbff] focus:text-[#9bcbff]";

  // Remove ALL box, ring, border, and outline highlights on menu items
  const itemClass =
    "cursor-pointer py-3 bg-transparent hover:bg-transparent focus:bg-transparent border-none outline-none ring-0 focus:ring-0 focus-visible:outline-none focus:outline-none focus:border-none shadow-none";

  const textClass =
    "font-medium text-gray-900 transition-colors duration-200 " + highlightClass;

  // Helper to handle click for items
  const handleItemClick = (item: NavLink) => {
    if (item.name === "Apply Now") {
      handleApplyNowClick();
    } else if (item.external) {
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
          For Nurses <ChevronDown className="ml-1 h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 z-50 bg-white">
        {nurseDropdownSections.map((section, secIdx) => (
          <React.Fragment key={section.title}>
            {secIdx > 0 && <DropdownMenuSeparator />}
            <DropdownMenuLabel className="text-base font-semibold pt-2 pb-1 px-3">{section.title}</DropdownMenuLabel>
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
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
