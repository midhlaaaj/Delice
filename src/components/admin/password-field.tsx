"use client";

import { useState } from "react";

export function PasswordField({ id, name }: { id: string; name: string }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative mb-6">
      <input
        id={id}
        name={name}
        type={visible ? "text" : "password"}
        required
        className="w-full border border-line rounded-lg px-3.5 py-2.5 pr-10 text-sm outline-none focus:border-plum-soft"
      />
      <button
        type="button"
        aria-label={visible ? "Hide password" : "Show password"}
        onClick={() => setVisible((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/45 hover:text-ink/70"
      >
        {visible ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-4.5 h-4.5">
            <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5.5 0-9-4.5-10-8 .61-1.87 1.75-3.72 3.28-5.22M9.9 4.24A10.94 10.94 0 0 1 12 4c5.5 0 9 4.5 10 8-.36 1.1-.94 2.23-1.72 3.27M14.12 14.12a3 3 0 1 1-4.24-4.24" />
            <path d="M1 1l22 22" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-4.5 h-4.5">
            <path d="M2 12s3.5-8 10-8 10 8 10 8-3.5 8-10 8-10-8-10-8Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        )}
      </button>
    </div>
  );
}
