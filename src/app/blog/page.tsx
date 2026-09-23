import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BlogCard } from "@/components/blog-card";
import { EmptyState } from "@/components/empty-state";
import { getPublishedBlogPosts } from "@/db/queries";

export const metadata = {
  title: "Journal — Delice",
  description: "Stories from the Delice kitchen — new flavors, behind-the-scenes, and baking notes.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const posts = await getPublishedBlogPosts();
  const [featured, ...rest] = posts;

  return (
    <>
      <SiteHeader />
      <section className="w-full pt-32 pb-20 max-w-[1160px] mx-auto px-6">
        <div className="max-w-[560px] mb-9">
          <h1 className="font-editorial text-ac-primary text-[clamp(28px,4vw,38px)]">
            Stories from the kitchen
          </h1>
          <p className="mt-3 font-humanist text-[15.5px] leading-relaxed text-ac-on-surface-variant">
            New flavors, behind-the-scenes notes, and everything else that goes into a box of Delice.
          </p>
        </div>

        {posts.length === 0 && (
          <EmptyState
            title="No stories yet"
            description="We're still writing — new flavor notes and behind-the-scenes stories are on the way."
            cta={{ label: "Back to home", href: "/" }}
          />
        )}

        {/* Mobile: one flat grid, every card styled the same, no lead story */}
        {posts.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:hidden">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {/* sm and up: a lead story plus a labeled grid of the rest */}
        <div className="hidden sm:block">
          {featured && (
            <div className="mb-5">
              <BlogCard post={featured} featured />
            </div>
          )}

          {rest.length > 0 && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
