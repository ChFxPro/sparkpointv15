import * as DialogPrimitive from '@radix-ui/react-dialog@1.1.6';
import { X } from 'lucide-react';
import type { GalaTrip } from '../../data/galaTrips';
import { tripMedia, tripVideoSrc } from '../../data/galaTripMedia';

// The full trip film, with sound, in a modal player. Loaded lazily: neither this
// code nor the film is fetched until someone presses Watch the film. Radix keeps
// focus inside the dialog and closes it on Esc; the player's own controls carry
// play, volume, captions and full screen. Caption tracks come from the pack
// (`<id>-film-16x9-web.vtt`) when it has them.

const LANG_LABEL: Record<string, string> = { en: 'English', es: 'Español' };

export default function TripFilmDialog({ trip, onClose }: { trip: GalaTrip; onClose: () => void }) {
  const media = tripMedia(trip.id);
  if (!media?.film) return null;
  const titleId = `trip-film-${trip.id}-title`;

  return (
    <DialogPrimitive.Root open onOpenChange={(open) => (open ? undefined : onClose())}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="gala-film-overlay" />
        <DialogPrimitive.Content
          className="gala-film"
          aria-labelledby={titleId}
          aria-describedby={undefined}
          onCloseAutoFocus={(event) => event.preventDefault()}
        >
          <div className="gala-film-head">
            <DialogPrimitive.Title id={titleId} className="gala-film-title">
              <span>Connection {trip.connection}</span>
              <span className="sr-only">: </span>
              {trip.title}
            </DialogPrimitive.Title>
            <DialogPrimitive.Close className="gala-film-close" aria-label="Close the film">
              <X aria-hidden="true" size={18} />
              <span aria-hidden="true">Close</span>
            </DialogPrimitive.Close>
          </div>
          <div className="gala-film-frame">
            {/* Sound on: the visitor asked for the film. */}
            <video
              className="gala-film-video"
              src={tripVideoSrc(media.film)}
              controls
              autoPlay
              playsInline
              preload="auto"
              poster={media.poster ? tripVideoSrc(media.poster) : undefined}
            >
              {(media.captions ?? []).map((track, index) => (
                <track
                  key={track.file}
                  kind="captions"
                  src={tripVideoSrc(track.file)}
                  srcLang={track.lang}
                  label={LANG_LABEL[track.lang] ?? track.lang}
                  default={index === 0}
                />
              ))}
            </video>
          </div>
          {media.credit ? <p className="gala-film-credit">Video: {media.credit}</p> : null}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
