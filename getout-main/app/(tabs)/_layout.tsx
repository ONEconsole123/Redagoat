import { Tabs } from 'expo-router';
import { BottomTabBar } from '@/components/BottomTabBar';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <BottomTabBar {...props} />}>
      <Tabs.Screen name="index" options={{ title: 'Explorer' }} />
      <Tabs.Screen name="add" options={{ title: 'Ajouter' }} />
      <Tabs.Screen name="chat" options={{ title: 'Messages' }} />
      <Tabs.Screen name="profile" options={{ title: 'Mon Profil' }} />
      <Tabs.Screen name="friends" options={{ href: null }} />
    </Tabs>
  );
}
