import { useRef, useState } from 'react';
import { Download, Play } from 'lucide-react';
import { projectId } from '../../utils/supabase/info';
import { storageDownload } from '../../components/photoShare/photoShareKit';
import media from '../../data/collabLabMedia.json';

// Shared by the Collaboration Lab media page (watch-only clip in Connect) and the
// editors' b-roll page (/collaboration-lab/media/b-roll, with downloads).

export type Video = (typeof media.videos)[number] & { preview?: string };

export const BASE = `https://${projectId}.supabase.co/storage/v1/object/public/event-media/collaboration-lab-2026`;
export const videos = media.videos as Video[];
export const broll = videos.filter((v) => v.kind === 'broll');
export const byId = (id: string) => videos.find((v) => v.id === id)!;

export const size = (bytes: number) => (bytes >= 1e9 ? `${(bytes / 1e9).toFixed(1)} GB` : `${Math.max(1, Math.round(bytes / 1e6))} MB`);
const length = (seconds: number) => (seconds >= 90 ? `${Math.round(seconds / 60)} min` : `${seconds} sec`);

export function VideoCard({ video, download = false }: { video: Video; download?: boolean }) {
  const [playing, setPlaying] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);
  const uploaded = video.bytes > 0;
  const titleId = `clb-video-${video.id}`;

  return (
    <li className="clb-video" aria-labelledby={titleId}>
      <div className="clb-video-frame">
        {playing ? (
          <video
            ref={ref}
            src={`${BASE}/${video.preview ?? video.file}`}
            poster={`${BASE}/${video.poster}`}
            controls
            autoPlay
            playsInline
            preload="metadata"
            width={video.width}
            height={video.height}
            aria-label={video.title}
          />
        ) : (
          <button type="button" className="clb-video-play" onClick={() => setPlaying(true)}>
            <img src={`${BASE}/${video.poster}`} alt="" width={1280} height={720} loading="lazy" decoding="async" />
            <span className="clb-video-play-icon" aria-hidden="true">
              <Play size={26} fill="currentColor" />
            </span>
            <span className="sr-only">Play {download ? 'a preview of ' : ''}{video.title}</span>
          </button>
        )}
      </div>
      <div className="clb-video-body">
        <p className="clb-video-meta">
          {length(video.duration)}
          {download ? ' · preview plays here' : ''}
        </p>
        <h3 id={titleId}>{video.title}</h3>
        <p className="clb-video-note">{video.note}</p>
        {download && (
          <div className="clb-video-actions">
            {uploaded ? (
              <a className="rhp-action rhp-action-solid" href={storageDownload(`${BASE}/${video.file}`, video.file)}>
                <Download aria-hidden="true" size={17} />
                Download · {size(video.bytes)}
              </a>
            ) : (
              <span className="clb-video-soon">Download coming soon</span>
            )}
          </div>
        )}
      </div>
    </li>
  );
}
