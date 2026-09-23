import { ReelsFeed } from "@/components/reels-feed";
import { getPublishedVideos } from "@/db/queries";

export const metadata = {
  title: "Explore Videos — Delice",
  alternates: { canonical: "/videos" },
};

export default async function VideosPage() {
  const videos = await getPublishedVideos();

  return (
    <div className="h-screen overflow-hidden bg-[#0F0710]">
      <ReelsFeed videos={videos} />
    </div>
  );
}
