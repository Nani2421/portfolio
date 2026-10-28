import { profile } from "@/data/portfolio";

/**
 * Contact form → email, via Resend's REST API.
 *
 * The API key is read from `process.env` and never leaves this file. Route
 * handlers only ever run on the server, so the key is not in the client bundle
 * — but that is only true as long as it is NOT named `NEXT_PUBLIC_*`, which
 * would inline it into the browser build. Never rename it.
 *
 * Called with `fetch` rather than the `resend` SDK: it is one POST, and this
 * avoids a dependency that would have to be kept up to date for no gain.
 */

/** Needs the Node runtime and must never be statically prerendered. */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LIMITS = { name: 100, email: 200, subject: 150, message: 5000 };

/**
 * Best-effort rate limit. This is per-process memory, so on a serverless host
 * each cold instance starts fresh and a determined sender gets around it — it
 * is here to stop an accidental double-submit and casual abuse, not as real
 * protection. Put a proper limiter in front if this ever gets traffic.
 */
const hits = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 3;

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  // Keep the map from growing without bound on a long-lived instance.
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );

export async function POST(req: Request) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    // Deliberately explicit: without this the form fails silently in a way
    // that looks like a bug rather than like missing configuration.
    return Response.json(
      { error: "Email is not configured on this deployment yet." },
      { status: 503 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Malformed request." }, { status: 400 });
  }

  // Honeypot: a field hidden from humans. Anything that fills it is a bot, and
  // it gets a 200 so it has no signal that the submission was dropped.
  if (typeof body.company === "string" && body.company.length > 0) {
    return Response.json({ ok: true });
  }

  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const name = str(body.name);
  const email = str(body.email);
  const subject = str(body.subject);
  const message = str(body.message);

  if (!name || !email || !message) {
    return Response.json(
      { error: "Name, email and message are required." },
      { status: 400 },
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "That email doesn't look right." }, { status: 400 });
  }
  if (
    name.length > LIMITS.name ||
    email.length > LIMITS.email ||
    subject.length > LIMITS.subject ||
    message.length > LIMITS.message
  ) {
    return Response.json({ error: "That's longer than allowed." }, { status: 400 });
  }

  // Counted only after validation passes: rate-limiting invalid requests means
  // three typos in an email address lock someone out for a minute, which
  // punishes exactly the people the form is for.
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  if (rateLimited(ip)) {
    return Response.json(
      { error: "Too many messages. Try again in a minute." },
      { status: 429 },
    );
  }

  // Until a domain is verified in Resend, `onboarding@resend.dev` is the only
  // address it will send from — and it can only deliver to the account owner.
  const from = process.env.CONTACT_FROM || "Portfolio <onboarding@resend.dev>";
  const to = process.env.CONTACT_TO || profile.email;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      // Replying goes straight back to whoever wrote in, not to the sending
      // address — which is the whole point of collecting their email.
      reply_to: email,
      subject: subject ? `Portfolio — ${subject}` : `Portfolio — message from ${name}`,
      text: `From: ${name} <${email}>\nSubject: ${subject || "(none)"}\n\n${message}`,
      html:
        `<p><strong>${esc(name)}</strong> &lt;${esc(email)}&gt;</p>` +
        (subject ? `<p><em>${esc(subject)}</em></p>` : "") +
        `<hr><p style="white-space:pre-wrap">${esc(message)}</p>`,
    }),
  });

  if (!res.ok) {
    // The upstream body can contain the key's account details, so it is logged
    // server-side and never returned to the browser.
    console.error("[contact] Resend failed", res.status, await res.text());
    return Response.json(
      { error: "Could not send the message. Please email me directly." },
      { status: 502 },
    );
  }

  return Response.json({ ok: true });
}
