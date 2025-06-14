
import React, { useState, useCallback, useRef, useEffect } from "react";
import { Plus, MessageCircleQuestion, Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExpandableActionMenuProps {
  onFaq: () => void;
  onRequestNurse: () => void;
  isFaqOpen: boolean;
}

export default function ExpandableActionMenu({
  onFaq,
  onRequestNurse,
  isFaqOpen,
}: ExpandableActionMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

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

  // Animate action buttons up in a stack: top=FAQ, middle=Request Nurse, bottom=main FAB
  return (
    <div
      ref={containerRef}
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2"
      aria-label="Expandable action menu"
    >
      {/* Background overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/10 transition-all duration-300",
          open ? "opacity-100 visible pointer-events-auto" : "opacity-0 invisible pointer-events-none"
        )}
        aria-hidden="true"
        onClick={() => setOpen(false)}
      />
      {/* Action buttons */}
      <div className="relative flex flex-col items-end" style={{ minWidth: 60 }}>
        <div className="flex flex-col space-y-3 mb-3"
             style={{
               // Animate stack-out, vertically spreading
               pointerEvents: open ? "auto" : "none",
             }}
        >
          {/* FAQ Action */}
          <button
            ref={faqBtn}
            className={cn(
              "w-14 h-14 rounded-full flex items-center justify-center text-white bg-blue-600 shadow-xl transition-all duration-300 focus:outline-none focus-visible:ring-2 active:scale-90",
              "dropdown-fab-btn",
              open
                ? "opacity-100 translate-y-0 scale-100 pointer-events-auto animate-fade-in-up"
                : "opacity-0 translate-y-4 scale-95 pointer-events-none"
            )}
            style={{
              transitionDelay: open ? "70ms" : "0ms",
            }}
            onClick={() => {
              setOpen(false);
              onFaq();
            }}
            aria-label="Open FAQ"
            tabIndex={open ? 0 : -1}
          >
            <MessageCircleQuestion size={28} />
          </button>
          {/* Request Nurse */}
          <button
            className={cn(
              "w-14 h-14 rounded-full flex items-center justify-center text-white bg-teal-600 shadow-xl transition-all duration-300 focus:outline-none focus-visible:ring-2 active:scale-90",
              "dropdown-fab-btn",
              open
                ? "opacity-100 translate-y-0 scale-100 pointer-events-auto animate-fade-in-up"
                : "opacity-0 translate-y-4 scale-95 pointer-events-none"
            )}
            style={{
              transitionDelay: open ? "130ms" : "0ms",
            }}
            onClick={() => {
              setOpen(false);
              onRequestNurse();
            }}
            aria-label="Request a Nurse"
            tabIndex={open ? 0 : -1}
          >
            <Stethoscope size={26} />
          </button>
        </div>
        {/* Main FAB */}
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
          }}
          onClick={() => setOpen(val => !val)}
        >
          <Plus size={34} className={cn("transition-transform duration-300", open ? "rotate-45" : "")} />
        </button>
      </div>
    </div>
  );
}
