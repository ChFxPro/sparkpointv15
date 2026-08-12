#!/usr/bin/env bash
#
# Compare every deployed edge function against this repo's copy.
#
# This is the only check on edge functions that can't be fooled. Grepping for a
# hardening symbol looks fine until the symbol gets renamed — on 2026-08-12 a
# check for `MAX_FORM_REQUEST_BYTES` reported the *correct* intake handler as
# unhardened, because the deploy-path version calls it
# `MAX_INTAKE_REQUEST_BYTES`; `MAX_FORM_...` was the name in a shadow copy that
# had already been deleted. A byte comparison against what Supabase is actually
# serving has no such failure mode.
#
# Compares the whole function directory, not just the entrypoint: a function that
# imports a sibling can drift in that file while index.ts still matches.
#
# Reports one of five states per function:
#   match         deployed tree == repo tree (file count and bytes shown)
#   DRIFT         both exist and differ — lists which files, per side
#   expected      deployed, no source here, and that is known and declared
#   no-source     deployed but absent from this repo, and NOT declared — a real finding
#   not-deployed  in this repo but not on the project
#
# The `expected` exemptions describe one project's inventory only. Pointed at any
# other --project-ref they are disabled, since the same slug means something else
# there.
#
# Read-only. Downloads to a temp dir and never writes to the repo or the project.
#
# Usage:
#   scripts/check-function-drift.sh [--project-ref REF]
# Exit codes: 0 all match · 1 drift or missing source found · 2 setup problem

set -euo pipefail

PROD_REF="suqtfbculwuetfdhdgdh"
REF="$PROD_REF"
if [[ "${1:-}" == "--project-ref" ]]; then
  [[ -n "${2:-}" ]] || { echo "--project-ref needs a value" >&2; exit 2; }
  REF="$2"
fi

command -v supabase >/dev/null 2>&1 || { echo "supabase CLI not found" >&2; exit 2; }
ROOT="$(git rev-parse --show-toplevel 2>/dev/null)" || { echo "not in a git repo" >&2; exit 2; }

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

printf '\nEdge function drift check — project %s\n\n' "$REF"

# Functions deliberately not sourced from this repo. A permanently-red check is a
# check people stop reading, so these are declared rather than reported forever.
# Anything NOT listed here that turns up no-source is a real finding.
#
# These describe ONE project's inventory — the production ref below. Pointed at any
# other project, the same slug means something else entirely, so the exemptions are
# not applied and every sourceless function is reported. Add a new block per
# project if this is ever needed elsewhere.
declare -A EXPECTED_NO_SOURCE=()
if [[ "$REF" == "$PROD_REF" ]]; then
  EXPECTED_NO_SOURCE=(
    [server]="owned by DataAdmin/Spwebdatahandlingapp (same project ref) — do NOT add supabase/functions/server/ here"
    [make-server-de2b7016]="orphaned Figma-Make auto-deploy, superseded by 'server'; live but not locally updatable"
  )
else
  printf '  note: --project-ref is not the production project, so no-source\n'
  printf '        exemptions are disabled; every sourceless function is reported.\n\n'
fi


# Deployed slugs, parsed from the CLI's table output.
DEPLOYED="$(supabase functions list --project-ref "$REF" 2>/dev/null \
  | awk -F'|' 'NR>1 && NF>3 {gsub(/ /,"",$3); if ($3 != "" && $3 != "SLUG" && $3 !~ /^-+$/) print $3}' | sort -u)"

[[ -n "$DEPLOYED" ]] || { echo "Could not list functions (auth? project ref?)" >&2; exit 2; }

LOCAL="$(cd "$ROOT" && ls -1 supabase/functions 2>/dev/null | while read -r d; do
  [[ -d "supabase/functions/$d" ]] && echo "$d"; done | sort -u)"

problems=0

for slug in $DEPLOYED; do
  repo_file=""
  for cand in "$ROOT/supabase/functions/$slug/index.ts" "$ROOT/supabase/functions/$slug/index.tsx"; do
    [[ -f "$cand" ]] && repo_file="$cand" && break
  done

  if [[ -z "$repo_file" ]]; then
    if [[ -n "${EXPECTED_NO_SOURCE[$slug]:-}" ]]; then
      printf '  %-24s expected    %s\n' "$slug" "${EXPECTED_NO_SOURCE[$slug]}"
    else
      printf '  %-24s no-source   deployed, but absent from this repo\n' "$slug"
      problems=$((problems+1))
    fi
    continue
  fi

  ( cd "$TMP" && supabase functions download "$slug" --project-ref "$REF" >/dev/null 2>&1 ) || {
    printf '  %-24s ERROR       could not download\n' "$slug"
    problems=$((problems+1)); continue; }

  # Compare the WHOLE function directory, not just the entrypoint. A function that
  # imports a sibling (helper, template, kv_store) can drift in that file while
  # index.ts matches, which an entrypoint-only check would call clean.
  dl_dir="$TMP/supabase/functions/$slug"
  if [[ ! -d "$dl_dir" ]]; then
    printf '  %-24s ERROR       download produced no directory\n' "$slug"
    problems=$((problems+1)); continue
  fi

  # -r recurses; .DS_Store is a Finder artifact, never a deployment input.
  DIFF_OUT="$(diff -r -q -x '.DS_Store' "$dl_dir" "$ROOT/supabase/functions/$slug" 2>&1 || true)"

  if [[ -z "$DIFF_OUT" ]]; then
    nfiles=$(find "$ROOT/supabase/functions/$slug" -type f ! -name '.DS_Store' | wc -l | tr -d ' ')
    nbytes=$(find "$ROOT/supabase/functions/$slug" -type f ! -name '.DS_Store' -exec cat {} + | wc -c | tr -d ' ')
    printf '  %-24s match       %s file(s), %s bytes\n' "$slug" "$nfiles" "$nbytes"
  else
    printf '  %-24s DRIFT\n' "$slug"
    printf '%s\n' "$DIFF_OUT" | sed 's|'"$dl_dir"'|<deployed>|g; s|'"$ROOT"'/supabase/functions/'"$slug"'|<repo>|g; s/^/                             /'
    problems=$((problems+1))
  fi
done

# Anything here but not deployed — usually fine (recovered source for a deleted
# function), but worth surfacing so it is a decision rather than a surprise.
for slug in $LOCAL; do
  grep -qx "$slug" <<< "$DEPLOYED" || printf '  %-24s not-deployed in repo only\n' "$slug"
done

printf '\n'
if [[ "$problems" -gt 0 ]]; then
  printf '%d function(s) need attention.\n\n' "$problems"; exit 1
fi
printf 'All deployed functions match this repo.\n\n'
