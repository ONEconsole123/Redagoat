import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { useFriends } from '@/hooks/useFriends';
import { QuickEmojiBar } from '@/components/QuickEmojiBar';
import { Send, Smile } from 'lucide-react-native';

interface ChatMessage {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
  type: 'text' | 'emoji_quick';
}

export default function ChatScreen() {
  const { user } = useAuth();
  const { friends } = useFriends(user?.id);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: 'Salut ! Qui peut sortir ce soir ? 🎉',
      sender: 'Sophie',
      timestamp: new Date(Date.now() - 3600000),
      type: 'text',
    },
    {
      id: '2',
      content: 'Go ?',
      sender: 'current',
      timestamp: new Date(Date.now() - 1800000),
      type: 'emoji_quick',
    },
    {
      id: '3',
      content: 'Moi je peux ! On fait quoi ?',
      sender: 'Alex',
      timestamp: new Date(Date.now() - 900000),
      type: 'text',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [showEmojiBar, setShowEmojiBar] = useState(true);

  const sendMessage = (content: string, type: 'text' | 'emoji_quick' = 'text') => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      sender: 'current',
      timestamp: new Date(),
      type,
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');
  };

  const handleEmojiPress = (emoji: string, message: string) => {
    sendMessage(`${emoji} ${message}`, 'emoji_quick');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Chat de groupe 💬</Text>
        <Text style={styles.subtitle}>
          {friends.filter(f => f.status === 'available').length} amis disponibles
        </Text>
      </View>

      <ScrollView style={styles.messagesContainer}>
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageContainer,
              message.sender === 'current' ? styles.myMessage : styles.otherMessage,
            ]}
          >
            {message.sender !== 'current' && (
              <Text style={styles.senderName}>{message.sender}</Text>
            )}
            <View
              style={[
                styles.messageBubble,
                message.sender === 'current' ? styles.myBubble : styles.otherBubble,
                message.type === 'emoji_quick' && styles.emojiBubble,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  message.sender === 'current' ? styles.myMessageText : styles.otherMessageText,
                  message.type === 'emoji_quick' && styles.emojiMessageText,
                ]}
              >
                {message.content}
              </Text>
            </View>
            <Text style={styles.timestamp}>{formatTime(message.timestamp)}</Text>
          </View>
        ))}
      </ScrollView>

      {showEmojiBar && (
        <QuickEmojiBar onEmojiPress={handleEmojiPress} />
      )}

      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={styles.emojiToggle}
          onPress={() => setShowEmojiBar(!showEmojiBar)}
        >
          <Smile size={24} color={showEmojiBar ? '#F59E0B' : '#9CA3AF'} />
        </TouchableOpacity>

        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Tape ton message..."
          multiline
          maxLength={500}
        />

        <TouchableOpacity
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
          onPress={() => inputText.trim() && sendMessage(inputText)}
          disabled={!inputText.trim()}
        >
          <Send size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    marginBottom: 16,
  },
  myMessage: {
    alignItems: 'flex-end',
  },
  otherMessage: {
    alignItems: 'flex-start',
  },
  senderName: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
    marginHorizontal: 8,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  myBubble: {
    backgroundColor: '#EF4444',
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
  },
  emojiBubble: {
    backgroundColor: '#F59E0B',
  },
  messageText: {
    fontSize: 16,
  },
  myMessageText: {
    color: '#FFFFFF',
  },
  otherMessageText: {
    color: '#1F2937',
  },
  emojiMessageText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 4,
    marginHorizontal: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  emojiToggle: {
    padding: 8,
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
    backgroundColor: '#F9FAFB',
  },
  sendButton: {
    backgroundColor: '#EF4444',
    borderRadius: 20,
    padding: 12,
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});