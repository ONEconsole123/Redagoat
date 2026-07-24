import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Compass, CirclePlus, MessageCircle, User, Plus } from 'lucide-react-native';
import { LiquidGlass } from './LiquidGlass';
import { COLORS } from '@/constants/theme';

const ICONS: Record<string, typeof Compass> = {
  index: Compass,
  add: CirclePlus,
  chat: MessageCircle,
  profile: User,
};

const BAR_HEIGHT = 64;
const FAB_SIZE = 56;

export function BottomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { paddingBottom: insets.bottom }]} pointerEvents="box-none">
      <LiquidGlass
        borderRadius={0}
        height={BAR_HEIGHT}
        backgroundColor="rgba(20,20,26,0.55)"
        contentStyle={styles.barContent}
        style={styles.bar}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const itemStyle = options.tabBarItemStyle as { display?: string } | undefined;
          if (itemStyle?.display === 'none') return null;

          const isFocused = state.index === index;
          const Icon = ICONS[route.name] ?? Compass;
          const label = (options.title ?? route.name) as string;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable key={route.key} onPress={onPress} style={styles.tabItem}>
              <Icon size={22} color={isFocused ? COLORS.accent : COLORS.textMuted} strokeWidth={2.2} />
              <Text style={[styles.tabLabel, { color: isFocused ? COLORS.accent : COLORS.textMuted }]}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </LiquidGlass>

      <Pressable
        onPress={() => navigation.navigate('add')}
        style={[styles.fabWrapper, { bottom: BAR_HEIGHT / 2 }]}
      >
        <LiquidGlass
          width={FAB_SIZE}
          height={FAB_SIZE}
          borderRadius={18}
          backgroundColor="rgba(30,30,36,0.7)"
          style={styles.fab}
        >
          <Plus size={26} color={COLORS.textPrimary} strokeWidth={2.5} />
        </LiquidGlass>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  bar: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.glassBorder,
  },
  barContent: {
    flexDirection: 'row',
    height: BAR_HEIGHT,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  fabWrapper: {
    position: 'absolute',
    left: '50%',
    marginLeft: -FAB_SIZE / 2,
  },
  fab: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
