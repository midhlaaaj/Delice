"use client";

import { useState } from "react";
import { upsertVideo } from "@/lib/actions/videos";
import { ImageUploadField } from "./image-upload-field";
import { VideoPreviewCard } from "./video-preview-card";
import { Button } from "@/components/button";
import { adminInput, adminLabel, ToggleField } from "./admin-ui";
import type { UgcVideo } from "@/db/schema";

export function VideoForm({ video }: { video?: UgcVideo }) {
  const [handle, setHandle] = useState(video?.handle ?? "");
  const [caption, setCaption] = useState(video?.caption ?? "");
  const [soundLabel, setSoundLabel] = useState(video?.soundLabel ?? "Original audio");
  const [thumbnailUrl, setThumbnailUrl] = useState<string | undefined>(video?.thumbnailUrl ?? undefined);

  return (
    <div className="flex flex-col lg:flex-row gap-10 items-start">
      <form action={upsertVideo} className="grid gap-5 max-w-xl w-full">
        {video && <input type="hidden" name="id" value={video.id} />}

        <div>
          <label className={adminLabel}>Handle</label>
          <input
            name="handle"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            placeholder="@keralafoodie"
            required
            className={adminInput}
          />
        </div>

        <div>
          <label className={adminLabel}>Caption</label>
          <textarea
            name="caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            required
            rows={2}
            className={adminInput}
          />
        </div>

        <ImageUploadField name="videoUrl" label="Video clip" defaultValue={video?.videoUrl} folder="videos" />
        <ImageUploadField
          name="thumbnailUrl"
          label="Thumbnail (optional)"
          defaultValue={video?.thumbnailUrl}
          folder="videos"
          cropAspect={9 / 16}
          cropOutputSize={{ w: 810, h: 1440 }}
          onUploaded={setThumbnailUrl}
        />

        <div>
          <label className={adminLabel}>Sound label</label>
          <input
            name="soundLabel"
            value={soundLabel}
            onChange={(e) => setSoundLabel(e.target.value)}
            className={adminInput}
          />
        </div>

        <div>
          <label className={adminLabel}>Sort order</label>
          <input name="sortOrder" type="number" defaultValue={video?.sortOrder ?? 0} className={`${adminInput} w-32`} />
        </div>

        <ToggleField name="isPublished" label="Published" defaultChecked={video?.isPublished ?? true} />

        <Button type="submit" className="w-fit">
          Save video
        </Button>
      </form>

      <VideoPreviewCard handle={handle} caption={caption} soundLabel={soundLabel} thumbnailUrl={thumbnailUrl} />
    </div>
  );
}
