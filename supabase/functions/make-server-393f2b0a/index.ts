/// <reference lib="deno.ns" />

import { Hono } from "npm:hono";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";

// This endpoint intentionally accepts public contact requests. Keep the payload
// small and validate it before it can reach privileged database or Monday calls.
const MAX_INTAKE_REQUEST_BYTES = 16 * 1024;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CONTROL_CHARACTERS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;
const ALL_CONTROL_CHARACTERS = /[\u0000-\u001F\u007F]/;

class IntakeValidationError extends Error {}

type JsonRecord = Record<string, unknown>;

const isJsonRecord = (value: unknown): value is JsonRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const invalidField = (field: string, message: string): never => {
  throw new IntakeValidationError(`${field} ${message}`);
};

const optionalText = (value: unknown, field: string, maxLength: number, allowNewlines = true) => {
  if (value === undefined || value === null || value === "") return "";
  if (typeof value !== "string") invalidField(field, "must be text");

  const normalized = value.trim();
  const disallowedCharacters = allowNewlines ? CONTROL_CHARACTERS : ALL_CONTROL_CHARACTERS;
  if (normalized.length > maxLength) invalidField(field, `must be ${maxLength} characters or fewer`);
  if (disallowedCharacters.test(normalized)) invalidField(field, "contains unsupported characters");

  return normalized;
};

const requiredText = (value: unknown, field: string, maxLength: number) => {
  const normalized = optionalText(value, field, maxLength, false);
  if (!normalized) invalidField(field, "is required");
  return normalized;
};

const requiredEmail = (value: unknown) => {
  const email = requiredText(value, "Email", 254).toLowerCase();
  if (!EMAIL_PATTERN.test(email)) invalidField("Email", "must be a valid email address");
  return email;
};

const allowedValue = <T extends string>(value: unknown, field: string, allowed: readonly T[]): T => {
  if (typeof value !== "string" || !allowed.includes(value as T)) invalidField(field, "is invalid");
  return value as T;
};

const optionalTextList = (value: unknown, field: string, maxItems: number, itemMaxLength: number) => {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value) || value.length > maxItems) {
    invalidField(field, `must contain no more than ${maxItems} selections`);
  }
  return value.map((item, index) => requiredText(item, `${field} item ${index + 1}`, itemMaxLength));
};

const readLimitedRequestBody = async (request: Request) => {
  if (!request.body) return "";

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      totalBytes += value.byteLength;
      if (totalBytes > MAX_INTAKE_REQUEST_BYTES) {
        await reader.cancel();
        throw new IntakeValidationError("Submission is too large");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const bytes = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    throw new IntakeValidationError("Submission must be valid UTF-8 JSON");
  }
};

const readIntakeBody = async (request: Request): Promise<JsonRecord> => {
  const declaredLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_INTAKE_REQUEST_BYTES) {
    throw new IntakeValidationError("Submission is too large");
  }

  const rawBody = await readLimitedRequestBody(request);
  try {
    const parsed = JSON.parse(rawBody);
    if (!isJsonRecord(parsed)) throw new IntakeValidationError("Submission must be a JSON object");
    return parsed;
  } catch (error) {
    if (error instanceof IntakeValidationError) throw error;
    throw new IntakeValidationError("Submission must be valid JSON");
  }
};

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

const allowedOrigins = [
  "https://yoursparkpoint.org",
  "https://www.yoursparkpoint.org",
  "https://chfxpro.github.io",
  "http://localhost:5173",
  "http://localhost:4173",
] as const;

function getCorsHeaders(req: Request) {
  const origin = (req.headers.get("origin") ?? "").trim();
  const allowOrigin = origin && allowedOrigins.includes(origin) ? origin : "null";

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

app.onError((err, c) => {
  console.error("Unhandled server error:", err);
  const corsHeaders = getCorsHeaders(c.req.raw);
  return c.json(
    {
      error: "Internal server error",
      details: err instanceof Error ? err.message : "Unknown error",
    },
    500,
    corsHeaders,
  );
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
    const body = await readIntakeBody(c.req.raw);
    const intent = allowedValue(body.intent, "Intent", ["volunteer", "partner", "contact"] as const);
    const name = requiredText(body.name, "Name", 100);
    const email = requiredEmail(body.email);
    const phone = optionalText(body.phone, "Phone", 50, false);
    const message = optionalText(body.message, "Message", 5_000);
    const source_path = optionalText(body.source_path, "Source path", 2_048, false);
    const interests = optionalTextList(body.interests, "Interests", 12, 100);
    const availability = optionalText(body.availability, "Availability", 500);
    const organization = optionalText(body.organization, "Organization", 200, false);
    const partnershipDetails = optionalText(body.partnershipDetails, "Partnership details", 3_000);

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
    if (error instanceof IntakeValidationError) {
      return c.json({ error: error.message }, 400);
    }
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
