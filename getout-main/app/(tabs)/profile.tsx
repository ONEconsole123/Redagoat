import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { StatusIndicator } from '@/components/StatusIndicator';
import { LogOut, Settings, CreditCard as Edit3, Bell, Eye, EyeOff } from 'lucide-react-native';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const { profile, updateStatus } = useUserProfile(user?.id);
  const [editing, setEditing] = useState(false);
  const [statusMessage, setStatusMessage] = useState(profile?.status_message || '');

  const handleSignOut = async () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Déconnexion', 
          style: 'destructive',
          onPress: async () => {
            await signOut();
          }
        },
      ]
    );
  };

  const toggleInvisibleMode = () => {
    if (!profile) return;
    
    const newStatus = profile.status === 'invisible' ? 'unavailable' : 'invisible';
    updateStatus(newStatus);
    
    Alert.alert(
      newStatus === 'invisible' ? 'Mode invisible activé 👻' : 'Mode invisible désactivé ✅',
      newStatus === 'invisible' 
        ? 'Tu peux voir tes amis mais ils ne voient pas ton statut'
        : 'Tes amis peuvent maintenant voir ton statut'
    );
  };

  if (!profile) return null;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ 
              uri: profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/png?seed=${profile.username}` 
            }}
            style={styles.avatar}
          />
          <View style={styles.statusBadge}>
            <StatusIndicator status={profile.status} size={20} />
          </View>
        </View>
        
        <Text style={styles.username}>{profile.username}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <View style={styles.content}>
        {/* Status Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mon statut</Text>
          
          <View style={styles.statusCard}>
            <View style={styles.statusInfo}>
              <StatusIndicator status={profile.status} size={16} />
              <Text style={styles.statusText}>
                {profile.status === 'available' ? 'Disponible' : 
                 profile.status === 'invisible' ? 'Invisible' : 'Pas disponible'}
              </Text>
            </View>
            
            {editing ? (
              <View style={styles.editContainer}>
                <TextInput
                  style={styles.statusInput}
                  value={statusMessage}
                  onChangeText={setStatusMessage}
                  placeholder="Message de statut..."
                  maxLength={50}
                />
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={() => {
                    setEditing(false);
                    // TODO: Save status message to database
                  }}
                >
                  <Text style={styles.saveButtonText}>Enregistrer</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setEditing(true)}
              >
                <Edit3 size={16} color="#6B7280" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Options</Text>
          
          <TouchableOpacity style={styles.option} onPress={toggleInvisibleMode}>
            {profile.status === 'invisible' ? (
              <EyeOff size={20} color="#9CA3AF" />
            ) : (
              <Eye size={20} color="#6B7280" />
            )}
            <Text style={styles.optionText}>
              {profile.status === 'invisible' ? 'Désactiver mode invisible' : 'Mode invisible'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option}>
            <Bell size={20} color="#6B7280" />
            <Text style={styles.optionText}>Notifications</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option}>
            <Settings size={20} color="#6B7280" />
            <Text style={styles.optionText}>Paramètres</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Statistiques</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Amis</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>45</Text>
              <Text style={styles.statLabel}>Sorties</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>89%</Text>
              <Text style={styles.statLabel}>Dispo</Text>
            </View>
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
          <LogOut size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
  },
  statusBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
  },
  username: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#6B7280',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 8,
    fontWeight: '500',
  },
  editContainer: {
    flex: 1,
    marginLeft: 16,
  },
  statusInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 8,
    fontSize: 14,
  },
  editButton: {
    padding: 8,
  },
  saveButton: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  optionText: {
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 12,
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#EF4444',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  logoutText: {
    fontSize: 16,
    color: '#EF4444',
    marginLeft: 8,
    fontWeight: '600',
  },
});