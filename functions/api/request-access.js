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

const TEAM = ["robley@frameworks.social", "elizabeth@frameworks.social", "tal@frameworks.social", "josh@frameworks.social"];
const DEFAULT_FROM = "AgentSq <notifications@app.agentsq.co>";
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

// Email clients ignore stylesheets and web fonts, so the branded layout is tables
// with inline styles and system-font fallbacks. Colours match docs/DESIGN-TOKENS.md.
const MAIL = {
  ink: "#111111",
  muted: "#55555F",
  page: "#FCFCFF",
  signal: "#6CFCFC",
  electric: "#5D5FEF",
  sans: "'Inter',Helvetica,Arial,sans-serif",
  mono: "'IBM Plex Mono','Courier New',monospace",
};

/** The team email. Every value came from a public form, so all of it is escaped. */
export function teamEmail(request) {
  const { full_name, email, company, website, note } = request;
  const row = (label, value) =>
    `<tr><td style="padding:12px 0;border-top:1px solid ${MAIL.ink};font-family:${MAIL.mono};font-size:10px;letter-spacing:1.4px;text-transform:uppercase;color:${MAIL.muted};width:110px;vertical-align:top">${label}</td>` +
    `<td style="padding:12px 0;border-top:1px solid ${MAIL.ink};font-family:${MAIL.sans};font-size:15px;color:${MAIL.ink};vertical-align:top">${escapeHtml(value) || "&ndash;"}</td></tr>`;
  const replyHref = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent("Your AgentSq access request")}`;
  const firstName = full_name.split(" ")[0];

  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>New access request</title></head>
<body style="margin:0;padding:0;background:${MAIL.page}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${escapeHtml(full_name)} from ${escapeHtml(company)} asked for access to AgentSq.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${MAIL.page}"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="width:100%;max-width:560px;background:#FFFFFF;border:2px solid ${MAIL.ink};box-shadow:6px 6px 0 ${MAIL.ink}">
<tr><td style="padding:18px 28px;background:${MAIL.signal};border-bottom:2px solid ${MAIL.ink}">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
<td style="font-family:${MAIL.sans};font-size:20px;font-weight:800;letter-spacing:-0.4px;color:${MAIL.ink}">AgentSq</td>
<td align="right" style="font-family:${MAIL.mono};font-size:10px;letter-spacing:1.6px;text-transform:uppercase;color:${MAIL.ink}">New access request</td>
</tr></table></td></tr>
<tr><td style="padding:32px 28px 8px">
<p style="margin:0 0 8px;font-family:${MAIL.mono};font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${MAIL.muted}">From the website</p>
<h1 style="margin:0;font-family:${MAIL.sans};font-size:28px;line-height:1.1;font-weight:800;letter-spacing:-0.6px;color:${MAIL.ink}">${escapeHtml(company)} asked for access.</h1>
<div style="width:72px;height:6px;margin-top:16px;background:${MAIL.ink};line-height:6px;font-size:6px">&nbsp;</div>
</td></tr>
<tr><td style="padding:20px 28px 4px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-bottom:1px solid ${MAIL.ink}">
${row("Name", full_name)}
${row("Email", email)}
${row("Company", company)}
${row("Website", website)}
</table></td></tr>
<tr><td style="padding:20px 28px 4px">
<p style="margin:0 0 8px;font-family:${MAIL.mono};font-size:10px;letter-spacing:1.4px;text-transform:uppercase;color:${MAIL.muted}">Note</p>
<div style="padding:12px 16px;background:${MAIL.page};border-left:4px solid ${MAIL.electric};font-family:${MAIL.sans};font-size:15px;line-height:1.55;color:${MAIL.ink};white-space:pre-wrap">${escapeHtml(note) || "&ndash;"}</div>
</td></tr>
<tr><td style="padding:28px 28px 32px">
<table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="background:${MAIL.electric};border:2px solid ${MAIL.ink};box-shadow:4px 4px 0 ${MAIL.ink}">
<a href="${escapeHtml(replyHref)}" style="display:inline-block;padding:13px 22px;font-family:${MAIL.mono};font-size:11px;letter-spacing:1.6px;text-transform:uppercase;color:#FFFFFF;text-decoration:none">Reply to ${escapeHtml(firstName)}</a>
</td></tr></table>
<p style="margin:18px 0 0;font-family:${MAIL.sans};font-size:13px;line-height:1.5;color:${MAIL.muted}">Or just reply to this email. It goes straight to ${escapeHtml(email)}.</p>
</td></tr>
<tr><td style="padding:14px 28px;border-top:2px solid ${MAIL.ink};font-family:${MAIL.mono};font-size:10px;letter-spacing:1.4px;text-transform:uppercase;color:${MAIL.muted}">AgentSq &middot; a Frameworks product</td></tr>
</table>
</td></tr></table>
</body></html>`;

  const text = [
    "New access request from the website",
    "",
    `Name:    ${full_name}`,
    `Email:   ${email}`,
    `Company: ${company}`,
    `Website: ${website || "-"}`,
    "",
    "Note:",
    note || "-",
    "",
    "Reply to this email to reach them.",
  ].join("\n");

  return {
    // Subjects are plain text; strip line breaks so a value can't add headers.
    subject: `Access request: ${company} (${full_name})`.replace(/[\r\n]+/g, " "),
    html,
    text,
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
      body: JSON.stringify({ from: env.RESEND_FROM || DEFAULT_FROM, to, subject: email.subject, html: email.html, text: email.text, reply_to: result.request.email }),
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
