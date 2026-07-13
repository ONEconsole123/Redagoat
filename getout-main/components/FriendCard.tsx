import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { StatusIndicator } from './StatusIndicator';
import { User } from '@/types/database';
import { MessageCircle } from 'lucide-react-native';

interface FriendCardProps {
  friend: User;
  onPress?: () => void;
  onChatPress?: () => void;
}

export function FriendCard({ friend, onPress, onChatPress }: FriendCardProps) {
  const getStatusText = () => {
    switch (friend.status) {
      case 'available':
        return 'Peut sortir !';
      case 'unavailable':
        return 'Pas dispo';
      case 'invisible':
        return 'Hors ligne';
    }
  };

  const getStatusColor = () => {
    switch (friend.status) {
      case 'available':
        return '#10B981';
      case 'unavailable':
        return '#EF4444';
      case 'invisible':
        return '#9CA3AF';
    }
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ 
              uri: friend.avatar_url || `https://api.dicebear.com/7.x/avataaars/png?seed=${friend.username}` 
            }}
            style={styles.avatar}
          />
          <View style={styles.statusBadge}>
            <StatusIndicator status={friend.status} size={16} />
          </View>
        </View>

        <View style={styles.info}>
          <Text style={styles.username}>{friend.username}</Text>
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            {getStatusText()}
          </Text>
          {friend.status_message && (
            <Text style={styles.statusMessage}>{friend.status_message}</Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.chatButton}
          onPress={onChatPress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MessageCircle size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginVertical: 6,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F3F4F6',
  },
  statusBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 2,
  },
  info: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  statusMessage: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  chatButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
  },
});