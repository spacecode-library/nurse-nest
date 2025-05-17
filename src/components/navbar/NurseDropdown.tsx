
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

interface NurseDropdownProps {
  shouldUseDarkText: boolean;
  handleApplyNowClick: () => void;
}

export default function NurseDropdown({ shouldUseDarkText, handleApplyNowClick }: NurseDropdownProps) {
  const navigate = useNavigate();
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button 
          className={cn(
            "font-medium flex items-center link-underline",
            shouldUseDarkText
              ? "text-gray-700 hover:text-primary-500" 
              : "text-white hover:text-primary-100"
          )}
        >
          For Nurses <ChevronDown className="ml-1 h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white shadow-md rounded-md border border-gray-100 w-64">
        <DropdownMenuItem className="cursor-pointer hover:bg-primary-50" onClick={handleApplyNowClick}>
          Apply Now
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer hover:bg-primary-50" onClick={() => navigate('/malpractice-insurance')}>
          Malpractice Insurance
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer hover:bg-primary-50" onClick={() => navigate('/llc-setup-help')}>
          LLC Setup Help
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer hover:bg-primary-50" onClick={() => navigate('/1099-tax-tips')}>
          1099 Tax Tips
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
