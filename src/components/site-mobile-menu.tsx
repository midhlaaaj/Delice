"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/button";
import { NAV_LINKS } from "@/components/site-nav";

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteMobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

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
      <div className="absolute top-0 right-0 h-full w-[82%] max-w-[340px] bg-ac-surface shadow-[-8px_0_32px_rgba(0,0,0,0.18)] flex flex-col overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -right-20 w-64 h-64 rounded-full bg-ac-maroon/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-ac-maroon via-ac-rose to-ac-maroon/40"
        />

        <div className="relative flex items-center justify-between pl-8 pr-6 h-20 shrink-0">
          <span className="font-humanist text-[11px] font-semibold uppercase tracking-[0.25em] text-ac-secondary">
            Menu
          </span>
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

        <div className="relative flex flex-col flex-1 pl-8 pr-6 pt-4 overflow-y-auto">
          <nav className="flex flex-col">
            {NAV_LINKS.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className="group flex items-center gap-3 py-4 border-b border-ac-border-hairline"
                >
                  <span
                    className={`font-editorial text-2xl transition-all group-hover:text-ac-maroon group-hover:translate-x-1 ${
                      active ? "text-ac-maroon" : "text-ac-on-surface"
                    }`}
                  >
                    {item.label}
                  </span>
                  <span className="ml-auto text-ac-secondary/50 group-hover:text-ac-maroon group-hover:translate-x-1 transition-all">
                    {active ? "●" : "→"}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-8 pb-8 flex flex-col gap-5">
            <Button href="/#partner-wholesale" variant="solid" className="w-full" onClick={() => setOpen(false)}>
              Become a Partner
            </Button>
            <p className="font-humanist text-[11px] font-semibold uppercase tracking-[0.15em] text-ac-secondary/60 text-center">
              Slice of Happiness ✦ Fresh Daily
            </p>
          </div>
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
