// SparkPoint Impact Dashboard API - Updated 2025
// deno-lint-ignore no-import-prefix
import { Hono, type Context } from "https://deno.land/x/hono@v4.6.8/mod.ts";
// deno-lint-ignore no-import-prefix
import { logger } from "https://deno.land/x/hono@v4.6.8/middleware.ts";
import * as kv from "./kv_store.tsx";
import { IMPACT_2025 } from "../../../data/impact2025.ts";
const app = new Hono();

// Form endpoints are public. Keep the accepted payload intentionally small so
// malformed or oversized submissions never reach storage or the email provider.
const MAX_FORM_REQUEST_BYTES = 16 * 1024;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CONTROL_CHARACTERS = /[\u0000-\u001F\u007F]/;

class FormValidationError extends Error {}

type JsonRecord = Record<string, unknown>;

const isJsonRecord = (value: unknown): value is JsonRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const invalidField = (field: string, message: string): never => {
  throw new FormValidationError(`${field} ${message}`);
};

const optionalText = (value: unknown, field: string, maxLength: number, allowNewlines = true) => {
  if (value === undefined || value === null || value === "") return "";
  if (typeof value !== "string") invalidField(field, "must be text");

  const normalized = value.trim();
  if (normalized.length > maxLength) invalidField(field, `must be ${maxLength} characters or fewer`);
  if (normalized.includes("\u0000") || (!allowNewlines && CONTROL_CHARACTERS.test(normalized))) {
    invalidField(field, "contains unsupported characters");
  }

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
  if (typeof value !== "string" || !allowed.includes(value as T)) {
    invalidField(field, "is invalid");
  }
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
      if (totalBytes > MAX_FORM_REQUEST_BYTES) {
        await reader.cancel();
        throw new FormValidationError("Submission is too large");
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
    throw new FormValidationError("Submission must be valid UTF-8 JSON");
  }
};

const readFormBody = async (c: Context): Promise<JsonRecord> => {
  const declaredLength = Number(c.req.raw.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_FORM_REQUEST_BYTES) {
    throw new FormValidationError("Submission is too large");
  }

  const rawBody = await readLimitedRequestBody(c.req.raw);

  try {
    const parsed = JSON.parse(rawBody);
    if (!isJsonRecord(parsed)) throw new FormValidationError("Submission must be a JSON object");
    return parsed;
  } catch (error) {
    if (error instanceof FormValidationError) throw error;
    throw new FormValidationError("Submission must be valid JSON");
  }
};

const allowedOrigins = new Set([
  // Production
  "https://yoursparkpoint.org",
  "https://www.yoursparkpoint.org",

  // GitHub Pages (origin is host only; no path)
  "https://chfxpro.github.io",

  // Local dev
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:4173",
]);

const normalizeOrigin = (origin: string | null) => {
  if (!origin) return null;
  // Trim + strip trailing slash
  const trimmed = origin.trim().replace(/\/$/, "");
  return trimmed.toLowerCase();
};

const getCorsHeaders = (req: Request) => {
  const rawOrigin = req.headers.get("origin");
  const origin = normalizeOrigin(rawOrigin);

  // Normalize the allowlist once per call (small set)
  const allowed = origin
    ? Array.from(allowedOrigins).some((o) => normalizeOrigin(o) === origin)
    : false;

  const allowOrigin = allowed && origin
    ? origin
    : "https://www.yoursparkpoint.org";

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    // Include the actual headers browsers commonly request in preflight
    "Access-Control-Allow-Headers": "apikey, authorization, content-type, x-client-info, accept, origin, x-requested-with",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
};

// Enable logger
app.use('*', logger(console.log));

// CORS handling for all routes and methods
app.use("*", async (c: Context, next: () => Promise<void>) => {
  const corsHeaders = getCorsHeaders(c.req.raw);

  if (c.req.method === "OPTIONS") {
    return new Response("ok", { status: 204, headers: corsHeaders });
  }

  await next();
  Object.entries(corsHeaders).forEach(([key, value]) => {
    c.res.headers.set(key, value);
  });
});

app.onError((err, c) => {
  console.error("Unhandled server error:", err);
  const corsHeaders = getCorsHeaders(c.req.raw);
  return c.json({
    error: "Internal server error",
    details: err instanceof Error ? err.message : "Unknown error",
  }, 500, corsHeaders);
});

