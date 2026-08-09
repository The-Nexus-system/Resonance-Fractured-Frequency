import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { ScreenContainer, ThemedText } from '@/components/ui';
import { useGame } from '@/context/game-provider';
import baseColors from '@/constants/colors';

const SECTIONS: { title: string; body: string }[] = [
  {
    title: 'What is Resonance?',
    body: 'Resonance: Fractured Frequency is a calm signal-alignment puzzle game. You repair broken beacons by matching each signal with its resonant counterpart. There are no timers, no punishments, and no fail states — only signals waiting to be understood.',
  },
  {
    title: 'One game, many ways to play',
    body: 'Every puzzle can be completed through sight, sound, or text — none of them is required on its own. Tones have captions, visuals have descriptions, and every result is announced to the screen reader, shown on screen, and confirmed with haptics.',
  },
  {
    title: 'Accessibility',
    body: 'The game supports VoiceOver semantics, adjustable text size up to 130%, high contrast, colourblind-safe mode, dyslexia-friendly text, large touch targets, captions for all audio, sound-off play, and haptic feedback. Your progress saves automatically.',
  },
  {
    title: 'The reference build',
    body: 'This native app is the companion to the Resonance web game — the validated reference build. Both share one game world, one save format, and one canon.',
  },
  {
    title: 'Audio credits',
    body: 'Every third-party sound and piece of music in Resonance is recorded in the project Audio Asset Ledger, and this section is generated from it. No third-party audio has been imported yet; as licensed sounds arrive, their creators and licenses will be credited here.',
  },
];

export default function AboutScreen() {
  const router = useRouter();
  const { colors, minTargetHeight } = useGame();

  return (
    <ScreenContainer testID="about-screen">
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back"
          testID="button-back"
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
          style={({ pressed }) => [
            styles.backButton,
            { minHeight: minTargetHeight, minWidth: minTargetHeight, opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Feather name="chevron-left" size={28} color={colors.foreground} />
        </Pressable>
        <ThemedText variant="heading" accessibilityRole="header">
          About
        </ThemedText>
      </View>

      <View style={styles.sections}>
        {SECTIONS.map((s) => (
          <View
            key={s.title}
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderRadius: baseColors.radius,
              },
            ]}
          >
            <ThemedText variant="subheading" accessibilityRole="header">
              {s.title}
            </ThemedText>
            <ThemedText variant="body" color={colors.mutedForeground}>
              {s.body}
            </ThemedText>
          </View>
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  backButton: { alignItems: 'center', justifyContent: 'center' },
  sections: { gap: 14 },
  card: { borderWidth: 1, padding: 18, gap: 8 },
});
