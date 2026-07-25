import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@/types/database';

export function useFriends(userId?: string) {
  const [friends, setFriends] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Simuler des amis pour la démo
  useEffect(() => {
    const mockFriends: User[] = [
      {
        id: '2',
        email: 'sophie@example.com',
        username: 'Sophie',
        status: 'available',
        status_message: 'Prête pour une soirée !',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '3',
        email: 'alex@example.com',
        username: 'Alex',
        status: 'available',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '4',
        email: 'marie@example.com',
        username: 'Marie',
        status: 'unavailable',
        status_message: 'En cours...',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
    
    setFriends(mockFriends);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    fetchFriends();
    subscribeToStatusUpdates();
  }, [userId]);

  const fetchFriends = async () => {
    try {
      const { data, error } = await supabase
        .from('friendships')
        .select(`
          friend_id,
          users!friendships_friend_id_fkey (
            id,
            username,
            avatar_url,
            status,
            status_message,
            available_at,
            updated_at
          )
        `)
        .eq('user_id', userId)
        .eq('status', 'accepted');

      if (error) throw error;
      
      const friendsData = data.map(item => item.users).filter(Boolean) as User[];
      setFriends(friendsData);
    } catch (error) {
      console.error('Error fetching friends:', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToStatusUpdates = () => {
    const subscription = supabase
      .channel('user-status-updates')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'users',
        filter: `id=in.(${friends.map(f => f.id).join(',')})`
      }, (payload) => {
        const updatedUser = payload.new as User;
        setFriends(prev => 
          prev.map(friend => 
            friend.id === updatedUser.id ? updatedUser : friend
          )
        );
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  return {
    friends,
    loading,
    refetch: fetchFriends,
  };
}