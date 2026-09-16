"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminSignOut } from "@/lib/actions/auth";

const NAV = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: (
      <path d="M4 13h6V4H4v9Zm0 7h6v-5H4v5Zm10 0h6V11h-6v9Zm0-16v5h6V4h-6Z" />
    ),
  },
  {
    href: "/admin/products",
    label: "Products",
    icon: <path d="M3 7l9-4 9 4-9 4-9-4Zm0 5l9 4 9-4M3 17l9 4 9-4" strokeLinejoin="round" />,
  },
  {
    href: "/admin/wheel",
    label: "Wheel",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="2.5" />
        <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
      </>
    ),
  },
  {
    href: "/admin/stores",
    label: "Stores",
    icon: (
      <>
        <path d="M4 10v10h16V10" />
        <path d="M2 10l2-6h16l2 6" />
        <path d="M9 20v-6h6v6" />
      </>
    ),
  },
  {
    href: "/admin/videos",
    label: "Videos",
    icon: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M10 9l5 3-5 3V9Z" />
      </>
    ),
  },
  {
    href: "/admin/blog",
    label: "Blog",
    icon: (
      <>
        <path d="M4 19.5V5.5A2.5 2.5 0 0 1 6.5 3H19v16.5" />
        <path d="M6.5 21H19v-2H6.5a1.5 1.5 0 0 0 0 3Z" />
      </>
    ),
  },
  {
    href: "/admin/hero",
    label: "Hero section",
    icon: (
      <>
        <rect x="3" y="4" width="18" height="12" rx="2" />
        <path d="M3 20h18M9 16v4M15 16v4" />
      </>
    ),
  },
  {
    href: "/admin/settings",
    label: "Settings",
    icon: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.04 1.56V21a2 2 0 1 1-4 0v-.09A1.7 1.7 0 0 0 9 19.36a1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.64 15a1.7 1.7 0 0 0-1.56-1.04H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.64 9a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.64a1.7 1.7 0 0 0 1.04-1.56V3a2 2 0 1 1 4 0v.09A1.7 1.7 0 0 0 15 4.64a1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.36 9a1.7 1.7 0 0 0 1.56 1.04H21a2 2 0 1 1 0 4h-.09A1.7 1.7 0 0 0 19.4 15Z" />
      </>
    ),
  },
];

export function AdminSidebar({ email }: { email?: string | null }) {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:flex-col md:w-60 md:shrink-0 md:sticky md:top-0 md:h-screen bg-ac-surface-container-lowest border-r border-ac-border-hairline">
      <Link href="/admin" className="flex items-center gap-2 px-6 h-20 shrink-0 border-b border-ac-border-hairline">
        <span className="font-editorial text-lg text-ac-primary">Delice</span>
        <span className="font-humanist text-[11px] font-semibold uppercase tracking-wide text-ac-secondary bg-ac-secondary-container/20 px-2 py-0.5 rounded-full">
          Admin
        </span>
      </Link>

      <nav className="flex-1 px-3 py-5 flex flex-col gap-1 overflow-y-auto">
        {NAV.map((item) => {
          const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-humanist text-sm transition-colors ${
                active
                  ? "bg-ac-maroon text-ac-on-maroon font-medium"
                  : "text-ac-on-surface-variant hover:bg-ac-surface-container-low hover:text-ac-on-surface"
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                className="w-4.5 h-4.5 shrink-0"
              >
                {item.icon}
              </svg>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-ac-border-hairline">
        <div className="font-humanist text-[12px] text-ac-on-surface-variant truncate mb-2 px-1">{email}</div>
        <form action={adminSignOut}>
          <button className="w-full font-humanist text-sm text-ac-on-surface-variant border border-ac-border-hairline rounded-xl px-3.5 py-2.5 hover:bg-ac-surface-container-low hover:text-ac-on-surface transition-colors">
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
