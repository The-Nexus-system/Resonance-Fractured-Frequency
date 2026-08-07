import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GameButton, ScreenContainer, ThemedText } from '@/components/ui';
import { useGame } from '@/context/game-provider';

export default function HomeScreen() {
  const router = useRouter();
  const { colors, haptic } = useGame();

  return (
    <ScreenContainer testID="home-screen">
      <View style={styles.center}>
        <View
          accessible={false}
          style={[styles.emblem, { backgroundColor: colors.accent, borderColor: colors.border }]}
        >
          <MaterialCommunityIcons name="waveform" size={56} color={colors.primary} />
        </View>
        <ThemedText variant="title" accessibilityRole="header" style={styles.title}>
          Resonance
        </ThemedText>
        <ThemedText variant="subheading" color={colors.mutedForeground} style={styles.subtitle}>
          Fractured Frequency
        </ThemedText>
        <ThemedText variant="body" color={colors.mutedForeground} style={styles.tagline}>
          A calm signal-alignment puzzle game, designed for every kind of player.
        </ThemedText>
      </View>

      <View style={styles.actions}>
        <GameButton
          label="Explore the Fracture"
          testID="button-explore"
          accessibilityHint="Opens The First Fracture as an explorable chapter"
          onPress={() => {
            haptic('select');
            router.push('/explore');
          }}
        />
        <GameButton
          label="Play (Classic)"
          variant="outline"
          testID="button-play"
          accessibilityHint="Opens the campaign list"
          onPress={() => {
            haptic('select');
            router.push('/campaigns');
          }}
        />
        <GameButton
          label="Spatial Prototype"
          variant="outline"
          testID="button-spatial"
          accessibilityHint="Technical preview of spatial navigation"
          onPress={() => {
            haptic('select');
            router.push('/spatial');
          }}
        />
        <GameButton
          label="Settings"
          variant="outline"
          testID="button-settings"
          accessibilityHint="Accessibility and game settings"
          onPress={() => {
            haptic('select');
            router.push('/settings');
          }}
        />
        <GameButton
          label="About"
          variant="outline"
          testID="button-about"
          onPress={() => {
            haptic('select');
            router.push('/about');
          }}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  emblem: {
    width: 112,
    height: 112,
    borderRadius: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginBottom: 16,
  },
  title: { textAlign: 'center' },
  subtitle: { textAlign: 'center' },
  tagline: { textAlign: 'center', marginTop: 12, paddingHorizontal: 16 },
  actions: { gap: 14, paddingBottom: 8 },
});
