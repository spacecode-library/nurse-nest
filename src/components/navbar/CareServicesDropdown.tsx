
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
          className="cursor-pointer focus:bg-blue-50 hover:bg-blue-50 py-3" 
          onClick={() => navigate('/newborn-nurse-support-guide')}
        >
          <span className="font-medium text-gray-900">Newborn Care</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="cursor-pointer focus:bg-blue-50 hover:bg-blue-50 py-3" 
          onClick={() => navigate('/elderly-care-nurse-services')}
        >
          <span className="font-medium text-gray-900">Elderly Care</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="cursor-pointer focus:bg-blue-50 hover:bg-blue-50 py-3" 
          onClick={() => navigate('/wound-care-nursing-guide')}
        >
          <span className="font-medium text-gray-900">Wound Care</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="cursor-pointer focus:bg-blue-50 hover:bg-blue-50 py-3" 
          onClick={() => navigate('/best-products-for-home-healthcare')}
        >
          <span className="font-medium text-gray-900">Product Reviews</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
