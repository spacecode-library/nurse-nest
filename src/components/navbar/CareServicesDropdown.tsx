
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
            "font-medium flex items-center link-underline",
            shouldUseDarkText
              ? "text-gray-700 hover:text-[#3b82f6]" 
              : "text-white hover:text-[#9bcbff]"
          )}
        >
          Care Services <ChevronDown className="ml-1 h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white shadow-lg rounded-md border border-gray-100 w-64 z-50">
        <DropdownMenuItem className="cursor-pointer hover:bg-[#f0f9ff] px-4 py-2" onClick={() => navigate('/newborn-nurse-support-guide')}>
          Newborn Care
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer hover:bg-[#f0f9ff] px-4 py-2" onClick={() => navigate('/elderly-care-nurse-services')}>
          Elderly Care
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer hover:bg-[#f0f9ff] px-4 py-2" onClick={() => navigate('/wound-care-nursing-guide')}>
          Wound Care
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer hover:bg-[#f0f9ff] px-4 py-2" onClick={() => navigate('/best-products-for-home-healthcare')}>
          Product Reviews
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
