import React from 'react';
import { Pressable, StyleSheet, Switch, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { ScreenContainer, ThemedText } from '@/components/ui';
import { useGame } from '@/context/game-provider';
import type { GameSettings } from '@/lib/save';
import baseColors from '@/constants/colors';

type BoolKey =
  | 'highContrast'
  | 'reduceMotion'
  | 'captions'
  | 'sound'
  | 'colorblindSafe'
  | 'dyslexiaFont'
  | 'largeTargets'
  | 'hapticsInterface'
  | 'hapticsGameplay'
  | 'shakeToInteract';

const TOGGLES: { key: BoolKey; label: string; description: string }[] = [
  { key: 'sound', label: 'Sound', description: 'Play resonance tones and audio feedback.' },
  { key: 'captions', label: 'Captions', description: 'Show text descriptions of every sound.' },
  {
    key: 'hapticsInterface',
    label: 'Interface haptics',
    description: 'Small vibration feedback for buttons and controls.',
  },
  {
    key: 'hapticsGameplay',
    label: 'Gameplay haptics',
    description: 'Vibration feedback for discoveries and resonance events.',
  },
  {
    key: 'shakeToInteract',
    label: 'Shake to interact',
    description: 'Shake the device to interact with a nearby object. Never required — the on-screen button always works.',
  },
  { key: 'highContrast', label: 'High contrast', description: 'Maximum contrast colours.' },
  {
    key: 'colorblindSafe',
    label: 'Colourblind-safe shapes',
    description: 'Use a single accent colour so shape, not colour, carries meaning.',
  },
  {
    key: 'dyslexiaFont',
    label: 'Dyslexia-friendly text',
    description: 'Wider letter spacing and taller line height.',
  },
  {
    key: 'largeTargets',
    label: 'Large touch targets',
    description: 'Bigger buttons for easier tapping.',
  },
  { key: 'reduceMotion', label: 'Reduce motion', description: 'Minimise animated effects.' },
];

export default function SettingsScreen() {
  const router = useRouter();
  const { colors, settings, updateSettings, haptic, minTargetHeight, announce } = useGame();

  const setOption = <K extends keyof GameSettings>(key: K, value: GameSettings[K]) => {
    updateSettings({ [key]: value } as Partial<GameSettings>);
    haptic('select');
  };

  const segmented = <K extends 'theme' | 'textSize'>(
    key: K,
    options: { value: GameSettings[K]; label: string }[],
  ) => (
    <View style={styles.segmentRow} accessibilityRole="radiogroup">
      {options.map((opt) => {
        const selected = settings[key] === opt.value;
        return (
          <Pressable
            key={String(opt.value)}
            accessibilityRole="radio"
            accessibilityLabel={opt.label}
            accessibilityState={{ selected, checked: selected }}
            testID={`option-${key}-${String(opt.value)}`}
            onPress={() => {
              setOption(key, opt.value);
              announce(`${opt.label} selected.`);
            }}
            style={({ pressed }) => [
              styles.segment,
              {
                minHeight: minTargetHeight,
                borderRadius: baseColors.radius,
                borderColor: selected ? colors.primary : colors.border,
                backgroundColor: selected ? colors.accent : colors.card,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <ThemedText variant="body" color={selected ? colors.accentForeground : colors.foreground}>
              {opt.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );

  return (
    <ScreenContainer testID="settings-screen">
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
          Settings
        </ThemedText>
      </View>

      <ThemedText variant="subheading" accessibilityRole="header" style={styles.sectionTitle}>
        Theme
      </ThemedText>
      {segmented('theme', [
        { value: 'light', label: 'Light' },
        { value: 'dark', label: 'Dark' },
        { value: 'system', label: 'System' },
      ])}

      <ThemedText variant="subheading" accessibilityRole="header" style={styles.sectionTitle}>
        Text size
      </ThemedText>
      {segmented('textSize', [
        { value: 'normal', label: 'Normal' },
        { value: 'large', label: 'Large' },
        { value: 'xl', label: 'XL' },
      ])}

      <ThemedText variant="subheading" accessibilityRole="header" style={styles.sectionTitle}>
        Accessibility
      </ThemedText>
      <View style={styles.toggleList}>
        {TOGGLES.map((t) => (
          <View
            key={t.key}
            style={[
              styles.toggleRow,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderRadius: baseColors.radius,
                minHeight: minTargetHeight,
              },
            ]}
          >
            <View style={styles.toggleText}>
              <ThemedText variant="body">{t.label}</ThemedText>
              <ThemedText variant="caption" color={colors.mutedForeground}>
                {t.description}
              </ThemedText>
            </View>
            <Switch
              accessibilityLabel={t.label}
              accessibilityHint={t.description}
              testID={`switch-${t.key}`}
              value={settings[t.key]}
              onValueChange={(v) => {
                setOption(t.key, v);
                announce(`${t.label} ${v ? 'on' : 'off'}.`);
              }}
              trackColor={{ true: colors.primary, false: colors.muted }}
              thumbColor={colors.card}
            />
          </View>
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  backButton: { alignItems: 'center', justifyContent: 'center' },
  sectionTitle: { marginTop: 20, marginBottom: 10 },
  segmentRow: { flexDirection: 'row', gap: 10 },
  segment: {
    flex: 1,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  toggleList: { gap: 10 },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  toggleText: { flex: 1, gap: 2 },
});
