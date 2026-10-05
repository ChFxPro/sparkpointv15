import { Link } from 'react-router';
import { ArrowRight, CalendarDays, MapPin } from 'lucide-react';

// Recap of Dr. Ora's August 10, 2026 library talk, shown on her Brain Health story.
// The talk has passed, so this points readers to SparkPoint rather than registration.
export function DrOraRecentTalk() {
  return (
    <div className="relative mb-12 overflow-hidden rounded-2xl shadow-sm" style={{ background: 'linear-gradient(135deg, #1A1A1A, #2b1730)' }}>
      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#E03694] via-[#FDB515] to-[#F15F48]" aria-hidden="true" />
      <div className="grid grid-cols-1 gap-6 p-7 md:grid-cols-[1fr_auto] md:items-center md:gap-10 md:p-10">
        <div>
          <span className="mb-3 inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#FDB515]">
            <span className="h-2 w-2 rounded-full bg-[#FDB515]" aria-hidden="true" /> Recent talk · August 10, 2026
          </span>
          <h2 className="mb-2 text-2xl font-bold text-white md:text-3xl">Building Healthy Brain Habits</h2>
          <p className="max-w-xl leading-relaxed text-white/70">
            Dr. Ora returned to the Transylvania County Library with the Alzheimer&rsquo;s Association and NC
            Cooperative Extension for an evening of brain health prevention, nutrition guidance, and hands-on
            wellness activities. Thank you to everyone who joined us.
          </p>
          <dl className="mt-5 flex flex-col gap-2 text-sm text-white/70 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2">
            <div className="flex items-center gap-2">
              <CalendarDays size={16} className="text-[#FDB515]" aria-hidden="true" />
              <dt className="sr-only">Date</dt>
              <dd>Monday, August 10, 2026</dd>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-[#FDB515]" aria-hidden="true" />
              <dt className="sr-only">Location</dt>
              <dd>Rogow Family Community Room, Transylvania County Library</dd>
            </div>
          </dl>
        </div>
        <div className="flex flex-shrink-0 flex-col items-start gap-2 md:items-end">
          <Link
            to="/intake?intent=contact"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full px-8 py-3.5 text-base font-bold shadow-lg transition-transform hover:-translate-y-0.5 hover:shadow-xl md:w-auto"
            style={{ background: 'linear-gradient(135deg, #E03694, #9E509F)', color: 'white' }}
          >
            Ask about future talks <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <span className="text-xs text-white/50">Interested in a brain health talk for your group? Let us know.</span>
        </div>
      </div>
    </div>
  );
}
