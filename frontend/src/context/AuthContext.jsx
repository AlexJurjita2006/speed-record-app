import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);       // utilizatorul auth
  const [profile, setProfile] = useState(null); // profilul public (username, avatar)
  const [loading, setLoading] = useState(true);

  // Încărcăm profilul pe baza userului
  const fetchProfile = async (userId) => {
    if (!userId) return null;
    const { data, error } = await supabase
      .from('profiles')
      .select('username, avatar_url, full_name')
      .eq('id', userId)
      .single();
    if (error) {
      console.error('Eroare la încărcarea profilului:', error);
      return null;
    }
    return data;
  };

  const refreshProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      return;
    }
    const profileData = await fetchProfile(user.id);
    setProfile(profileData);
  }, [user]);

  useEffect(() => {
    let isMounted = true;

    const initSession = async () => {
      try {
        // Forțăm procesarea hash-ului dacă există
        if (window.location.hash || window.location.search) {
          await supabase.auth.getSession();
        }
        const { data: { session } } = await supabase.auth.getSession();
        if (!isMounted) return;
        setUser(session?.user ?? null);
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;
      setUser(session?.user ?? null);
    });

    return () => {
      isMounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // Când user se schimbă, reîncărcăm profilul
  useEffect(() => {
    refreshProfile();
  }, [user, refreshProfile]);

  const signInWithGoogle = useCallback(async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }, []);

  const value = {
    user,
    profile,
    loading,
    signInWithGoogle,
    signOut,
    refreshProfile, // expunem pentru a putea reîncărca după onboarding
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);