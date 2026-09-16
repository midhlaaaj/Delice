"use client";

export function BlogPreviewCard({
  title,
  category,
  excerpt,
  readMinutes,
  coverImageUrl,
  colorFrom,
  colorTo,
}: {
  title: string;
  category: string;
  excerpt: string;
  readMinutes: number;
  coverImageUrl?: string;
  colorFrom: string;
  colorTo: string;
}) {
  return (
    <div className="sticky top-8">
      <p className="font-humanist text-[11px] font-semibold uppercase tracking-wide text-ac-on-surface-variant mb-2.5">
        Live preview (mobile)
      </p>
      <div className="w-[240px] bg-ac-paper border border-ac-border-hairline rounded-2xl overflow-hidden shadow-[0_20px_50px_-30px_rgba(42,22,32,0.35)]">
        <div className="relative aspect-[16/9]">
          {coverImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={coverImageUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <div
              className="w-full h-full"
              style={{ background: `linear-gradient(150deg, ${colorFrom}, ${colorTo})` }}
            />
          )}
          <span className="absolute top-2.5 left-2.5 font-humanist text-[9.5px] font-semibold uppercase tracking-wide text-white bg-ac-ink/45 backdrop-blur-sm px-2 py-1 rounded-full">
            {category || "Journal"}
          </span>
        </div>
        <div className="p-3.5">
          <h3 className="font-editorial font-medium text-ac-primary leading-[1.2] text-[16px] line-clamp-2">
            {title || "Post title"}
          </h3>
          <p className="mt-1.5 font-humanist text-[12px] text-ac-on-surface-variant leading-snug line-clamp-2">
            {excerpt || "A short teaser shown on the blog listing card."}
          </p>
          <div className="mt-2.5 font-humanist text-[10px] uppercase tracking-wide text-ac-on-surface-variant/70">
            {readMinutes} min read
          </div>
        </div>
      </div>
    </div>
  );
}
