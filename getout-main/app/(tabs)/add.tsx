import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/theme';

export default function AddScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.title}>Ajouter un objet</Text>
      <Text style={styles.subtitle}>Publie un objet à troquer près de chez toi</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
  },
});
