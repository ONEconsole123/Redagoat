import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolateColor,
} from 'react-native-reanimated';
import { StatusIndicator } from './StatusIndicator';

interface StatusButtonProps {
  status: 'available' | 'unavailable' | 'invisible';
  onPress: () => void;
  disabled?: boolean;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export function StatusButton({ status, onPress, disabled }: StatusButtonProps) {
  const progress = useSharedValue(status === 'available' ? 1 : 0);

  React.useEffect(() => {
    progress.value = withSpring(status === 'available' ? 1 : 0, {
      damping: 15,
      stiffness: 150,
    });
  }, [status]);

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      ['#EF4444', '#10B981']
    );

    return {
      backgroundColor,
      transform: [{ scale: withSpring(disabled ? 0.95 : 1) }],
    };
  });

  const getStatusText = () => {
    switch (status) {
      case 'available':
        return 'Je peux sortir ! 🎉';
      case 'unavailable':
        return 'Pas dispo 😴';
      case 'invisible':
        return 'Mode invisible 👻';
    }
  };

  const getSubText = () => {
    switch (status) {
      case 'available':
        return 'Tes amis peuvent te voir';
      case 'unavailable':
        return 'Appuie pour être dispo';
      case 'invisible':
        return 'Tu vois tout, personne te voit';
    }
  };

  return (
    <AnimatedTouchableOpacity
      style={[styles.button, animatedStyle]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <View style={styles.indicatorContainer}>
          <StatusIndicator status={status} size={20} animated />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.statusText}>{getStatusText()}</Text>
          <Text style={styles.subText}>{getSubText()}</Text>
        </View>
      </View>
    </AnimatedTouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginVertical: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicatorContainer: {
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subText: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
});