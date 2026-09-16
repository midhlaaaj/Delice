import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getBlogPostBySlug, getOtherBlogPosts, getPublishedBlogPosts } from "@/db/queries";
import { BlogCover, BlogCard, formatDate } from "@/components/blog-card";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export async function generateStaticParams() {
  const posts = await getPublishedBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} — Delice Journal`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const others = await getOtherBlogPosts(slug, 3);
  const paragraphs = post.content.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

  return (
    <>
      <SiteHeader />

      <div className="w-full max-w-[760px] mx-auto px-6 pt-32 pb-20">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 font-humanist text-sm text-ac-on-surface-variant hover:text-ac-on-surface transition-colors mb-6 md:mb-10"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-4 h-4">
            <path d="M15 5l-7 7 7 7" />
          </svg>
          Back to journal
        </Link>

        <h1 className="font-editorial font-medium text-ac-primary text-[clamp(28px,4.5vw,44px)] leading-[1.08]">
          {post.title}
        </h1>
        <div className="mt-4 flex items-center gap-2 font-humanist text-[13.5px] text-ac-on-surface-variant">
          <span>{formatDate(post.publishedAt)}</span>
          <span className="w-1 h-1 rounded-full bg-ac-border-hairline" />
          <span>{post.readMinutes} min read</span>
        </div>

        <div className="mt-7 relative aspect-[16/9] rounded-2xl overflow-hidden">
          <BlogCover post={post} />
          <span className="absolute top-3 left-3 font-humanist text-[10.5px] font-semibold uppercase tracking-wide text-white bg-ac-ink/45 backdrop-blur-sm px-2.5 py-1 rounded-full">
            {post.category}
          </span>
        </div>

        <div className="mt-8 grid gap-5 font-humanist text-[16px] leading-relaxed text-ac-on-surface max-w-[640px]">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>

      {others.length > 0 && (
        <div className="w-full max-w-[1160px] mx-auto px-6 pb-20">
          <h2 className="font-editorial text-xl text-ac-primary mb-4.5">More from the journal</h2>
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3">
            {others.map((p) => (
              <BlogCard key={p.id} post={p} />
            ))}
          </div>
        </div>
      )}

      <SiteFooter />
    </>
  );
}
