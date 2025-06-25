
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
  return (
    <AccordionItem value={value} className="border-b-0">
      <AccordionTrigger className={styles.mobileMenuTrigger} tabIndex={0}>
        <span className="flex items-center gap-2">
          <span className={styles.mobileTriggerIcon}>
            {icon}
          </span>
          <span>{label}</span>
        </span>
      </AccordionTrigger>
      <AccordionContent>
        <div className="ml-3 sm:ml-4 space-y-2">
          {onSpecialTopAction && specialTopLabel && (
            <button
              onClick={onSpecialTopAction}
              className="block font-medium text-gray-600 hover:text-brand-primary py-1 px-0"
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
                  className="block font-medium text-gray-600 hover:text-brand-primary py-1 px-0"
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
