
import React from "react";
import { Link } from "react-router-dom";

interface Props {
  to: string;
  children: React.ReactNode;
  onClick?: (path: string) => void;
  className?: string;
}

export default function MobileMenuNavLink({ to, onClick, children, className }: Props) {
  return (
    <Link
      to={to}
      onClick={() => onClick?.(to)}
      className={`block font-medium text-gray-700 hover:text-brand-primary py-2 px-1 rounded transition-colors text-base ${className || ""}`}
    >
      {children}
    </Link>
  );
}
