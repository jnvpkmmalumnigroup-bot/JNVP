import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { api } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children, initialAuth = null }) {
  const [session, setSession] = useState(initialAuth?.session ?? null);
  const [profile, setProfile] = useState(initialAuth?.profile ?? null);
  const [loading, setLoading] = useState(initialAuth ? false : isSupabaseConfigured);

  const token = session?.access_token ?? null;

  const refreshProfile = useCallback(
    async (accessToken = token) => {
      if (!accessToken) {
        setProfile(null);
        return null;
      }
      try {
        const data = await api.getMyProfile(accessToken);
        setProfile(data);
        return data;
      } catch (err) {
        if (err.status === 404) {
          setProfile(null);
          return null;
        }
        return null;
      }
    },
    [token]
  );

  useEffect(() => {
    if (initialAuth || !isSupabaseConfigured || !supabase) {
      return;
    }

    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      const currentSession = data?.session ?? null;
      setSession(currentSession);
      if (currentSession?.access_token) {
        // Pre-warm Render backend on sign-in
        api.health().catch(() => {});
        refreshProfile(currentSession.access_token).finally(() => {
          if (mounted) setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return;
      setSession(nextSession);
      if (nextSession?.access_token) {
        api.health().catch(() => {});
        refreshProfile(nextSession.access_token);
      } else {
        setProfile(null);
      }
    });

    return () => {
      mounted = false;
      listener?.subscription?.unsubscribe();
    };
  }, [initialAuth, refreshProfile]);

  const signInWithGoogle = async () => {
    if (!supabase) {
      return {
        error: null,
        message: 'Supabase Auth is not configured in local preview. Set VITE_SUPABASE_URL to enable Google OAuth.'
      };
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/onboarding` }
    });
    return { error };
  };

  const signInWithMagicLink = async (email) => {
    if (!supabase) {
      return {
        error: null,
        message: `Magic link preview prepared for ${email}. Configure VITE_SUPABASE_URL to send live emails.`
      };
    }
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/onboarding` }
    });
    return { error };
  };

  const signOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setSession(null);
    setProfile(null);
  };

  const value = {
    session,
    user: session?.user ?? null,
    token,
    profile,
    loading,
    setProfile,
    setSession,
    refreshProfile,
    signInWithGoogle,
    signInWithMagicLink,
    signOut
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
