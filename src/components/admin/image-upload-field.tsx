"use client";

import { useState } from "react";
import { adminLabel } from "./admin-ui";
import { ImageCropperModal } from "./image-cropper";

export function ImageUploadField({
  name,
  label,
  defaultValue,
  folder,
  onUploaded,
  cropAspect,
  cropOutputSize,
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  folder: string;
  onUploaded?: (url: string) => void;
  /**
   * width / height to lock the crop to (e.g. 1 for a square product card,
   * 9/16 for a video thumbnail). Pass `null` for a freeform crop (hero).
   * Omit entirely to skip the cropper and upload the file as-is.
   */
  cropAspect?: number | null;
  /** target output pixel size; only used when `cropAspect` is a number */
  cropOutputSize?: { w: number; h: number };
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("folder", folder);

      const res = await fetch("/api/admin/upload", { method: "POST", body });
      if (!res.ok) throw new Error("Upload failed");
      const { publicUrl } = await res.json();

      setUrl(publicUrl);
      onUploaded?.(publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  const cropEnabled = cropAspect !== undefined;

  return (
    <div>
      <label className={adminLabel}>{label}</label>
      <input type="hidden" name={name} value={url} />
      <div className="flex items-center gap-3">
        {url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="" className="w-16 h-16 object-cover rounded-lg border border-ac-border-hairline" />
        )}
        <label className="inline-flex items-center gap-2 font-humanist text-sm text-ac-secondary border border-dashed border-ac-border-hairline hover:border-ac-secondary rounded-xl px-4 py-2.5 cursor-pointer transition-colors">
          {uploading ? "Uploading…" : url ? "Replace" : "Upload"}
          <input
            type="file"
            accept="image/*,video/*"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              if (cropEnabled && file.type.startsWith("image/")) {
                setPendingFile(file);
              } else {
                handleFile(file);
              }
              e.target.value = "";
            }}
            className="hidden"
          />
        </label>
      </div>
      {error && <p className="font-humanist text-xs text-ac-rose mt-1">{error}</p>}

      {pendingFile && (
        <ImageCropperModal
          file={pendingFile}
          aspect={cropAspect ?? null}
          outputSize={cropOutputSize}
          title={`Crop: ${label}`}
          onCancel={() => setPendingFile(null)}
          onCropped={(cropped) => {
            setPendingFile(null);
            handleFile(cropped);
          }}
        />
      )}
    </div>
  );
}
