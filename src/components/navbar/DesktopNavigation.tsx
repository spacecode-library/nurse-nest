
import React from "react";
import NavLinks from "./NavLinks";
import NurseDropdown from "./NurseDropdown";
import CareServicesDropdown from "./CareServicesDropdown";

interface Props {
  shouldUseDarkText: boolean;
  handleApplyNowClick: () => void;
}

export function DesktopNavigation({ shouldUseDarkText, handleApplyNowClick }: Props) {
  return (
    <div className="hidden lg:flex items-center space-x-6">
      <NavLinks shouldUseDarkText={shouldUseDarkText} />
      <NurseDropdown
        shouldUseDarkText={shouldUseDarkText}
        handleApplyNowClick={handleApplyNowClick}
      />
      <CareServicesDropdown shouldUseDarkText={shouldUseDarkText} />
    </div>
  );
}
