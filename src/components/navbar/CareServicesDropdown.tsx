
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

  const hoverTextClass = shouldUseDarkText
    ? "hover:text-[#3b82f6]"
    : "hover:text-[#9bcbff]";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button 
          className={cn(
            "font-medium flex items-center transition-colors duration-300 ease-in-out hover:scale-105 focus:outline-none focus-visible:outline-none",
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
          className="cursor-pointer py-3"
          onClick={() => navigate('/newborn-nurse-support-guide')}
        >
          <span className={cn("font-medium text-gray-900 transition-colors duration-200", hoverTextClass)}>
            Newborn Care
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="cursor-pointer py-3"
          onClick={() => navigate('/elderly-care-nurse-services')}
        >
          <span className={cn("font-medium text-gray-900 transition-colors duration-200", hoverTextClass)}>
            Elderly Care
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="cursor-pointer py-3"
          onClick={() => navigate('/wound-care-nursing-guide')}
        >
          <span className={cn("font-medium text-gray-900 transition-colors duration-200", hoverTextClass)}>
            Wound Care
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="cursor-pointer py-3"
          onClick={() => navigate('/best-products-for-home-healthcare')}
        >
          <span className={cn("font-medium text-gray-900 transition-colors duration-200", hoverTextClass)}>
            Product Reviews
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
