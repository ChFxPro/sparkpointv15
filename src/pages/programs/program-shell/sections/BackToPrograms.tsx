import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";

export function BackToPrograms() {
  return (
    <div className="px-4 pt-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/programs"
          className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-[color:var(--program-ink)] opacity-60 transition-all duration-200 hover:opacity-100 hover:text-[color:var(--program-accent)]"
        >
          <ArrowLeft size={13} aria-hidden="true" />
          All programs
        </Link>
      </div>
    </div>
  );
}
