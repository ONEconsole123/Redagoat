import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@/types/database';

export function useUserProfile(userId?: string) {
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Simuler un profil utilisateur pour la démo
  useEffect(() => {
    // Créer un profil factice pour la démo
    const mockProfile: User = {
      id: '1',
      email: 'demo@example.com',
      username: 'DemoUser',
      status: 'available',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    setProfile(mockProfile);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus: 'available' | 'unavailable' | 'invisible') => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('users')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;
      
      // Update local state
      setProfile(prev => prev ? { ...prev, status: newStatus } : null);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return {
    profile,
    loading,
    updateStatus,
    refetch: fetchProfile,
  };
}