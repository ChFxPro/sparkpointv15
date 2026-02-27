/// <reference lib="deno.ns" />

import { Hono } from "npm:hono";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";

function cap(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

// ---------------- Monday push (optional, won’t break intake if it fails) ----------------
async function pushToMonday(args: {
  intent: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  source_path?: string;
  submissionId: string;
  createdAtISO: string;
}) {
  const token = Deno.env.get("MONDAY_API_TOKEN");
  const boardId = Deno.env.get("MONDAY_BOARD_ID");

  // If not configured, just skip.
  if (!token || !boardId) {
    console.log("Monday not configured; skipping push.");
    return;
  }

  // Column IDs from your board:
  const colEmail = Deno.env.get("MONDAY_COL_EMAIL")!;
  const colPhone = Deno.env.get("MONDAY_COL_PHONE")!;
  const colStatus = Deno.env.get("MONDAY_COL_STATUS")!;
  const colIntent = Deno.env.get("MONDAY_COL_INTENT")!;
  const colDate = Deno.env.get("MONDAY_COL_DATE")!;
  const colItemName = Deno.env.get("MONDAY_COL_ITEMNAME")!;

  const itemName = `${args.name} — ${cap(args.intent)}`;
  const yyyyMmDd = args.createdAtISO.slice(0, 10);

  const columnValues: Record<string, any> = {
    [colEmail]: args.email,                 // text column
    [colPhone]: args.phone ?? "",           // text column
    [colStatus]: { label: "New" },          // status column
    [colIntent]: { labels: [cap(args.intent)] }, // dropdown column
    [colDate]: { date: yyyyMmDd },          // date column
    [colItemName]: itemName,                // text column
  };

  const query = `
    mutation ($boardId: ID!, $itemName: String!, $columnValues: JSON!) {
      create_item(board_id: $boardId, item_name: $itemName, column_values: $columnValues) {
        id
      }
    }
  `;

  const res = await fetch("https://api.monday.com/v2", {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables: {
        boardId: Number(boardId),
        itemName,
        columnValues: JSON.stringify(columnValues),
      },
    }),
  });

  const json = await res.json();

  if (!res.ok || json.errors) {
    console.error("Monday push failed:", JSON.stringify(json));
    return; // do NOT throw
  }

  console.log("Monday item created:", json.data?.create_item?.id);
}

// ---------------- App + CORS ----------------
const app = new Hono();

// Your function name (used for the “double route” fix)
const FN_PREFIX = "/make-server-393f2b0a";

const allowedOrigins = new Set<string>([
  "https://yoursparkpoint.org",
  "https://www.yoursparkpoint.org",
  "https://chfxpro.github.io",
  "http://localhost:3000",
]);

function normalizeOrigin(origin: string) {
  return origin.trim().replace(/\/+$/, "");
}

function getCorsHeaders(req: Request) {
  const origin = (req.headers.get("origin") ?? "").trim();
  const normalizedOrigin = normalizeOrigin(origin);
  const allowOrigin = normalizedOrigin && allowedOrigins.has(normalizedOrigin) ? origin : "null";

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    "Access-Control-Allow-Headers":
      "apikey, authorization, content-type, x-client-info, accept, origin, x-requested-with",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

app.use("*", logger(console.log));

app.use("*", async (c, next) => {
  const corsHeaders = getCorsHeaders(c.req.raw);

  if (c.req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  await next();

  for (const [k, v] of Object.entries(corsHeaders)) {
    c.res.headers.set(k, v);
  }
});

// ---------------- Supabase client (Service Role) ----------------
// We use SERVICE_ROLE inside the Edge Function so inserts work reliably (no RLS drama).
function getSupabaseAdmin() {
  const url =
    Deno.env.get("SUPABASE_URL") ??
    `https://${Deno.env.get("SUPABASE_PROJECT_REF") ?? ""}.supabase.co`;

  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!url || !serviceKey) {
    throw new Error("Missing SUPABASE_URL and/or SUPABASE_SERVICE_ROLE_KEY secrets.");
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}

// ---------------- Handlers ----------------
const healthHandler = (c: any) =>
  c.json({ ok: true, service: "sparkpoint-forms", function: "make-server-393f2b0a" });

const intakeHandler = async (c: any) => {
  try {
    const body = await c.req.json();

    const {
      intent,
      name,
      email,
      phone,
      message,
      source_path,
      // volunteer extras
      interests,
      availability,
      // partner extras
      organization,
      partnershipDetails,
    } = body ?? {};

    if (!intent || !name || !email) {
      return c.json({ error: "intent, name, and email are required" }, 400);
    }

    const validIntents = ["volunteer", "partner", "contact"];
    if (!validIntents.includes(intent)) {
      return c.json({ error: "Invalid intent" }, 400);
    }

    const createdAtISO = new Date().toISOString();
    const submissionId = `intake_${intent}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

    const extras: Record<string, unknown> = {};

    if (intent === "volunteer") {
      extras.interests = Array.isArray(interests) ? interests : [];
      extras.availability = availability ?? "";
    }

    if (intent === "partner") {
      extras.organization = organization ?? "";
      extras.partnershipDetails = partnershipDetails ?? "";
    }

    // Insert into Postgres
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("intake_submissions").insert({
      id: submissionId,
      intent,
      name,
      email,
      phone: phone ?? "",
      message: message ?? "",
      source_path: source_path ?? "",
      extras,
      created_at: createdAtISO,
    });

    if (error) {
      console.error("DB insert error:", error);
      return c.json({ error: "Failed to save submission", details: error.message }, 500);
    }

    // Push to Monday (best-effort)
    pushToMonday({
  intent,
  name,
  email,
  phone,
  message,
  source_path,
  submissionId,
  createdAtISO,
}).catch((err) => console.error("Monday push error:", err));

    return c.json({ success: true, submissionId });
  } catch (error) {
    console.error("Error processing /intake:", error);
    return c.json(
      { error: "Failed to process submission", details: error instanceof Error ? error.message : "Unknown error" },
      500,
    );
  }
};

// ---- Register BOTH route styles explicitly ----
app.get("/health", healthHandler);
app.get(`${FN_PREFIX}/health`, healthHandler);

app.post("/intake", intakeHandler);
app.post(`${FN_PREFIX}/intake`, intakeHandler);

// Catch-all (helps debugging)
app.all("*", (c) => {
  return c.json(
    {
      error: "Route not found",
      method: c.req.method,
      path: c.req.path,
      hints: {
        try: ["GET /health", `GET ${FN_PREFIX}/health`, "POST /intake", `POST ${FN_PREFIX}/intake`],
      },
    },
    404,
  );
});

Deno.serve(app.fetch);
