// Supabase Edge Function: send-lead-email
// Triggered by a Database Webhook on the `leads` table (on INSERT).
// Sends two emails via Resend:
//   1. Confirmation to the customer (in their language: sv | en)
//   2. Notification to the RM Bygg inbox (always EN)
//
// Required environment secrets (set via `supabase secrets set`):
//   RESEND_API_KEY       — from https://resend.com/api-keys
//   FROM_EMAIL           — verified sender (e.g. "RM Bygg <noreply@rmbygg.com>" or "onboarding@resend.dev")
//   NOTIFICATION_EMAIL   — where business notifications go (info@rmbygg.com)

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") || "RM Bygg <onboarding@resend.dev>";
const NOTIFICATION_EMAIL = Deno.env.get("NOTIFICATION_EMAIL") || "info@rmbygg.com";

type Lang = "sv" | "en";

const COPY = {
  sv: {
    subject: "Tack för din förfrågan — RM Bygg & Montage",
    greeting: (name: string) => `Hej ${name || "där"},`,
    intro: "Tack för att du kontaktade oss! Vi har tagit emot din förfrågan och återkommer till dig inom 24 timmar på arbetsdagar.",
    summaryTitle: "Din förfrågan",
    typeLabel: "Typ",
    servicesLabel: "Tjänster",
    propertyLabel: "Fastighet",
    timingLabel: "Tidsplan",
    notesLabel: "Anteckningar",
    bookingLabel: "Bokning",
    closing: "Har du en brådskande fråga? Ring oss på +46 72 214 32 98.",
    sign: "Vänliga hälsningar,\nTeamet på RM Bygg & Montage",
    typeMap: { book: "Boka besök", quote: "Offertförfrågan", invoice: "Faktura" } as Record<string, string>,
  },
  en: {
    subject: "Thanks for your inquiry — RM Bygg & Montage",
    greeting: (name: string) => `Hi ${name || "there"},`,
    intro: "Thank you for reaching out! We've received your inquiry and will get back to you within 24 hours on business days.",
    summaryTitle: "Your inquiry",
    typeLabel: "Type",
    servicesLabel: "Services",
    propertyLabel: "Property",
    timingLabel: "Timing",
    notesLabel: "Notes",
    bookingLabel: "Booking",
    closing: "Got an urgent question? Call us on +46 72 214 32 98.",
    sign: "Best regards,\nThe team at RM Bygg & Montage",
    typeMap: { book: "Book a visit", quote: "Quote request", invoice: "Invoice" },
  },
};

const C = { bg: "#F5F3EF", ink: "#0D1117", muted: "#6B7280", line: "#E5E1D8", red: "#943226" };

function esc(s: unknown): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function row(label: string, value: string, rawHtml = false): string {
  if (!value) return "";
  const valueCell = rawHtml ? value : esc(value);
  return `<tr>
    <td style="padding:10px 0;border-bottom:1px solid ${C.line};color:${C.muted};font-size:13px;letter-spacing:0.04em;text-transform:uppercase;width:130px;vertical-align:top">${esc(label)}</td>
    <td style="padding:10px 0;border-bottom:1px solid ${C.line};color:${C.ink};font-size:15px;line-height:1.5">${valueCell}</td>
  </tr>`;
}

function shell(title: string, bodyHtml: string): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title></head>
<body style="margin:0;padding:0;background:${C.bg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:${C.ink}">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.bg};padding:32px 16px">
  <tr><td align="center">
    <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff;border:1px solid ${C.line};border-radius:8px;max-width:560px;width:100%">
      <tr><td style="padding:32px 36px 28px;border-bottom:3px solid ${C.red}">
        <div style="font-family:Georgia,serif;font-size:22px;font-weight:600;letter-spacing:-0.01em">RM Bygg <span style="color:${C.red}">&amp;</span> Montage</div>
        <div style="font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:${C.muted};margin-top:4px">Builder with heart · Gävle</div>
      </td></tr>
      <tr><td style="padding:32px 36px">${bodyHtml}</td></tr>
      <tr><td style="padding:18px 36px 26px;border-top:1px solid ${C.line};font-size:12px;color:${C.muted};text-align:center">
        RM Bygg &amp; Montage AB · Gävle, Sverige · +46 72 214 32 98
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;
}

