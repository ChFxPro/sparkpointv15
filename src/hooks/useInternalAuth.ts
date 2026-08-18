import { useEffect, useState } from 'react';
import type { Session } from '@jsr/supabase__supabase-js';
import { supabase } from '../lib/supabaseClient';
import type { BackstageAccess } from '../data/backstage';

export type InternalRole = 'pending' | 'staff' | 'board' | 'partner';

const ROLES: readonly InternalRole[] = ['pending', 'staff', 'board', 'partner'];

/* Fallback when the profiles table is missing entirely — i.e. before the
   migration has been applied, when no role system exists and every signed-in
   user could already reach everything. Falling back to 'staff' preserves that
   behavior rather than locking current users out mid-deploy.

   This is NOT the default for new accounts: that is 'pending' and it lives in
   the database (see the migration), which is what actually stops a
   self-registered magic-link user from gaining access. */
const NO_PROFILE_ROW_FALLBACK: InternalRole = 'staff';

function isInternalRole(value: unknown): value is InternalRole {
  return ROLES.includes(value as InternalRole);
}

export function roleCanAccess(role: InternalRole | null, access: BackstageAccess): boolean {
  if (access === 'open') return true;
  if (!role) return false;
  // 'pending' is an account nobody has vouched for yet — it opens nothing.
  if (role === 'pending') return false;
  if (access === 'board') return role === 'board';
  // 'shared' admits external co-organizers; 'member' deliberately does not.
  if (access === 'shared') return true;
  return role === 'staff' || role === 'board';
}

export function useInternalAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<InternalRole | null>(null);
  const [roleLoading, setRoleLoading] = useState(false);

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

  const userId = session?.user?.id ?? null;

  useEffect(() => {
    if (!userId) {
      setRole(null);
      setRoleLoading(false);
      return;
    }

    let cancelled = false;
    setRoleLoading(true);

    void (async () => {
      let resolved: InternalRole = NO_PROFILE_ROW_FALLBACK;
      try {
        const { data } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', userId)
          .maybeSingle();
        if (isInternalRole(data?.role)) {
          resolved = data.role;
        }
      } catch {
        // Network failure — fall through to NO_PROFILE_ROW_FALLBACK.
      }
      if (!cancelled) {
        setRole(resolved);
        setRoleLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const signIn = (email: string, password: string) =>
    supabase.auth.signInWithPassword({ email, password });

  const signOut = () => supabase.auth.signOut();

  /* Points at /internal/login rather than /internal so existing reset emails
     keep working; that route renders Backstage too. */
  const resetPassword = (email: string) =>
    supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}${import.meta.env.BASE_URL}internal/login`,
    });

  return {
    session,
    user: session?.user ?? null,
    role,
    loading,
    roleLoading,
    canAccess: (access: BackstageAccess) => roleCanAccess(role, access),
    signIn,
    signOut,
    resetPassword,
  };
}
