import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { ugcVideos } from "@/db/schema";
import { VideoForm } from "@/components/admin/video-form";

export default async function EditVideoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [video] = await db.select().from(ugcVideos).where(eq(ugcVideos.id, id)).limit(1);
  if (!video) notFound();

  return (
    <div>
      <h1 className="font-editorial text-2xl text-ac-primary mb-6">Edit video</h1>
      <VideoForm video={video} />
    </div>
  );
}
