import { ArrowRight, CalendarDays, Users, Video } from 'lucide-react';
import { Sparkmark } from '../components/Sparkmark';

// The WNC Regional Rural Health Virtual Post-Convening Session was held on Thursday,
// November 5, 2026, at 10 a.m. ET on Zoom, for people who attended on October 1. This band
// is now a record of it, between the recap hero and the photo web, and the hero carries a
// small link down to it. The owner may come back with feedback and takeaways from the
// session; add them to this band. The BackPorch post that announced the session was
// unpinned on Nov 5. Don't name a host for the session: the source invite doesn't.

export const POST_SESSION_ID = 'post-convening';

const speakers = [
  'North Carolina Rural Health Association',
  'NC DHHS Office of Rural Health',
  'Impact Health',
  'WNC Health Policy Initiative',
];

export function PostSessionHeroLink() {
  return (
    <a className="rh-next-link" href={`#${POST_SESSION_ID}`}>
      <span className="rh-next-link-tag">Nov 5</span>
      <span>We met again online for the post-convening session</span>
      <ArrowRight aria-hidden="true" size={16} />
    </a>
  );
}

export function PostSessionBand() {
  return (
    <section id={POST_SESSION_ID} className="rh-next" aria-labelledby="rh-next-title">
      <div className="rh-shell rh-next-grid">
        <div className="rh-next-copy">
          <p className="rh-next-kicker">
            <Sparkmark size="1.05em" />
            November 5 · Back together, online
          </p>
          <h2 id="rh-next-title">The conversation kept moving.</h2>
          <p className="rh-next-name">WNC Regional Rural Health Virtual Post-Convening Session</p>
          <p className="rh-next-lede">
            On November 5, people from the October 1 convening came back together online to
            reconnect, carry forward the conversations and partnerships that started at Deerwoode
            Reserve, and share what they need and what they can offer one another.
          </p>
          <div className="rh-next-speakers">
            <p>Attendees heard about upcoming events, opportunities, and resources from</p>
            <ul>
              {speakers.map((speaker) => (
                <li key={speaker}>{speaker}</li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="rh-next-card" aria-label="Session details">
          <div className="rh-next-date" aria-hidden="true">
            <span>Nov</span>
            <strong>05</strong>
            <span>Held</span>
          </div>
          <dl className="rh-next-facts">
            <div>
              <dt>
                <CalendarDays aria-hidden="true" size={17} />
                Date
              </dt>
              <dd>Thursday, November 5, 2026</dd>
            </div>
            <div>
              <dt>
                <Video aria-hidden="true" size={17} />
                Where
              </dt>
              <dd>Online, on Zoom</dd>
            </div>
            <div>
              <dt>
                <Users aria-hidden="true" size={17} />
                Who
              </dt>
              <dd>October 1 convening attendees</dd>
            </div>
          </dl>
          <p className="rh-next-note">
            Thank you to everyone who joined us. We’ll share more from the session here as it
            comes together.
          </p>
        </aside>
      </div>
    </section>
  );
}
