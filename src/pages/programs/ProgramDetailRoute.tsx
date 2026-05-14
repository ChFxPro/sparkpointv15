import { useParams, Link } from "react-router";
import { getProgramBySlug } from "./programsData";
import { SEOHead } from "../../components/SEOHead";
import { ProgramDetailPage } from "./program-shell/ProgramDetailPage";

export default function ProgramDetailRoute() {
  const { slug } = useParams<{ slug: string }>();
  const program = slug ? getProgramBySlug(slug) : undefined;

  if (!program) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 px-6 py-20 text-center">
        <h1 className="text-2xl font-bold text-spark-ink">Program not found</h1>
        <p className="text-spark-soft">
          We couldn't find a program matching{" "}
          <code className="rounded bg-spark-ink/5 px-1.5 py-0.5 text-sm">{slug ?? "this path"}</code>.
        </p>
        <Link
          to="/programs"
          className="mt-2 inline-flex items-center gap-2 rounded-full bg-spark-rose px-6 py-3 text-[0.82rem] font-semibold uppercase tracking-[0.1em] text-white transition-all hover:brightness-105"
        >
          Back to all programs
        </Link>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title={`${program.title} | SparkPoint`}
        description={program.shortDescription}
        path={`/programs/${program.slug}`}
      />
      <ProgramDetailPage program={program} />
    </>
  );
}
