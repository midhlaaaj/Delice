import { getAllBlogPosts } from "@/db/queries";
import { deleteBlogPost } from "@/lib/actions/blog";
import { AdminPageHeader, AdminList, AdminListRow, StatusPill } from "@/components/admin/admin-ui";

export default async function AdminBlogPage() {
  const posts = await getAllBlogPosts();

  return (
    <div>
      <AdminPageHeader
        title="Blog"
        description="Journal posts shown on the site's blog."
        action={{ label: "New post", href: "/admin/blog/new" }}
      />

      <AdminList
        emptyLabel="No posts yet."
        items={posts.map((p) => (
          <AdminListRow
            key={p.id}
            href={`/admin/blog/${p.id}`}
            title={p.title}
            meta={`${p.category} · ${p.author}`}
            thumbnail={
              p.coverImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.coverImageUrl} alt="" className="w-full h-full object-cover" />
              ) : undefined
            }
            pills={<StatusPill tone={p.isPublished ? "positive" : "neutral"} label={p.isPublished ? "Published" : "Hidden"} />}
            deleteAction={deleteBlogPost}
            deleteId={p.id}
          />
        ))}
      />
    </div>
  );
}
