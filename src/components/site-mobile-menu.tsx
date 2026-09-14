"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";

const NAV_LINKS = [
  { href: "/explore", label: "Explore All" },
  { href: "/stores", label: "Find a Store" },
  { href: "/videos", label: "Videos" },
];

export function SiteMobileMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  const drawer = (
    <div className="fixed inset-0 z-[60] md:hidden">
      <button
        type="button"
        aria-label="Close menu"
        onClick={() => setOpen(false)}
        className="absolute inset-0 bg-ac-ink/40 backdrop-blur-sm"
      />
      <div className="absolute top-0 right-0 h-full w-[78%] max-w-[320px] bg-ac-surface shadow-[-8px_0_32px_rgba(0,0,0,0.18)] flex flex-col">
        <div className="h-20 flex items-center justify-between px-6 shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/delice-wordmark-dark.svg" alt="Delice" className="h-11 w-auto" />
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="inline-flex items-center justify-center w-10 h-10 rounded-full text-ac-primary hover:bg-ac-surface-container transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-5 h-5">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col px-6 pt-2">
          <nav className="flex flex-col">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="font-humanist text-[15px] font-medium uppercase tracking-wide text-ac-on-surface py-3.5 border-b border-ac-border-hairline"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/#partner-wholesale"
            onClick={() => setOpen(false)}
            className="mt-5 flex items-center justify-center w-full rounded-full bg-ac-maroon text-ac-on-maroon hover:bg-ac-maroon-deep transition-all shadow-[0_2px_8px_rgba(42,22,32,0.12)] px-5 py-3.5 font-humanist text-sm font-bold uppercase tracking-wide"
          >
            Become a Partner
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full text-ac-primary hover:bg-ac-surface-container transition-colors"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-5 h-5">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>

      {open && createPortal(drawer, document.body)}
    </>
  );
}
