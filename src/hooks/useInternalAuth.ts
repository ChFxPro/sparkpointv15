import { useEffect, useState } from 'react';
import type { Session } from '@jsr/supabase__supabase-js';
import { supabase } from '../lib/supabaseClient';

export function useInternalAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    supabase.auth.getSession().then(({ data }) => {
      if (!cancelled) {
        setSession(data.session);
        setLoading(false);
      }
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!cancelled) {
        setSession(nextSession);
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
      subscription.subscription.unsubscribe();
    };
  }, []);

  const signIn = (email: string, password: string) =>
    supabase.auth.signInWithPassword({ email, password });

  // Signing out also clears BackPorch drafts autosaved in this browser, so the next
  // person at a shared computer doesn't find them.
  const signOut = () => {
    try {
      for (const key of Object.keys(window.localStorage)) {
        if (key.startsWith('backporch-draft:')) window.localStorage.removeItem(key);
      }
    } catch {
      /* storage unavailable: nothing to clear */
    }
    return supabase.auth.signOut();
  };

  const resetPassword = (email: string) =>
    supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}${import.meta.env.BASE_URL}internal/login`,
    });

  return { session, user: session?.user ?? null, loading, signIn, signOut, resetPassword };
}
