// Internal reports portal (/internal/reports) — monthly ingest script.
//
// Turns a folder of raw Meta/Facebook Page Insights CSV exports into one row in the
// `report_snapshots` table. Split into two stages on purpose:
//   1. parseReportDir()   — CSVs (+ optional metadata) -> a plain report object
//   2. upsertReportSnapshot() — that object -> Supabase, via the service role key
// If the CSV pull itself gets automated later (e.g. a scheduled Meta Graph API fetch
// instead of a manual export), only stage 1 needs to change — stage 2 stays the same.
//
// Usage:
//   SUPABASE_SERVICE_ROLE_KEY=... node scripts/internal-reports/ingest.mjs \
//     --dir scripts/internal-reports/incoming/social-media-2026-07 \
//     --period 2026-07 --total-audience 1957
//
// Expects --dir to contain: Views.csv, Viewers.csv, Visits.csv, Interactions.csv,
// Follows.csv, Link clicks.csv (the exact filenames Meta's export uses), and
// optionally a downloads.json ([{ "label": "...", "storage_path": "..." }]) for any
// PDF/DOCX briefs already uploaded to the internal-reports storage bucket.

import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

// Public project ref — mirrors src/utils/supabase/info.tsx (not a secret; the anon
// key there is client-safe by design). This script needs the *service role* key,
// which is never committed and must be supplied via env var at run time.
const SUPABASE_PROJECT_ID = 'suqtfbculwuetfdhdgdh';
const REST_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co/rest/v1`;

const CSV_FIELD_MAP = {
  'Views.csv': 'views',
  'Viewers.csv': 'viewers',
  'Visits.csv': 'visits',
  'Interactions.csv': 'interactions',
  'Follows.csv': 'follows',
  'Link clicks.csv': 'link_clicks',
};

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) {
      const key = argv[i].slice(2);
      const value = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true;
      args[key] = value;
    }
  }
  return args;
}

// Meta's exports are UTF-16LE with a BOM and a leading `sep=,` Excel hint line, then a
// single-column metric-title row, then a `"Date","Primary"` header, then data rows.
async function parseMetaCsv(filePath) {
  const buffer = await readFile(filePath);
  const text = buffer.toString('utf16le').replace(/^﻿/, '');
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

  const dataLines = lines.filter((line) => /^"?\d{4}-\d{2}-\d{2}T/.test(line));

  return dataLines.map((line) => {
    const match = line.match(/^"(\d{4}-\d{2}-\d{2})T[^"]*","(-?\d+)"$/);
    if (!match) throw new Error(`Unrecognized CSV row in ${filePath}: ${line}`);
    return { date: match[1], value: Number(match[2]) };
  });
}

export async function parseReportDir(dir, { period, title, dateRange, reportType, totalAudience }) {
  const filesInDir = await readdir(dir);
  const byDate = new Map();

  for (const [filename, field] of Object.entries(CSV_FIELD_MAP)) {
    if (!filesInDir.includes(filename)) {
      throw new Error(`Missing ${filename} in ${dir}`);
    }
    const rows = await parseMetaCsv(path.join(dir, filename));
    for (const { date, value } of rows) {
      if (!byDate.has(date)) byDate.set(date, { date });
      byDate.get(date)[field] = value;
    }
  }

  const daily_metrics = [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));

  const sum = (field) => daily_metrics.reduce((acc, row) => acc + (row[field] ?? 0), 0);
  const summary = {
    total_audience: totalAudience,
    new_follows: sum('follows'),
    total_views: sum('views'),
    total_viewers: sum('viewers'),
    total_visits: sum('visits'),
    total_interactions: sum('interactions'),
    total_link_clicks: sum('link_clicks'),
  };

  let downloads = [];
  if (filesInDir.includes('downloads.json')) {
    downloads = JSON.parse(await readFile(path.join(dir, 'downloads.json'), 'utf8'));
  }

  return {
    report_type: reportType,
    period,
    title,
    date_range: dateRange,
    summary,
    daily_metrics,
    downloads,
  };
}

export async function upsertReportSnapshot(report, serviceRoleKey) {
  const res = await fetch(`${REST_URL}/report_snapshots?on_conflict=report_type,period`, {
    method: 'POST',
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=representation',
    },
    body: JSON.stringify([{ ...report, updated_at: new Date().toISOString() }]),
  });

  if (!res.ok) {
    throw new Error(`Supabase upsert failed: HTTP ${res.status} — ${await res.text()}`);
  }
  return res.json();
}

function defaultDateRange(period) {
  const [year, month] = period.split('-').map(Number);
  const first = new Date(Date.UTC(year, month - 1, 1));
  const last = new Date(Date.UTC(year, month, 0));
  const fmt = (d) => d.toISOString().slice(0, 10);
  return `${fmt(first)} to ${fmt(last)}`;
}

function defaultTitle(period, reportType) {
  const [year, month] = period.split('-').map(Number);
  const monthName = new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString('en-US', {
    month: 'long',
    timeZone: 'UTC',
  });
  const label = reportType === 'social_media' ? 'Social Media' : reportType;
  return `SparkPoint ${label} — ${monthName} ${year}`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!args.dir || !args.period) {
    console.error('Usage: SUPABASE_SERVICE_ROLE_KEY=... node ingest.mjs --dir <path> --period <YYYY-MM> [--total-audience N] [--title "..."] [--date-range "..."] [--report-type social_media]');
    process.exit(1);
  }
  if (!serviceRoleKey) {
    console.error('Missing SUPABASE_SERVICE_ROLE_KEY env var. Get it from Supabase Dashboard > Project Settings > API — never commit it.');
    process.exit(1);
  }

  const reportType = args['report-type'] || 'social_media';
  const totalAudience = args['total-audience'] != null ? Number(args['total-audience']) : null;

  const report = await parseReportDir(path.resolve(args.dir), {
    period: args.period,
    title: args.title || defaultTitle(args.period, reportType),
    dateRange: args['date-range'] || defaultDateRange(args.period),
    reportType,
    totalAudience,
  });

  console.log(`Parsed ${report.daily_metrics.length} daily rows for ${report.period}. Summary:`, report.summary);

  const [saved] = await upsertReportSnapshot(report, serviceRoleKey);
  console.log(`Upserted report_snapshots row ${saved.id} (${saved.report_type}/${saved.period}).`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
