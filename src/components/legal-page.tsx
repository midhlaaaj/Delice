import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <div className="w-full max-w-[760px] mx-auto px-6 pt-32 pb-20">
        <h1 className="font-editorial font-medium text-ac-primary text-[clamp(28px,4.5vw,40px)] leading-[1.08]">
          {title}
        </h1>
        <p className="mt-3 font-humanist text-[13.5px] text-ac-on-surface-variant">Last updated: {updated}</p>

        <div className="mt-9 font-humanist text-[15.5px] leading-relaxed text-ac-on-surface max-w-[680px]">
          {children}
        </div>
      </div>
      <SiteFooter />
    </>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-8 first:mt-0">
      <h2 className="font-editorial text-ac-primary text-[19px] mb-2.5">{title}</h2>
      <div className="grid gap-3">{children}</div>
    </section>
  );
}

export function LegalList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="grid gap-1.5 pl-5 list-disc marker:text-ac-on-surface-variant">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}
