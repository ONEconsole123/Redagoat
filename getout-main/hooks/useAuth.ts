import { useEffect, useState } from 'react';
import { supabase, hasValidCredentials } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hasValidCredentials || !supabase) {
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!hasValidCredentials || !supabase) {
      return { 
        data: null, 
        error: { message: 'Supabase not configured. Please connect to Supabase first.' } 
      };
    }
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { data, error };
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Network error. Please check your connection and try again.' } 
      };
    }
  };

  const signUp = async (email: string, password: string, username: string) => {
    if (!hasValidCredentials || !supabase) {
      return { 
        data: null, 
        error: { message: 'Supabase not configured. Please connect to Supabase first.' } 
      };
    }
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          }
        }
      });
      return { data, error };
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Network error. Please check your connection and try again.' } 
      };
    }
  };

  const signOut = async () => {
    if (!hasValidCredentials || !supabase) {
      return { error: null };
    }
    
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      return { error: null }; // Ignore sign out errors
    }
  };

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };
}