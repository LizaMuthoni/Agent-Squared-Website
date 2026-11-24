// Entry point when the site is deployed as a Cloudflare Worker with static assets
// (wrangler.jsonc). It serves site/ and runs the backend routes below; the route
// logic itself lives in functions/, which Cloudflare Pages would also pick up.

import { onRequest as requestAccessAny, onRequestPost as requestAccessPost } from "../functions/api/request-access.js";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname === "agentsquared.co") {
      url.hostname = "www.agentsquared.co";
      return Response.redirect(url.toString(), 301);
    }
    const { pathname } = url;
    if (pathname === "/api/request-access") {
      return request.method === "POST" ? requestAccessPost({ request, env }) : requestAccessAny();
    }
    if (pathname.startsWith("/api/")) {
      return new Response(JSON.stringify({ ok: false, error: "Not found." }), {
        status: 404,
        headers: { "content-type": "application/json" },
      });
    }
    return env.ASSETS.fetch(request);
  },
};
