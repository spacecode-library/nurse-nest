
import React, { useState, useRef, useEffect } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSmartNavigation } from "@/hooks/useSmartNavigation";

interface ExpandableActionMenuProps {
  onFaq: () => void;
  onRequestNurse: () => void;
  isFaqOpen: boolean;
  visible?: boolean;
}

export default function ExpandableActionMenu({
  onFaq,
  onRequestNurse,
  isFaqOpen,
  visible = true,
}: ExpandableActionMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { handleRequestNurse } = useSmartNavigation();

  // Close on click outside
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  // Keyboard close support
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) setOpen(false);
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [open]);

  // For accessibility: trap focus to menu on open (simple, to first action)
  const faqBtn = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    if (open) {
      setTimeout(() => faqBtn.current?.focus(), 170);
    }
  }, [open]);

  const handleGetNurse = () => {
    setOpen(false);
    handleRequestNurse();
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 transition-all duration-1000 ease-[cubic-bezier(0.33,1,0.68,1)] will-change-[opacity,transform]",
        visible
          ? "opacity-100 pointer-events-auto translate-y-0"
          : "opacity-0 pointer-events-none translate-y-8"
      )}
      aria-label="Expandable action menu"
      suppressHydrationWarning
      style={{ transitionProperty: "opacity, transform" }}
    >
      <div
        className={cn(
          "fixed inset-0 bg-transparent transition-all duration-300", // changed from bg-black/10 to bg-transparent
          open ? "opacity-100 visible pointer-events-auto" : "opacity-0 invisible pointer-events-none"
        )}
        aria-hidden="true"
        onClick={() => setOpen(false)}
      />
      <div className="relative flex flex-col items-end" style={{ minWidth: 60 }}>
        <div
          className="flex flex-col space-y-3 mb-3"
          style={{
            pointerEvents: open ? "auto" : "none",
          }}
        >
          <button
            ref={faqBtn}
            className={cn(
              "min-w-[140px] h-14 px-5 rounded-xl flex items-center justify-center font-semibold text-base shadow-xl transition-[background,box-shadow,transform] duration-300 focus-visible:outline-none focus:outline-none ring-0 active:scale-95",
              "dropdown-fab-btn select-none",
              open
                ? "opacity-100 translate-y-0 scale-100 pointer-events-auto animate-fade-in-up-custom"
                : "opacity-0 translate-y-8 scale-95 pointer-events-none",
              "bg-blue-600 text-white hover:bg-blue-700"
            )}
            style={{
              transitionDelay: open ? "80ms" : "0ms",
              letterSpacing: ".01em"
            }}
            onClick={() => {
              setOpen(false);
              onFaq();
            }}
            aria-label="Open FAQ"
            tabIndex={open ? 0 : -1}
            autoFocus={false}
          >
            FAQ
          </button>
          <button
            className={cn(
              "min-w-[140px] h-14 px-5 rounded-xl flex items-center justify-center font-semibold text-base shadow-xl transition-[background,box-shadow,transform] duration-300 focus-visible:outline-none focus:outline-none ring-0 active:scale-95",
              "dropdown-fab-btn select-none",
              open
                ? "opacity-100 translate-y-0 scale-100 pointer-events-auto animate-fade-in-up-custom"
                : "opacity-0 translate-y-8 scale-95 pointer-events-none",
              "bg-teal-600 text-white hover:bg-teal-700"
            )}
            style={{
              transitionDelay: open ? "180ms" : "0ms",
              letterSpacing: ".01em"
            }}
            onClick={handleGetNurse}
            aria-label="Get Nurse"
            tabIndex={open ? 0 : -1}
            autoFocus={false}
          >
            Get Nurse
          </button>
        </div>
        <button
          aria-label={open ? "Close menu" : "Open quick actions"}
          className={cn(
            "w-16 h-16 rounded-full bg-sky-500 shadow-2xl flex items-center justify-center text-white transition-all duration-300 focus:outline-none focus-visible:ring-2 hover:bg-sky-600 active:scale-95",
            "fab-trigger-btn",
            open ? "rotate-45" : "rotate-0",
            open ? "z-20" : ""
          )}
          style={{
            transition: "box-shadow 0.25s, background 0.3s, transform 0.3s",
            willChange: "transform, background, box-shadow",
          }}
          onClick={() => setOpen(val => !val)}
        >
          <Plus size={34} className={cn("transition-transform duration-300", open ? "rotate-45" : "")} />
        </button>
      </div>
    </div>
  );
}
