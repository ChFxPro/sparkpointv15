# Supabase edge functions

**This directory is the only place the Supabase CLI reads.** A function is deployed from
`supabase/functions/<slug>/`, and the slug is the directory name. Anything under `src/`
or in a worktree is not a deploy path.

## Deploy from here, via a PR — not inline

Several functions on project `suqtfbculwuetfdhdgdh` were deployed by passing their source
inline to an MCP `deploy_edge_function` call. The code was generated in-session and never
written to a repo, so as of 2026-08-11 four live functions had **no recoverable source
anywhere on the machine** — the only copy was the one running on Supabase. A redeploy or an
accidental delete would have destroyed them outright.

Inline deploys also bypass every gate on this repo: no PR, no build check, no secret scan,
no history, no diff. Put the source here and ship it through a PR instead.

## What is deployed, and from where

| Function | Source | Notes |
|---|---|---|
| `make-server-393f2b0a` | this directory | Public intake. Carries the SEC-004 hardening (16 KB body ceiling, field validation). |
| `rh-ticket-stock` | this directory | Recovered 2026-08-12. Read-only ticket-stock proxy for the convening page; called by `src/hooks/useRemainingSeats.ts`. |
| `probe-headers` | this directory | Recovered 2026-08-12. One-off debug probe of storage response headers. Almost certainly disposable — see below. |
| `program-triage` | **not in this repo** | Recovered but held: hardcodes a live shared key. See the deploy-hazard note below. |
| `triage-api` | **not in this repo** | Same. |
| `server` | **a different repo** — `DataAdmin/Spwebdatahandlingapp` | Do **not** add a `server/` directory here; deploying it would overwrite that project's live function. |
| `make-server-de2b7016` | none | Orphaned Figma-Make auto-deploy, superseded by `server`. Live, with no local way to update it. |

`probe-headers` was recovered for completeness because it was unrecoverable, not because it
is wanted. It fetches two files from public storage and reports their headers — a debugging
aid from 2026-07-31 with no caller in this codebase. Reasonable to delete from the project
once someone confirms that.

## Deploy hazard: stale duplicate checkouts

As of 2026-08-11 `make-server-393f2b0a` existed in **four** CLI-valid deploy directories.
Three were stale at 7,461 bytes against the real 11,808, and **none of the three contained
the SEC-004 hardening** — deploying from any of them would silently roll back the request
size limit and field validation on a live public form:

- `sparkpointv15/.claude/worktrees/resource-directory/…`
- `sparkpointv15/.claude/worktrees/mystifying-euler-52c838/…`
- `dr_ora/.worktrees/sparkpoint-kyn/…` ← a sparkpoint worktree parked under an unrelated repo

Before running any `supabase functions deploy`, confirm you are in the repo root on `main`,
not in a worktree.

## Secret handling

Read secrets from `Deno.env.get(...)`; never hardcode them. Note that the `gitleaks` CI job
catches provider-format credentials and high-entropy strings — it does **not** catch a
homemade shared password like `"orgname2026"`. That class of secret has to be caught in
review.
