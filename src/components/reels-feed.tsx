"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { UgcVideo } from "@/db/schema";
import { EmptyState } from "./empty-state";

const FALLBACK_GRADIENTS = [
  "linear-gradient(160deg,#7C4667,#2A1620)",
  "linear-gradient(160deg,#DE8A4C,#5A3222)",
  "linear-gradient(160deg,#8B9B72,#2A1620)",
  "linear-gradient(160deg,#40200F,#7A4A34)",
  "linear-gradient(160deg,#C15D5E,#43223A)",
  "linear-gradient(160deg,#A9B98E,#3F4A2E)",
];

function ReelCard({ video, index }: { video: UgcVideo; index: number }) {
  const [paused, setPaused] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasVideo = Boolean(video.videoUrl);

  useEffect(() => {
    const el = videoRef.current;
    const container = containerRef.current;
    if (!el || !container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !paused) {
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.6 }
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, [paused]);

  return (
    <div className="h-[100svh] snap-start relative flex items-center justify-center md:py-6">
      <div
        ref={containerRef}
        className="relative w-full h-full md:w-[420px] md:h-full md:rounded-[28px] flex items-end overflow-hidden after:content-[''] after:absolute after:inset-0 after:bg-gradient-to-b after:from-black/15 after:via-transparent after:via-30% after:to-black/75"
        style={
          hasVideo
            ? undefined
            : video.thumbnailUrl
              ? { backgroundImage: `url(${video.thumbnailUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
              : { background: FALLBACK_GRADIENTS[index % FALLBACK_GRADIENTS.length] }
        }
      >
        {hasVideo && (
          <video
            ref={videoRef}
            src={video.videoUrl}
            poster={video.thumbnailUrl ?? undefined}
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        <div className="absolute top-[70px] left-4.5 z-10 inline-flex items-center gap-1.5 bg-black/35 px-3 py-1.5 rounded-full text-xs text-white before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-orange">
          Delice
        </div>

        <button
          className="absolute inset-0 z-[5] flex items-center justify-center bg-transparent border-none p-0"
          aria-label="Play or pause"
          onClick={() => setPaused((p) => !p)}
        >
          {paused && (
            <div className="w-14 h-14 rounded-full bg-white/18 backdrop-blur-sm flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="#fff" className="w-5 h-5 ml-0.5">
                <polygon points="6,4 20,12 6,20" />
              </svg>
            </div>
          )}
        </button>

        <div className="relative z-10 pr-18.5 pl-4.5 pb-8.5 text-white">
          <div className="text-[14.5px] font-semibold mb-1.5 flex items-center gap-2">
            <span className="w-6.5 h-6.5 rounded-full border-[1.5px] border-white bg-[linear-gradient(160deg,#E3A9B6,#7C4667)]" />
            {video.handle}
          </div>
          <div className="text-[13.5px] leading-snug text-white/92 max-w-[78%]">{video.caption}</div>
          <div className="flex items-center gap-1.5 mt-2.5 text-xs text-white/75">
            ♪ {video.soundLabel ?? "Original audio"}
          </div>
        </div>

        <div className="absolute right-3 bottom-8.5 z-10 flex flex-col items-center gap-5">
          <button className="bg-transparent border-none text-white flex flex-col items-center gap-1 text-[11px]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6.5 h-6.5">
              <path d="M12 21s-7.5-4.8-10-9.3C.5 7.8 3 4 7 4c2 0 3.5 1.2 5 3 1.5-1.8 3-3 5-3 4 0 6.5 3.8 5 7.7C19.5 16.2 12 21 12 21z" />
            </svg>
            Like
          </button>
          <button className="bg-transparent border-none text-white flex flex-col items-center gap-1 text-[11px]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6.5 h-6.5">
              <path d="M21 11.5a8.5 8.5 0 1 1-4-7.2L21 3l-1 5.5" />
            </svg>
            Share
          </button>
        </div>
      </div>
    </div>
  );
}

export function ReelsFeed({ videos }: { videos: UgcVideo[] }) {
  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-5 py-4.5 bg-gradient-to-b from-black/55 to-transparent">
        <Link
          href="/"
          aria-label="Back to home"
          className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" className="w-4 h-4">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </Link>
        <h1 className="font-editorial text-[16px] font-medium text-white m-0">Explore</h1>
        <div className="w-9" />
      </div>

      {videos.length > 0 ? (
        <div className="h-[100svh] overflow-y-scroll snap-y snap-mandatory [scrollbar-width:none]">
          {videos.map((v, i) => (
            <ReelCard key={v.id} video={v} index={i} />
          ))}
        </div>
      ) : (
        <div className="h-[100svh] flex items-center justify-center">
          <EmptyState
            tone="dark"
            title="No videos yet"
            description="We're still filming — check back soon for behind-the-scenes clips and flavor drops."
            cta={{ label: "Back to home", href: "/" }}
          />
        </div>
      )}
    </>
  );
}
