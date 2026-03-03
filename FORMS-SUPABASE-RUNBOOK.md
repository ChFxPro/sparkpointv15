# Forms Supabase Runbook

## Canonical Intake Function (Current)
- Function slug: `make-server-393f2b0a`
- Canonical endpoint: `https://suqtfbculwuetfdhdgdh.supabase.co/functions/v1/make-server-393f2b0a/intake`
- Health endpoint: `https://suqtfbculwuetfdhdgdh.supabase.co/functions/v1/make-server-393f2b0a/health`

## Auth + CORS Rules
- Browser intake calls must include anon auth headers:
  - `apikey: <public anon key>`
  - `Authorization: Bearer <public anon key>`
- Why: this edge function is protected by Supabase function auth and returns `401 Missing authorization header` without them.
- CORS must never return `*` for this authenticated edge function.
- CORS allowlist must include exact origins:
  - `https://yoursparkpoint.org`
  - `https://www.yoursparkpoint.org`
  - `https://chfxpro.github.io`
  - `http://localhost:5173`
  - `http://localhost:4173`
- If origin is missing or not allowed, function should return `Access-Control-Allow-Origin: null`.

## Curl Verification
```bash
PROJECT_ID="suqtfbculwuetfdhdgdh"
ANON="$(sed -n 's/^export const publicAnonKey = \"\\(.*\\)\"/\\1/p' src/utils/supabase/info.tsx)"
BASE="https://${PROJECT_ID}.supabase.co/functions/v1/make-server-393f2b0a"

# OPTIONS preflight (no auth headers needed)
curl -sS -D - -o /dev/null -X OPTIONS "${BASE}/intake" \
  -H "Origin: https://yoursparkpoint.org" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: content-type,apikey,authorization"
# Expected: HTTP 204 + Access-Control-Allow-Origin: https://yoursparkpoint.org

# POST without auth headers (expected 401)
curl -sS -D - -o - -X POST "${BASE}/intake" \
  -H "Origin: https://yoursparkpoint.org" \
  -H "Content-Type: application/json" \
  --data '{"intent":"contact","name":"Test","email":"test@example.com","message":"probe"}'
# Expected: HTTP 401 + Access-Control-Allow-Origin: https://yoursparkpoint.org (not *)

# POST with auth headers (expected 200)
curl -sS -D - -o - -X POST "${BASE}/intake" \
  -H "Origin: https://yoursparkpoint.org" \
  -H "Content-Type: application/json" \
  -H "apikey: ${ANON}" \
  -H "Authorization: Bearer ${ANON}" \
  --data '{"intent":"contact","name":"Test","email":"test@example.com","message":"probe"}'
# Expected: HTTP 200 + Access-Control-Allow-Origin: https://yoursparkpoint.org
```

## Quick Debug Checklist
1. Confirm client bundle marker points to canonical slug:
   - good: `functions/v1/make-server-393f2b0a/intake`
   - bad: `functions/v1/server/intake`
2. Confirm GitHub Pages workflow uploads `build/` (not `dist/`).
3. Confirm function routes:
   - `GET /functions/v1/server/health` can be healthy but intake path may still be wrong.
   - `POST /functions/v1/server/intake` should not be used for forms.
   - `POST /functions/v1/make-server-393f2b0a/intake` is the production intake route.
4. If dashboard setting `Verify JWT with legacy secret` is ON, keep sending anon `apikey` + `Authorization` headers from frontend.

## Most Common Failure Modes
1. Origin mismatch in allowlist (response returns `Access-Control-Allow-Origin: null`).
2. OPTIONS handler returns `204` with a body (causes 500 preflight failure).
3. Missing frontend auth headers (`apikey` + `Authorization`) causes 401.
4. Wrong function slug/path in bundle (`server/intake` instead of `make-server-393f2b0a/intake`).
