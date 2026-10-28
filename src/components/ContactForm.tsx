"use client";

import { useState } from "react";

/**
 * Name, email, message → /api/contact, which emails it to me through Resend.
 * The hidden `company` field is a honeypot: people never see it, bots fill it.
 */

type State = "idle" | "sending" | "sent" | "error";

const field =
  "w-full rounded-md border border-line bg-white px-3 py-2.5 text-[15px] outline-none transition-colors placeholder:text-faint focus:border-accent";

export default function ContactForm() {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
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

  if (state === "sent") {
    return <p className="mt-6 text-[15px] text-accent">Thanks — your message reached me. I’ll reply soon.</p>;
  }

  return (
    <form onSubmit={submit} className="mt-6 grid max-w-xl gap-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <input name="name" required maxLength={100} placeholder="Your name" className={field} />
        <input name="email" type="email" required maxLength={200} placeholder="Your email" className={field} />
      </div>
      <textarea name="message" required maxLength={5000} rows={4} placeholder="Message" className={`${field} resize-y`} />
      <input name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      <div className="flex items-center gap-4">
        <button type="submit" disabled={state === "sending"} className="pill disabled:opacity-60">
          {state === "sending" ? "Sending…" : "Send message"}
        </button>
        {state === "error" && <p className="text-[14px] text-[#c2410c]">{error}</p>}
      </div>
    </form>
  );
}
