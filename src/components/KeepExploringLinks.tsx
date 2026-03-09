import { Link } from 'react-router';

type KeepExploringLink = {
  to: string;
  label: string;
  description: string;
};

type KeepExploringLinksProps = {
  title?: string;
  intro?: string;
  links: KeepExploringLink[];
  className?: string;
};

export function KeepExploringLinks({
  title = 'Keep Exploring',
  intro = 'Explore the next page that feels most useful for you.',
  links,
  className = '',
}: KeepExploringLinksProps) {
  return (
    <section className={`py-16 px-6 bg-[#F8F6F3] border-t border-[#E7E2DB] ${className}`}>
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">{title}</h2>
        <p className="text-slate-600 mb-8 max-w-2xl">{intro}</p>

        <nav aria-label={`${title} links`}>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {links.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="group block h-full rounded-2xl border border-slate-200 bg-white px-5 py-4 transition-colors hover:border-[#E03694]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E03694]/40"
                >
                  <span className="block font-semibold text-slate-900 group-hover:text-[#E03694]">
                    {link.label}
                  </span>
                  <span className="mt-1 block text-sm text-slate-600">{link.description}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
