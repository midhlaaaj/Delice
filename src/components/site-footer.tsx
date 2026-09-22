import Link from "next/link";

const FOOTER_LINKS = [
  { href: "/explore", label: "Explore All" },
  { href: "/stores", label: "Find a Store" },
  { href: "/videos", label: "Videos" },
  { href: "/blog", label: "Journal" },
  { href: "/#partner-wholesale", label: "Become a Partner" },
];

const LEGAL_LINKS = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-and-conditions", label: "Terms & Conditions" },
  { href: "/cookie-policy", label: "Cookie Policy" },
];

export function SiteFooter() {
  return (
    <footer className="w-full bg-ac-maroon text-ac-on-maroon overflow-hidden">
      <div className="max-w-[1160px] mx-auto px-6 pt-8 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <span className="font-humanist text-sm text-ac-on-maroon-muted">Slice of Happiness</span>
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="font-humanist text-sm text-ac-on-maroon hover:text-ac-on-maroon-muted transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="border-t border-ac-on-maroon-line">
        <div className="max-w-[1160px] mx-auto px-6">
          <Link href="/" className="flex justify-center py-8 hover:opacity-90 transition-opacity">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/delice-wordmark.svg"
              alt="Delice — Slice of Happiness"
              className="w-[70vw] sm:w-[55vw] lg:w-[500px]"
            />
          </Link>
        </div>
      </div>

      <div className="border-t border-ac-on-maroon-line">
        <div className="max-w-[1160px] mx-auto px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="font-humanist text-xs text-ac-on-maroon-muted">© 2026 Delice</p>
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="font-humanist text-xs text-ac-on-maroon-muted hover:text-ac-on-maroon transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
