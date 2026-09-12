import Link from "next/link";
import { db } from "@/db";
import { ugcVideos } from "@/db/schema";
import { asc } from "drizzle-orm";
import { deleteVideo } from "@/lib/actions/videos";

export default async function AdminVideosPage() {
  const videos = await db.select().from(ugcVideos).orderBy(asc(ugcVideos.sortOrder));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl text-plum">Videos</h1>
        <Link href="/admin/videos/new" className="bg-plum text-cream rounded-full px-5 py-2.5 text-sm">
          New video
        </Link>
      </div>

      <div className="bg-paper border border-line rounded-2xl divide-y divide-line">
        {videos.map((v) => (
          <div key={v.id} className="flex items-center justify-between px-5 py-4">
            <div>
              <div className="text-sm font-medium text-plum">{v.handle}</div>
              <div className="text-xs text-ink/50 mt-0.5">
                {v.caption} · {v.isPublished ? "published" : "hidden"}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href={`/admin/videos/${v.id}`} className="text-sm text-plum-soft">
                Edit
              </Link>
              <form action={deleteVideo}>
                <input type="hidden" name="id" value={v.id} />
                <button className="text-sm text-rose">Delete</button>
              </form>
            </div>
          </div>
        ))}
        {videos.length === 0 && (
          <div className="px-5 py-8 text-center text-sm text-ink/50">No videos yet.</div>
        )}
      </div>
    </div>
  );
}
