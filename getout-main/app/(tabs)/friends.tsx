import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { useFriends } from '@/hooks/useFriends';
import { FriendCard } from '@/components/FriendCard';
import { Search, UserPlus, QrCode } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';

export default function FriendsScreen() {
  const { user } = useAuth();
  const { friends, loading, refetch } = useFriends(user?.id);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const searchUsers = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, username, avatar_url, status')
        .ilike('username', `%${query}%`)
        .neq('id', user?.id)
        .limit(10);

      if (error) throw error;
      
      // Filter out existing friends
      const friendIds = friends.map(f => f.id);
      const filteredResults = data.filter(u => !friendIds.includes(u.id));
      setSearchResults(filteredResults);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setSearching(false);
    }
  };

  const sendFriendRequest = async (friendId: string) => {
    try {
      const { error } = await supabase
        .from('friendships')
        .insert({
          user_id: user?.id,
          friend_id: friendId,
          status: 'accepted' // For MVP, auto-accept friend requests
        });

      if (error) throw error;

      Alert.alert('Succès !', 'Ami ajouté avec succès !');
      setSearchQuery('');
      setSearchResults([]);
      refetch();
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'ajouter cet ami');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mes amis ({friends.length})</Text>
        <Text style={styles.subtitle}>Voir qui peut sortir avec toi !</Text>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Search size={20} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Chercher des amis..."
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              searchUsers(text);
            }}
          />
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Search Results */}
        {searchResults.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Résultats de recherche</Text>
            {searchResults.map((user: any) => (
              <View key={user.id} style={styles.searchResult}>
                <FriendCard friend={user} />
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => sendFriendRequest(user.id)}
                >
                  <UserPlus size={20} color="#FFFFFF" />
                  <Text style={styles.addButtonText}>Ajouter</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Friends List */}
        {friends.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tes amis</Text>
            {friends.map((friend) => (
              <FriendCard
                key={friend.id}
                friend={friend}
                onChatPress={() => {
                  // Navigate to chat with this friend
                }}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>👥</Text>
            <Text style={styles.emptyStateTitle}>Aucun ami pour le moment</Text>
            <Text style={styles.emptyStateText}>
              Commence par chercher tes amis avec leur pseudo !
            </Text>
          </View>
        )}

        {/* Quick Add Section */}
        <View style={styles.quickAddSection}>
          <TouchableOpacity style={styles.quickAddButton}>
            <QrCode size={24} color="#F59E0B" />
            <Text style={styles.quickAddText}>Code QR</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  searchSection: {
    padding: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 16,
    color: '#1F2937',
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginHorizontal: 20,
    marginBottom: 12,
  },
  searchResult: {
    position: 'relative',
  },
  addButton: {
    position: 'absolute',
    right: 30,
    top: '50%',
    transform: [{ translateY: -20 }],
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  quickAddSection: {
    padding: 20,
    alignItems: 'center',
  },
  quickAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#F59E0B',
    borderStyle: 'dashed',
  },
  quickAddText: {
    color: '#F59E0B',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});