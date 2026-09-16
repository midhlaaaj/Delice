"use client";

export function VideoPreviewCard({
  handle,
  caption,
  soundLabel,
  thumbnailUrl,
}: {
  handle: string;
  caption: string;
  soundLabel: string;
  thumbnailUrl?: string;
}) {
  return (
    <div className="sticky top-8">
      <p className="font-humanist text-[11px] font-semibold uppercase tracking-wide text-ac-on-surface-variant mb-2.5">
        Live preview (mobile)
      </p>
      <div className="w-[220px] aspect-[9/17.5] rounded-[28px] border-[6px] border-ac-ink bg-ac-ink overflow-hidden relative shadow-[0_20px_50px_-30px_rgba(42,22,32,0.5)]">
        <div
          className="absolute inset-0 flex items-end after:content-[''] after:absolute after:inset-0 after:bg-gradient-to-b after:from-black/15 after:via-transparent after:via-30% after:to-black/75"
          style={
            thumbnailUrl
              ? { backgroundImage: `url(${thumbnailUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
              : { background: "linear-gradient(160deg,#7C4667,#2A1620)" }
          }
        >
          <div className="absolute top-4 left-3 z-10 inline-flex items-center gap-1.5 bg-black/35 px-2.5 py-1 rounded-full text-[10px] text-white before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-orange">
            Delice
          </div>

          <div className="relative z-10 pr-9 pl-3 pb-6 text-white">
            <div className="text-[11.5px] font-semibold mb-1 flex items-center gap-1.5">
              <span className="w-4.5 h-4.5 rounded-full border border-white bg-[linear-gradient(160deg,#E3A9B6,#7C4667)] shrink-0" />
              <span className="truncate">{handle || "@handle"}</span>
            </div>
            <div className="text-[11px] leading-snug text-white/92 max-w-[85%] line-clamp-2">
              {caption || "Caption goes here."}
            </div>
            <div className="flex items-center gap-1 mt-1.5 text-[9.5px] text-white/75">
              ♪ {soundLabel || "Original audio"}
            </div>
          </div>

          <div className="absolute right-2 bottom-6 z-10 flex flex-col items-center gap-3">
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" className="w-4.5 h-4.5">
              <path d="M12 21s-7.5-4.8-10-9.3C.5 7.8 3 4 7 4c2 0 3.5 1.2 5 3 1.5-1.8 3-3 5-3 4 0 6.5 3.8 5 7.7C19.5 16.2 12 21 12 21z" />
            </svg>
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" className="w-4.5 h-4.5">
              <path d="M21 11.5a8.5 8.5 0 1 1-4-7.2L21 3l-1 5.5" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
