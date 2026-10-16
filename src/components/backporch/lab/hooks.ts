import { useEffect, useRef, useState, type RefObject } from 'react';
import { useReducedMotion } from 'motion/react';
import { useAccessibility } from '../../../context/AccessibilityContext';

/** True when the visitor (system setting or the site's own toggle) wants less motion. */
export function useCalm(): boolean {
  const system = useReducedMotion();
  const { motionPreference } = useAccessibility();
  return Boolean(system) || motionPreference === 'reduce';
}

/** Whether an element is on screen; `once` stops watching after the first sighting. */
export function useInView<T extends Element>(options: { once?: boolean; rootMargin?: string; threshold?: number } = {}): [RefObject<T>, boolean] {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  const { once = false, rootMargin = '0px', threshold = 0.25 } = options;
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        setSeen(entry.isIntersecting);
        if (entry.isIntersecting && once) io.disconnect();
      },
      { rootMargin, threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once, rootMargin, threshold]);
  return [ref, seen];
}

/** A random token this browser keeps, so polls and reactions can be one-per-browser without accounts. */
export function voterToken(): string {
  const KEY = 'porch-voter';
  try {
    const existing = window.localStorage.getItem(KEY);
    if (existing && /^[a-z0-9]{16,64}$/.test(existing)) return existing;
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    const token = Array.from(bytes, (b) => (b % 36).toString(36)).join('') + Date.now().toString(36);
    window.localStorage.setItem(KEY, token);
    return token;
  } catch {
    return Array.from({ length: 24 }, () => Math.floor(Math.random() * 36).toString(36)).join('');
  }
}

export function remember(key: string, value?: string): string | null {
  try {
    if (value !== undefined) window.localStorage.setItem(key, value);
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}