// Debug: Log all incoming requests
app.use("*", async (c: Context, next: () => Promise<void>) => {
  console.log(`📥 Incoming request: ${c.req.method} ${c.req.url}`);
  await next();
});

const healthHandler = (c: Context) => {
  return c.json({ status: "ok" });
};

app.get("/make-server-535d8907/health", healthHandler);
app.get("/make-server-393f2b0a/health", healthHandler);

// Initialize Impact Metrics Data
app.post("/make-server-535d8907/impact/init", async (c: Context) => {
  console.log('✅ Impact init endpoint called');
  try {
    const metricsData = {
      "2024": {
        year: 2024,
        community_events: 37,
        workshops: 29,
        youth_events: 18,
        presentations: 13,
        total_events: 97,
        attendance: 7000,
        unique_partners: 40,
        individuals_trained: 500,
        avg_attendance: 72.1,
        ready_groups: 8,
        notes: "Foundational year — post-Helene recovery efforts; outreach built through schools, food access, and trauma-informed training."
      },
      "2025": {
        year: IMPACT_2025.year,
        events_logged: IMPACT_2025.eventsLogged,
        events_with_attendance_recorded: IMPACT_2025.eventsWithAttendanceRecorded,
        events_missing_attendance: IMPACT_2025.eventsMissingAttendance,
        total_events: IMPACT_2025.eventsLogged,
        attendance: IMPACT_2025.attendanceTotalRecordedMinimum,
        unique_partners: IMPACT_2025.uniqueCollaboratingOrganizationCount,
        months_active_programming: IMPACT_2025.monthsActiveProgramming,
        notes: "Canonical 2025 totals sourced from SparkPoint impact tracking reference."
      }
    };

    await kv.set("sparkpoint_impact_metrics", metricsData);

    return c.json({ 
      success: true, 
      message: "Impact metrics initialized successfully",
      data: metricsData
    });
  } catch (error) {
    console.error('Error initializing impact metrics:', error);
    return c.json({ 
      error: "Failed to initialize impact metrics",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Get Impact Metrics
app.get("/make-server-535d8907/impact/metrics", async (c: Context) => {
  console.log('✅ Impact metrics GET endpoint called');
  try {
    const metrics = await kv.get("sparkpoint_impact_metrics");
    
    if (!metrics) {
      return c.json({ 
        error: "Impact metrics not found. Please initialize first.",
      }, 404);
    }

    return c.json({ 
      success: true,
      data: metrics
    });
  } catch (error) {
    console.error('Error fetching impact metrics:', error);
    return c.json({ 
      error: "Failed to fetch impact metrics",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Volunteer/Partner Form Submission
app.post("/make-server-535d8907/volunteer", async (c: Context) => {
  try {
    const body = await readFormBody(c);
    const type = allowedValue(body.type, "Type", ["volunteer", "partner"] as const);
    const name = requiredText(body.name, "Name", 100);
    const email = requiredEmail(body.email);
    const phone = optionalText(body.phone, "Phone", 50, false);
    const organization = optionalText(body.organization, "Organization", 200, false);
    const interests = optionalTextList(body.interests, "Interests", 12, 100);
    const availability = optionalText(body.availability, "Availability", 500);
    const message = optionalText(body.message, "Message", 5_000);

    // Generate a unique ID for this submission
    const submissionId = `${type}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // Store in KV store
    const submissionData = {
      id: submissionId,
      type,
      name,
      email,
      phone: phone || '',
      organization: organization || '',
      interests: interests || [],
      availability: availability || '',
      message: message || '',
      submittedAt: new Date().toISOString(),
    };

    await kv.set(submissionId, submissionData);

    // Send email notification
    try {
      const emailBody = `
New ${type === 'volunteer' ? 'Volunteer' : 'Partnership'} Form Submission

Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
${type === 'partner' ? `Organization: ${organization || 'Not provided'}` : ''}
${type === 'volunteer' && interests.length > 0 ? `Interests: ${interests.join(', ')}` : ''}
Availability: ${availability || 'Not provided'}

Message:
${message || 'No message provided'}

Submitted: ${new Date().toLocaleString()}
      `.trim();

      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        },
        body: JSON.stringify({
          from: 'SparkPoint Forms <noreply@yoursparkpoint.org>',
          to: ['info@yoursparkpoint.org'],
          subject: `New ${type === 'volunteer' ? 'Volunteer' : 'Partnership'} Application from ${name}`,
          text: emailBody,
        }),
      });

      if (!emailResponse.ok) {
        const errorData = await emailResponse.text();
        console.error('Email sending error:', errorData);
        // Don't fail the whole request if email fails
      }
    } catch (emailError) {
      console.error('Error sending email notification:', emailError);
      // Continue even if email fails
    }

    return c.json({ 
      success: true, 
      message: "Form submitted successfully",
      submissionId 
    });

  } catch (error) {
    if (error instanceof FormValidationError) {
      return c.json({ error: error.message }, 400);
    }
    console.error('Error processing volunteer/partner form:', error);
    return c.json({ 
      error: "Failed to process form submission",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

type IntakeSubmission = {
  id: string;
  intent: "volunteer" | "partner" | "contact";
  name: string;
  email: string;
  phone: string;
  message: string;
  source_path: string;
  submittedAt: string;
  status: "new";
  interests?: string[];
  availability?: string;
  organization?: string;
  partnershipDetails?: string;
};

const intakeHandler = async (c: Context) => {
  try {
    const body = await readFormBody(c);
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

    // Generate ID
    const submissionId = `intake_${intent}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // Construct data object based on intent to avoid storing irrelevant fields
    const submissionData: IntakeSubmission = {
      id: submissionId,
      intent,
      name,
      email,
      phone: phone || '',
      message: message || '',
      source_path: source_path || '',
      submittedAt: new Date().toISOString(),
      status: 'new'
    };

    // Add intent-specific fields
    if (intent === 'volunteer') {
      submissionData.interests = Array.isArray(interests) ? interests : [];
      submissionData.availability = availability || '';
    } else if (intent === 'partner') {
      submissionData.organization = organization || '';
      submissionData.partnershipDetails = partnershipDetails || '';
    }

    // Store in KV
    await kv.set(submissionId, submissionData);

    // Send email notification via Resend (reusing existing logic if available, or just logging)
    // Using the same structure as the existing /volunteer endpoint for consistency
    try {
      let emailSubject = `New Inquiry from ${name}`;
      if (intent === 'volunteer') emailSubject = `New Volunteer Application from ${name}`;
      if (intent === 'partner') emailSubject = `New Partnership Inquiry from ${name}`;
      if (intent === 'contact') emailSubject = `New Contact Request from ${name}`;

      let specificDetails = '';
      if (intent === 'volunteer') {
        specificDetails = `
Interests: ${(submissionData.interests ?? []).join(', ') || 'None selected'}
Availability: ${submissionData.availability || 'Not provided'}
        `;
      } else if (intent === 'partner') {
        specificDetails = `
Organization: ${submissionData.organization || 'Not provided'}
Partnership Details: ${submissionData.partnershipDetails || 'Not provided'}
        `;
      }

      const emailBody = `
${emailSubject}

Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
Source: ${source_path || 'Unknown'}

${specificDetails}

Message:
${message || 'No message provided'}

Submitted: ${new Date().toLocaleString()}
      `.trim();

      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        },
        body: JSON.stringify({
          from: 'SparkPoint Intake <noreply@yoursparkpoint.org>',
          to: ['info@yoursparkpoint.org'],
          subject: emailSubject,
          text: emailBody,
        }),
      });

      if (!emailResponse.ok) {
        console.error('Email sending error:', await emailResponse.text());
      }
    } catch (emailError) {
      console.error('Error sending email notification:', emailError);
    }

    return c.json({ 
      success: true, 
      message: "Form submitted successfully",
      submissionId 
    });

  } catch (error) {
    if (error instanceof FormValidationError) {
      return c.json({ error: error.message }, 400);
    }
    console.error('Error processing intake form:', error);
    return c.json({ 
      error: "Failed to process form submission",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
};

app.post("/make-server-535d8907/intake", intakeHandler);
app.post("/make-server-393f2b0a/intake", intakeHandler);
app.post("/intake", intakeHandler);

// Catch-all route for debugging
app.all("*", (c: Context) => {
  console.log(`❌ Unmatched route: ${c.req.method} ${c.req.url}`);
  return c.json({ 
    error: "Route not found",
    method: c.req.method,
    path: c.req.url,
    availableRoutes: [
      "GET /make-server-535d8907/health",
      "POST /make-server-535d8907/impact/init",
      "GET /make-server-535d8907/impact/metrics",
      "POST /make-server-535d8907/volunteer",
      "POST /intake",
      "POST /make-server-535d8907/intake",
      "POST /make-server-393f2b0a/intake"
    ]
  }, 404);
});

Deno.serve(app.fetch);
