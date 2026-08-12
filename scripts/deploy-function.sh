#!/usr/bin/env bash
#
# Guarded deploy for a Supabase edge function.
#
# Why this exists: `supabase functions deploy <slug>` reads
# `<current directory>/supabase/functions/<slug>/`. Nothing marks a directory as
# "the real one", so ANY full checkout of this repo is a live deploy button —
# git worktrees included, since a worktree is a full checkout.
#
# On 2026-08-12 there were seven CLI-valid deploy directories for
# `make-server-393f2b0a` on one machine. Three held a pre-hardening copy of the
# public intake handler; deploying from any of them would have silently removed
# the 16 KB request ceiling and field validation from a live public form, with no
# error and no warning. The strays were deleted, but nothing stops new ones
# appearing — the next worktree recreates the hazard.
#
# So this script refuses to deploy from anywhere except the canonical checkout on
# an up-to-date `main`, and makes you confirm the target project.
#
# Usage:
#   scripts/deploy-function.sh <slug> [--project-ref REF]
#   scripts/deploy-function.sh make-server-393f2b0a
#
#   ALLOW_DIRTY=1    skip the clean-tree check (for a deliberate hotfix)
#   SKIP_CONFIRM=1   skip the interactive prompt (for CI)

set -euo pipefail

DEFAULT_REF="suqtfbculwuetfdhdgdh"
SLUG="${1:-}"
REF="$DEFAULT_REF"

if [[ "${2:-}" == "--project-ref" && -n "${3:-}" ]]; then
  REF="$3"
fi

die() { printf '\nREFUSING TO DEPLOY\n  %s\n\n' "$1" >&2; exit 1; }
ok()  { printf '  ok    %s\n' "$1"; }

[[ -n "$SLUG" ]] || die "No function slug given. Usage: scripts/deploy-function.sh <slug>"

printf '\nGuarded deploy: %s -> project %s\n\n' "$SLUG" "$REF"

# 1. Must be inside a git work tree at all.
git rev-parse --is-inside-work-tree >/dev/null 2>&1 \
  || die "Not inside a git work tree. Run this from the repo root."

# 2. Must NOT be a linked worktree. In a worktree, --git-dir and --git-common-dir
#    differ; in the main checkout they are the same. This is the check that
#    actually catches the historical failure mode.
GIT_DIR_ABS="$(cd "$(git rev-parse --git-dir)" && pwd)"
GIT_COMMON_ABS="$(cd "$(git rev-parse --git-common-dir)" && pwd)"
if [[ "$GIT_DIR_ABS" != "$GIT_COMMON_ABS" ]]; then
  die "This is a linked git worktree, not the canonical checkout.
     worktree git dir : $GIT_DIR_ABS
     repo git dir     : $GIT_COMMON_ABS
     Deploy from the main checkout instead — a stale worktree is exactly how a
     pre-hardening handler would reach production."
fi
ok "canonical checkout (not a worktree)"

# 3. Must be run from the repo root, so the CLI's relative path resolves as expected.
ROOT="$(git rev-parse --show-toplevel)"
[[ "$PWD" == "$ROOT" ]] || die "Run from the repo root ($ROOT), not $PWD."
ok "at repo root"

# 4. Must be on main.
BRANCH="$(git rev-parse --abbrev-ref HEAD)"
[[ "$BRANCH" == "main" ]] || die "On branch '$BRANCH'. Deploy from main, after merging."
ok "on main"

# 5. Must be level with origin/main — not behind (stale code) and not ahead
#    (unreviewed code). Both are reasons not to ship.
git fetch origin main --quiet
BEHIND="$(git rev-list --count HEAD..origin/main)"
AHEAD="$(git rev-list --count origin/main..HEAD)"
[[ "$BEHIND" == "0" ]] || die "$BEHIND commit(s) behind origin/main. Pull first."
[[ "$AHEAD"  == "0" ]] || die "$AHEAD commit(s) ahead of origin/main — unreviewed. Push and merge first."
ok "level with origin/main"

# 6. The function must exist here, and its source must be committed.
DIR="supabase/functions/$SLUG"
[[ -d "$DIR" ]] || die "No such function directory: $DIR
     Functions deploy from supabase/functions/<slug>/ — the slug is the directory name."
ok "function directory exists"

if [[ "${ALLOW_DIRTY:-0}" != "1" ]]; then
  DIRTY="$(git status --porcelain -- "$DIR" | wc -l | tr -d ' ')"
  [[ "$DIRTY" == "0" ]] || die "$DIRTY uncommitted change(s) under $DIR.
     Commit them, or re-run with ALLOW_DIRTY=1 if this is a deliberate hotfix."
  ok "function source is committed"
fi

# 7. Confirm, showing exactly what is about to happen.
printf '\n  slug     : %s\n  source   : %s\n  project  : %s\n  commit   : %s\n\n' \
  "$SLUG" "$ROOT/$DIR" "$REF" "$(git rev-parse --short HEAD)"

if [[ "${SKIP_CONFIRM:-0}" != "1" ]]; then
  read -r -p "Deploy this to production? [y/N] " reply
  [[ "$reply" == "y" || "$reply" == "Y" ]] || die "Cancelled."
fi

supabase functions deploy "$SLUG" --project-ref "$REF"

printf '\nDeployed. Verify it matches the repo with:\n  scripts/check-function-drift.sh\n\n'
