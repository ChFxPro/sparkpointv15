import { Link } from "react-router";

export interface RelatedProgramItem {
  to: string;
  kind: string;
  title: string;
  blurb: string;
}

interface RelatedProgramsProps {
  items: RelatedProgramItem[];
}

export function RelatedPrograms({ items }: RelatedProgramsProps) {
  if (items.length === 0) return null;

  return (
    <section className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <h2
          className="mb-6 text-[1.2rem] font-bold tracking-[-0.018em]"
          style={{ color: "var(--program-ink)" }}
        >
          Related
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="group block rounded-2xl border border-black/8 p-5 transition-colors hover:border-[color:var(--program-accent)] hover:bg-[color:var(--program-accent-soft)]"
            >
              <span
                className="mb-2 inline-block text-[0.68rem] font-bold uppercase tracking-[0.12em] opacity-60"
                style={{ color: "var(--program-accent)" }}
              >
                {item.kind}
              </span>
              <span
                className="block text-[0.95rem] font-semibold leading-snug"
                style={{ color: "var(--program-ink)" }}
              >
                {item.title}
              </span>
              <span
                className="mt-1 block text-[0.85rem] leading-6 opacity-70"
                style={{ color: "var(--program-ink)" }}
              >
                {item.blurb}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
