import { ArrowRight, CalendarDays, Clock3, ExternalLink, Video } from 'lucide-react';
import { Sparkmark } from '../components/Sparkmark';

// The virtual post-convening session (Thursday, November 5, 2026, 10 a.m. ET) for people
// who attended on October 1. Registration is on Zoom. The band and the hero's "Up next"
// link both retire on their own once the session day is over.

export const POST_SESSION_ID = 'post-convening';
const POST_SESSION_REGISTER_URL =
  'https://us02web.zoom.us/meeting/register/06fVIHohSyCuvisOJLrSTg#/registration';
const POST_SESSION_EXPIRES = new Date('2026-11-06T00:00:00-05:00');

const speakers = [
  'North Carolina Rural Health Association',
  'NC DHHS Office of Rural Health',
  'Impact Health',
  'WNC Health Policy Initiative',
];

export function isPostSessionActive(now = new Date()) {
  return now < POST_SESSION_EXPIRES;
}

export function PostSessionHeroLink() {
  if (!isPostSessionActive()) return null;

  return (
    <a className="rh-next-link" href={`#${POST_SESSION_ID}`}>
      <span className="rh-next-link-tag">Up next</span>
      <span>Virtual post-convening session · Thu, Nov 5</span>
      <ArrowRight aria-hidden="true" size={16} />
    </a>
  );
}

export function PostSessionBand() {
  if (!isPostSessionActive()) return null;

  return (
    <section id={POST_SESSION_ID} className="rh-next" aria-labelledby="rh-next-title">
      <div className="rh-shell rh-next-grid">
        <div className="rh-next-copy">
          <p className="rh-next-kicker">
            <Sparkmark size="1.05em" />
            Up next · For everyone who was in the room
          </p>
          <h2 id="rh-next-title">Keep the conversation moving.</h2>
          <p className="rh-next-name">WNC Regional Rural Health Virtual Post-Convening Session</p>
          <p className="rh-next-lede">
            If you joined us on October 1, this is your invitation back. The virtual session is
            a chance to reconnect with other rural health stakeholders and carry forward the
            conversations and partnerships that started at Deerwoode Reserve.
          </p>
          <div className="rh-next-speakers">
            <p>You’ll hear about upcoming events, opportunities, and resources from</p>
            <ul>
              {speakers.map((speaker) => (
                <li key={speaker}>{speaker}</li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="rh-next-card" aria-label="Session details and registration">
          <div className="rh-next-date" aria-hidden="true">
            <span>Nov</span>
            <strong>05</strong>
            <span>Thursday</span>
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
                <Clock3 aria-hidden="true" size={17} />
                Time
              </dt>
              <dd>10:00 a.m. Eastern</dd>
            </div>
            <div>
              <dt>
                <Video aria-hidden="true" size={17} />
                Where
              </dt>
              <dd>Online, on Zoom</dd>
            </div>
          </dl>
          <a
            className="rh-next-register"
            href={POST_SESSION_REGISTER_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Register for the session
            <ExternalLink aria-hidden="true" size={18} />
          </a>
          <p className="rh-next-note">
            Registration is on Zoom. Zoom emails your join link once you register.
          </p>
        </aside>
      </div>
    </section>
  );
}
