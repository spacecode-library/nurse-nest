
import React from "react";
import UserMenu from "./UserMenu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  shouldUseDarkText: boolean;
  showNavbarButton: boolean;
  handleRequestNurseClick: () => void;
}

export function NavbarActions({
  shouldUseDarkText,
  showNavbarButton,
  handleRequestNurseClick,
}: Props) {
  return (
    <div className="hidden lg:flex items-center space-x-4">
      <UserMenu shouldUseDarkText={shouldUseDarkText} />
      <div
        className={cn(
          "relative transition-all duration-500 ease-in-out",
          showNavbarButton
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-2 pointer-events-none"
        )}
      >
        <Button
          onClick={handleRequestNurseClick}
          className="relative bg-sky-300 hover:bg-sky-200 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus-visible:outline-none"
        >
          Request a Nurse
        </Button>
      </div>
    </div>
  );
}
