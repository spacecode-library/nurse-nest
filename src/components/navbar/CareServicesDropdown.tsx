
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface CareServicesDropdownProps {
  shouldUseDarkText: boolean;
}

export default function CareServicesDropdown({ shouldUseDarkText }: CareServicesDropdownProps) {
  const navigate = useNavigate();

  const highlightClass = shouldUseDarkText
    ? "hover:text-[#3b82f6] focus:text-[#3b82f6]"
    : "hover:text-[#9bcbff] focus:text-[#9bcbff]";

  const itemClass =
    "cursor-pointer py-3 bg-transparent hover:bg-transparent focus:bg-transparent outline-none border-none";

  const textClass =
    "font-medium text-gray-900 transition-colors duration-200 " + highlightClass;

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
      <DropdownMenuContent className="w-64">
        <DropdownMenuItem
          className={itemClass}
          onClick={() => navigate('/newborn-nurse-support-guide')}
        >
          <span className={textClass}>
            Newborn Care
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className={itemClass}
          onClick={() => navigate('/elderly-care-nurse-services')}
        >
          <span className={textClass}>
            Elderly Care
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className={itemClass}
          onClick={() => navigate('/wound-care-nursing-guide')}
        >
          <span className={textClass}>
            Wound Care
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className={itemClass}
          onClick={() => navigate('/best-products-for-home-healthcare')}
        >
          <span className={textClass}>
            Product Reviews
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
