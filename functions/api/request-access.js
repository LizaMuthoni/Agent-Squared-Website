// POST /api/request-access - the Request access form (site/request-access/),
// handled by the site itself as a Cloudflare Pages Function, not by the app.
// Takes JSON {full_name, email, company, website, note, trap} and answers
// {ok: true} or {ok: false, error, fields}, like the study form.
//
// The request is checked and emailed to the team through Resend; nothing is
// stored. A filled honeypot (`trap`) gets a fake success so bots don't learn
// they were caught, and posts from other sites are refused.
//
// Settings (Pages project > Settings > Variables and secrets):
//   RESEND_API_KEY     required (secret)
//   RESEND_FROM        sender on a domain verified in Resend
//   ACCESS_REQUEST_TO  comma-separated recipients (defaults to the team below)
//   RESEND_API_URL     only for local tests against a mock

const TEAM = ["josh@frameworks.social", "elizabeth@frameworks.social", "robley@frameworks.social"];
const DEFAULT_FROM = "Agent Squared <notifications@app.agentsq.co>";
const RESEND_URL = "https://api.resend.com/emails";

// Generous for real requests, small enough that the form can't carry an
// arbitrary payload into the team's inbox.
const LIMITS = { full_name: 120, email: 254, company: 160, website: 300, note: 2000 };
const REQUIRED = ["full_name", "email", "company"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const WEBSITE_RE = /^(https?:\/\/)?[^\s/]+\.[^\s]+$/i;

function reply(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}

/** Checks the form; returns {request} or {error, fields}. */
export function validate(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return { error: "The request must be a JSON object.", fields: {} };
  if (typeof raw.trap === "string" && raw.trap.trim() !== "") return { spam: true };
  const request = {};
  const fields = {};
  for (const [name, limit] of Object.entries(LIMITS)) {
    const value = raw[name];
    if (value !== undefined && value !== null && typeof value !== "string") {
      fields[name] = "Must be text";
      continue;
    }
    // The note keeps its line breaks; the single-line fields don't.
    const text = name === "note" ? (value ?? "").trim().replace(/\r\n?/g, "\n") : (value ?? "").replace(/\s+/g, " ").trim();
    if (REQUIRED.includes(name) && !text) fields[name] = "Required";
    else if (text.length > limit) fields[name] = `Keep it under ${limit} characters`;
    request[name] = text;
  }
  if (request.email && !fields.email && !EMAIL_RE.test(request.email)) fields.email = "Enter a valid email address";
  if (request.website && !fields.website && !WEBSITE_RE.test(request.website)) fields.website = "Enter a valid website";
  const names = Object.keys(fields);
  if (names.length > 0) return { error: `Please check: ${names.map((n) => n.replace("_", " ")).join(", ")}.`, fields };
  return { request };
}

function escapeHtml(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

/** The team email. Every value came from a public form, so all of it is escaped. */
export function teamEmail(request) {
  const row = (label, value) =>
    `<tr><td style="padding:2px 12px 2px 0;color:#666">${label}</td><td>${escapeHtml(value) || "-"}</td></tr>`;
  return {
    // Subjects are plain text; strip line breaks so a value can't add headers.
    subject: `Access request: ${request.company} (${request.full_name})`.replace(/[\r\n]+/g, " "),
    html: [
      "<p>Someone asked for access to Agent Squared from the website.</p>",
      "<table>",
      row("Name", request.full_name),
      row("Email", request.email),
      row("Company", request.company),
      row("Website", request.website),
      "</table>",
      `<p style="margin:16px 0 4px;color:#666">Note</p><div style="white-space:pre-wrap">${escapeHtml(request.note) || "-"}</div>`,
      '<p style="margin-top:16px;color:#666">Reply to this email to reach them.</p>',
    ].join("\n"),
  };
}

export async function onRequestPost({ request, env }) {
  // Browsers always send Origin on a POST; refuse forms posted from other sites.
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return reply({ ok: false, error: "Requests from this site aren't accepted." }, 403);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return reply({ ok: false, error: "The request must be JSON." }, 400);
  }

  const result = validate(body);
  if (result.spam) return reply({ ok: true });
  if (result.error) return reply({ ok: false, error: result.error, fields: result.fields }, 400);

  if (!env.RESEND_API_KEY) {
    console.error("request-access: RESEND_API_KEY is not set");
    return reply({ ok: false, error: "Something went wrong. Please try again." }, 500);
  }

  const email = teamEmail(result.request);
  const to = (env.ACCESS_REQUEST_TO || TEAM.join(",")).split(",").map((s) => s.trim()).filter(Boolean);
  try {
    const res = await fetch(env.RESEND_API_URL || RESEND_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: env.RESEND_FROM || DEFAULT_FROM, to, subject: email.subject, html: email.html, reply_to: result.request.email }),
    });
    if (!res.ok) {
      console.error(`request-access: Resend answered ${res.status}: ${await res.text()}`);
      return reply({ ok: false, error: "We could not send your request. Please try again." }, 502);
    }
  } catch (err) {
    console.error(`request-access: ${err instanceof Error ? err.message : String(err)}`);
    return reply({ ok: false, error: "We could not send your request. Please try again." }, 502);
  }
  return reply({ ok: true });
}

export function onRequest() {
  return reply({ ok: false, error: "Use POST." }, 405);
}
