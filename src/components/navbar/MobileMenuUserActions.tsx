
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GlowEffect } from "@/components/ui/glow-effect";

interface Props {
  user: any;
  signOut: () => void;
  handleNavClick: (path: string) => void;
  handleRequestNurse: () => void;
  setIsOpen: (open: boolean) => void;
}

export default function MobileMenuUserActions({
  user,
  signOut,
  handleNavClick,
  handleRequestNurse,
  setIsOpen,
}: Props) {
  return (
    <div className="border-t pt-4 space-y-3">
      {user ? (
        <div className="space-y-2">
          <Link
            to="/dashboard"
            onClick={() => { handleNavClick('/dashboard'); }}
            className="block text-gray-700 hover:text-brand-primary font-medium py-2 px-1 rounded"
          >
            Dashboard
          </Link>
          <button
            onClick={() => { signOut(); setIsOpen(false); }}
            className="block w-full text-left text-gray-700 hover:text-brand-primary font-medium py-2 px-1 rounded"
          >
            Sign Out
          </button>
        </div>
      ) : null}
      <div className="relative">
        <GlowEffect
          colors={['#9bcbff', '#3b82f6', '#7dd3fc', '#2563eb']}
          mode="colorShift"
          blur="medium"
          duration={4}
          scale={1.05}
          intensity={0.3}
        />
        <Button
          onClick={() => { handleRequestNurse(); setIsOpen(false); }}
          className="relative w-full bg-gradient-to-r from-[#9bcbff] to-[#3b82f6] hover:from-[#7dd3fc] hover:to-[#2563eb] text-white font-semibold mt-1"
        >
          Request a Nurse
        </Button>
      </div>
    </div>
  );
}
