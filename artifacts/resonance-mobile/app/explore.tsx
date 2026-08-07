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
MANDATORY CAPABILITY RULE — DO NOT SELF-DOWNGRADE THE ENGINE

For Phase 4, implement the intended full native systems:

* True 3-D world rendering
* True world-space AR
* True native 3-D positional/spatial audio

Do NOT create a deliberately simplified second implementation as the normal fallback for older hardware.

Do NOT use:

* Stereo approximation instead of native spatial audio
* 2-D directional camera overlays instead of world-space AR
* Flat markers or simplified pseudo-3-D instead of the real 3-D renderer

merely because some devices or OS versions may expose reduced capabilities.

Implement the real native feature against the appropriate supported Apple frameworks.

Allow iOS, the device, graphics/audio hardware, and the native frameworks themselves to provide whatever capability reduction, rendering degradation, spatial-audio behavior, or compatibility handling is appropriate for that hardware.

The application must not preemptively replace the intended engine with a lesser gameplay system.

REAL-DEVICE VALIDATION IS NOT AN IMPLEMENTATION ESCAPE

If physical hardware is unavailable during development:

IMPLEMENT THE FEATURE ANYWAY.

Then report physical-device validation as outstanding.

“Needs a real iPhone to verify” means:
“The completed implementation still needs hardware testing.”

It must NEVER mean:
“We deferred implementing it.”

This applies equally to:

3-D RENDERING

Build the production 3-D renderer now.

Do not substitute:

* Debug primitives
* Flat directional markers
* 2-D overlays
* Placeholder geometry

and call the system architecture-ready.

WORLD-SPACE AR

Build the actual AR system now using supported native world-space technology.

Do not stop at:

* Camera preview
* Directional overlay
* Simulated AR
* Architecture preparation

and defer real AR.

3-D SPATIAL AUDIO

Build native world-positioned spatial audio now.

Do not stop at:

* Stereo panning
* Volume reduction for behind
* Left/right approximation
* Simulated depth

and defer real positional audio.

The visual world, AR world, semantic world, and audio world must use the same object positions.

CAPABILITY DIFFERENCES

Where Apple APIs expose device-capability differences, handle them through the intended native API behavior and normal compatibility handling.

Do not redesign the game around the least-capable hypothetical device.

Do not create an inferior parallel engine unless a documented platform requirement genuinely makes one necessary.

If such a platform limitation is discovered, document:

1. The exact Apple/platform limitation.
2. Which device or OS capability is affected.
3. What the native framework does automatically.
4. Whether any application-level handling is actually required.

Do not invent compatibility limitations.

Do not use speculative compatibility concerns to reduce Phase 4 scope.

PHASE 4 ACCEPTANCE RULE

The following phrases are NOT acceptable substitutes for implementation:

* “architecture-ready”
* “prepared for later”
* “foundation complete”
* “will come in a future phase”
* “simulated for now”
* “stereo approximation”
* “camera overlay”
* “placeholder renderer”
* “device testing required before implementation”

Phase 4 requires the actual production systems to be implemented now.

Physical-device testing may remain open.

