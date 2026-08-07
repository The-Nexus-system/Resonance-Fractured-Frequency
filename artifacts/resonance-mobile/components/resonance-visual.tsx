/**
 * Visual language for resonance and fracture (Phase 4).
 *
 * State is never colour-only: shape, motion, texture, and text all carry it.
 * - Fractured/resonating: split, jittering double-ring (instability).
 * - Attuned: single steady ring with a solid core (coherence).
 * - Dormant: dim outline.
 * Honors reduce-motion: static but still visually distinct per state.
 */
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ui';
import { useGame } from '@/context/game-provider';
import type { ObjectState } from '@/lib/spatial/world';

export function ResonanceVisual({ state, label }: { state: ObjectState; label: string }) {
  const { colors, settings } = useGame();
  const jitter = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (settings.reduceMotion) return;
    let loop: Animated.CompositeAnimation | null = null;
    if (state === 'resonating') {
      // Irregular jitter: two different durations so the phases drift.
      loop = Animated.loop(
        Animated.sequence([
          Animated.timing(jitter, { toValue: 1, duration: 260, easing: Easing.linear, useNativeDriver: true }),
          Animated.timing(jitter, { toValue: -1, duration: 340, easing: Easing.linear, useNativeDriver: true }),
          Animated.timing(jitter, { toValue: 0.5, duration: 180, easing: Easing.linear, useNativeDriver: true }),
          Animated.timing(jitter, { toValue: 0, duration: 300, easing: Easing.linear, useNativeDriver: true }),
        ]),
      );
    } else if (state === 'attuned') {
      loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, { toValue: 1, duration: 1600, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 0, duration: 1600, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        ]),
      );
    }
    loop?.start();
    return () => loop?.stop();
  }, [state, settings.reduceMotion, jitter, pulse]);

  const stateWord = state === 'attuned' ? 'attuned' : state === 'resonating' ? 'unstable' : 'dormant';
  const accent = state === 'attuned' ? colors.primary : colors.mutedForeground;

  return (
    <View style={styles.wrap} accessible accessibilityLabel={`${label}: ${stateWord}`}>
      <View style={styles.stage}>
        {state === 'resonating' ? (
          <>
            {/* Split double-ring: broken symmetry, offset copies. */}
            <Animated.View
              style={[
                styles.ring,
                { borderColor: accent, borderStyle: 'dashed' },
                {
                  transform: [
                    { translateX: settings.reduceMotion ? -3 : Animated.multiply(jitter, 4) },
                    { translateY: settings.reduceMotion ? 1 : Animated.multiply(jitter, -2) },
                  ],
                },
              ]}
            />
            <Animated.View
              style={[
                styles.ring,
                styles.ringSmall,
                { borderColor: accent },
                {
                  transform: [
                    { translateX: settings.reduceMotion ? 3 : Animated.multiply(jitter, -4) },
                  ],
                },
              ]}
            />
          </>
        ) : state === 'attuned' ? (
          <>
            <Animated.View
              style={[
                styles.ring,
                { borderColor: colors.primary, borderStyle: 'solid' },
                settings.reduceMotion
                  ? null
                  : {
                      transform: [
                        { scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.12] }) },
                      ],
                      opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 0.7] }),
                    },
              ]}
            />
            <View style={[styles.core, { backgroundColor: colors.primary }]} />
          </>
        ) : (
          <MaterialCommunityIcons name="circle-outline" size={44} color={colors.mutedForeground} />
        )}
      </View>
      <ThemedText variant="caption" color={colors.mutedForeground}>
        {stateWord}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 4 },
  stage: { width: 64, height: 64, alignItems: 'center', justifyContent: 'center' },
  ring: {
    position: 'absolute',
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2.5,
  },
  ringSmall: { width: 36, height: 36, borderRadius: 18, opacity: 0.7 },
  core: { width: 14, height: 14, borderRadius: 7 },
});
