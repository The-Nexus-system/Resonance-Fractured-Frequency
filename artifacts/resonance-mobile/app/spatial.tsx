/**
 * Spatial Prototype screen — Phase 3 technical sandbox.
 *
 * Proves the semantic spatial architecture with accessible controls:
 * large-target buttons for turning, moving, orientation summaries, pings,
 * and interaction. Everything shown here is generated from the semantic
 * world model (lib/spatial/world.ts) — no story content, no new canon.
 * Fully playable with sound off, haptics off, or both.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { GameButton, ScreenContainer, ThemedText } from '@/components/ui';
import { useGame } from '@/context/game-provider';
import {
  createPrototypeWorld,
  discoverNearby,
  interactableObjects,
  moveForward,
  orientationSummary,
  turn,
  facingWord,
  visibleObjects,
  type SpatialWorld,
} from '@/lib/spatial/world';
import { objectPing } from '@/lib/spatial/audio';
import { createAnnouncementCoalescer } from '@/lib/spatial/announce';
import baseColors from '@/constants/colors';

/** Minimum ms between movement inputs — prevents accidental rapid repeats. */
const MOVE_DEBOUNCE_MS = 350;

export default function SpatialScreen() {
  const router = useRouter();
  const { colors, settings, announce, playUri, haptic, minTargetHeight } = useGame();

  const worldRef = useRef<SpatialWorld>(createPrototypeWorld());
  const [description, setDescription] = useState(() => orientationSummary(worldRef.current));
  const [caption, setCaption] = useState<string | null>(null);
  const [, forceRender] = useState(0);
  const lastMoveRef = useRef(0);

  const refresh = useCallback(() => forceRender((n) => n + 1), []);

  // Speech-safe announcements: routine movement text coalesces (latest wins,
  // >=1.5s apart) so rapid turns can never flood the VoiceOver queue;
  // discoveries and interaction results speak immediately.
  const announcerRef = useRef(createAnnouncementCoalescer(announce));
  useEffect(() => {
    const announcer = announcerRef.current;
    return () => announcer.dispose();
  }, []);

  const debounced = useCallback(() => {
    const now = Date.now();
    if (now - lastMoveRef.current < MOVE_DEBOUNCE_MS) return false;
    lastMoveRef.current = now;
    return true;
  }, []);

  // Routine movement: update on-screen text, announce briefly (no flooding).
  const afterMove = useCallback(
    (routineMessage: string) => {
      const world = worldRef.current;
      const found = discoverNearby(world);
      setDescription(orientationSummary(world));
      refresh();
      if (found.length > 0) {
        // Discovery is important: announce it immediately.
        const names = found.map((o) => o.label).join('. ');
        announcerRef.current.critical(`Discovered: ${names}.`);
        haptic('success');
        if (settings.captions) setCaption(`[Discovery chime: ${names.toLowerCase()}]`);
      } else {
        // Routine movement: coalesced, latest state wins. The surroundings
        // card always carries the full text on screen regardless.
        announcerRef.current.routine(routineMessage);
      }
    },
    [haptic, refresh, settings.captions],
  );

  const handleTurn = useCallback(
    (dir: 'left' | 'right') => {
      if (!debounced()) return;
      turn(worldRef.current, dir);
      haptic('select');
      afterMove(`Facing ${facingWord(worldRef.current.player.headingDeg)}.`);
    },
    [afterMove, debounced, haptic],
  );

  const handleForward = useCallback(() => {
    if (!debounced()) return;
    moveForward(worldRef.current, 2);
    haptic('select');
    afterMove('Moved forward.');
  }, [afterMove, debounced, haptic]);

  const handleLookAround = useCallback(() => {
    const summary = orientationSummary(worldRef.current);
    setDescription(summary);
    // Explicitly requested by the player — speak immediately.
    announcerRef.current.critical(summary);
  }, []);

  const handlePing = useCallback(() => {
    const world = worldRef.current;
    const nearest = visibleObjects(world)[0] ?? null;
    if (!nearest) {
      announce('Nothing discovered to ping yet.');
      setCaption(settings.captions ? '[Silence: nothing to ping]' : null);
      return;
    }
    const ping = objectPing(world.player, nearest);
    if (settings.sound) playUri(ping.uri);
    if (settings.captions) setCaption(ping.caption);
    announce(ping.caption.replace(/[[\]]/g, ''));
    haptic('select');
  }, [announce, haptic, playUri, settings.captions, settings.sound]);

  const handleInteract = useCallback(() => {
    const world = worldRef.current;
    const targets = interactableObjects(world);
    if (targets.length === 0) {
      announce('Nothing within reach to interact with.');
      haptic('error');
      if (settings.captions) setCaption('[No interaction available]');
      return;
    }
    const target = targets[0].object;
    target.state = target.state === 'attuned' ? 'dormant' : 'attuned';
    const message = `${target.label} is now ${target.state}.`;
    setDescription(orientationSummary(world));
    refresh();
    announce(message);
    haptic('success');
    if (settings.sound) {
      const ping = objectPing(world.player, interactableObjects(world)[0] ?? targets[0]);
      playUri(ping.uri);
    }
    if (settings.captions) setCaption(`[Resonance shift: ${target.label.toLowerCase()}]`);
  }, [announce, haptic, playUri, refresh, settings.captions, settings.sound]);

  const world = worldRef.current;
  const canInteract = useMemo(
    () => interactableObjects(world).length > 0,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [world, description],
  );

  return (
    <ScreenContainer testID="spatial-screen">
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back to home"
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
          Spatial Prototype
        </ThemedText>
      </View>

      <ThemedText variant="caption" color={colors.mutedForeground} style={styles.note}>
        Technical preview of spatial navigation. Stationary play — no walking required.
      </ThemedText>

      <View
        accessible
        accessibilityLabel={`Surroundings: ${description}`}
        testID="text-surroundings"
        style={[
          styles.descriptionCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderRadius: baseColors.radius,
          },
        ]}
      >
        <ThemedText variant="caption" color={colors.primary} style={styles.cardLabel}>
          SURROUNDINGS
        </ThemedText>
        <ThemedText variant="body">{description}</ThemedText>
      </View>

      {caption && settings.captions ? (
        <ThemedText
          variant="caption"
          color={colors.mutedForeground}
          accessibilityLabel={`Sound caption: ${caption}`}
          testID="text-caption"
          style={styles.caption}
        >
          {caption}
        </ThemedText>
      ) : null}

      <View style={styles.controls}>
        <View style={styles.row}>
          <GameButton
            label="Turn Left"
            variant="outline"
            testID="button-turn-left"
            accessibilityHint="Rotates you 45 degrees left"
            icon={<MaterialCommunityIcons name="rotate-left" size={24} color={colors.foreground} />}
            onPress={() => handleTurn('left')}
            style={styles.half}
          />
          <GameButton
            label="Turn Right"
            variant="outline"
            testID="button-turn-right"
            accessibilityHint="Rotates you 45 degrees right"
            icon={
              <MaterialCommunityIcons name="rotate-right" size={24} color={colors.foreground} />
            }
            onPress={() => handleTurn('right')}
            style={styles.half}
          />
        </View>
        <GameButton
          label="Move Forward"
          variant="outline"
          testID="button-move-forward"
          accessibilityHint="Takes one step in the direction you are facing"
          icon={<MaterialCommunityIcons name="arrow-up" size={24} color={colors.foreground} />}
          onPress={handleForward}
        />
        <GameButton
          label="Look Around"
          testID="button-look-around"
          accessibilityHint="Describes your surroundings"
          icon={<Feather name="eye" size={22} color={colors.primaryForeground} />}
          onPress={handleLookAround}
        />
        <View style={styles.row}>
          <GameButton
            label="Ping Nearest"
            variant="outline"
            testID="button-ping"
            accessibilityHint="Plays a positioned tone from the nearest discovered object, with a caption"
            icon={<Feather name="volume-2" size={22} color={colors.foreground} />}
            onPress={handlePing}
            style={styles.half}
          />
          <GameButton
            label="Interact"
            testID="button-interact"
            disabled={!canInteract}
            accessibilityHint="Interacts with the nearest object within reach"
            icon={
              <MaterialCommunityIcons name="gesture-tap" size={24} color={colors.primaryForeground} />
            }
            onPress={handleInteract}
            style={styles.half}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  backButton: { alignItems: 'center', justifyContent: 'center' },
  note: { marginBottom: 14 },
  descriptionCard: { borderWidth: 1, padding: 18, gap: 8, marginBottom: 12 },
  cardLabel: { letterSpacing: 1.2, fontFamily: 'Inter_600SemiBold' },
  caption: { fontStyle: 'italic', marginBottom: 8 },
  controls: { gap: 12, marginTop: 8, paddingBottom: 8 },
  row: { flexDirection: 'row', gap: 12 },
  half: { flex: 1 },
});
