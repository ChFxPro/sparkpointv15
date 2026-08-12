const REF = "suqtfbculwuetfdhdgdh";
const PUB = "https://" + REF + ".supabase.co/storage/v1/object/public/triage/";

Deno.serve(async () => {
  const out: unknown[] = [];
  for (const f of ["sort.html", "results-x7q2.html"]) {
    const r = await fetch(PUB + f);
    const t = await r.text();
    out.push({
      url: PUB + f,
      status: r.status,
      contentType: r.headers.get("content-type"),
      contentDisposition: r.headers.get("content-disposition"),
      len: t.length,
      startsWithDoctype: t.startsWith("<!DOCTYPE html>"),
      hasAbsoluteSubmit: t.includes("program-triage?action=submit"),
      hasAbsoluteResults: t.includes("program-triage?action=results"),
    });
  }
  return new Response(JSON.stringify(out, null, 2), { headers: { "Content-Type": "application/json" } });
});
