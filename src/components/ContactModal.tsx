"use client";

import { useEffect, useRef, useState } from "react";
import { profile } from "@/data/portfolio";

/**
 * The "Get in touch" dialog.
 *
 * Built on the native <dialog> element rather than a div: `showModal()` gives
 * focus trapping, Escape-to-close, inertness of the page behind it and the
 * top-layer stacking for free. Re-implementing those correctly is most of what
 * a modal actually is.
 *
 * Styling follows the rest of the site — zero radius, hairlines, mono labels,
 * serif body — rather than the rounded-card look this was modelled on.
 */

const HEADING = { fontFamily: "var(--font-heading)" };

type State = "idle" | "sending" | "sent" | "error";

export default function ContactModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) {
      el.showModal();
      // The page behind a modal must not scroll with it.
      document.body.style.overflow = "hidden";
    } else if (!open && el.open) {
      el.close();
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Something went wrong.");
      setState("sent");
      form.reset();
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  return (
    <dialog
      ref={ref}
      // `close` also fires on Escape and on the backdrop, so this is the one
      // place that needs to tell the parent the dialog went away.
      onClose={() => {
        onClose();
        setState("idle");
        setError("");
      }}
      onClick={(e) => {
        // A click on the dialog element itself — not its children — is a click
        // on the backdrop.
        if (e.target === ref.current) ref.current?.close();
      }}
      className="w-[min(34rem,calc(100vw-2rem))] border border-line-strong bg-page p-0 text-fg backdrop:bg-black/50"
    >
      <div className="annot border-b border-line px-6 py-5">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 className="display text-h2" style={HEADING}>
              Get in touch
            </h2>
            <p className="mt-1 text-muted">
              Roles, questions, or something you&apos;re building — all welcome.
            </p>
          </div>
          <button
            onClick={() => ref.current?.close()}
            aria-label="Close"
            className="-mr-1 -mt-1 shrink-0 p-1 text-muted transition-colors hover:text-fg"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
              <path
                d="M4 4l10 10M14 4L4 14"
                stroke="currentColor"
                strokeWidth="1.4"
              />
            </svg>
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 font-mono text-meta text-faint">
          <a href={`mailto:${profile.email}`} className="link-underline">
            {profile.email}
          </a>
          <span>{profile.location}</span>
        </div>
      </div>

      {state === "sent" ? (
        <div className="px-6 py-10">
          <p className="text-lead" style={HEADING}>
            Sent.
          </p>
          <p className="mt-2 text-muted">
            Thanks — I&apos;ll reply to the address you gave me.
          </p>
          <button
            onClick={() => ref.current?.close()}
            style={HEADING}
            className="mt-6 inline-flex h-10 items-center border border-fg px-4 text-[15px] transition-colors hover:bg-fg hover:text-page"
          >
            Close
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="px-6 py-5">
          {/* Honeypot. Hidden from people, irresistible to bots; the server
              silently drops anything that fills it. */}
          <input
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute left-[-9999px] h-0 w-0 opacity-0"
          />

          <Field label="Name" name="name" required maxLength={100} />
          <Field
            label="Email"
            name="email"
            type="email"
            required
            maxLength={200}
          />
          <Field label="Subject" name="subject" maxLength={150} />
          <Field label="Message" name="message" required maxLength={5000} textarea />

          {state === "error" && (
            <p role="alert" className="mt-4 font-mono text-meta text-signal">
              {error}
            </p>
          )}

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => ref.current?.close()}
              style={HEADING}
              className="inline-flex h-10 items-center border border-line px-4 text-[15px] text-muted transition-colors hover:border-fg hover:text-fg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={state === "sending"}
              style={HEADING}
              className="inline-flex h-10 items-center bg-accent px-4 text-[15px] text-page transition-colors hover:bg-accent-deep disabled:opacity-60"
            >
              {state === "sending" ? "Sending…" : "Send message"}
            </button>
          </div>
        </form>
      )}
    </dialog>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  maxLength,
  textarea,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  maxLength?: number;
  textarea?: boolean;
}) {
  const cls =
    "mt-1.5 w-full border border-line bg-surface px-3 py-2 text-fg outline-none transition-colors placeholder:text-faint focus:border-accent";
  return (
    <label className="mt-4 block first:mt-0">
      <span className="eyebrow">
        {label}
        {!required && <span className="text-faint"> (optional)</span>}
      </span>
      {textarea ? (
        <textarea
          name={name}
          required={required}
          maxLength={maxLength}
          rows={5}
          className={`${cls} resize-y`}
        />
      ) : (
        <input
          name={name}
          type={type}
          required={required}
          maxLength={maxLength}
          className={cls}
        />
      )}
    </label>
  );
}
