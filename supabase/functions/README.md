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
| ~~`program-triage`~~ · ~~`triage-api`~~ · ~~`probe-headers`~~ | — | **Deleted from the project 2026-08-12.** A program-triage tool built and self-tested 2026-07-31, never rolled out. See below. |
| `server` | **a different repo** — `DataAdmin/Spwebdatahandlingapp` | Do **not** add a `server/` directory here; deploying it would overwrite that project's live function. |
| `make-server-de2b7016` | none | Orphaned Figma-Make auto-deploy, superseded by `server`. Live, with no local way to update it. |

## The 2026-07-31 triage tool, and why it is gone

`program-triage`, `triage-api` and `probe-headers` were deployed on 2026-07-31 as a tool for
sorting SparkPoint's programs into keep / merge / archive. It was self-tested once and never
rolled out — the submissions table held exactly one row, Jeff's own. All three were deleted
from the project on 2026-08-12.

Two things are worth knowing, because they generalise:

- **`program-triage` and `triage-api` both hardcoded a shared dashboard key** (org name plus
  year) which gated an endpoint returning every submission. That is why they were never
  committed here: publishing the literal in a public repo would have removed the last
  friction in front of it. The functions are deleted, so the key is now inert.
- **`gitleaks` did not flag it.** A homemade shared password matches no provider format and
  no entropy rule, so the CI secret scan would have passed those files. See "Secret
  handling" below — this class of secret has to be caught in review.

The tool's genuinely valuable part was the program inventory embedded in its source: all 24
programs with their Listen/Learn/Lead path, format, cluster, whether each appears on the
website or in the 2026 handout, and an evidence assessment of whether it is actually
running. That content was extracted to the Digital Brain vault
(`08-Sources/sparkpoint-program-inventory-2026.md`) before deletion, along with Jeff's
single triage pass. The source itself is backed up outside any repo at
`~/Claude/backups/supabase-suqtfbculwuetfdhdgdh-20260812/`.

## Use the scripts, not the bare CLI

```bash
scripts/deploy-function.sh <slug>        # guarded deploy
scripts/check-function-drift.sh          # is deployed == repo?
```

**`deploy-function.sh`** refuses to run unless you are in the canonical checkout (not a
worktree), at the repo root, on `main`, level with `origin/main`, with the function's source
committed — then shows the slug, path, project and commit and asks for confirmation. The
worktree check is the one that matters: it catches the exact way a pre-hardening handler
could otherwise reach production.

**`check-function-drift.sh`** downloads every deployed function and byte-compares it against
this repo. It is the only check on these functions that cannot be fooled by a renamed
symbol — see the comment at the top of the script for how a grep-based check reported the
*correct* intake handler as unhardened. Read-only. Run it after any deploy, and any time you
are unsure what is actually live.

Functions knowingly sourced from elsewhere (`server`, `make-server-de2b7016`) are declared
inside the drift script so the check can pass green. Anything else reporting `no-source` is
a real finding.

## Deploy hazard: stale duplicate checkouts — resolved 2026-08-12, but it recurs

`supabase functions deploy <slug>` reads `<current directory>/supabase/functions/<slug>/`.
Nothing marks a directory as the real one, so **any full checkout of this repo is a live
deploy button** — and a git worktree is a full checkout.

On 2026-08-12 there were **seven** CLI-valid deploy directories for `make-server-393f2b0a`
on one machine, not the four first counted (the initial search missed `~/.claude/jobs/`).
Three held a pre-SEC-004 copy at 7,461 bytes against the real 11,808:

- `sparkpointv15/.claude/worktrees/resource-directory/` — also held one unmerged commit,
  since preserved on `origin/feat/resource-directory`, plus a `.gitignore` rule now ported here
- `sparkpointv15/.claude/worktrees/mystifying-euler-52c838/`
- `dr_ora/.worktrees/sparkpoint-kyn/` — a sparkpoint worktree parked under an unrelated repo,
  where nothing about the path hinted it could overwrite this project's production endpoint

All non-canonical checkouts were removed, leaving exactly one deploy path. Feature branches
were preserved on `origin` first; only the working copies went.

**This will happen again** — the next worktree recreates it. That is what
`scripts/deploy-function.sh` is for: it refuses to deploy from a linked worktree rather than
relying on anyone remembering. To audit by hand at any time:

```bash
find ~ -type d -path "*/supabase/functions/*" -not -path "*/node_modules/*" -not -path "*/.git/*"
```

## Secret handling

Read secrets from `Deno.env.get(...)`; never hardcode them. Note that the `gitleaks` CI job
catches provider-format credentials and high-entropy strings — it does **not** catch a
homemade shared password like `"orgname2026"`. That class of secret has to be caught in
review.
