import { db } from "@/db";
import { ugcVideos } from "@/db/schema";
import { asc } from "drizzle-orm";
import { deleteVideo } from "@/lib/actions/videos";
import { AdminPageHeader, AdminList, AdminListRow, StatusPill } from "@/components/admin/admin-ui";

export default async function AdminVideosPage() {
  const videos = await db.select().from(ugcVideos).orderBy(asc(ugcVideos.sortOrder));

  return (
    <div>
      <AdminPageHeader
        title="Videos"
        description="UGC clips shown in the 'Loved by Kerala Foodies' reel."
        action={{ label: "New video", href: "/admin/videos/new" }}
      />

      <AdminList
        emptyLabel="No videos yet."
        items={videos.map((v) => (
          <AdminListRow
            key={v.id}
            href={`/admin/videos/${v.id}`}
            title={v.handle}
            meta={v.caption}
            thumbnail={
              v.thumbnailUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={v.thumbnailUrl} alt="" className="w-full h-full object-cover" />
              ) : undefined
            }
            pills={<StatusPill tone={v.isPublished ? "positive" : "neutral"} label={v.isPublished ? "Published" : "Hidden"} />}
            deleteAction={deleteVideo}
            deleteId={v.id}
          />
        ))}
      />
    </div>
  );
}
