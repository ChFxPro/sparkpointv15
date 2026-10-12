import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useReducedMotion } from 'motion/react';
import { SPARKMARK_URL } from '../components/Sparkmark';

const BASE = import.meta.env.BASE_URL;

// Matches the projection `world-dots.svg` was generated with: equirectangular,
// 1000 units wide, cropped to 78°N–58°S.
const W = 1000;
const TOP = 78;
const BOTTOM = -58;
const H = Math.round(((TOP - BOTTOM) / 360) * W);

function project(lon: number, lat: number): [number, number] {
  return [((lon + 180) / 360) * W, ((TOP - lat) / (TOP - BOTTOM)) * H];
}

// Home base: Transylvania County, NC (marked at the county seat).
const HOME = project(-82.73, 35.23);

// ILLUSTRATIVE ONLY — these are spread across the map to suggest "anywhere",
// not the actual auction trips. Replace with the real destinations (and add
// labels) once the lineup is announced.
const ROUTES: Array<[number, number]> = [
  [-64, 17],
  [-71, -41],
  [-19, 64],
  [12, 43],
  [37, -3],
  [139, 36],
  [115, -8],
  [171, -43],
];

function arc([x1, y1]: [number, number], [x2, y2]: [number, number]) {
  const distance = Math.hypot(x2 - x1, y2 - y1);
  const cx = (x1 + x2) / 2;
  const cy = Math.max(6, (y1 + y2) / 2 - distance * 0.32);
  return `M${x1.toFixed(1)} ${y1.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
}

export function GalaRouteMap() {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const routes = ROUTES.map(([lon, lat]) => {
    const end = project(lon, lat);
    return { end, d: arc(HOME, end) };
  });

  return (
    <div ref={ref} className={visible ? 'gala-map is-visible' : 'gala-map'}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby="gala-map-title">
        <title id="gala-map-title">
          Eight illustrative travel routes leaving Transylvania County, North Carolina for destinations
          around the world, with the giveback travelling home.
        </title>
        <image href={`${BASE}assets/events/gala/world-dots.svg`} width={W} height={H} opacity="0.55" />

        {routes.map((route, index) => (
          <g key={index} style={{ '--i': index } as CSSProperties}>
            <path className="gala-map-route" d={route.d} pathLength={1} />
            <circle className="gala-map-dest" cx={route.end[0]} cy={route.end[1]} r="4.5" />
            <text className="gala-map-num" x={route.end[0]} y={route.end[1] - 10}>
              {String(index + 1).padStart(2, '0')}
            </text>
            {visible && !reduceMotion ? (
              <>
                <circle r="2.6" className="gala-map-out">
                  <animateMotion
                    dur={`${4.2 + (index % 3) * 0.7}s`}
                    begin={`${1.2 + index * 0.35}s`}
                    repeatCount="indefinite"
                    path={route.d}
                  />
                </circle>
                <circle r="2.6" className="gala-map-home">
                  <animateMotion
                    dur={`${4.2 + (index % 3) * 0.7}s`}
                    begin={`${3.2 + index * 0.35}s`}
                    repeatCount="indefinite"
                    keyPoints="1;0"
                    keyTimes="0;1"
                    calcMode="linear"
                    path={route.d}
                  />
                </circle>
              </>
            ) : null}
          </g>
        ))}

        <g className="gala-map-homebase" transform={`translate(${HOME[0]} ${HOME[1]})`}>
          <circle className="gala-map-pulse" r="7" />
          <circle className="gala-map-pulse gala-map-pulse-2" r="7" />
          <circle r="9" className="gala-map-home-halo" />
          <image href={SPARKMARK_URL} x="-12" y="-12" width="24" height="24" />
          <text x="-15" y="26" textAnchor="end">Transylvania County, NC</text>
        </g>
      </svg>
      <div className="gala-map-legend">
        <span><i className="is-out" /> The trips go out</span>
        <span><i className="is-home" /> The giveback comes home</span>
        <span className="gala-map-note">Routes are illustrative. The eight destinations are announced before the Gala.</span>
      </div>
    </div>
  );
}
