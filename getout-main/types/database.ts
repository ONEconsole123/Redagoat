export interface User {
  id: string;
  email: string;
  username: string;
  avatar_url?: string;
  status: 'available' | 'unavailable' | 'invisible';
  status_message?: string;
  available_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Friendship {
  id: string;
  user_id: string;
  friend_id: string;
  status: 'pending' | 'accepted' | 'blocked';
  created_at: string;
}

export interface FriendGroup {
  id: string;
  name: string;
  created_by: string;
  created_at: string;
}

export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  role: 'admin' | 'member';
  joined_at: string;
}

export interface Message {
  id: string;
  content: string;
  sender_id: string;
  recipient_id?: string;
  group_id?: string;
  message_type: 'text' | 'emoji_quick' | 'system';
  created_at: string;
}

export interface StatusUpdate {
  id: string;
  user_id: string;
  old_status: string;
  new_status: string;
  created_at: string;
}