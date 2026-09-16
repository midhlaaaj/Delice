import Link from "next/link";
import { Button } from "@/components/button";
import { DeleteButton } from "./delete-button";

export const adminInput =
  "w-full border border-ac-border-hairline rounded-xl px-3.5 py-2.5 text-sm font-humanist text-ac-on-surface bg-ac-surface-container-lowest outline-none transition-colors focus:border-ac-secondary";

export const adminLabel = "block font-humanist text-[13px] text-ac-on-surface-variant mb-1.5";

export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
      <div>
        <h1 className="font-editorial text-2xl text-ac-primary">{title}</h1>
        {description && (
          <p className="mt-1 font-humanist text-sm text-ac-on-surface-variant max-w-md">{description}</p>
        )}
      </div>
      {action && (
        <Button href={action.href} size="sm" className="w-fit">
          {action.label}
        </Button>
      )}
    </div>
  );
}

export function AdminCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`bg-ac-surface-container-lowest border border-ac-border-hairline rounded-2xl shadow-[0_1px_3px_rgba(42,22,32,0.05)] ${className}`}
    >
      {children}
    </div>
  );
}

export function StatusPill({ tone, label }: { tone: "positive" | "neutral" | "warning"; label: string }) {
  const styles = {
    positive: "bg-ac-sage/20 text-[#4a5a37]",
    neutral: "bg-ac-surface-container text-ac-on-surface-variant",
    warning: "bg-ac-secondary-container/25 text-ac-secondary",
  } as const;

  return (
    <span
      className={`inline-flex items-center font-humanist text-[11px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${styles[tone]}`}
    >
      {label}
    </span>
  );
}

export function ToggleField({
  name,
  label,
  defaultChecked = false,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center justify-between gap-4 cursor-pointer select-none">
      <span className="font-humanist text-sm text-ac-on-surface">{label}</span>
      <span className="relative inline-flex shrink-0">
        <input type="checkbox" name={name} defaultChecked={defaultChecked} className="peer sr-only" />
        <span className="block w-10 h-6 rounded-full bg-ac-surface-container border border-ac-border-hairline transition-colors peer-checked:bg-ac-maroon peer-checked:border-ac-maroon peer-focus-visible:ring-2 peer-focus-visible:ring-ac-secondary/40" />
        <span className="absolute top-[3px] left-[3px] w-[18px] h-[18px] bg-white rounded-full shadow-[0_1px_2px_rgba(42,22,32,0.3)] transition-transform peer-checked:translate-x-[16px]" />
      </span>
    </label>
  );
}

export function AdminList({
  items,
  emptyLabel,
}: {
  items: React.ReactNode[];
  emptyLabel: string;
}) {
  if (items.length === 0) {
    return (
      <AdminCard>
        <div className="px-5 py-14 text-center font-humanist text-sm text-ac-on-surface-variant">
          {emptyLabel}
        </div>
      </AdminCard>
    );
  }

  return (
    <AdminCard className="divide-y divide-ac-border-hairline overflow-hidden">{items}</AdminCard>
  );
}

export function AdminListRow({
  href,
  title,
  meta,
  pills,
  deleteAction,
  deleteId,
  thumbnail,
}: {
  href: string;
  title: string;
  meta?: string;
  pills?: React.ReactNode;
  deleteAction: (formData: FormData) => void;
  deleteId: string;
  thumbnail?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 px-5 py-4 hover:bg-ac-surface-container-low/60 transition-colors">
      {thumbnail && (
        <div className="w-11 h-11 rounded-lg overflow-hidden bg-ac-surface-container-low shrink-0 flex items-center justify-center">
          {thumbnail}
        </div>
      )}
      <Link href={href} className="min-w-0 flex-1">
        <div className="font-humanist text-sm font-medium text-ac-primary truncate">{title}</div>
        <div className="mt-1 flex items-center gap-2 flex-wrap">
          {meta && <span className="font-humanist text-[12px] text-ac-on-surface-variant">{meta}</span>}
          {pills}
        </div>
      </Link>
      <div className="flex items-center gap-3 shrink-0">
        <Link
          href={href}
          className="font-humanist text-[13px] text-ac-secondary hover:text-ac-cocoa font-medium transition-colors"
        >
          Edit
        </Link>
        <DeleteButton action={deleteAction} id={deleteId} />
      </div>
    </div>
  );
}
