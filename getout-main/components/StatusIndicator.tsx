import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withSequence,
  withTiming,
  runOnJS
} from 'react-native-reanimated';

interface StatusIndicatorProps {
  status: 'available' | 'unavailable' | 'invisible';
  size?: number;
  animated?: boolean;
}

export function StatusIndicator({ 
  status, 
  size = 12, 
  animated = false 
}: StatusIndicatorProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  React.useEffect(() => {
    if (animated && status === 'available') {
      // Explosion effect when becoming available
      scale.value = withSequence(
        withSpring(1.5, { damping: 10 }),
        withSpring(1, { damping: 8 })
      );
      
      opacity.value = withSequence(
        withTiming(0.7, { duration: 100 }),
        withTiming(1, { duration: 200 })
      );
    }
  }, [status, animated]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const getColor = () => {
    switch (status) {
      case 'available':
        return '#10B981'; // Green
      case 'unavailable':
        return '#EF4444'; // Red
      case 'invisible':
        return '#9CA3AF'; // Gray
      default:
        return '#9CA3AF';
    }
  };

  return (
    <Animated.View style={[animatedStyle]}>
      <View
        style={[
          styles.indicator,
          {
            width: size,
            height: size,
            backgroundColor: getColor(),
          },
        ]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  indicator: {
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});