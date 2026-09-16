"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const NAV_LINKS = [
  { href: "/explore", label: "Explore All" },
  { href: "/stores", label: "Find a Store" },
  { href: "/videos", label: "Videos" },
  { href: "/blog", label: "Journal" },
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteNav() {
  const pathname = usePathname();

  return (
    <nav className="col-start-2 hidden md:flex items-center gap-8 justify-self-center">
      {NAV_LINKS.map((link) => {
        const active = isActive(pathname, link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={`relative font-humanist text-sm font-medium uppercase tracking-wide transition-colors py-1 ${
              active ? "text-ac-on-surface" : "text-ac-on-surface-variant hover:text-ac-on-surface"
            }`}
          >
            {link.label}
            <span
              className={`absolute left-0 right-0 -bottom-0.5 h-[2px] rounded-full bg-ac-secondary transition-opacity ${
                active ? "opacity-100" : "opacity-0"
              }`}
            />
          </Link>
        );
      })}
    </nav>
  );
}
