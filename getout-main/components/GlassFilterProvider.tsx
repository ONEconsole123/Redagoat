import { useEffect } from 'react';
import { Platform } from 'react-native';

const FILTER_ID = 'glass-distortion';

const FILTER_SVG = `<svg width="0" height="0" style="position:absolute;overflow:hidden" aria-hidden="true">
  <defs>
    <filter id="${FILTER_ID}" x="0%" y="0%" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.008 0.008" numOctaves="2" seed="92" result="noise" />
      <feGaussianBlur in="noise" stdDeviation="2" result="blurred" />
      <feDisplacementMap in="SourceGraphic" in2="blurred" scale="77" xChannelSelector="R" yChannelSelector="G" />
    </filter>
  </defs>
</svg>`;

/**
 * Injects the shared `glass-distortion` SVG filter into the page once.
 * Web only — native platforms have no equivalent for feDisplacementMap,
 * LiquidGlass falls back to expo-blur there instead.
 */
export function GlassFilterProvider() {
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const doc = (globalThis as any).document;
    if (!doc || doc.getElementById(FILTER_ID)) return;

    doc.body.insertAdjacentHTML('afterbegin', FILTER_SVG);
  }, []);

  return null;
}
