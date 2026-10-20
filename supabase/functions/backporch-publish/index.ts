// "Update the site now" for the BackPorch editor (/internal/backporch).
//
// New posts show on the site immediately (the pages read Supabase live), but the
// prerendered post pages, /p/ short-address stubs, link previews, and RSS/JSON
// feeds are baked at build time. This function starts the site's deploy
// workflow so those catch up in a few minutes instead of waiting for the
// scheduled rebuild.
//
// Only BackPorch editors may call it: the caller's own JWT is used to ask the
// database `is_porch_editor()`, the same check that guards writing posts.
//
// Secrets (set in the Supabase Dashboard, never in this file):
//   GITHUB_DEPLOY_TOKEN  fine-grained token, repo ChFxPro/sparkpointv15 only,
//                        permission "Actions: Read and write", nothing else.
// SUPABASE_URL and SUPABASE_ANON_KEY are provided by Supabase automatically.

const REPO = "ChFxPro/sparkpointv15";
const WORKFLOW = "deploy.yml";
const REF = "main";
// One deploy per two minutes is plenty; the workflow's own concurrency group
// cancels an older in-progress run anyway.
const MIN_INTERVAL_MS = 2 * 60 * 1000;

const ALLOWED_ORIGINS = new Set([
  "https://yoursparkpoint.org",
  "https://www.yoursparkpoint.org",
  "http://localhost:3000",
]);

let lastDispatch = 0;

function cors(req: Request): Record<string, string> {
  const origin = req.headers.get("Origin") ?? "";
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGINS.has(origin) ? origin : "https://yoursparkpoint.org",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, apikey, Authorization, x-client-info",
    Vary: "Origin",
  };
}

function json(req: Request, status: number, body: Record<string, unknown>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors(req), "Content-Type": "application/json" },
  });
}

async function isEditor(authHeader: string): Promise<boolean> {
  const url = Deno.env.get("SUPABASE_URL");
  const anon = Deno.env.get("SUPABASE_ANON_KEY");
  if (!url || !anon) return false;
  const res = await fetch(`${url}/rest/v1/rpc/is_porch_editor`, {
    method: "POST",
    headers: { apikey: anon, Authorization: authHeader, "Content-Type": "application/json" },
    body: "{}",
    signal: AbortSignal.timeout(5000),
  });
  if (!res.ok) return false;
  return (await res.json()) === true;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors(req) });
  if (req.method !== "POST") return json(req, 405, { error: "method not allowed" });

  const auth = req.headers.get("Authorization") ?? "";
  if (!auth.startsWith("Bearer ")) return json(req, 401, { error: "sign in first" });

  try {
    if (!(await isEditor(auth))) return json(req, 403, { error: "not a BackPorch editor" });
  } catch {
    return json(req, 503, { error: "could not check access" });
  }

  const now = Date.now();
  if (now - lastDispatch < MIN_INTERVAL_MS) {
    return json(req, 202, { ok: true, note: "an update was started moments ago" });
  }

  const token = Deno.env.get("GITHUB_DEPLOY_TOKEN");
  if (!token) return json(req, 500, { error: "site updates are not configured" });

  const res = await fetch(`https://api.github.com/repos/${REPO}/actions/workflows/${WORKFLOW}/dispatches`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "sparkpoint-backporch-publish",
    },
    body: JSON.stringify({ ref: REF }),
    signal: AbortSignal.timeout(10000),
  });

  if (res.status !== 204) {
    console.error(`GitHub dispatch failed: ${res.status} ${(await res.text()).slice(0, 200)}`);
    return json(req, 502, { error: "could not start the site update" });
  }

  lastDispatch = now;
  return json(req, 202, { ok: true });
});
