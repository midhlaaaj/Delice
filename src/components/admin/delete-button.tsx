"use client";

import { useRef, useState } from "react";

export function DeleteButton({
  action,
  id,
  label = "Delete",
}: {
  action: (formData: FormData) => void;
  id: string;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <>
      <form ref={formRef} action={action}>
        <input type="hidden" name="id" value={id} />
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOpen(true);
          }}
          className="font-humanist text-[13px] text-ac-on-surface-variant hover:text-ac-rose transition-colors"
        >
          {label}
        </button>
      </form>

      {open && (
        <div
          className="fixed inset-0 z-[200] bg-ac-ink/45 backdrop-blur-[2px] flex items-center justify-center p-6"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-sm bg-ac-surface-container-lowest rounded-2xl border border-ac-border-hairline shadow-[0_24px_48px_-16px_rgba(42,22,32,0.4)] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-10 rounded-full bg-ac-rose/12 text-ac-rose flex items-center justify-center mb-4">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6h16Z" />
              </svg>
            </div>
            <h3 className="font-editorial text-lg text-ac-primary mb-1">Delete this?</h3>
            <p className="font-humanist text-sm text-ac-on-surface-variant mb-5">
              This can&apos;t be undone.
            </p>
            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="font-humanist text-sm text-ac-on-surface-variant hover:text-ac-on-surface border border-ac-border-hairline rounded-full px-4 py-2 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  formRef.current?.requestSubmit();
                }}
                className="font-humanist text-sm font-medium text-white bg-ac-rose hover:bg-ac-maroon rounded-full px-4 py-2 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
