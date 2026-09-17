"use client";

import { useEffect, useRef, useState } from "react";
import { adminLabel } from "./admin-ui";
import { ImageCropperModal } from "./image-cropper";

type MediaItem = { url: string; type: "image" | "video" };

const IMAGE_SLOTS = ["imageThreeQuarterUrl", "imageTopUrl", "imageSideUrl"] as const;
const VIDEO_SLOT = "transitionVideoUrl";
const MAX_IMAGES = IMAGE_SLOTS.length;

function initialItems(defaults: { images: (string | null | undefined)[]; video?: string | null }): MediaItem[] {
  const items: MediaItem[] = defaults.images
    .filter((u): u is string => Boolean(u))
    .map((url) => ({ url, type: "image" as const }));
  if (defaults.video) items.push({ url: defaults.video, type: "video" });
  return items;
}

export function MediaUploadField({
  defaultImages,
  defaultVideo,
  folder,
  onChange,
}: {
  defaultImages: (string | null | undefined)[];
  defaultVideo?: string | null;
  folder: string;
  onChange?: (items: { url: string; type: "image" | "video" }[]) => void;
}) {
  const [items, setItems] = useState<MediaItem[]>(() => initialItems({ images: defaultImages, video: defaultVideo }));
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cropQueue, setCropQueue] = useState<File[]>([]);
  const [editing, setEditing] = useState<{ index: number; file: File } | null>(null);
  const [editLoadingIndex, setEditLoadingIndex] = useState<number | null>(null);
  const dragIndex = useRef<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  useEffect(() => {
    onChange?.(items);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  async function uploadFiles(files: File[]) {
    setError(null);
    setUploading(true);
    try {
      for (const file of files) {
        const type: MediaItem["type"] = file.type.startsWith("video/") ? "video" : "image";
        if (type === "image" && items.filter((i) => i.type === "image").length >= MAX_IMAGES) {
          setError(`Up to ${MAX_IMAGES} images for now.`);
          continue;
        }
        if (type === "video" && items.some((i) => i.type === "video")) {
          setError("Only one video for now.");
          continue;
        }
        const body = new FormData();
        body.append("file", file);
        body.append("folder", folder);
        const res = await fetch("/api/admin/upload", { method: "POST", body });
        if (!res.ok) throw new Error("Upload failed");
        const { publicUrl } = await res.json();
        setItems((prev) => [...prev, { url: publicUrl, type }]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function handleFiles(files: FileList) {
    setError(null);
    const all = Array.from(files);
    const images = all.filter((f) => f.type.startsWith("image/"));
    const others = all.filter((f) => !f.type.startsWith("image/"));
    if (images.length > 0) setCropQueue((q) => [...q, ...images]);
    if (others.length > 0) uploadFiles(others);
  }

  function removeAt(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  async function startEdit(index: number) {
    setError(null);
    setEditLoadingIndex(index);
    try {
      const res = await fetch(items[index].url);
      if (!res.ok) throw new Error("Couldn't load image for editing");
      const blob = await res.blob();
      const file = new File([blob], "image.png", { type: blob.type || "image/png" });
      setEditing({ index, file });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't load image for editing");
    } finally {
      setEditLoadingIndex(null);
    }
  }

  async function replaceAt(index: number, file: File) {
    setError(null);
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("folder", folder);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      if (!res.ok) throw new Error("Upload failed");
      const { publicUrl } = await res.json();
      setItems((prev) => prev.map((it, i) => (i === index ? { url: publicUrl, type: "image" } : it)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function reorder(from: number, to: number) {
    setItems((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }

  // Serialize back into the four fixed fields the server action expects —
  // position among same-type items determines which named slot it fills.
  const images = items.filter((i) => i.type === "image");
  const video = items.find((i) => i.type === "video");

  return (
    <div>
      <label className={adminLabel}>Photos & video</label>
      <p className="font-humanist text-[12px] text-ac-on-surface-variant mb-3">
        First image is used as the hero shot on cards and the wheel. Drag to reorder.
      </p>

      {IMAGE_SLOTS.map((slot, i) => (
        <input key={slot} type="hidden" name={slot} value={images[i]?.url ?? ""} />
      ))}
      <input type="hidden" name={VIDEO_SLOT} value={video?.url ?? ""} />

      {items.length > 0 && (
        <ul className="grid gap-2 mb-3">
          {items.map((item, i) => (
            <li
              key={item.url}
              draggable
              onDragStart={() => {
                dragIndex.current = i;
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setOverIndex(i);
              }}
              onDragLeave={() => setOverIndex((cur) => (cur === i ? null : cur))}
              onDrop={(e) => {
                e.preventDefault();
                if (dragIndex.current !== null && dragIndex.current !== i) reorder(dragIndex.current, i);
                dragIndex.current = null;
                setOverIndex(null);
              }}
              onDragEnd={() => {
                dragIndex.current = null;
                setOverIndex(null);
              }}
              className={`flex items-center gap-3 bg-ac-surface-container-lowest border rounded-xl px-3 py-2.5 transition-colors ${
                overIndex === i ? "border-ac-secondary" : "border-ac-border-hairline"
              }`}
            >
              <span className="cursor-grab active:cursor-grabbing text-ac-on-surface-variant/60 shrink-0" aria-hidden>
                <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
                  <circle cx="6" cy="4" r="1.4" />
                  <circle cx="14" cy="4" r="1.4" />
                  <circle cx="6" cy="10" r="1.4" />
                  <circle cx="14" cy="10" r="1.4" />
                  <circle cx="6" cy="16" r="1.4" />
                  <circle cx="14" cy="16" r="1.4" />
                </svg>
              </span>

              <div className="w-11 h-11 rounded-lg overflow-hidden bg-ac-surface-container-low shrink-0 flex items-center justify-center">
                {item.type === "video" ? (
                  <video src={item.url} className="w-full h-full object-cover" muted />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.url} alt="" className="w-full h-full object-cover" />
                )}
              </div>

              <span className="font-humanist text-[12.5px] text-ac-on-surface-variant flex-1 min-w-0 truncate">
                {i === 0 && item.type === "image" ? "Hero shot" : item.type === "video" ? "Video" : "Photo"}
              </span>

              {item.type === "image" && (
                <button
                  type="button"
                  onClick={() => startEdit(i)}
                  disabled={editLoadingIndex !== null}
                  aria-label="Edit / crop"
                  className="text-ac-on-surface-variant hover:text-ac-secondary transition-colors shrink-0 disabled:opacity-50"
                >
                  {editLoadingIndex === i ? (
                    <span className="block w-4 h-4 rounded-full border-2 border-ac-border-hairline border-t-ac-secondary animate-spin" />
                  ) : (
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.5 3.5a2.1 2.1 0 0 1 3 3L8 19l-4 1 1-4Z" />
                    </svg>
                  )}
                </button>
              )}

              <button
                type="button"
                onClick={() => removeAt(i)}
                aria-label="Remove"
                className="text-ac-on-surface-variant hover:text-ac-rose transition-colors shrink-0"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}

      <label className="inline-flex items-center gap-2 font-humanist text-sm text-ac-secondary border border-dashed border-ac-border-hairline hover:border-ac-secondary rounded-xl px-4 py-2.5 cursor-pointer transition-colors">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
        {uploading ? "Uploading…" : "Add photos or video"}
        <input
          type="file"
          accept="image/*,video/*"
          multiple
          disabled={uploading}
          onChange={(e) => {
            if (e.target.files?.length) handleFiles(e.target.files);
            e.target.value = "";
          }}
          className="hidden"
        />
      </label>
      {error && <p className="font-humanist text-xs text-ac-rose mt-1.5">{error}</p>}

      {cropQueue.length > 0 && (
        <ImageCropperModal
          file={cropQueue[0]}
          aspect={4 / 3}
          outputSize={{ w: 1600, h: 1200 }}
          title="Crop photo"
          onCancel={() => setCropQueue((q) => q.slice(1))}
          onCropped={(cropped) => {
            setCropQueue((q) => q.slice(1));
            uploadFiles([cropped]);
          }}
        />
      )}

      {editing && (
        <ImageCropperModal
          file={editing.file}
          aspect={4 / 3}
          outputSize={{ w: 1600, h: 1200 }}
          title="Edit photo"
          onCancel={() => setEditing(null)}
          onCropped={(cropped) => {
            const index = editing.index;
            setEditing(null);
            replaceAt(index, cropped);
          }}
        />
      )}
    </div>
  );
}
