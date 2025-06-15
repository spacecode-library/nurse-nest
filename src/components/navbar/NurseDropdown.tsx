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

  // Text highlight color
  const highlightClass = shouldUseDarkText
    ? "hover:text-[#3b82f6] focus:text-[#3b82f6]"
    : "hover:text-[#9bcbff] focus:text-[#9bcbff]";

  // Remove ALL box, ring, border, and outline highlights on menu items
  const itemClass =
    "cursor-pointer py-3 bg-transparent hover:bg-transparent focus:bg-transparent border-none outline-none ring-0 focus:ring-0 focus-visible:outline-none focus:outline-none focus:border-none shadow-none";

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
          For Nurses <ChevronDown className="ml-1 h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64">
        <DropdownMenuItem
          className={itemClass}
          onClick={handleApplyNowClick}
          tabIndex={0}
        >
          <span className={textClass}>
            Apply Now
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className={itemClass}
          onClick={() => navigate('/nurse-llc-setup-guide')}
          tabIndex={0}
        >
          <span className={textClass}>
            LLC Setup Guide
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className={itemClass}
          onClick={() => navigate('/blog/ein-applications-independent-contract-nurses')}
          tabIndex={0}
        >
          <span className={textClass}>
            EIN Applications
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className={itemClass}
          onClick={() => navigate('/business-bank-account-for-nurses')}
          tabIndex={0}
        >
          <span className={textClass}>
            Business Banking
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className={itemClass}
          onClick={() => navigate('/malpractice-insurance-for-nurses')}
          tabIndex={0}
        >
          <span className={textClass}>
            Malpractice Insurance
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className={itemClass}
          onClick={() => navigate('/1099-tax-tips')}
          tabIndex={0}
        >
          <span className={textClass}>
            1099 Tax Tips
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
