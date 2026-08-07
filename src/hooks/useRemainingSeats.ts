import { useEffect, useState } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

const TICKET_STOCK_ENDPOINT = `https://${projectId}.supabase.co/functions/v1/rh-ticket-stock`;

export function useRemainingSeats() {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch(TICKET_STOCK_ENDPOINT, {
      headers: { apikey: publicAnonKey, Authorization: `Bearer ${publicAnonKey}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
      .then((data: { remaining?: unknown }) => {
        if (!cancelled && typeof data.remaining === 'number') {
          setRemaining(data.remaining);
        }
      })
      .catch(() => {
        // Live count unavailable — callers fall back to the static total.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return remaining;
}
