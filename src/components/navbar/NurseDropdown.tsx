
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
              ? "text-gray-700 hover:text-[#3b82f6]" 
              : "text-white hover:text-[#9bcbff]"
          )}
        >
          For Nurses <ChevronDown className="ml-1 h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white shadow-lg rounded-md border border-gray-100 w-64 z-50">
        <DropdownMenuItem className="cursor-pointer hover:bg-[#f0f9ff] px-4 py-2" onClick={handleApplyNowClick}>
          Apply Now
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer hover:bg-[#f0f9ff] px-4 py-2 font-semibold" onClick={() => navigate('/nurse-llc-setup-guide')}>
          LLC Setup Guide
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer hover:bg-[#f0f9ff] px-4 py-2" onClick={() => navigate('/get-ein-nurse-business')}>
          EIN Applications
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer hover:bg-[#f0f9ff] px-4 py-2" onClick={() => navigate('/business-bank-account-for-nurses')}>
          Business Banking
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer hover:bg-[#f0f9ff] px-4 py-2" onClick={() => navigate('/malpractice-insurance-for-nurses')}>
          Malpractice Insurance
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer hover:bg-[#f0f9ff] px-4 py-2" onClick={() => navigate('/1099-tax-tips')}>
          1099 Tax Tips
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
