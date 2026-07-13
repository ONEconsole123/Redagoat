import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useFriends } from '@/hooks/useFriends';
import { StatusButton } from '@/components/StatusButton';
import { FriendCard } from '@/components/FriendCard';
import { StatusIndicator } from '@/components/StatusIndicator';
import { router } from 'expo-router';

export default function HomeScreen() {
  const { user } = useAuth();
  const { profile, updateStatus } = useUserProfile(user?.id);
  const { friends, loading: friendsLoading, refetch } = useFriends(user?.id);
  const [refreshing, setRefreshing] = useState(false);

  const handleStatusChange = async () => {
    if (!profile) return;

    const newStatus = profile.status === 'available' ? 'unavailable' : 'available';
    await updateStatus(newStatus);
    
    // Show feedback
    Alert.alert(
      newStatus === 'available' ? 'Tu es dispo ! 🎉' : 'Plus dispo 😴',
      newStatus === 'available' 
        ? 'Tes amis vont être notifiés !'
        : 'Tes amis ne te verront plus disponible'
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const availableFriends = friends.filter(f => f.status === 'available');
  const unavailableFriends = friends.filter(f => f.status !== 'available');

  return (
    <View style={styles.container}>
      {/* Header with permanent status bar */}
      <View style={[styles.statusBar, { backgroundColor: profile.status === 'available' ? '#10B981' : '#EF4444' }]}>
        <View style={styles.statusBarContent}>
          <StatusIndicator status={profile.status} size={16} />
          <Text style={styles.statusBarText}>
            {profile.status === 'available' ? 'Tu peux sortir !' : 'Pas disponible'}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Salut {profile.username} ! 👋</Text>
          <Text style={styles.welcomeSubtext}>
            Change ton statut pour que tes amis sachent si tu peux sortir
          </Text>
        </View>

        <StatusButton
          status={profile.status}
          onPress={handleStatusChange}
        />

        {/* Available Friends */}
        {availableFriends.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              🎉 Disponibles maintenant ({availableFriends.length})
            </Text>
            {availableFriends.map((friend) => (
              <FriendCard
                key={friend.id}
                friend={friend}
                onChatPress={() => router.push(`/(tabs)/chat`)}
              />
            ))}
          </View>
        )}

        {/* All Friends Group Status */}
        {availableFriends.length > 1 && (
          <View style={styles.groupAlert}>
            <Text style={styles.groupAlertText}>
              🔥 Toute la team est dispo ! C'est le moment de sortir !
            </Text>
          </View>
        )}

        {/* Unavailable Friends */}
        {unavailableFriends.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              😴 Pas disponibles ({unavailableFriends.length})
            </Text>
            {unavailableFriends.map((friend) => (
              <FriendCard
                key={friend.id}
                friend={friend}
                onChatPress={() => router.push(`/(tabs)/chat`)}
              />
            ))}
          </View>
        )}

        {friends.length === 0 && !friendsLoading && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>Aucun ami pour le moment 😢</Text>
            <Text style={styles.emptyStateText}>
              Va dans l'onglet "Amis" pour en ajouter !
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  statusBar: {
    paddingTop: 50,
    paddingBottom: 12,
    paddingHorizontal: 20,
  },
  statusBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  content: {
    flex: 1,
  },
  welcomeSection: {
    padding: 20,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  welcomeSubtext: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginHorizontal: 20,
    marginBottom: 12,
  },
  groupAlert: {
    backgroundColor: '#F59E0B',
    marginHorizontal: 20,
    marginVertical: 16,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  groupAlertText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
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
});