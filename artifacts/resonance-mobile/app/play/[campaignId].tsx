import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { GameButton, ProgressBar, ScreenContainer, ThemedText } from '@/components/ui';
import { useGame } from '@/context/game-provider';
import { campaigns, type Campaign, type Choice, type Node } from '@/lib/campaigns';
import { ERROR_TONE_FREQ } from '@/lib/tones';
import baseColors from '@/constants/colors';

export default function PlayScreen() {
  const { campaignId } = useLocalSearchParams<{ campaignId: string }>();
  const router = useRouter();
  const {
    loaded,
    colors,
    settings,
    progress,
    updateProgress,
    announce,
    playTone,
    stopTone,
    haptic,
    minTargetHeight,
  } = useGame();

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [nodeIndex, setNodeIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; type: 'error' | 'success' } | null>(
    null,
  );
  const [advancing, setAdvancing] = useState(false);
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initializedRef = useRef(false);

  // Never leave a pending auto-advance or a playing tone running after
  // leaving the screen.
  useEffect(() => {
    return () => {
      if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
      stopTone();
    };
  }, [stopTone]);

  // Initialise from the sanitised save once it has loaded.
  useEffect(() => {
    if (!loaded || initializedRef.current) return;
    const found = campaigns.find((c) => c.id === campaignId);
    if (!found || found.locked) {
      router.replace('/campaigns');
      return;
    }
    initializedRef.current = true;
    setCampaign(found);
    const p = progress[found.id] ?? { currentNodeIndex: 0, completed: false };
    if (p.completed) {
      setCompleted(true);
      announce(`${found.title} campaign completed screen.`);
    } else {
      // Clamp any out-of-range saved index so a damaged save can never
      // restore the player into a nonexistent node and crash the game.
      const safeIndex = Math.min(
        Math.max(0, p.currentNodeIndex),
        Math.max(0, found.nodes.length - 1),
      );
      setNodeIndex(safeIndex);
      announce(`Playing ${found.title}, node ${safeIndex + 1}.`);
    }
  }, [loaded, campaignId, progress, router, announce]);

  const handleChoice = useCallback(
    (choice: Choice, node: Node) => {
      if (!campaign) return;
      // Ignore input while a correct answer is advancing, so feedback and
      // game state can never contradict each other.
      if (advancing) return;
      if (choice.isCorrect) {
        setAdvancing(true);
        setFeedback({ message: 'Correct! Resonance established.', type: 'success' });
        announce('Correct! Resonance established.');
        playTone(node.toneFreq ?? 440);
        haptic('success');

        if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
        advanceTimerRef.current = setTimeout(() => {
          setFeedback(null);
          setAdvancing(false);
          const nextIndex = nodeIndex + 1;
          if (nextIndex >= campaign.nodes.length) {
            setCompleted(true);
            updateProgress(campaign.id, nextIndex, true);
            announce('Campaign complete! Returning to calm screen.');
          } else {
            setNodeIndex(nextIndex);
            updateProgress(campaign.id, nextIndex, false);
            announce(`Advanced to node ${nextIndex + 1}.`);
          }
        }, 1500);
      } else {
        const msg = choice.feedbackOnFail ?? 'Incorrect resonance. Try a different alignment.';
        setFeedback({ message: msg, type: 'error' });
        announce(`Incorrect. ${msg}`);
        playTone(ERROR_TONE_FREQ);
        haptic('error');
      }
    },
    [campaign, advancing, nodeIndex, announce, playTone, haptic, updateProgress],
  );

  const handleReplay = useCallback(() => {
    if (!campaign) return;
    setCompleted(false);
    setNodeIndex(0);
    setFeedback(null);
    setAdvancing(false);
    if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    updateProgress(campaign.id, 0, false);
    announce('Restarting campaign.');
  }, [campaign, updateProgress, announce]);

  if (!campaign) return null;

  if (completed) {
    return (
      <ScreenContainer testID="completed-screen">
        <View style={styles.completedWrap}>
          <MaterialCommunityIcons
            name="check-circle-outline"
            size={80}
            color={colors.primary}
            accessible={false}
          />
          <ThemedText variant="title" accessibilityRole="header" style={styles.centerText}>
            Signal Restored
          </ThemedText>
          <ThemedText variant="body" color={colors.mutedForeground} style={styles.centerText}>
            You have successfully aligned all frequencies in {campaign.title}. The planetary
            network hums in harmony once more.
          </ThemedText>
          <View style={styles.completedActions}>
            <GameButton
              label="Return to Campaigns"
              testID="button-return"
              onPress={() => router.replace('/campaigns')}
            />
            <GameButton
              label="Replay Campaign"
              variant="outline"
              testID="button-replay"
              onPress={handleReplay}
            />
          </View>
        </View>
      </ScreenContainer>
    );
  }

  const node = campaign.nodes[nodeIndex];
  if (!node) return null;
  const percent = (nodeIndex / campaign.nodes.length) * 100;

  return (
    <ScreenContainer testID="play-screen">
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back to campaigns"
          testID="button-back"
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/campaigns'))}
          style={({ pressed }) => [
            styles.backButton,
            { minHeight: minTargetHeight, minWidth: minTargetHeight, opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Feather name="chevron-left" size={28} color={colors.foreground} />
        </Pressable>
        <View style={styles.headerInfo}>
          <View style={styles.headerRow}>
            <ThemedText variant="caption" color={colors.mutedForeground}>
              {campaign.title}
            </ThemedText>
            <ThemedText variant="caption" color={colors.mutedForeground}>
              {nodeIndex + 1} / {campaign.nodes.length}
            </ThemedText>
          </View>
          <ProgressBar
            value={percent}
            label={`Progress: Node ${nodeIndex + 1} of ${campaign.nodes.length}`}
          />
        </View>
      </View>

      <ThemedText variant="body" style={styles.narrative}>
        {node.narrative}
      </ThemedText>

      <View
        style={[
          styles.targetCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderRadius: baseColors.radius,
          },
        ]}
      >
        <ThemedText variant="caption" color={colors.primary} style={styles.targetLabel}>
          TARGET RESONANCE
        </ThemedText>
        <View style={styles.targetRow}>
          <View
            accessible={false}
            style={[
              styles.targetShape,
              { backgroundColor: colors.background, borderColor: colors.border },
            ]}
          >
            <MaterialCommunityIcons
              name={node.targetVisual.shape}
              size={44}
              color={settings.colorblindSafe ? colors.primary : node.targetVisual.color}
            />
          </View>
          <View style={styles.targetInfo}>
            <ThemedText variant="body">{node.targetDescription}</ThemedText>
            <ThemedText
              variant="caption"
              color={colors.mutedForeground}
              accessibilityLabel={`Visual representation: ${node.targetVisual.label}`}
            >
              {node.targetVisual.label}
            </ThemedText>
          </View>
        </View>
        {settings.sound && node.toneFreq ? (
          <GameButton
            label="Play Tone"
            variant="outline"
            testID="button-play-tone"
            accessibilityLabel="Play target tone"
            icon={<Feather name="volume-2" size={20} color={colors.foreground} />}
            onPress={() => playTone(node.toneFreq!)}
          />
        ) : null}
        {settings.captions && node.toneCaption ? (
          <ThemedText
            variant="caption"
            color={colors.mutedForeground}
            accessibilityLabel={`Sound caption: ${node.toneCaption}`}
            style={styles.caption}
          >
            {node.toneCaption}
          </ThemedText>
        ) : null}
      </View>

      {feedback ? (
        <View
          accessible
          accessibilityRole="alert"
          testID={`feedback-${feedback.type}`}
          style={[
            styles.feedback,
            {
              borderRadius: baseColors.radius,
              backgroundColor:
                feedback.type === 'error' ? `${colors.destructive}22` : colors.successBackground,
            },
          ]}
        >
          <MaterialCommunityIcons
            name={feedback.type === 'error' ? 'alert-circle-outline' : 'check-circle-outline'}
            size={24}
            color={feedback.type === 'error' ? colors.destructive : colors.success}
            accessible={false}
          />
          <ThemedText
            variant="body"
            color={feedback.type === 'error' ? colors.destructive : colors.success}
            style={styles.feedbackText}
          >
            {feedback.message}
          </ThemedText>
        </View>
      ) : null}

      <ThemedText variant="subheading" accessibilityRole="header" style={styles.choicesHeading}>
        Select matching alignment:
      </ThemedText>
      <View style={styles.choices}>
        {node.choices.map((choice) => (
          <GameButton
            key={choice.id}
            label={choice.label}
            variant="outline"
            testID={`choice-${choice.id}`}
            disabled={advancing}
            icon={
              <MaterialCommunityIcons name={choice.icon} size={26} color={colors.foreground} />
            }
            onPress={() => handleChoice(choice, node)}
            style={styles.choiceButton}
          />
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  backButton: { alignItems: 'center', justifyContent: 'center' },
  headerInfo: { flex: 1, gap: 8 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between' },
  narrative: { marginBottom: 16 },
  targetCard: { borderWidth: 1, padding: 18, gap: 14 },
  targetLabel: { letterSpacing: 1.2, fontFamily: 'Inter_600SemiBold' },
  targetRow: { flexDirection: 'row', gap: 16, alignItems: 'center' },
  targetShape: {
    width: 84,
    height: 84,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  targetInfo: { flex: 1, gap: 6 },
  caption: { fontStyle: 'italic' },
  feedback: {
    flexDirection: 'row',
    gap: 10,
    padding: 14,
    marginTop: 16,
    alignItems: 'flex-start',
  },
  feedbackText: { flex: 1 },
  choicesHeading: { marginTop: 20, marginBottom: 12 },
  choices: { gap: 12, paddingBottom: 8 },
  choiceButton: { justifyContent: 'flex-start' },
  completedWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  centerText: { textAlign: 'center' },
  completedActions: { alignSelf: 'stretch', gap: 12, marginTop: 20 },
});
