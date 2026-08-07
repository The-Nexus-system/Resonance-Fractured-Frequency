/**
 * The First Fracture — explorable chapter (Phase 4 vertical slice).
 *
 * Free spatial exploration of the fracture zone. The four ESTABLISHED puzzle
 * nodes from lib/campaigns.ts are embedded verbatim: reaching a resonator and
 * choosing "Attune" opens its original narrative and choices with the same
 * answers. Attuning changes the environmental soundscape (its musical voice
 * joins), and restoring all four resolves the harmony and completes the
 * campaign in the shared save.
 *
 * Accessibility: everything works with sound off, haptics off, camera off,
 * and without physical movement. All state is carried in text.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { GameButton, ScreenContainer, ThemedText } from '@/components/ui';
import { useGame } from '@/context/game-provider';
import { campaigns, type Node } from '@/lib/campaigns';
import { emptyExploreState } from '@/lib/save';
import {
  createFirstFractureWorld,
  FF_META,
  FF_RESONATOR_IDS,
  FF_INSPECT_IDS,
  FIRST_FRACTURE_SCORE,
  sanitizeFirstFractureExplore,
} from '@/lib/spatial/firstFracture';
import {
  discoverNearby,
  interactableObjects,
  moveForward,
  orientationSummary,
  relativeAngleDeg,
  turn,
  facingWord,
  viewObject,
  visibleObjects,
  type SpatialWorld,
  type WorldObject,
} from '@/lib/spatial/world';
import { voiceForObject } from '@/lib/music/theory';
import {
  resolutionCaption,
  resolutionVoices,
  soundscapeVoices,
  voiceChangeCaption,
  voiceRender,
  type VoiceState,
} from '@/lib/music/soundscape';
import { renderVoicesUri } from '@/lib/music/synth';
import { createAnnouncementCoalescer } from '@/lib/spatial/announce';
import { ResonanceVisual } from '@/components/resonance-visual';
import { CameraLayer } from '@/components/camera-layer';
import baseColors from '@/constants/colors';

const CAMPAIGN_ID = 'the-first-fracture';
const MOVE_DEBOUNCE_MS = 350;
const SHAKE_THRESHOLD = 1.8; // total g-force
const SHAKE_COOLDOWN_MS = 1500;

const campaign = campaigns.find((c) => c.id === CAMPAIGN_ID)!;

function panFor(world: SpatialWorld, object: WorldObject): number {
  const angle = relativeAngleDeg(world.player, object.position);
  return Math.max(-1, Math.min(1, Math.sin((angle * Math.PI) / 180)));
}

function proximityFor(world: SpatialWorld, object: WorldObject): number {
  const v = viewObject(world, object);
  return Math.max(0, Math.min(1, 1 - v.distance / 20));
}

export default function ExploreScreen() {
  const router = useRouter();
  const {
    colors,
    settings,
    explore,
    updateExplore,
    updateProgress,
    grantReward,
    rewards,
    announce,
    playUri,
    stopTone,
    haptic,
    minTargetHeight,
  } = useGame();

  // Whitelist the persisted state against real chapter IDs: a corrupt or
  // hand-edited save can never bypass progression or reveal gated content.
  const chapter = sanitizeFirstFractureExplore(explore[CAMPAIGN_ID] ?? emptyExploreState());
  const chapterRef = useRef(chapter);
  chapterRef.current = chapter;

  // Build the world once, replaying persisted state onto it.
  const worldRef = useRef<SpatialWorld | null>(null);
  if (worldRef.current === null) {
    const world = createFirstFractureWorld();
    const saved = sanitizeFirstFractureExplore(explore[CAMPAIGN_ID] ?? emptyExploreState());
    for (const o of world.objects) {
      if (saved.attuned.includes(o.id)) {
        o.state = 'attuned';
        o.discovered = true;
      }
      if (saved.collected.includes(o.id)) {
        // Consumed collectibles stay visible but can't mask other targets.
        o.discovered = true;
        o.state = 'attuned';
        o.interactable = false;
      }
      if (saved.visitedHidden.includes(o.id)) {
        o.discovered = true;
      }
    }
    // Unrevealed hidden objects are physically absent until their gate opens.
    const attunedCount = saved.attuned.length;
    world.objects = world.objects.filter((o) => {
      const meta = FF_META[o.id];
      if (meta?.role !== 'hidden') return true;
      if (saved.visitedHidden.includes(o.id)) return true;
      return attunedCount >= (meta.revealAfterAttuned ?? 0);
    });
    worldRef.current = world;
  }
  const world = worldRef.current;

  const [description, setDescription] = useState(() => orientationSummary(world));
  const [caption, setCaption] = useState<string | null>(null);
  const [puzzleObjectId, setPuzzleObjectId] = useState<string | null>(null);
  const [puzzleFeedback, setPuzzleFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [inspectText, setInspectText] = useState<string | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [, forceRender] = useState(0);
  const refresh = useCallback(() => forceRender((n) => n + 1), []);
  const lastMoveRef = useRef(0);

  const announcerRef = useRef(createAnnouncementCoalescer(announce));
  useEffect(() => {
    const a = announcerRef.current;
    return () => {
      a.dispose();
      stopTone();
    };
  }, [stopTone]);

  const attunedCount = chapter.attuned.length;
  const isRestored = attunedCount >= FF_RESONATOR_IDS.length;

  /* ---------------- soundscape ---------------- */

  const voiceStates = useCallback((): Record<string, VoiceState> => {
    const states: Record<string, VoiceState> = {};
    for (const id of FF_RESONATOR_IDS) {
      const obj = world.objects.find((o) => o.id === id);
      if (!obj) continue;
      const presence = obj.state === 'attuned' ? 'confident' : obj.discovered ? 'clear' : 'faint';
      states[id] = {
        presence,
        pan: panFor(world, obj),
        proximity: proximityFor(world, obj),
      };
    }
    return states;
  }, [world]);

  const playSoundscape = useCallback(() => {
    const states = voiceStates();
    const voices = soundscapeVoices(FIRST_FRACTURE_SCORE, states);
    if (settings.sound && voices.length > 0) playUri(renderVoicesUri(voices));
    const parts = FIRST_FRACTURE_SCORE.voices.map((v) => {
      const s = states[v.objectId];
      const word = s.presence === 'confident' ? 'settled' : s.presence === 'clear' ? 'unsteady' : 'faint and wavering';
      return `${v.plainIdentity} (${v.note}) — ${word}`;
    });
    const text = `[Soundscape: ${parts.join('; ')}]`;
    if (settings.captions) setCaption(text);
    announcerRef.current.critical(text.replace(/[[\]]/g, ''));
  }, [playUri, settings.captions, settings.sound, voiceStates]);

  /* ---------------- movement ---------------- */

  const debounced = useCallback(() => {
    const now = Date.now();
    if (now - lastMoveRef.current < MOVE_DEBOUNCE_MS) return false;
    lastMoveRef.current = now;
    return true;
  }, []);

  const afterMove = useCallback(
    (routineMessage: string) => {
      const found = discoverNearby(world);
      setDescription(orientationSummary(world));
      refresh();
      if (found.length > 0) {
        const names = found.map((o) => o.label).join('. ');
        announcerRef.current.critical(`Discovered: ${names}.`);
        haptic('success', 'gameplay');
        if (settings.captions) setCaption(`[Discovery: ${names.toLowerCase()}]`);
        // A newly discovered resonator's voice becomes clearer in the world.
        for (const o of found) {
          const voice = voiceForObject(FIRST_FRACTURE_SCORE, o.id);
          if (voice && settings.sound) {
            const render = voiceRender(voice, {
              presence: 'clear',
              pan: panFor(world, o),
              proximity: proximityFor(world, o),
            });
            playUri(renderVoicesUri([render]));
            if (settings.captions) setCaption(voiceChangeCaption(voice, 'clear', panFor(world, o)));
          }
        }
      } else {
        announcerRef.current.routine(routineMessage);
      }
    },
    [haptic, playUri, refresh, settings.captions, settings.sound, world],
  );

  const handleTurn = useCallback(
    (dir: 'left' | 'right') => {
      if (!debounced()) return;
      turn(world, dir);
      haptic('select', 'ui');
      afterMove(`Facing ${facingWord(world.player.headingDeg)}.`);
    },
    [afterMove, debounced, haptic, world],
  );

  const handleForward = useCallback(() => {
    if (!debounced()) return;
    moveForward(world, 2);
    haptic('select', 'ui');
    afterMove('Moved forward.');
  }, [afterMove, debounced, haptic, world]);

  const handleLookAround = useCallback(() => {
    const summary = orientationSummary(world);
    setDescription(summary);
    announcerRef.current.critical(summary);
  }, [world]);

  /* ---------------- semantic interact ---------------- */

  const revealHiddenIfDue = useCallback(
    (newAttunedCount: number) => {
      const full = createFirstFractureWorld();
      for (const candidate of full.objects) {
        const meta = FF_META[candidate.id];
        if (meta?.role !== 'hidden') continue;
        if (world.objects.some((o) => o.id === candidate.id)) continue;
        if (newAttunedCount >= (meta.revealAfterAttuned ?? 0)) {
          world.objects.push(candidate);
        }
      }
    },
    [world],
  );

  const completeRestoration = useCallback(() => {
    updateProgress(CAMPAIGN_ID, campaign.nodes.length, true);
    grantReward('ff-resonator-all');
    // Post-restoration environmental change: inspect texts change and the
    // final hidden place appears (handled by revealHiddenIfDue).
    if (settings.sound) playUri(renderVoicesUri(resolutionVoices(FIRST_FRACTURE_SCORE), 3.2));
    const text = resolutionCaption(FIRST_FRACTURE_SCORE);
    if (settings.captions) setCaption(text);
    announcerRef.current.critical(
      'All four resonators attuned. ' + text.replace(/[[\]]/g, '') + ' The beacon is restored.',
    );
    haptic('success', 'gameplay');
  }, [grantReward, haptic, playUri, settings.captions, settings.sound, updateProgress]);

  const attuneObject = useCallback(
    (objectId: string) => {
      const obj = world.objects.find((o) => o.id === objectId);
      if (!obj) return;
      obj.state = 'attuned';
      const prev = chapterRef.current;
      const attuned = prev.attuned.includes(objectId) ? prev.attuned : [...prev.attuned, objectId];
      updateExplore(CAMPAIGN_ID, { attuned });
      revealHiddenIfDue(attuned.length);
      setDescription(orientationSummary(world));
      refresh();

      const voice = voiceForObject(FIRST_FRACTURE_SCORE, objectId);
      if (voice) {
        const pan = panFor(world, obj);
        if (attuned.length >= FF_RESONATOR_IDS.length) {
          completeRestoration();
        } else {
          if (settings.sound) {
            playUri(renderVoicesUri([voiceRender(voice, { presence: 'confident', pan, proximity: 1 })]));
          }
          const text = voiceChangeCaption(voice, 'confident', pan);
          if (settings.captions) setCaption(text);
          announcerRef.current.critical(`${obj.label} attuned. ` + text.replace(/[[\]]/g, ''));
          haptic('success', 'gameplay');
        }
      }
    },
    [completeRestoration, haptic, playUri, refresh, revealHiddenIfDue, settings.captions, settings.sound, updateExplore, world],
  );

  const performInteract = useCallback(() => {
    const targets = interactableObjects(world);
    if (targets.length === 0) {
      announcerRef.current.critical('Nothing within reach to interact with.');
      haptic('error', 'ui');
      if (settings.captions) setCaption('[No interaction available]');
      return;
    }
    const target = targets[0].object;
    const meta = FF_META[target.id];
    if (!meta) return;

    if (meta.role === 'resonator') {
      if (target.state === 'attuned') {
        // Post-completion optional interaction: listen to it at rest.
        const voice = voiceForObject(FIRST_FRACTURE_SCORE, target.id);
        if (voice && settings.sound) {
          playUri(renderVoicesUri([voiceRender(voice, { presence: 'confident', pan: panFor(world, target), proximity: 1 })]));
        }
        const text = meta.postRestoreText ?? meta.inspectText;
        setInspectText(text);
        announcerRef.current.critical(text);
        if (grantReward('ff-afterglow')) {
          announcerRef.current.critical('Reward earned: Afterglow.');
        }
        return;
      }
      setPuzzleFeedback(null);
      setPuzzleObjectId(target.id);
      announcerRef.current.critical(`Attuning ${target.label}. ${nodeFor(target.id)?.narrative ?? ''}`);
      return;
    }

    if (meta.role === 'fragment') {
      const prev = chapterRef.current;
      if (!prev.collected.includes(target.id)) {
        updateExplore(CAMPAIGN_ID, { collected: [...prev.collected, target.id] });
        if (meta.rewardId) grantReward(meta.rewardId);
        target.state = 'attuned';
        target.interactable = false;
        setInspectText(meta.inspectText);
        announcerRef.current.critical(`Collected: ${target.label}. ${meta.inspectText}`);
        haptic('success', 'gameplay');
        if (settings.captions) setCaption('[A small chime as the fragment is collected]');
        if (settings.sound) playUri(renderVoicesUri([{ freq: 1046.5, gain: 0.18, pan: panFor(world, target), timbre: 'chime' }], 1.2));
        refresh();
      }
      return;
    }

    if (meta.role === 'inspect') {
      const text = isRestored && meta.postRestoreText ? meta.postRestoreText : meta.inspectText;
      setInspectText(text);
      announcerRef.current.critical(text);
      haptic('select', 'ui');
      const prev = chapterRef.current;
      if (!prev.inspected.includes(target.id)) {
        const inspected = [...prev.inspected, target.id];
        updateExplore(CAMPAIGN_ID, { inspected });
        if (FF_INSPECT_IDS.every((id) => inspected.includes(id))) {
          if (grantReward('ff-surveyor')) announcerRef.current.critical('Reward earned: Field Notes.');
        }
      }
      return;
    }

    if (meta.role === 'hidden') {
      const prev = chapterRef.current;
      setInspectText(meta.inspectText);
      announcerRef.current.critical(meta.inspectText);
      haptic('success', 'gameplay');
      if (!prev.visitedHidden.includes(target.id)) {
        updateExplore(CAMPAIGN_ID, { visitedHidden: [...prev.visitedHidden, target.id] });
        if (meta.rewardId && grantReward(meta.rewardId)) {
          announcerRef.current.critical('Hidden discovery recorded.');
        }
      }
    }
  }, [grantReward, haptic, isRestored, playUri, refresh, settings.captions, settings.sound, updateExplore, world]);

  /* ---------------- shake-to-interact (optional input channel) ---------------- */

  const lastShakeRef = useRef(0);
  const performInteractRef = useRef(performInteract);
  performInteractRef.current = performInteract;
  useEffect(() => {
    // Shake is a native-only optional input channel; the Interact button is
    // always the primary path. expo-sensors is loaded lazily because its web
    // shim crashes at import time.
    if (Platform.OS === 'web' || !settings.shakeToInteract || puzzleObjectId) return;
    let sub: { remove: () => void } | null = null;
    let cancelled = false;
    void import('expo-sensors')
      .then(({ Accelerometer }) => {
        if (cancelled) return;
        Accelerometer.setUpdateInterval(120);
        sub = Accelerometer.addListener(({ x, y, z }: { x: number; y: number; z: number }) => {
          const magnitude = Math.sqrt(x * x + y * y + z * z);
          if (magnitude > SHAKE_THRESHOLD) {
            const now = Date.now();
            if (now - lastShakeRef.current < SHAKE_COOLDOWN_MS) return;
            lastShakeRef.current = now;
            // Same semantic action as the on-screen Interact button.
            performInteractRef.current();
          }
        });
      })
      .catch(() => {
        // Sensors unavailable: shake simply does nothing; buttons carry the game.
      });
    return () => {
      cancelled = true;
      sub?.remove();
    };
  }, [settings.shakeToInteract, puzzleObjectId]);

  /* ---------------- embedded puzzle (verbatim campaign nodes) ---------------- */

  function nodeFor(objectId: string): Node | null {
    const nodeId = FF_META[objectId]?.nodeId;
    return campaign.nodes.find((n) => n.id === nodeId) ?? null;
  }

  const puzzleNode = puzzleObjectId ? nodeFor(puzzleObjectId) : null;
  const puzzleObject = puzzleObjectId ? world.objects.find((o) => o.id === puzzleObjectId) : null;

  const handlePuzzleChoice = useCallback(
    (choiceId: string) => {
      if (!puzzleNode || !puzzleObjectId) return;
      const choice = puzzleNode.choices.find((c) => c.id === choiceId);
      if (!choice) return;
      if (choice.isCorrect) {
        setPuzzleFeedback({ type: 'success', text: 'Resonance matched.' });
        setPuzzleObjectId(null);
        attuneObject(puzzleObjectId);
      } else {
        const text = choice.feedbackOnFail ?? 'The resonance does not match. Try again.';
        setPuzzleFeedback({ type: 'error', text });
        announcerRef.current.critical(text);
        haptic('error', 'gameplay');
        if (settings.sound) {
          // Unstable error texture, not a jingle: detuned low drone.
          playUri(renderVoicesUri([{ freq: 150, gain: 0.22, pan: 0, timbre: 'drone', detuneCents: 18 }], 1.2));
        }
        if (settings.captions) setCaption('[A low, unstable tone — the fracture resists]');
      }
    },
    [attuneObject, haptic, playUri, puzzleNode, puzzleObjectId, settings.captions, settings.sound],
  );

  /* ---------------- render ---------------- */

  const canInteract = useMemo(
    () => interactableObjects(world).length > 0,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [world, description],
  );

  const nearestView = visibleObjects(world)[0] ?? null;
  const earnedCount = Object.keys(rewards.earned).length;

  return (
    <ScreenContainer testID="explore-screen" scroll>
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
        <View style={{ flex: 1 }}>
          <ThemedText variant="heading" accessibilityRole="header">
            The First Fracture
          </ThemedText>
          <ThemedText variant="caption" color={colors.mutedForeground} testID="text-progress">
            {attunedCount} / {FF_RESONATOR_IDS.length} resonators attuned
            {earnedCount > 0 ? ` · ${earnedCount} discoveries` : ''}
          </ThemedText>
        </View>
      </View>

      {cameraOpen ? <CameraLayer world={world} onClose={() => setCameraOpen(false)} /> : null}

      {puzzleNode && puzzleObject ? (
        <View
          style={[styles.card, { backgroundColor: colors.card, borderColor: colors.primary, borderRadius: baseColors.radius }]}
          testID="puzzle-panel"
        >
          <ThemedText variant="caption" color={colors.primary} style={styles.cardLabel}>
            ATTUNING {puzzleObject.label.toUpperCase()}
          </ThemedText>
          <ThemedText variant="body">{puzzleNode.narrative}</ThemedText>
          <ThemedText variant="body" color={colors.mutedForeground}>
            {puzzleNode.targetDescription}
          </ThemedText>
          {settings.sound && puzzleNode.toneFreq ? (
            <GameButton
              label="Play target tone"
              variant="outline"
              testID="button-play-tone"
              onPress={() => {
                playUri(renderVoicesUri([{ freq: puzzleNode.toneFreq!, gain: 0.25, pan: 0, timbre: 'drone', detuneCents: 10 }], 1.6));
                if (settings.captions && puzzleNode.toneCaption) setCaption(puzzleNode.toneCaption);
              }}
            />
          ) : null}
          {settings.captions && puzzleNode.toneCaption ? (
            <ThemedText variant="caption" color={colors.mutedForeground}>
              {puzzleNode.toneCaption}
            </ThemedText>
          ) : null}
          {puzzleFeedback ? (
            <ThemedText
              variant="body"
              color={puzzleFeedback.type === 'error' ? colors.destructive : colors.primary}
              testID={`feedback-${puzzleFeedback.type}`}
            >
              {puzzleFeedback.text}
            </ThemedText>
          ) : null}
          {puzzleNode.choices.map((choice) => (
            <GameButton
              key={choice.id}
              label={choice.label}
              variant="outline"
              testID={`choice-${choice.id}`}
              icon={<MaterialCommunityIcons name={choice.icon} size={22} color={colors.foreground} />}
              onPress={() => handlePuzzleChoice(choice.id)}
            />
          ))}
          <GameButton
            label="Step back"
            variant="ghost"
            testID="button-puzzle-close"
            onPress={() => {
              setPuzzleObjectId(null);
              setPuzzleFeedback(null);
            }}
          />
        </View>
      ) : (
        <>
          <View
            accessible
            accessibilityLabel={`Surroundings: ${description}`}
            testID="text-surroundings"
            style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: baseColors.radius }]}
          >
            <ThemedText variant="caption" color={colors.primary} style={styles.cardLabel}>
              SURROUNDINGS
            </ThemedText>
            <ThemedText variant="body">{description}</ThemedText>
            {nearestView ? (
              <View style={styles.visualRow}>
                <ResonanceVisual state={nearestView.object.state} label={nearestView.object.label} />
                <ThemedText variant="caption" color={colors.mutedForeground} style={{ flex: 1 }}>
                  Nearest: {nearestView.object.label}, {nearestView.direction.replace('-', ' and ')},{' '}
                  {nearestView.distanceCategory}.
                </ThemedText>
              </View>
            ) : null}
          </View>

          {inspectText ? (
            <ThemedText variant="body" color={colors.mutedForeground} testID="text-inspect" style={styles.inspect}>
              {inspectText}
            </ThemedText>
          ) : null}

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
                icon={<MaterialCommunityIcons name="rotate-right" size={24} color={colors.foreground} />}
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
            <View style={styles.row}>
              <GameButton
                label="Look Around"
                testID="button-look-around"
                accessibilityHint="Describes your surroundings"
                icon={<Feather name="eye" size={22} color={colors.primaryForeground} />}
                onPress={handleLookAround}
                style={styles.half}
              />
              <GameButton
                label="Listen"
                variant="outline"
                testID="button-listen"
                accessibilityHint="Plays the current environmental soundscape with a caption"
                icon={<Feather name="volume-2" size={22} color={colors.foreground} />}
                onPress={playSoundscape}
                style={styles.half}
              />
            </View>
            <GameButton
              label="Interact"
              testID="button-interact"
              disabled={!canInteract}
              accessibilityHint="Interacts with the nearest object within reach"
              icon={<MaterialCommunityIcons name="gesture-tap" size={24} color={colors.primaryForeground} />}
              onPress={performInteract}
            />
            <GameButton
              label={cameraOpen ? 'Hide camera view' : 'Camera view (optional)'}
              variant="ghost"
              testID="button-camera-toggle"
              accessibilityHint="Optional camera presentation. The game never requires it."
              onPress={() => setCameraOpen((v) => !v)}
            />
          </View>
        </>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  backButton: { alignItems: 'center', justifyContent: 'center' },
  card: { borderWidth: 1, padding: 18, gap: 10, marginBottom: 12 },
  cardLabel: { letterSpacing: 1.2, fontFamily: 'Inter_600SemiBold' },
  visualRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 6 },
  inspect: { marginBottom: 10 },
  caption: { fontStyle: 'italic', marginBottom: 10 },
  controls: { gap: 12, paddingBottom: 12 },
  row: { flexDirection: 'row', gap: 12 },
  half: { flex: 1 },
});
