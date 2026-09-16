import { Button } from "./button";

type Cta = { label: string; href: string } | { label: string; onClick: () => void };

export function EmptyState({
  title,
  description,
  cta,
  tone = "light",
}: {
  title: string;
  description?: string;
  cta?: Cta;
  tone?: "light" | "dark";
}) {
  const isDark = tone === "dark";

  return (
    <div className="flex flex-col items-center text-center py-16 px-6">
      <div
        className={`w-14 h-14 rounded-full flex items-center justify-center mb-5 ${
          isDark ? "bg-white/10" : "bg-ac-surface-container"
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`w-6 h-6 ${isDark ? "text-white/50" : "text-ac-on-surface-variant/60"}`}
        >
          <rect x="3.5" y="8.5" width="17" height="11" rx="2" />
          <path d="M3.5 8.5 7 4h10l3.5 4.5" />
          <path d="M9 13.5a3 3 0 0 0 6 0" />
        </svg>
      </div>
      <h3 className={`font-editorial text-xl ${isDark ? "text-white" : "text-ac-primary"}`}>{title}</h3>
      {description && (
        <p
          className={`mt-2 font-humanist text-sm leading-relaxed max-w-sm ${
            isDark ? "text-white/60" : "text-ac-on-surface-variant"
          }`}
        >
          {description}
        </p>
      )}
      {cta && (
        <div className="mt-6">
          {"href" in cta ? (
            <Button href={cta.href} variant={isDark ? "inverse" : "solid"}>
              {cta.label}
            </Button>
          ) : (
            <Button onClick={cta.onClick} variant={isDark ? "inverse" : "solid"}>
              {cta.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