Implementation may not. */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
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
import { environmentCaption, environmentVoices } from '@/lib/music/environment';
import { contextualAction, noActionHint, actionForObject, type SemanticAction } from '@/lib/actions';
import {
  FIRST_FRACTURE_REWARDS,
  activeUnlocks,
  evaluateRewards,
  type RewardContext,
} from '@/lib/rewards';
import { campaignRecords, explorationSummary } from '@/lib/replay';
import { createAnnouncementCoalescer } from '@/lib/spatial/announce';
import { ResonanceVisual } from '@/components/resonance-visual';
import { CameraLayer } from '@/components/camera-layer';
import { WorldScene } from '@/components/world3d/world-scene';
import { sceneState, sceneDescription } from '@/lib/scene/entities';
import { pingGuidance, prioritizedLookAround, type Guidance } from '@/lib/guidance';
import { isNativeSpatialAudioAvailable, isNativeARAvailable, NativeARView } from '../modules/resonance-native';
import { syncNativeSpatialAudio, stopNativeSpatialAudio, toNativeEntities } from '@/lib/native/bridge';
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
  const [sceneOpen, setSceneOpen] = useState(true);
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

  // Unlock payloads are DERIVED from the earned-reward ledger — they can
  // never desync from real progress.
  const unlocks = useMemo(() => activeUnlocks(FIRST_FRACTURE_REWARDS, rewards), [rewards]);
  const hasQuietFocus = unlocks.some((u) => u.kind === 'fieldEffect' && u.effectId === 'ff-quiet-focus');
  const hasOvertoneCrown = unlocks.some((u) => u.kind === 'musicLayer' && u.layerId === 'ff-overtone-crown');
  const archiveEntries = unlocks.filter((u) => u.kind === 'archiveEntry');

  const playSoundscape = useCallback(() => {
    const states = voiceStates();
    // Environmental music: positional object voices layered over the
    // environment's own restoration-stage bed (with any unlocked layers).
    const objectVoices = soundscapeVoices(FIRST_FRACTURE_SCORE, states);
    const envVoices = environmentVoices(FIRST_FRACTURE_SCORE, chapterRef.current.attuned, {
      quietFocus: hasQuietFocus,
      overtoneCrown: hasOvertoneCrown,
    });
    if (settings.sound) playUri(renderVoicesUri([...objectVoices, ...envVoices], 3.2));
    const stage = environmentCaption(chapterRef.current.attuned.length, FF_RESONATOR_IDS.length);
    const parts = FIRST_FRACTURE_SCORE.voices.map((v) => {
      const s = states[v.objectId];
      const word = s.presence === 'confident' ? 'settled' : s.presence === 'clear' ? 'unsteady' : 'faint and wavering';
      return `${v.plainIdentity} (${v.note}) — ${word}`;
    });
    const text = `${stage} [${parts.join('; ')}]`;
    if (settings.captions) setCaption(text);
    announcerRef.current.critical(stage.replace(/[[\]]/g, ''));
  }, [hasOvertoneCrown, hasQuietFocus, playUri, settings.captions, settings.sound, voiceStates]);

  // ONE action context shared by guidance, contextual button, 3-D taps and
  // VoiceOver actions (declared before movement handlers that use it).
  const actionCtx = useMemo(
    () => ({
      roleOf: (id: string) => FF_META[id]?.role,
      // "Done" = this object's primary action is finished, so guidance
      // steers toward whatever is still new instead of a visited place.
      isDone: (id: string) => {
        const c = chapterRef.current;
        const role = FF_META[id]?.role;
        if (role === 'fragment') return c.collected.includes(id);
        if (role === 'hidden') return c.visitedHidden.includes(id);
        if (role === 'inspect') return c.inspected.includes(id);
        if (role === 'resonator') return c.attuned.includes(id);
        return false;
      },
    }),
    [],
  );

  // Native presentation sync (real iOS builds only): mirror the semantic
  // world into the native HRTF spatial-audio engine after every state
  // change. No-op in Expo Go / web preview — the module is absent there.
  useEffect(() => {
    if (!isNativeSpatialAudioAvailable()) return;
    if (!settings.sound) {
      // Respect the sound-off setting on native builds too: the native
      // engine loops positional tones and must be silenced explicitly.
      stopNativeSpatialAudio().catch(() => {});
      return;
    }
    syncNativeSpatialAudio(world, actionCtx.isDone).catch((err) => {
      // Surface loudly (no silent fallback): the JS soundscape still runs.
      console.error('Native spatial audio sync failed:', err);
    });
  });
  useEffect(() => {
    return () => {
      stopNativeSpatialAudio().catch(() => {});
    };
  }, []);

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

  // Look Around: prioritised guidance first (unresolved objectives), then
  // the protected Phase 3 orientation summary, unchanged.
  const handleLookAround = useCallback(() => {
    const base = orientationSummary(world);
    const remaining = FF_RESONATOR_IDS.filter((id) => !chapterRef.current.attuned.includes(id)).length;
    const summary = prioritizedLookAround(world, actionCtx, base, remaining);
    setDescription(summary);
    announcerRef.current.critical(summary);
  }, [actionCtx, world]);

  // Ping Nearest: names the kind of unresolved signal, direction, distance,
  // elevation, and closer/farther progress since the last ping.
  const lastPingRef = useRef<Guidance | null>(null);
  const handlePing = useCallback(() => {
    const { guidance, text } = pingGuidance(world, actionCtx, lastPingRef.current);
    lastPingRef.current = guidance;
    announcerRef.current.critical(text);
    if (settings.captions) setCaption(`[Ping: ${text}]`);
    haptic('select', 'ui');
  }, [actionCtx, haptic, settings.captions, world]);

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

  /**
   * Reward engine hookup: build a context snapshot from the chapter state
   * and let the DECLARATIVE conditions decide what has been earned. No
   * gameplay branch ever hard-codes "if fragment X then award X".
   */
  const evalRewards = useCallback(
    (next: {
      attuned: string[];
      collected: string[];
      inspected: string[];
      visitedHidden: string[];
      listenedAtRest: string[];
    }) => {
      const ctx: RewardContext = {
        campaignId: CAMPAIGN_ID,
        collected: next.collected,
        visited: next.visitedHidden,
        inspected: next.inspected,
        attunedCount: next.attuned.length,
        listenedAtRestRoles: next.listenedAtRest,
      };
      // rewardsRef inside the provider is synchronous, so evaluating against
      // the rendered `rewards` snapshot is safe: duplicates are rejected.
      for (const def of evaluateRewards(FIRST_FRACTURE_REWARDS, ctx, rewards)) {
        if (grantReward(def.id)) {
          haptic('reward', 'gameplay');
          announcerRef.current.critical(`Reward earned: ${def.title}.`);
          if (def.payload) {
            const label =
              def.payload.kind === 'archiveEntry'
                ? `Archive entry added: ${def.payload.title}.`
                : `Unlocked: ${def.payload.label}.`;
            announcerRef.current.critical(label);
          }
        }
      }
    },
    [grantReward, haptic, rewards],
  );

  const completeRestoration = useCallback(() => {
    updateProgress(CAMPAIGN_ID, campaign.nodes.length, true);
    // Post-restoration environmental change: inspect texts change and the
    // final hidden place appears (handled by revealHiddenIfDue).
    if (settings.sound) playUri(renderVoicesUri(resolutionVoices(FIRST_FRACTURE_SCORE), 3.2));
    const text = resolutionCaption(FIRST_FRACTURE_SCORE);
    if (settings.captions) setCaption(text);
    announcerRef.current.critical(
      'All four resonators attuned. ' + text.replace(/[[\]]/g, '') + ' The beacon is restored.',
    );
    haptic('restoration', 'gameplay');
  }, [haptic, playUri, settings.captions, settings.sound, updateProgress]);

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
            // The attuned voice settles IN CONTEXT: it plays in tune over the
            // environment's current stage bed, so restoration is heard as a
            // musical change in the world, not a swapped sound effect.
            const env = environmentVoices(FIRST_FRACTURE_SCORE, attuned);
            playUri(renderVoicesUri([voiceRender(voice, { presence: 'confident', pan, proximity: 1 }), ...env], 3.0));
          }
          const text = voiceChangeCaption(voice, 'confident', pan);
          if (settings.captions) setCaption(text);
          announcerRef.current.critical(`${obj.label} attuned. ` + text.replace(/[[\]]/g, ''));
          haptic('attuned', 'gameplay');
        }
      }
      evalRewards({ ...chapterRef.current, attuned });
    },
    [completeRestoration, evalRewards, haptic, playUri, refresh, revealHiddenIfDue, settings.captions, settings.sound, updateExplore, world],
  );

  /** ONE dispatcher for every input mechanism (button, 3-D tap, VoiceOver,
   * shake, Shortcut deep link). All inputs resolve to a SemanticAction and
   * land here — no input has its own gameplay logic. */
  // Rapid-repeat protection (§11): every input channel — button, 3-D tap,
  // VoiceOver action, shake, Shortcut deep link — funnels through here, so
  // near-simultaneous native events cannot double-fire a semantic action.
  const lastActionRef = useRef(0);
  const performAction = useCallback(
    (action: SemanticAction) => {
      const now = Date.now();
      if (now - lastActionRef.current < MOVE_DEBOUNCE_MS) return;
      lastActionRef.current = now;
      const target = world.objects.find((o) => o.id === action.objectId);
      const meta = FF_META[action.objectId];
      if (!target || !meta) return;

      switch (action.kind) {
        case 'attune': {
          setPuzzleFeedback(null);
          setPuzzleObjectId(target.id);
          announcerRef.current.critical(`Attuning ${target.label}. ${nodeFor(target.id)?.narrative ?? ''}`);
          return;
        }
        case 'listen-rest': {
          // Post-completion optional interaction: listen to it at rest.
          const voice = voiceForObject(FIRST_FRACTURE_SCORE, target.id);
          if (voice && settings.sound) {
            playUri(renderVoicesUri([voiceRender(voice, { presence: 'confident', pan: panFor(world, target), proximity: 1 })]));
          }
          const text = meta.postRestoreText ?? meta.inspectText;
          setInspectText(text);
          announcerRef.current.critical(text);
          // Persist listen-at-rest evidence so the reward survives restarts
          // and can be validated against the save (anti-forgery reconcile).
          const prevState = chapterRef.current;
          if (!prevState.listenedAtRest.includes(meta.role)) {
            const next = { ...prevState, listenedAtRest: [...prevState.listenedAtRest, meta.role] };
            updateExplore(CAMPAIGN_ID, next);
            evalRewards(next);
          } else {
            evalRewards(prevState);
          }
          return;
        }
        case 'collect': {
          const prev = chapterRef.current;
          if (prev.collected.includes(target.id)) return;
          const next = { ...prev, collected: [...prev.collected, target.id] };
          updateExplore(CAMPAIGN_ID, { collected: next.collected });
          target.state = 'attuned';
          target.interactable = false;
          setInspectText(meta.inspectText);
          announcerRef.current.critical(`Collected: ${target.label}. ${meta.inspectText}`);
          haptic('success', 'gameplay');
          if (settings.captions) setCaption('[A small chime as the fragment is collected]');
          if (settings.sound) playUri(renderVoicesUri([{ freq: 1046.5, gain: 0.18, pan: panFor(world, target), timbre: 'chime' }], 1.2));
          refresh();
          evalRewards(next);
          return;
        }
        case 'inspect': {
          const text = isRestored && meta.postRestoreText ? meta.postRestoreText : meta.inspectText;
          setInspectText(text);
          announcerRef.current.critical(text);
          haptic('select', 'ui');
          const prev = chapterRef.current;
          if (!prev.inspected.includes(target.id)) {
            const next = { ...prev, inspected: [...prev.inspected, target.id] };
            updateExplore(CAMPAIGN_ID, { inspected: next.inspected });
            evalRewards(next);
          }
          return;
        }
        case 'visit': {
          const prev = chapterRef.current;
          setInspectText(meta.inspectText);
          announcerRef.current.critical(meta.inspectText);
          haptic('discovery', 'gameplay');
          if (!prev.visitedHidden.includes(target.id)) {
            const next = { ...prev, visitedHidden: [...prev.visitedHidden, target.id] };
            updateExplore(CAMPAIGN_ID, { visitedHidden: next.visitedHidden });
            evalRewards(next);
          }
          return;
        }
      }
    },
    [evalRewards, haptic, isRestored, playUri, refresh, settings.captions, settings.sound, updateExplore, world],
  );

  /** The current CONTEXTUAL action: what the primary button will do. */
  const currentAction = useMemo(
    () => contextualAction(world, actionCtx),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [world, actionCtx, description, chapter],
  );

  const performInteract = useCallback(() => {
    const action = contextualAction(world, actionCtx);
    if (!action) {
      const hint = noActionHint(world, actionCtx);
      announcerRef.current.critical(hint);
      haptic('error', 'ui');
      if (settings.captions) setCaption(`[${hint}]`);
      return;
    }
    performAction(action);
  }, [actionCtx, haptic, performAction, settings.captions, world]);

  /* ---------------- Shortcut / deep-link route (Action Button, Back Tap) ---------------- */

  // Opening resonance-mobile://explore?action=interact triggers the current
  // contextual semantic action — the SAME dispatcher as every other input.
  // iOS users can wrap that URL in a Shortcut and assign it to the Action
  // Button or to Back Tap (Settings → Accessibility → Touch → Back Tap).
  // The app stays fully functional without either.
  const params = useLocalSearchParams<{ action?: string }>();
  const consumedParamRef = useRef(false);
  useEffect(() => {
    if (params.action === 'interact') {
      if (!consumedParamRef.current) {
        consumedParamRef.current = true;
        performInteractRef.current();
      }
    } else {
      // Param cleared (or navigation without it): re-arm so the next
      // Shortcut / Action Button / Back Tap invocation dispatches again.
      consumedParamRef.current = false;
    }
  }, [params.action]);

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

  // The "Nearest" readout must agree with Ping/guidance (§3: one nearest,
  // not two): prefer the nearest DISCOVERED object that still has something
  // new; fall back to the nearest discovered object of any state.
  const nearestView = (() => {
    const views = visibleObjects(world);
    return views.find((v) => !actionCtx.isDone(v.object.id)) ?? views[0] ?? null;
  })();
  const earnedCount = Object.keys(rewards.earned).length;
  const records = useMemo(
    () =>
      campaignRecords(
        {
          campaignId: CAMPAIGN_ID,
          requiredIds: FF_RESONATOR_IDS,
          collectibleIds: ['fragment-a', 'fragment-b', 'fragment-c'],
          inspectIds: FF_INSPECT_IDS,
          hiddenIds: Object.entries(FF_META)
            .filter(([, m]) => m.role === 'hidden')
            .map(([id]) => id),
        },
        chapter,
        rewards,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [chapter.attuned.length, chapter.collected.length, chapter.inspected.length, chapter.visitedHidden.length, rewards],
  );

  // VoiceOver custom actions on the surroundings card: the same semantic
  // action system, exposed without hunting for a visual target.
  const a11yActions = useMemo(() => {
    const acts: { name: string; label: string }[] = [
      { name: 'look', label: 'Look around' },
      { name: 'listen', label: 'Listen to the soundscape' },
    ];
    if (currentAction) acts.unshift({ name: 'interact', label: currentAction.label });
    return acts;
  }, [currentAction]);

  const onA11yAction = useCallback(
    (event: { nativeEvent: { actionName: string } }) => {
      const name = event.nativeEvent.actionName;
      if (name === 'interact') performInteract();
      else if (name === 'listen') playSoundscape();
      else if (name === 'look') handleLookAround();
    },
    [handleLookAround, performInteract, playSoundscape],
  );

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
            {earnedCount > 0 ? ` · ${earnedCount} discoveries` : ''} · {explorationSummary(records)}
          </ThemedText>
        </View>
      </View>

      {cameraOpen ? (
        isNativeARAvailable() ? (
          // Real world-space AR (RealityKit) — only in a native iOS build.
          <View style={StyleSheet.absoluteFill}>
            <NativeARView
              entities={toNativeEntities(world, actionCtx.isDone)}
              style={StyleSheet.absoluteFill}
            />
            <GameButton
              label="Close AR"
              icon={<Feather name="x" size={18} color={baseColors.dark.primaryForeground} />}
              onPress={() => setCameraOpen(false)}
              style={{ position: 'absolute', top: 60, right: 16 }}
            />
          </View>
        ) : (
          <CameraLayer world={world} onClose={() => setCameraOpen(false)} />
        )
      ) : null}

      {sceneOpen && !puzzleNode ? (
        <View
          accessible
          accessibilityLabel={`3-D view of the fracture zone. ${sceneDescription(
            sceneState(world, { roleOf: actionCtx.roleOf, requiredIds: FF_RESONATOR_IDS }),
          )} The same information is available in the Surroundings text below.`}
          testID="world-3d"
          style={{ marginBottom: 12, borderRadius: baseColors.radius, overflow: 'hidden' }}
        >
          <WorldScene
            scene={sceneState(world, {
              roleOf: actionCtx.roleOf,
              focusedId: currentAction?.objectId ?? null,
              requiredIds: FF_RESONATOR_IDS,
            })}
            onSelectEntity={(id) => {
              // A tap on a rendered object invokes the SAME semantic action
              // as the accessible button — no renderer-specific logic.
              const action = actionForObject(world, id, actionCtx);
              if (action) {
                const reachable = contextualAction(world, actionCtx);
                if (reachable && reachable.objectId === id) performAction(action);
                else announcerRef.current.critical(`${action.label}: move closer first.`);
              }
            }}
            reduceMotion={settings.reduceMotion}
            quality={settings.graphicsQuality}
          />
        </View>
      ) : null}

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
            accessibilityActions={a11yActions}
            onAccessibilityAction={onA11yAction}
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
                accessibilityHint="Describes your surroundings, most important things first"
                icon={<Feather name="eye" size={22} color={colors.primaryForeground} />}
                onPress={handleLookAround}
                style={styles.half}
              />
              <GameButton
                label="Ping Nearest"
                variant="outline"
                testID="button-ping"
                accessibilityHint="Tells you the nearest unresolved signal, its direction and distance, and whether you are getting closer"
                icon={<MaterialCommunityIcons name="radar" size={22} color={colors.foreground} />}
                onPress={handlePing}
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
              label={currentAction ? currentAction.label : 'Interact'}
              testID="button-interact"
              accessibilityHint={
                currentAction
                  ? 'Performs the named action on the nearby object'
                  : 'Tells you where the nearest signal is'
              }
              icon={<MaterialCommunityIcons name="gesture-tap" size={24} color={colors.primaryForeground} />}
              onPress={performInteract}
            />
            {archiveEntries.length > 0 ? (
              <View
                style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: baseColors.radius }]}
                testID="archive-panel"
              >
                <ThemedText variant="caption" color={colors.primary} style={styles.cardLabel}>
                  ARCHIVE — UNLOCKED BY DISCOVERIES
                </ThemedText>
                {archiveEntries.map((entry) => (
                  <View key={entry.title} accessible accessibilityLabel={`${entry.title}. ${entry.text}`}>
                    <ThemedText variant="body" style={{ fontFamily: 'Inter_600SemiBold' }}>
                      {entry.title}
                    </ThemedText>
                    <ThemedText variant="caption" color={colors.mutedForeground}>
                      {entry.text}
                    </ThemedText>
                  </View>
                ))}
              </View>
            ) : null}
            <GameButton
              label={sceneOpen ? 'Hide 3-D view' : 'Show 3-D view (optional)'}
              variant="ghost"
              testID="button-scene-toggle"
              accessibilityHint="Optional 3-D presentation. Every piece of information is also in the text."
              onPress={() => setSceneOpen((v) => !v)}
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
