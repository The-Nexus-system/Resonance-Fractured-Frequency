import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { GameButton, ScreenContainer, ThemedText } from '@/components/ui';
import { useGame } from '@/context/game-provider';
import { CHARACTERS } from '@/lib/gateone/characters';
import { defaultGateOne } from '@/lib/save';

export default function CharacterSelectScreen() {
  const router = useRouter();
  const { colors, haptic, gateOne, updateGateOne, minTargetHeight } = useGame();

  return (
    <ScreenContainer testID="characters-screen">
      <ThemedText variant="title" accessibilityRole="header" style={styles.title}>
        Choose your crew member
      </ThemedText>
      <ThemedText variant="body" color={colors.mutedForeground} style={styles.subtitle}>
        Day One begins on the Earth transport, on approach to the lunar interchange.
      </ThemedText>
      <ScrollView contentContainerStyle={styles.list}>
        {CHARACTERS.map((c) => {
          const selected = gateOne.characterId === c.id;
          return (
            <Pressable
              key={c.id}
              testID={`character-${c.id}`}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={`${c.name}, ${c.rank}, ${c.role}, from ${c.origin}. ${c.blurb}`}
              onPress={() => {
                haptic('select');
                updateGateOne({ ...defaultGateOne, characterId: c.id });
                router.push('/day-one');
              }}
              style={({ pressed }) => [
                styles.card,
                {
                  backgroundColor: colors.card,
                  borderColor: selected ? colors.primary : colors.border,
                  minHeight: minTargetHeight,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <ThemedText variant="subheading">{c.name}</ThemedText>
              <ThemedText variant="caption" color={colors.mutedForeground}>
                {c.rank} · {c.role} · {c.pronouns} · {c.origin}
              </ThemedText>
              <ThemedText variant="body" style={styles.blurb}>
                {c.blurb}
              </ThemedText>
            </Pressable>
          );
        })}
        <GameButton
          label="Back"
          variant="outline"
          testID="button-back"
          onPress={() => {
            haptic('select');
            router.back();
          }}
        />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: 8 },
  subtitle: { marginTop: 4, marginBottom: 12 },
  list: { gap: 12, paddingBottom: 24 },
  card: { borderWidth: 2, borderRadius: 12, padding: 14, gap: 4 },
  blurb: { marginTop: 4 },
});