function buildCustomerEmail(lead: any, lang: Lang): { subject: string; html: string } {
  const c = COPY[lang];
  const typeLabel = c.typeMap[lead.type] || lead.type || "";
  const body = `
    <p style="font-size:17px;margin:0 0 14px">${esc(c.greeting(lead.name || ""))}</p>
    <p style="font-size:15px;line-height:1.65;color:${C.ink};margin:0 0 24px">${esc(c.intro)}</p>
    <div style="font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:${C.red};margin-bottom:10px;font-weight:600">${esc(c.summaryTitle)}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${C.line}">
      ${row(c.typeLabel, typeLabel)}
      ${row(c.servicesLabel, lead.services || "")}
      ${row(c.propertyLabel, lead.property_type || "")}
      ${row(c.timingLabel, lead.timing || "")}
      ${row(c.bookingLabel, lead.booking_slot || "")}
      ${row(c.notesLabel, lead.notes || "")}
    </table>
    <p style="font-size:14px;line-height:1.6;color:${C.muted};margin:28px 0 18px">${esc(c.closing)}</p>
    <p style="font-size:15px;line-height:1.6;color:${C.ink};margin:0;white-space:pre-line">${esc(c.sign)}</p>
  `;
  return { subject: c.subject, html: shell(c.subject, body) };
}

function buildNotificationEmail(lead: any): { subject: string; html: string } {
  const subject = `New ${lead.type || "lead"} from ${lead.name || lead.email || "unknown"}`;
  const emailLink = lead.email ? `<a href="mailto:${esc(lead.email)}" style="color:${C.red};text-decoration:none">${esc(lead.email)}</a>` : "";
  const phoneLink = lead.phone ? `<a href="tel:${esc(lead.phone)}" style="color:${C.red};text-decoration:none">${esc(lead.phone)}</a>` : "";
  const body = `
    <p style="font-size:17px;margin:0 0 8px">New lead received</p>
    <p style="font-size:13px;color:${C.muted};margin:0 0 24px">Submitted via website · language: <strong>${esc(lead.lang)}</strong></p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${C.line}">
      ${row("Type", lead.type || "")}
      ${row("Name", lead.name || "")}
      ${row("Email", emailLink, true)}
      ${row("Phone", phoneLink, true)}
      ${row("Company", lead.company || "")}
      ${row("Address", lead.address || "")}
      ${row("Services", lead.services || "")}
      ${row("Property", lead.property_type || "")}
      ${row("Timing", lead.timing || "")}
      ${row("Booking", lead.booking_slot || "")}
      ${row("Notes", lead.notes || "")}
    </table>
    <p style="margin:28px 0 0;font-size:12px;color:${C.muted}">
      Open the admin dashboard: <a href="https://totalchi.github.io/RezkiWebsite/admin.html" style="color:${C.red}">view leads</a>
    </p>
  `;
  return { subject, html: shell(subject, body) };
}

async function sendEmail(to: string, subject: string, html: string): Promise<{ ok: boolean; status?: number; error?: string }> {
  if (!RESEND_API_KEY) return { ok: false, error: "RESEND_API_KEY not configured" };
  if (!to) return { ok: false, error: "no recipient" };

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: FROM_EMAIL, to: [to], subject, html }),
  });

  if (!res.ok) {
    const text = await res.text();
    return { ok: false, status: res.status, error: text };
  }
  return { ok: true };
}

Deno.serve(async (req) => {
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization,apikey,x-client-info",
  };

  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405, headers: cors });

  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: "invalid JSON" }), { status: 400, headers: { ...cors, "Content-Type": "application/json" } });
  }

  // Supabase Database Webhook payload: { type, table, record, schema, old_record }
  // Also support direct invocation where the body IS the lead.
  const lead = payload?.record ?? payload;

  if (!lead || !lead.email) {
    return new Response(JSON.stringify({ ok: false, error: "no lead.email in payload" }), {
      status: 200, headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  const lang: Lang = lead.lang === "sv" ? "sv" : "en";

  const customer = buildCustomerEmail(lead, lang);
  const notification = buildNotificationEmail(lead);

  const [custResult, notifResult] = await Promise.all([
    sendEmail(lead.email, customer.subject, customer.html),
    sendEmail(NOTIFICATION_EMAIL, notification.subject, notification.html),
  ]);

  return new Response(JSON.stringify({
    ok: true,
    customer: custResult,
    notification: notifResult,
  }), {
    status: 200,
    headers: { ...cors, "Content-Type": "application/json" },
  });
});
