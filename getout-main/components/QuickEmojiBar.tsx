import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';

interface QuickEmojiBarProps {
  onEmojiPress: (emoji: string, message: string) => void;
}

const QUICK_EMOJIS = [
  { emoji: '🎉', message: 'Go ?' },
  { emoji: '🍺', message: 'On sort ?' },
  { emoji: '❌', message: 'Je peux pas' },
  { emoji: '⏰', message: 'Plus tard ?' },
  { emoji: '🏠', message: 'Chez moi ?' },
  { emoji: '🎬', message: 'Ciné ?' },
  { emoji: '🍕', message: 'Resto ?' },
  { emoji: '💃', message: 'Soirée ?' },
];

export function QuickEmojiBar({ onEmojiPress }: QuickEmojiBarProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {QUICK_EMOJIS.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.emojiButton}
          onPress={() => onEmojiPress(item.emoji, item.message)}
          activeOpacity={0.7}
        >
          <Text style={styles.emoji}>{item.emoji}</Text>
          <Text style={styles.message}>{item.message}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    maxHeight: 80,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  emojiButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    marginRight: 8,
    minWidth: 60,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  emoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  message: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '500',
  },
});