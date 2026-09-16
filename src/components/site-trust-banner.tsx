export function SiteTrustBanner({ items }: { items: string[] }) {
  if (items.length === 0) return null;

  const row = (
    <span className="inline-flex items-center">
      {items.map((item, i) => (
        <span key={i} className="inline-flex items-center">
          <span className="font-humanist text-[11px] font-semibold uppercase tracking-[0.15em] text-ac-on-maroon px-6">
            {item}
          </span>
          <span className="text-ac-on-maroon-muted">✦</span>
        </span>
      ))}
    </span>
  );

  return (
    <div className="h-9 bg-ac-maroon overflow-hidden whitespace-nowrap flex items-center">
      <div
        className="inline-flex animate-marquee"
        style={{ animationDuration: "28s", "--marquee-end": "-33.3333%" } as React.CSSProperties}
      >
        {row}
        {row}
        {row}
      </div>
    </div>
  );
}
