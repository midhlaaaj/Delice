"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Rect = { x: number; y: number; w: number; h: number };
type HandleKey = "nw" | "ne" | "sw" | "se";
type DragMode = "move" | HandleKey;

const STAGE_MAX_W = 560;
const STAGE_MAX_H = 460;
const HANDLE_SIZE = 14;
const MIN_SIZE = 30;

const CHECKERBOARD_STYLE: React.CSSProperties = {
  backgroundImage:
    "linear-gradient(45deg,#ccc 25%,transparent 25%),linear-gradient(-45deg,#ccc 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#ccc 75%),linear-gradient(-45deg,transparent 75%,#ccc 75%)",
  backgroundSize: "16px 16px",
  backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
  backgroundColor: "#f5f5f5",
};

export function ImageCropperModal({
  file,
  aspect,
  outputSize,
  title,
  onCancel,
  onCropped,
}: {
  file: File;
  /** width / height, or null for a freeform (unlocked) crop */
  aspect: number | null;
  /** target output pixel size, used only when `aspect` is set */
  outputSize?: { w: number; h: number };
  title?: string;
  onCancel: () => void;
  onCropped: (file: File) => void;
}) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);
  const [stage, setStage] = useState({ w: STAGE_MAX_W, h: STAGE_MAX_H });
  const [rect, setRect] = useState<Rect | null>(null);
  const dragRef = useRef<{ mode: DragMode; startX: number; startY: number; startRect: Rect } | null>(null);

  // Object URL is created and revoked within the same effect so Strict
  // Mode's dev-only setup→cleanup→setup replay can't revoke the URL out
  // from under the <img> before it loads (which happens if creation lives
  // in a useState initializer, paired with a separately-timed cleanup).
  useEffect(() => {
    const url = URL.createObjectURL(file);
    setImgUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const clampRect = useCallback(
    (r: Rect): Rect => {
      let { x, y, w, h } = r;
      w = Math.max(MIN_SIZE, Math.min(w, stage.w));
      h = Math.max(MIN_SIZE, Math.min(h, stage.h));
      x = Math.max(0, Math.min(x, stage.w - w));
      y = Math.max(0, Math.min(y, stage.h - h));
      return { x, y, w, h };
    },
    [stage]
  );

  function handleImgLoad() {
    const img = imgRef.current;
    if (!img) return;
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    setNatural({ w, h });

    const scale = Math.min(STAGE_MAX_W / w, STAGE_MAX_H / h, 1);
    const stageW = Math.round(w * scale);
    const stageH = Math.round(h * scale);
    setStage({ w: stageW, h: stageH });

    let rw: number;
    let rh: number;
    if (aspect) {
      if (stageW / stageH > aspect) {
        rh = stageH;
        rw = rh * aspect;
      } else {
        rw = stageW;
        rh = rw / aspect;
      }
    } else {
      rw = stageW;
      rh = stageH;
    }
    setRect({ x: (stageW - rw) / 2, y: (stageH - rh) / 2, w: rw, h: rh });
  }

  useEffect(() => {
    function onMove(e: PointerEvent) {
      const drag = dragRef.current;
      if (!drag) return;
      const dx = e.clientX - drag.startX;
      const dy = e.clientY - drag.startY;
      const s = drag.startRect;

      if (drag.mode === "move") {
        setRect(clampRect({ ...s, x: s.x + dx, y: s.y + dy }));
        return;
      }

      let { x, y, w, h } = s;
      if (drag.mode === "se") {
        w = s.w + dx;
        h = aspect ? w / aspect : s.h + dy;
      } else if (drag.mode === "nw") {
        w = s.w - dx;
        h = aspect ? w / aspect : s.h - dy;
        x = s.x + (s.w - w);
        y = s.y + (s.h - h);
      } else if (drag.mode === "ne") {
        w = s.w + dx;
        h = aspect ? w / aspect : s.h - dy;
        y = s.y + (s.h - h);
      } else if (drag.mode === "sw") {
        w = s.w - dx;
        h = aspect ? w / aspect : s.h + dy;
        x = s.x + (s.w - w);
      }
      w = Math.max(MIN_SIZE, w);
      h = Math.max(MIN_SIZE, h);
      setRect(clampRect({ x, y, w, h }));
    }
    function onUp() {
      dragRef.current = null;
    }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [aspect, clampRect]);

  const startDrag = useCallback(
    (mode: DragMode) => (e: React.PointerEvent) => {
      if (!rect) return;
      e.preventDefault();
      e.stopPropagation();
      dragRef.current = { mode, startX: e.clientX, startY: e.clientY, startRect: rect };
    },
    [rect]
  );

  function confirm() {
    if (!rect || !natural || !imgRef.current) return;
    const scaleToNatural = natural.w / stage.w;
    const sx = rect.x * scaleToNatural;
    const sy = rect.y * scaleToNatural;
    const sw = rect.w * scaleToNatural;
    const sh = rect.h * scaleToNatural;

    let outW: number;
    let outH: number;
    if (aspect && outputSize) {
      outW = outputSize.w;
      outH = outputSize.h;
    } else {
      const maxEdge = 1600;
      const scaleDown = Math.min(1, maxEdge / Math.max(sw, sh));
      outW = Math.round(sw * scaleDown);
      outH = Math.round(sh * scaleDown);
    }

    const canvas = document.createElement("canvas");
    canvas.width = outW;
    canvas.height = outH;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, outW, outH);
    ctx.drawImage(imgRef.current, sx, sy, sw, sh, 0, 0, outW, outH);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const croppedFile = new File([blob], file.name.replace(/\.\w+$/, "") + "-cropped.png", {
        type: "image/png",
      });
      onCropped(croppedFile);
    }, "image/png");
  }

  const handleKeys: HandleKey[] = ["nw", "ne", "sw", "se"];

  return (
    <div className="fixed inset-0 z-[200] bg-ac-ink/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-5 max-w-[640px] w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-humanist text-sm font-semibold text-ac-primary">
            {title ?? "Crop image"} {aspect ? "" : "(freeform)"}
          </h3>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close"
            className="text-ac-on-surface-variant hover:text-ac-primary text-sm"
          >
            ✕
          </button>
        </div>

        <div className="relative mx-auto select-none touch-none" style={{ width: stage.w, height: stage.h, ...CHECKERBOARD_STYLE }}>
          {imgUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              ref={imgRef}
              src={imgUrl}
              alt=""
              onLoad={handleImgLoad}
              className="absolute inset-0 w-full h-full pointer-events-none"
              draggable={false}
            />
          )}

          {!natural && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/70">
              <div className="w-8 h-8 rounded-full border-2 border-ac-border-hairline border-t-ac-maroon animate-spin" />
              <p className="font-humanist text-sm text-ac-on-surface-variant">Image is loading, please wait…</p>
            </div>
          )}

          {rect && (
            <>
              {/* dim mask: 4 bars around the crop rect, avoids a fragile clip-path hole */}
              <div className="absolute bg-black/45 pointer-events-none" style={{ left: 0, top: 0, width: stage.w, height: rect.y }} />
              <div
                className="absolute bg-black/45 pointer-events-none"
                style={{ left: 0, top: rect.y + rect.h, width: stage.w, height: stage.h - rect.y - rect.h }}
              />
              <div className="absolute bg-black/45 pointer-events-none" style={{ left: 0, top: rect.y, width: rect.x, height: rect.h }} />
              <div
                className="absolute bg-black/45 pointer-events-none"
                style={{ left: rect.x + rect.w, top: rect.y, width: stage.w - rect.x - rect.w, height: rect.h }}
              />

              <div
                onPointerDown={startDrag("move")}
                className="absolute border-2 border-white cursor-move"
                style={{ left: rect.x, top: rect.y, width: rect.w, height: rect.h }}
              />
              {handleKeys.map((key) => {
                const left = key.includes("w") ? rect.x : rect.x + rect.w;
                const top = key.includes("n") ? rect.y : rect.y + rect.h;
                return (
                  <div
                    key={key}
                    onPointerDown={startDrag(key)}
                    className="absolute bg-white border border-ac-primary rounded-full shadow"
                    style={{
                      left: left - HANDLE_SIZE / 2,
                      top: top - HANDLE_SIZE / 2,
                      width: HANDLE_SIZE,
                      height: HANDLE_SIZE,
                      cursor: `${key}-resize`,
                    }}
                  />
                );
              })}
            </>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 mt-5">
          <button
            type="button"
            onClick={onCancel}
            className="font-humanist text-sm text-ac-on-surface-variant border border-ac-border-hairline rounded-full px-4 py-2 hover:bg-ac-surface-container-low transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={confirm}
            disabled={!rect}
            className="font-humanist text-sm font-medium text-ac-on-primary bg-ac-maroon hover:bg-ac-maroon-deep disabled:opacity-50 rounded-full px-5 py-2 transition-colors"
          >
            Use this crop
          </button>
        </div>
      </div>
    </div>
  );
}
