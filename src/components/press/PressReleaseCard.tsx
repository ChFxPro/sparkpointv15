import { ArrowRight, Calendar } from 'lucide-react';
import { Link } from 'react-router';
import {
  formatPressDate,
  getPressAsset,
  getPressAssetUrl,
  type PressRelease,
} from '../../data/pressReleases';

interface PressReleaseCardProps {
  release: PressRelease;
  featured?: boolean;
}

export function PressReleaseCard({ release, featured = false }: PressReleaseCardProps) {
  const hero = getPressAsset(release, release.heroImageId);

  if (!hero) return null;

  return (
    <article
      className={
        featured
          ? 'group grid overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm lg:grid-cols-[0.9fr_1.1fr]'
          : 'group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md'
      }
    >
      <div className={featured ? 'bg-[#F7F4EF] p-7 md:p-10' : 'bg-[#F7F4EF] p-6'}>
        <img
          src={getPressAssetUrl(hero)}
          alt={hero.alt}
          width={hero.width}
          height={hero.height}
          loading={featured ? 'eager' : 'lazy'}
          className={
            featured
              ? 'mx-auto h-[24rem] w-full object-contain md:h-[31rem]'
              : 'mx-auto aspect-[4/3] w-full object-contain'
          }
        />
      </div>

      <div className={featured ? 'flex flex-col justify-center p-8 md:p-12' : 'flex flex-1 flex-col p-6'}>
        <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-semibold text-gray-500">
          {release.category ? <span className="text-[#9E509F]">{release.category}</span> : null}
          <span className="inline-flex items-center gap-2">
            <Calendar size={16} aria-hidden="true" />
            <time dateTime={release.datePublished}>{formatPressDate(release.datePublished)}</time>
          </span>
        </div>
        <h2 className={featured ? 'text-3xl font-bold leading-tight text-[#1A1A1A] md:text-4xl' : 'text-2xl font-bold leading-tight text-[#1A1A1A]'}>
          <Link
            to={`/press/${release.slug}`}
            className="rounded-sm outline-none transition-colors group-hover:text-[#E03694] focus-visible:ring-2 focus-visible:ring-[#E03694] focus-visible:ring-offset-4"
          >
            {release.title}
          </Link>
        </h2>
        <p className={featured ? 'mt-5 text-lg leading-8 text-gray-600' : 'mt-4 flex-1 leading-7 text-gray-600'}>
          {release.summary}
        </p>
        <Link
          to={`/press/${release.slug}`}
          className="mt-7 inline-flex w-fit items-center gap-2 rounded-sm font-bold text-[#E03694] outline-none transition-[gap] hover:gap-3 focus-visible:ring-2 focus-visible:ring-[#E03694] focus-visible:ring-offset-4"
        >
          Read the full release <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
