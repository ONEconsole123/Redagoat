import React from 'react';
import { View, StyleSheet, Platform, ViewStyle, StyleProp, DimensionValue } from 'react-native';
import { BlurView } from 'expo-blur';

interface LiquidGlassProps {
  children?: React.ReactNode;
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  backgroundColor?: string;
  tint?: 'light' | 'dark';
  intensity?: number;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}

// Only valid on web — react-native-web forwards unrecognized style keys
// straight through to the DOM node's inline style.
const webFilterStyle =
  Platform.OS === 'web'
    ? ({
        filter: `url(#glass-distortion)`,
        WebkitFilter: `url(#glass-distortion)`,
      } as unknown as ViewStyle)
    : undefined;

export function LiquidGlass({
  children,
  width,
  height,
  borderRadius = 28,
  backgroundColor = 'rgba(255,255,255,0.06)',
  tint = 'dark',
  intensity = 40,
  style,
  contentStyle,
}: LiquidGlassProps) {
  return (
    <View style={[styles.shadowWrap, { borderRadius, width, height }, style]}>
      <View style={[styles.clip, { borderRadius }]}>
        {/* Teinte de base : garantit un aspect "verre" même si le blur/filtre n'est pas supporté */}
        <View style={[StyleSheet.absoluteFill, { backgroundColor }]} />

        {Platform.OS === 'web' ? (
          <View style={[StyleSheet.absoluteFill, webFilterStyle]} />
        ) : (
          <BlurView intensity={intensity} tint={tint} style={StyleSheet.absoluteFill} />
        )}

        {/* Reflet lumineux interne */}
        <View style={[StyleSheet.absoluteFill, styles.highlight, { borderRadius }]} pointerEvents="none" />

        <View style={[styles.content, contentStyle]}>{children}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shadowWrap: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  clip: {
    flex: 1,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  highlight: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
  },
  content: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
