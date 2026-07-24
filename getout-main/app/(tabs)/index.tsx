import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, User } from 'lucide-react-native';
import { LiquidGlass } from '@/components/LiquidGlass';
import { COLORS } from '@/constants/theme';

export default function ExploreScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Swappit</Text>
          <Text style={styles.subtitle}>Découvre des objets à troquer près de chez toi</Text>
        </View>
        <Pressable style={styles.profileButton}>
          <User size={18} color={COLORS.textPrimary} />
        </Pressable>
      </View>

      <View style={styles.searchRow}>
        <LiquidGlass
          borderRadius={16}
          height={48}
          backgroundColor="rgba(255,255,255,0.06)"
          style={styles.searchGlass}
          contentStyle={styles.searchContent}
        >
          <TextInput
            placeholder="Rechercher un objet..."
            placeholderTextColor={COLORS.textMuted}
            style={styles.searchInput}
          />
        </LiquidGlass>

        <Pressable style={styles.searchButton}>
          <Search size={20} color={COLORS.textPrimary} strokeWidth={2.5} />
        </Pressable>
      </View>

      <View style={styles.emptyState}>
        <LiquidGlass
          width={88}
          height={88}
          borderRadius={22}
          backgroundColor="rgba(255,255,255,0.05)"
        >
          <Search size={30} color={COLORS.textMuted} strokeWidth={2} />
        </LiquidGlass>
        <Text style={styles.emptyTitle}>Aucun résultat</Text>
        <Text style={styles.emptySubtitle}>Essaie avec d'autres mots-clés ou catégories.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
    maxWidth: 260,
  },
  profileButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  searchGlass: {
    flex: 1,
  },
  searchContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  searchInput: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 15,
  },
  searchButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.accent,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 12,
    marginBottom: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
