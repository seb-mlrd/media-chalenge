'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const initAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (session) {
      const userId = session.user.id;

      const { data: profile, error } = await supabase
        .from('profils')
        .select('nickname, is_admin, id')
        .eq('user_id', userId)
        .single();

      if (!error) {
        setUser({
          user_id: userId,
          id: profile.id,
          email: session.user.email,
          token: session.access_token,
          nickname: profile.nickname,
          is_admin: profile.is_admin,
        });
      }
    } else {
      setUser(null);
    }

    setLoading(false);
  };

  useEffect(() => {
    initAuth();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        initAuth();
      } else {
        setUser(null);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
