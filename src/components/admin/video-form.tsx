import { upsertVideo } from "@/lib/actions/videos";
import { ImageUploadField } from "./image-upload-field";
import type { UgcVideo } from "@/db/schema";

export function VideoForm({ video }: { video?: UgcVideo }) {
  return (
    <form action={upsertVideo} className="grid gap-4 max-w-xl">
      {video && <input type="hidden" name="id" value={video.id} />}

      <div>
        <label className="block text-sm text-ink/70 mb-1.5">Handle</label>
        <input
          name="handle"
          defaultValue={video?.handle}
          placeholder="@keralafoodie"
          required
          className="w-full border border-line rounded-lg px-3.5 py-2.5 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm text-ink/70 mb-1.5">Caption</label>
        <textarea
          name="caption"
          defaultValue={video?.caption}
          required
          rows={2}
          className="w-full border border-line rounded-lg px-3.5 py-2.5 text-sm"
        />
      </div>

      <ImageUploadField
        name="videoUrl"
        label="Video clip"
        defaultValue={video?.videoUrl}
        folder="videos"
      />
      <ImageUploadField
        name="thumbnailUrl"
        label="Thumbnail (optional)"
        defaultValue={video?.thumbnailUrl}
        folder="videos"
      />

      <div>
        <label className="block text-sm text-ink/70 mb-1.5">Sound label</label>
        <input
          name="soundLabel"
          defaultValue={video?.soundLabel ?? "Original audio"}
          className="w-full border border-line rounded-lg px-3.5 py-2.5 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm text-ink/70 mb-1.5">Sort order</label>
        <input
          name="sortOrder"
          type="number"
          defaultValue={video?.sortOrder ?? 0}
          className="w-32 border border-line rounded-lg px-3.5 py-2.5 text-sm"
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isPublished" defaultChecked={video?.isPublished ?? true} />
        Published
      </label>

      <button type="submit" className="bg-plum text-cream rounded-full px-6 py-2.5 text-sm w-fit">
        Save video
      </button>
    </form>
  );
}
