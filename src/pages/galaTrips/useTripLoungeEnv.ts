import { useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { useAccessibility } from '../../context/AccessibilityContext';

// What the visitor's device and settings allow the trips lounge to do.
//
// - motion: false under the OS "reduce motion" setting or the site's own motion
//   toggle. No video plays and the poster stills don't drift.
// - data: false when the browser asks to save data (Save-Data) or the
//   connection is 2G. Cards keep their poster stills and no video file is fetched.
// - hover: a mouse or trackpad. Cards come alive on hover or focus; on touch
//   screens the card nearest the middle of the screen does instead.

interface NetworkInformationLike {
  saveData?: boolean;
  effectiveType?: string;
  addEventListener?: (type: 'change', listener: () => void) => void;
  removeEventListener?: (type: 'change', listener: () => void) => void;
}

function connection(): NetworkInformationLike | undefined {
  if (typeof navigator === 'undefined') return undefined;
  return (navigator as Navigator & { connection?: NetworkInformationLike }).connection;
}

function dataAllowed() {
  const c = connection();
  if (!c) return true;
  if (c.saveData) return false;
  return c.effectiveType !== 'slow-2g' && c.effectiveType !== '2g';
}

const HOVER_QUERY = '(hover: hover) and (pointer: fine)';

export function useTripLoungeEnv() {
  const systemReduced = useReducedMotion();
  const { motionPreference } = useAccessibility();
  const motion = !systemReduced && motionPreference !== 'reduce';

  const [data, setData] = useState(true);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    setData(dataAllowed());
    const c = connection();
    const onChange = () => setData(dataAllowed());
    c?.addEventListener?.('change', onChange);

    const mq = window.matchMedia(HOVER_QUERY);
    setHover(mq.matches);
    const onHover = () => setHover(mq.matches);
    mq.addEventListener('change', onHover);
    return () => {
      c?.removeEventListener?.('change', onChange);
      mq.removeEventListener('change', onHover);
    };
  }, []);

  return { motion, data, hover, video: motion && data };
}
