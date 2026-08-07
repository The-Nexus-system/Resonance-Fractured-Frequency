import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { ScreenContainer, ThemedText } from '@/components/ui';
import { useGame } from '@/context/game-provider';
import { campaigns } from '@/lib/campaigns';
import baseColors from '@/constants/colors';

export default function CampaignsScreen() {
  const router = useRouter();
  const { colors, progress, haptic, minTargetHeight } = useGame();

  return (
    <ScreenContainer testID="campaigns-screen">
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back to home"
          testID="button-back"
          onPress={() => {
            haptic('select');
            if (router.canGoBack()) router.back();
            else router.replace('/');
          }}
          style={({ pressed }) => [
            styles.backButton,
            { minHeight: minTargetHeight, minWidth: minTargetHeight, opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Feather name="chevron-left" size={28} color={colors.foreground} />
        </Pressable>
        <ThemedText variant="heading" accessibilityRole="header">
          Campaigns
        </ThemedText>
      </View>

      <View style={styles.list}>
        {campaigns.map((c) => {
          const p = progress[c.id];
          const status = c.locked
            ? c.lockReason ?? 'Locked'
            : p?.completed
              ? 'Completed'
              : p && p.currentNodeIndex > 0
                ? `In progress — node ${p.currentNodeIndex + 1} of ${c.nodes.length}`
                : 'Not started';
          return (
            <Pressable
              key={c.id}
              accessibilityRole="button"
              accessibilityLabel={`${c.title}. ${c.description} ${status}.`}
              accessibilityState={{ disabled: !!c.locked }}
              disabled={!!c.locked}
              testID={`campaign-${c.id}`}
              onPress={() => {
                haptic('select');
                router.push({ pathname: '/play/[campaignId]', params: { campaignId: c.id } });
              }}
              style={({ pressed }) => [
                styles.card,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  borderRadius: baseColors.radius,
                  opacity: c.locked ? 0.6 : pressed ? 0.8 : 1,
                },
              ]}
            >
              <View style={styles.cardHeader}>
                <ThemedText variant="subheading">{c.title}</ThemedText>
                {c.locked ? (
                  <MaterialCommunityIcons name="lock" size={20} color={colors.mutedForeground} />
                ) : p?.completed ? (
                  <MaterialCommunityIcons name="check-circle" size={20} color={colors.success} />
                ) : null}
              </View>
              <ThemedText variant="body" color={colors.mutedForeground}>
                {c.description}
              </ThemedText>
              <ThemedText variant="caption" color={colors.mutedForeground}>
                {status}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 20 },
  backButton: { alignItems: 'center', justifyContent: 'center' },
  list: { gap: 14 },
  card: { borderWidth: 1, padding: 18, gap: 8 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
