/**
 * Shared themed primitives: screen container, text, buttons.
 * All sizing respects the game's accessibility settings.
 */
import React from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGame } from '@/context/game-provider';
import baseColors from '@/constants/colors';

export function ScreenContainer({
  children,
  scroll = true,
  testID,
}: {
  children: React.ReactNode;
  scroll?: boolean;
  testID?: string;
}) {
  const { colors } = useGame();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === 'web';
  const padding = {
    paddingTop: (isWeb ? 67 : insets.top) + 12,
    paddingBottom: (isWeb ? 34 : insets.bottom) + 16,
    paddingHorizontal: 20,
  };

  if (!scroll) {
    return (
      <View testID={testID} style={[styles.flex, { backgroundColor: colors.background }, padding]}>
        {children}
      </View>
    );
  }
  return (
    <View style={[styles.flex, { backgroundColor: colors.background }]}>
      <ScrollView
        testID={testID}
        contentContainerStyle={[padding, styles.grow]}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
    </View>
  );
}

export function ThemedText({
  children,
  variant = 'body',
  color,
  style,
  ...rest
}: {
  children: React.ReactNode;
  variant?: 'title' | 'heading' | 'subheading' | 'body' | 'caption';
  color?: string;
  style?: StyleProp<TextStyle>;
} & React.ComponentProps<typeof Text>) {
  const { colors, fontScale, letterSpacing, bodyLineHeight } = useGame();
  const sizes: Record<string, { fontSize: number; fontFamily: string }> = {
    title: { fontSize: 30, fontFamily: 'Inter_700Bold' },
    heading: { fontSize: 22, fontFamily: 'Inter_600SemiBold' },
    subheading: { fontSize: 17, fontFamily: 'Inter_600SemiBold' },
    body: { fontSize: 16, fontFamily: 'Inter_400Regular' },
    caption: { fontSize: 13, fontFamily: 'Inter_400Regular' },
  };
  const { fontSize, fontFamily } = sizes[variant] ?? sizes.body;
  const scaled = Math.round(fontSize * fontScale);
  return (
    <Text
      {...rest}
      style={[
        {
          fontSize: scaled,
          fontFamily,
          color: color ?? colors.foreground,
          letterSpacing,
          lineHeight: bodyLineHeight(scaled),
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

export function GameButton({
  label,
  onPress,
  variant = 'primary',
  icon,
  disabled,
  accessibilityLabel,
  accessibilityHint,
  testID,
  style,
}: {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'ghost';
  icon?: React.ReactNode;
  disabled?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const { colors, fontScale, letterSpacing, minTargetHeight } = useGame();
  const bg =
    variant === 'primary' ? colors.primary : variant === 'outline' ? colors.card : 'transparent';
  const fg = variant === 'primary' ? colors.primaryForeground : colors.foreground;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      testID={testID}
      style={({ pressed }) => [
        styles.button,
        {
          minHeight: minTargetHeight,
          backgroundColor: bg,
          borderColor: variant === 'outline' ? colors.border : 'transparent',
          borderWidth: variant === 'outline' ? 1.5 : 0,
          borderRadius: baseColors.radius,
          opacity: disabled ? 0.5 : pressed ? 0.75 : 1,
        },
        style,
      ]}
    >
      {icon ? <View style={styles.buttonIcon}>{icon}</View> : null}
      <Text
        style={{
          fontSize: Math.round(17 * fontScale),
          fontFamily: 'Inter_600SemiBold',
          color: fg,
          letterSpacing,
          flexShrink: 1,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function ProgressBar({ value, label }: { value: number; label: string }) {
  const { colors } = useGame();
  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(value) }}
      style={[styles.progressTrack, { backgroundColor: colors.muted }]}
    >
      <View
        style={[
          styles.progressFill,
          { backgroundColor: colors.primary, width: `${Math.max(0, Math.min(100, value))}%` },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  grow: { flexGrow: 1 },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
    gap: 10,
  },
  buttonIcon: { marginRight: 2 },
  progressTrack: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
});
