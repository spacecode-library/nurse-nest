
import React from "react";
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import styles from "./MobileMenu.module.css";
import { Link } from "react-router-dom";

interface DropdownSection {
  label: string;
  icon?: React.ReactNode;
  value: string;
  onSpecialTopAction?: () => void;
  specialTopLabel?: string;
  sections: Array<{
    links: Array<{ name: string; path: string; }>;
  }>;
  onNavClick: (path: string) => void;
  topLinkFirst?: boolean;
}

export default function MobileMenuDropdown({
  label,
  icon,
  value,
  onSpecialTopAction,
  specialTopLabel,
  sections,
  onNavClick,
  topLinkFirst = false,
}: DropdownSection) {
  // NOTE: We'll use a sibling chevron on the left with label on right
  return (
    <AccordionItem value={value} className="border-b-0">
      <AccordionTrigger
        className={`${styles.mobileMenuTrigger} group px-2 py-1 flex items-center gap-2 transition-colors duration-200 hover:text-brand-primary focus:text-brand-primary`}
        tabIndex={0}
        // pass data-state for CSS animation on chevron
        data-state={undefined}
      >
        <span className="mr-2 flex">
          {/* left-positioned chevron: animate on open using [data-state='open'] */}
          {icon}
        </span>
        <span className="font-medium">{label}</span>
      </AccordionTrigger>
      <AccordionContent>
        <div className="ml-3 sm:ml-4 space-y-2 animate-fade-in">
          {onSpecialTopAction && specialTopLabel && (
            <button
              onClick={onSpecialTopAction}
              className="block font-medium text-gray-600 hover:text-brand-primary py-1 px-0 transition-colors duration-200 focus:outline-none"
            >
              {specialTopLabel}
            </button>
          )}
          {/* List other links */}
          {sections.map((section, i) =>
            section.links.map((link, j) => {
              // If topLinkFirst, skip first link (Apply Now) in mapped list, since handled in specialTopAction
              if (topLinkFirst && i === 0 && j === 0) return null;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => onNavClick(link.path)}
                  className="block font-medium text-gray-600 hover:text-brand-primary py-1 px-0 transition-colors duration-200 focus:outline-none"
                >
                  {link.name}
                </Link>
              );
            })
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
