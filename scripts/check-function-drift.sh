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
# Reports one of four states per function:
#   match     deployed bytes == repo bytes
#   DRIFT     both exist and differ — someone deployed from somewhere else
#   no-source deployed but not in this repo (nothing here can update it)
#   not-deployed  in this repo but not on the project
#
# Read-only. Downloads to a temp dir and never writes to the repo or the project.
#
# Usage:
#   scripts/check-function-drift.sh [--project-ref REF]
# Exit codes: 0 all match · 1 drift or missing source found · 2 setup problem

set -euo pipefail

REF="${2:-suqtfbculwuetfdhdgdh}"
[[ "${1:-}" == "--project-ref" && -n "${2:-}" ]] && REF="$2"

command -v supabase >/dev/null 2>&1 || { echo "supabase CLI not found" >&2; exit 2; }
ROOT="$(git rev-parse --show-toplevel 2>/dev/null)" || { echo "not in a git repo" >&2; exit 2; }

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

printf '\nEdge function drift check — project %s\n\n' "$REF"

# Deployed slugs, parsed from the CLI's table output.
DEPLOYED="$(supabase functions list --project-ref "$REF" 2>/dev/null \
  | awk -F'|' 'NR>1 && NF>3 {gsub(/ /,"",$3); if ($3 != "" && $3 != "SLUG" && $3 !~ /^-+$/) print $3}' | sort -u)"

[[ -n "$DEPLOYED" ]] || { echo "Could not list functions (auth? project ref?)" >&2; exit 2; }

LOCAL="$(cd "$ROOT" && ls -1 supabase/functions 2>/dev/null | while read -r d; do
  [[ -d "supabase/functions/$d" ]] && echo "$d"; done | sort -u)"

# Functions deliberately not sourced from this repo. A permanently-red check is a
# check people stop reading, so these are declared rather than reported forever.
# Anything NOT listed here that turns up no-source is a real finding.
declare -A EXPECTED_NO_SOURCE=(
  [server]="owned by DataAdmin/Spwebdatahandlingapp (same project ref) — do NOT add supabase/functions/server/ here"
  [make-server-de2b7016]="orphaned Figma-Make auto-deploy, superseded by 'server'; live but not locally updatable"
)

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

  dl=""
  for cand in "$TMP/supabase/functions/$slug/index.ts" "$TMP/supabase/functions/$slug/index.tsx"; do
    [[ -f "$cand" ]] && dl="$cand" && break
  done

  if [[ -z "$dl" ]]; then
    printf '  %-24s ERROR       download produced no entrypoint\n' "$slug"
    problems=$((problems+1))
  elif diff -q "$dl" "$repo_file" >/dev/null 2>&1; then
    printf '  %-24s match       %s bytes\n' "$slug" "$(wc -c < "$repo_file" | tr -d ' ')"
  else
    printf '  %-24s DRIFT       deployed %s B vs repo %s B\n' "$slug" \
      "$(wc -c < "$dl" | tr -d ' ')" "$(wc -c < "$repo_file" | tr -d ' ')"
    printf '  %-24s             diff: diff <(supabase functions download %s) %s\n' "" "$slug" "${repo_file#"$ROOT"/}"
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
