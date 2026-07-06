// Supabase Edge Function: submit-lead
// The ONLY write path for website leads (the anon role has no INSERT right on
// `leads` anymore — see supabase_leads_captcha_migration.sql).
//
// Flow:
//   1. Verify the Cloudflare Turnstile token server-side (human check)
//   2. Whitelist + length-limit the lead fields
//   3. Insert the lead with the service-role key
//      (the existing Database Webhook on `leads` still fires send-lead-email)
//
// Required environment secrets (set via `supabase secrets set`):
//   TURNSTILE_SECRET_KEY — from https://dash.cloudflare.com → Turnstile
//     Falls back to Cloudflare's always-pass TEST secret so the function works
//     before real keys exist. That test mode blocks NOTHING — set the real key!
//
// Auto-provided by Supabase: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

const TURNSTILE_TEST_SECRET = "1x0000000000000000000000000000000AA"; // always passes
const TURNSTILE_SECRET = Deno.env.get("TURNSTILE_SECRET_KEY") || TURNSTILE_TEST_SECRET;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const ALLOWED_ORIGINS = [
  "https://rmbygg.nu",
  "https://www.rmbygg.nu",
  "https://totalchi.github.io",
];

// Max length per accepted lead column; anything not listed here is dropped.
const FIELD_LIMITS: Record<string, number> = {
  type: 20,
  lang: 5,
  name: 120,
  email: 200,
  phone: 50,
  company: 160,
  address: 240,
  services: 240,
  property_type: 80,
  timing: 80,
  notes: 2000,
  booking_slot: 120,
};

function corsHeaders(origin: string | null): Record<string, string> {
  const isDev = origin ? /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin) : false;
  const allowed = origin && (ALLOWED_ORIGINS.includes(origin) || isDev) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization,apikey,x-client-info",
    "Vary": "Origin",
  };
}

function json(status: number, body: unknown, cors: Record<string, string>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}

function sanitizeLead(raw: any): Record<string, string> {
  const lead: Record<string, string> = {};
  for (const [key, max] of Object.entries(FIELD_LIMITS)) {
    const v = raw?.[key];
    if (typeof v === "string" && v.trim()) lead[key] = v.trim().slice(0, max);
  }
  lead.status = "new";
  return lead;
}

async function verifyTurnstile(token: string, remoteip: string): Promise<boolean> {
  const body = new URLSearchParams({ secret: TURNSTILE_SECRET, response: token });
  if (remoteip) body.set("remoteip", remoteip);
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
    });
    if (!res.ok) return false;
    const data = await res.json();
    return data.success === true;
  } catch {
    return false;
  }
}

Deno.serve(async (req) => {
  const cors = corsHeaders(req.headers.get("origin"));

  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405, headers: cors });

  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return json(400, { ok: false, error: "invalid JSON" }, cors);
  }

  // Honeypot tripped client-side → pretend success, store nothing.
  if (typeof payload?.website === "string" && payload.website.trim()) {
    return json(200, { ok: true }, cors);
  }

  const token = typeof payload?.token === "string" ? payload.token : "";
  if (!token) return json(403, { ok: false, error: "captcha token missing" }, cors);

  const remoteip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim();
  const human = await verifyTurnstile(token, remoteip);
  if (!human) return json(403, { ok: false, error: "captcha verification failed" }, cors);

  const lead = sanitizeLead(payload?.lead);
  if (!lead.email || !lead.email.includes("@")) {
    return json(400, { ok: false, error: "valid email required" }, cors);
  }

  const insert = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
    method: "POST",
    headers: {
      "apikey": SERVICE_ROLE_KEY,
      "Authorization": `Bearer ${SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      "Prefer": "return=minimal",
    },
    body: JSON.stringify([lead]),
  });

  if (!insert.ok) {
    const detail = await insert.text();
    console.error("lead insert failed:", insert.status, detail);
    return json(500, { ok: false, error: "could not save lead" }, cors);
  }

  return json(200, { ok: true }, cors);
});
