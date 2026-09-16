import Link from "next/link";
import type { BlogPost } from "@/db/schema";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", { month: "short", day: "numeric", year: "numeric" }).format(
    date
  );
}

const GRAIN_URL =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeGaussianBlur stdDeviation='0.3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export function BlogCover({ post, className = "" }: { post: BlogPost; className?: string }) {
  if (post.coverImageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={post.coverImageUrl} alt={post.title} className={`w-full h-full object-cover ${className}`} />
    );
  }
  return (
    <div
      className={`relative w-full h-full flex items-center justify-center ${className}`}
      style={{
        background: `linear-gradient(150deg, ${post.colorFrom ?? "#E3A9B6"}, ${post.colorTo ?? "#7C4667"})`,
      }}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.18] mix-blend-overlay"
        style={{ backgroundImage: GRAIN_URL, backgroundRepeat: "repeat" }}
      />
      <svg viewBox="0 0 24 24" fill="none" className="relative w-9 h-9 text-white/40">
        <path
          d="M4 5.5C4 4.67 4.67 4 5.5 4H12v16H5.5A1.5 1.5 0 0 1 4 18.5v-13Z"
          stroke="currentColor"
          strokeWidth="1.3"
        />
        <path
          d="M20 5.5c0-.83-.67-1.5-1.5-1.5H12v16h6.5c.83 0 1.5-.67 1.5-1.5v-13Z"
          stroke="currentColor"
          strokeWidth="1.3"
        />
      </svg>
    </div>
  );
}

export function BlogCard({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
  if (featured) {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className="group flex flex-col sm:flex-row rounded-2xl overflow-hidden bg-ac-paper border border-ac-border-hairline transition-transform active:scale-[0.98]"
      >
        <div className="relative flex-none overflow-hidden h-[280px] sm:h-auto sm:w-[50%]">
          <BlogCover post={post} className="group-hover:scale-105 transition-transform duration-300" />
        </div>
        <div className="p-6 sm:p-9 flex flex-col flex-1 justify-center min-h-[320px] sm:min-h-[420px]">
          <span className="font-humanist text-[11px] font-semibold uppercase tracking-[0.12em] text-ac-secondary">
            {post.category}
          </span>
          <h3 className="mt-2 font-editorial font-medium text-ac-primary leading-[1.15] tracking-tight text-[26px] sm:text-[36px]">
            {post.title}
          </h3>
          <p className="mt-4 font-humanist text-[15px] sm:text-[16px] font-normal text-ac-on-surface-variant leading-relaxed line-clamp-3">
            {post.excerpt}
          </p>
          <div className="mt-5 flex items-center gap-2 font-humanist text-[11px] uppercase tracking-wide text-ac-on-surface-variant/70">
            <span>{formatDate(post.publishedAt)}</span>
            <span className="w-1 h-1 rounded-full bg-ac-border-hairline" />
            <span>{post.readMinutes} min read</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col h-[260px] sm:h-[300px] rounded-2xl overflow-hidden bg-ac-paper border border-ac-border-hairline transition-transform active:scale-[0.98]"
    >
      <div className="relative overflow-hidden flex-[7] sm:flex-[3]">
        <BlogCover post={post} className="group-hover:scale-105 transition-transform duration-300" />
        <span className="absolute top-2.5 left-2.5 font-humanist text-[9.5px] font-semibold uppercase tracking-wide text-white bg-ac-ink/45 backdrop-blur-sm px-2 py-1 rounded-full">
          {post.category}
        </span>
        <span className="sm:hidden absolute top-2.5 right-2.5 font-humanist text-[9.5px] font-semibold uppercase tracking-wide text-white bg-ac-ink/45 backdrop-blur-sm px-2 py-1 rounded-full">
          {post.readMinutes} min
        </span>
      </div>
      <div className="p-4 flex flex-col justify-center sm:justify-between flex-[3] sm:flex-[1]">
        <h3 className="font-editorial font-medium text-ac-primary leading-[1.2] tracking-tight text-[18px] line-clamp-2">
          {post.title}
        </h3>
        <div className="hidden sm:flex mt-auto pt-2 items-center gap-2 font-humanist text-[10px] uppercase tracking-wide text-ac-on-surface-variant/70">
          <span>{formatDate(post.publishedAt)}</span>
          <span className="w-1 h-1 rounded-full bg-ac-border-hairline" />
          <span>{post.readMinutes} min read</span>
        </div>
      </div>
    </Link>
  );
}

export { formatDate };
