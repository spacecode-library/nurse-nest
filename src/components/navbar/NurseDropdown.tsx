
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
            "font-medium flex items-center transition-colors duration-300 ease-in-out hover:scale-105",
            shouldUseDarkText
              ? "text-gray-700 hover:text-[#3b82f6]" 
              : "text-white hover:text-[#9bcbff]"
          )}
        >
          For Nurses <ChevronDown className="ml-1 h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64">
        <DropdownMenuItem 
          className="cursor-pointer focus:bg-blue-50 hover:bg-blue-50 py-3" 
          onClick={handleApplyNowClick}
        >
          <span className="font-medium text-gray-900">Apply Now</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="cursor-pointer focus:bg-blue-50 hover:bg-blue-50 py-3" 
          onClick={() => navigate('/nurse-llc-setup-guide')}
        >
          <span className="font-medium text-gray-900">LLC Setup Guide</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="cursor-pointer focus:bg-blue-50 hover:bg-blue-50 py-3" 
          onClick={() => navigate('/get-ein-nurse-business')}
        >
          <span className="font-medium text-gray-900">EIN Applications</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="cursor-pointer focus:bg-blue-50 hover:bg-blue-50 py-3" 
          onClick={() => navigate('/business-bank-account-for-nurses')}
        >
          <span className="font-medium text-gray-900">Business Banking</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="cursor-pointer focus:bg-blue-50 hover:bg-blue-50 py-3" 
          onClick={() => navigate('/malpractice-insurance-for-nurses')}
        >
          <span className="font-medium text-gray-900">Malpractice Insurance</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="cursor-pointer focus:bg-blue-50 hover:bg-blue-50 py-3" 
          onClick={() => navigate('/1099-tax-tips')}
        >
          <span className="font-medium text-gray-900">1099 Tax Tips</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
