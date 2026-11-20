// The Gala page's section bar (Jeff, 2026-11-20: easier in-page navigation). It
// sits right under the hero and then sticks under the site header (80px, fixed),
// lighting the section the reader is in. On phones it's a row of chips that
// scrolls sideways inside itself, and the lit chip keeps itself in view.
// Targets need `scroll-margin-top` (gala.css) so a jump lands below both bars.

import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { GALA_TICKETS_URL } from '../data/events';

// `from` is where a section starts lighting: the trips start at the route map,
// whose trailer opens them.
const SECTIONS = [
  { id: 'music', label: 'The evening' },
  { id: 'trips', label: 'The trips', from: 'routes' },
  { id: 'passport', label: 'How it works' },
  { id: 'faq', label: 'Questions' },
  { id: 'getting-there', label: 'Getting there' },
];

export function GalaJumpNav() {
  const [active, setActive] = useState<string | null>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Light the section whose top has passed the bars, until the next one does.
  useEffect(() => {
    const targets = SECTIONS.map((section) => ({
      id: section.id,
      start: document.getElementById('from' in section && section.from ? section.from : section.id),
      end: document.getElementById(section.id),
    })).filter((t) => t.start && t.end) as { id: string; start: HTMLElement; end: HTMLElement }[];
    if (!targets.length) return;
    const onScroll = () => {
      const line = 170;
      let current: string | null = null;
      for (const t of targets) {
        if (t.start.getBoundingClientRect().top <= line) current = t.id;
      }
      // Past the last section's end, nothing is lit.
      const last = targets[targets.length - 1];
      if (current === last.id && last.end.getBoundingClientRect().bottom < line) current = null;
      setActive(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  // On phones, keep the lit chip in view inside the sideways-scrolling row.
  useEffect(() => {
    const list = listRef.current;
    const chip = active ? list?.querySelector<HTMLElement>(`[data-id="${active}"]`) : null;
    if (!list || !chip || list.scrollWidth <= list.clientWidth) return;
    const left = chip.offsetLeft - (list.clientWidth - chip.offsetWidth) / 2;
    list.scrollTo({ left: Math.max(0, left), behavior: 'smooth' });
  }, [active]);

  return (
    <nav className="gala-jump" aria-label="On this page">
      <div className="gala-shell gala-jump-inner">
        <ul ref={listRef} className="gala-jump-list">
          {SECTIONS.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                data-id={section.id}
                className={active === section.id ? 'is-active' : undefined}
                aria-current={active === section.id ? 'location' : undefined}
              >
                {section.label}
              </a>
            </li>
          ))}
        </ul>
        {GALA_TICKETS_URL ? (
          <a className="gala-jump-tickets" href={GALA_TICKETS_URL} target="_blank" rel="noopener noreferrer">
            Get tickets <ArrowRight aria-hidden="true" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        ) : null}
      </div>
    </nav>
  );
}
