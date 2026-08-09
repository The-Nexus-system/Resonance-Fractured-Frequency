/**
 * Day One — Gate One (native): continuous physical traversal from the Earth
 * transport cabin to the Hearth's first lift. Movement is hold-to-move only;
 * Look Around and Badge Guidance describe, never move. Every sound has a
 * caption and VoiceOver announcement equivalent.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GameButton, ScreenContainer, ThemedText } from '@/components/ui';
import { useGame } from '@/context/game-provider';
import { getCharacter } from '@/lib/gateone/characters';
import {
  GateOneNativeEngine,
  type Caption,
  type EngineSnapshot,
  type HeldControl,
} from '@/lib/gateone/engine';
import { WALKABLE } from '@/lib/gateone/world';
import { defaultGateOne } from '@/lib/save';

const MAP_W = 300;
const MAP_H = 200;
// World bounds for the mini-map: x in [-28..30], y in [0..104].
const WX0 = -28;
const WX1 = 30;
const WY0 = 0;
const WY1 = 104;
const sx = (x: number) => ((x - WX0) / (WX1 - WX0)) * MAP_W;
const sy = (y: number) => MAP_H - ((y - WY0) / (WY1 - WY0)) * MAP_H;

export default function DayOneScreen() {
  const router = useRouter();
  const {
    colors, haptic, announce, playUri, settings, gateOne, updateGateOne, minTargetHeight,
  } = useGame();
  const character = getCharacter(gateOne.characterId);
  const [started, setStarted] = useState(false);
  const [complete, setComplete] = useState(gateOne.complete);
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [snap, setSnap] = useState<EngineSnapshot | null>(null);
  const engineRef = useRef<GateOneNativeEngine | null>(null);
  const scrollRef = useRef<ScrollView>(null);
  const persistRef = useRef(0);

  const begin = useCallback(() => {
    if (!character || engineRef.current) return; // idempotent: no double engines
    const engine = new GateOneNativeEngine(
      character.id,
      {
        onCaption: (c) => {
          setCaptions((prev) => [...prev.slice(-60), c]);
          requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));
        },
        onAnnounce: announce,
        onStateChange: () => {
          const e = engineRef.current;
          if (!e) return;
          setSnap(e.snapshot());
          const now = Date.now();
          if (now - persistRef.current > 2000) {
            persistRef.current = now;
            updateGateOne({
              x: e.x, y: e.y, heading: e.heading,
              hatchOpen: e.hatchOpen,
              firedEvents: e.getFiredEvents(),
            });
          }
        },
        onGateOneComplete: () => {
          setComplete(true);
          updateGateOne({ complete: true });
          haptic('restoration', 'gameplay');
        },
        onPlayTone: (uri) => playUri(uri),
        onHaptic: (kind) => {
          if (kind === 'badge') haptic('discovery', 'gameplay');
          else if (kind === 'bump') haptic('error', 'gameplay');
          else haptic('approach', 'gameplay');
        },
      },
      gateOne.firedEvents.length > 0 || gateOne.y > 2
        ? {
            x: gateOne.x, y: gateOne.y, heading: gateOne.heading,
            fired: gateOne.firedEvents, hatchOpen: gateOne.hatchOpen,
          }
        : undefined,
    );
    engineRef.current = engine;
    engine.start(settings.sound);
    setStarted(true);
    announce('Day One begins. Hold the movement controls to walk. Look Around and Badge Guidance describe your surroundings.');
  }, [character, announce, playUri, haptic, settings.sound, gateOne, updateGateOne]);

  useEffect(() => {
    return () => {
      const e = engineRef.current;
      if (e) {
        updateGateOne({
          x: e.x, y: e.y, heading: e.heading,
          hatchOpen: e.hatchOpen,
          firedEvents: e.getFiredEvents(),
        });
        e.dispose();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    engineRef.current?.setSound(settings.sound);
  }, [settings.sound]);

  const hold = (c: HeldControl) => engineRef.current?.hold(c);
  const release = (c: HeldControl) => engineRef.current?.release(c);
  // VoiceOver double-tap fires press-in and press-out together, so holds
  // never sustain; a discrete bounded step keeps traversal fully accessible
  // under the same collision rules (never a teleport).
  const step = (c: HeldControl) => engineRef.current?.step(c);

  const restart = useCallback(() => {
    engineRef.current?.dispose();
    engineRef.current = null;
    updateGateOne({ ...defaultGateOne, characterId: gateOne.characterId });
    setCaptions([]);
    setComplete(false);
    setStarted(false);
    setSnap(null);
  }, [gateOne.characterId, updateGateOne]);

  if (!character) {
    return (
      <ScreenContainer testID="day-one-screen">
        <View style={styles.center}>
          <ThemedText variant="title" accessibilityRole="header">Day One</ThemedText>
          <ThemedText variant="body" color={colors.mutedForeground} style={styles.introText}>
            Choose a crew member to begin.
          </ThemedText>
          <GameButton label="Choose crew member" testID="button-choose" onPress={() => router.replace('/characters')} />
        </View>
      </ScreenContainer>
    );
  }

  if (!started && !complete) {
    return (
      <ScreenContainer testID="day-one-screen">
        <View style={styles.center}>
          <ThemedText variant="title" accessibilityRole="header">Day One</ThemedText>
          <ThemedText variant="subheading" color={colors.mutedForeground}>
            {character.name} — {character.rank}, {character.role}
          </ThemedText>
          <ThemedText variant="body" color={colors.mutedForeground} style={styles.introText}>
            The Earth transport is on final approach to the lunar interchange. Everything ahead
            is walked, not skipped: hold the arrows to move and turn. Look Around and Badge
            Guidance describe where things are; they never move you.
          </ThemedText>
          <GameButton label="Begin Day One" testID="button-begin" onPress={begin} />
          <GameButton
            label="Change crew member"
            variant="outline"
            testID="button-change"
            onPress={() => router.replace('/characters')}
          />
        </View>
      </ScreenContainer>
    );
  }

  if (complete) {
    return (
      <ScreenContainer testID="day-one-screen">
        <View style={styles.center}>
          <MaterialCommunityIcons name="elevator-passenger-outline" size={56} color={colors.primary} />
          <ThemedText variant="title" accessibilityRole="header" style={styles.doneTitle}>
            You have reached the first lift
          </ThemedText>
          <ThemedText variant="body" color={colors.mutedForeground} style={styles.introText}>
            "Medical intake first. Everybody. Forward. First lift. Deck Three."
          </ThemedText>
          <ThemedText variant="body" color={colors.mutedForeground} style={styles.introText}>
            Gate One is complete. Medical intake awaits beyond this point.
          </ThemedText>
          <GameButton label="Play Day One again" testID="button-restart" onPress={restart} />
          <GameButton
            label="Change crew member"
            variant="outline"
            testID="button-change"
            onPress={() => {
              restart();
              router.replace('/characters');
            }}
          />
          <GameButton label="Home" variant="outline" testID="button-home" onPress={() => router.replace('/')} />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer testID="day-one-screen">
      <View style={styles.topRow}>
        <ThemedText variant="subheading" accessibilityRole="header">
          {snap?.zoneName ?? 'Transport cabin'}
        </ThemedText>
        <ThemedText variant="caption" color={colors.mutedForeground}>
          {character.name}
        </ThemedText>
      </View>

      {!settings.reduceMotion && snap && (
        <View
          accessible={false}
          importantForAccessibility="no-hide-descendants"
          style={[styles.map, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          {WALKABLE.map((r, i) => (
            <View
              key={i}
              style={{
                position: 'absolute',
                left: sx(r.x1),
                top: sy(r.y2),
                width: Math.max(2, sx(r.x2) - sx(r.x1)),
                height: Math.max(2, sy(r.y1) - sy(r.y2)),
                backgroundColor: colors.accent,
                borderRadius: 3,
              }}
            />
          ))}
          {snap.npcs.map((n) => (
            <View
              key={n.id}
              style={[styles.dot, { left: sx(n.x) - 3, top: sy(n.y) - 3, backgroundColor: colors.mutedForeground }]}
            />
          ))}
          <View
            style={[
              styles.player,
              {
                left: sx(snap.x) - 5,
                top: sy(snap.y) - 5,
                backgroundColor: colors.primary,
                transform: [{ rotate: `${(snap.heading * 180) / Math.PI}deg` }],
              },
            ]}
          />
        </View>
      )}

      <ScrollView
        ref={scrollRef}
        style={[styles.captions, { borderColor: colors.border }]}
        contentContainerStyle={styles.captionsInner}
        testID="list-captions"
      >
        {captions.length === 0 && (
          <ThemedText variant="caption" color={colors.mutedForeground}>
            The cabin hums around you. Hold forward to move.
          </ThemedText>
        )}
        {settings.captions &&
          captions.map((c) => (
            <ThemedText key={c.id} variant="caption" testID={`caption-${c.id}`}>
              {c.speaker ? `${c.speaker}: ` : ''}
              {c.text}
            </ThemedText>
          ))}
      </ScrollView>

      <View style={styles.assistRow}>
        <GameButton
          label="Look Around"
          variant="outline"
          testID="button-look"
          onPress={() => {
            haptic('select');
            const text = engineRef.current?.lookAround();
            if (text) {
              announce(text);
              setCaptions((prev) => [
                ...prev.slice(-60),
                { id: Date.now(), speaker: 'You look around', kind: 'narration', text },
              ]);
            }
          }}
        />
        <GameButton
          label="Badge Guidance"
          variant="outline"
          testID="button-guidance"
          onPress={() => {
            const text = engineRef.current?.repeatGuidance();
            if (text) {
              announce(text);
              setCaptions((prev) => [
                ...prev.slice(-60),
                { id: Date.now(), speaker: 'Badge', kind: 'badge', text },
              ]);
            }
          }}
        />
      </View>

      <View style={styles.controls}>
        <HoldButton
          icon="rotate-left"
          label="Turn left"
          color={colors.primary}
          bg={colors.card}
          border={colors.border}
          size={minTargetHeight + 12}
          onIn={() => hold('left')}
          onOut={() => release('left')}
          onStep={() => step('left')}
          testID="ctl-left"
        />
        <View style={styles.controlsMid}>
          <HoldButton
            icon="arrow-up-bold"
            label="Move forward"
            color={colors.primary}
            bg={colors.card}
            border={colors.border}
            size={minTargetHeight + 12}
            onIn={() => hold('forward')}
            onOut={() => release('forward')}
            onStep={() => step('forward')}
            testID="ctl-forward"
          />
          <HoldButton
            icon="arrow-down-bold"
            label="Step back"
            color={colors.primary}
            bg={colors.card}
            border={colors.border}
            size={minTargetHeight + 12}
            onIn={() => hold('back')}
            onOut={() => release('back')}
            onStep={() => step('back')}
            testID="ctl-back"
          />
        </View>
        <HoldButton
          icon="rotate-right"
          label="Turn right"
          color={colors.primary}
          bg={colors.card}
          border={colors.border}
          size={minTargetHeight + 12}
          onIn={() => hold('right')}
          onOut={() => release('right')}
          onStep={() => step('right')}
          testID="ctl-right"
        />
      </View>
    </ScreenContainer>
  );
}

function HoldButton(props: {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  label: string;
  color: string;
  bg: string;
  border: string;
  size: number;
  onIn: () => void;
  onOut: () => void;
  /** Discrete bounded step — the accessible activation path (VoiceOver). */
  onStep: () => void;
  testID: string;
}) {
  const holding = useRef(false);
  const movedWhileHeld = useRef(false);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={props.label}
      accessibilityHint="Double tap to take one step, or touch and hold to keep moving"
      onPressIn={() => {
        holding.current = true;
        movedWhileHeld.current = false;
        props.onIn();
      }}
      onPressOut={() => {
        holding.current = false;
        props.onOut();
      }}
      onLongPress={() => {
        movedWhileHeld.current = true; // sustained hold: continuous movement already ran
      }}
      onPress={() => {
        // A quick tap (or a VoiceOver activation, where in/out fire together)
        // never sustains the hold — take one discrete, collision-checked step.
        if (!movedWhileHeld.current) props.onStep();
      }}
      testID={props.testID}
      style={({ pressed }) => [
        styles.holdButton,
        {
          width: props.size,
          height: props.size,
          backgroundColor: pressed ? props.color : props.bg,
          borderColor: props.border,
        },
      ]}
    >
      {({ pressed }) => (
        <MaterialCommunityIcons name={props.icon} size={30} color={pressed ? props.bg : props.color} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14, paddingHorizontal: 8 },
  introText: { textAlign: 'center' },
  doneTitle: { textAlign: 'center', marginTop: 8 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 },
  map: {
    width: MAP_W,
    height: MAP_H,
    alignSelf: 'center',
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
  },
  dot: { position: 'absolute', width: 6, height: 6, borderRadius: 3 },
  player: { position: 'absolute', width: 10, height: 10, borderRadius: 2 },
  captions: { flex: 1, borderWidth: 1, borderRadius: 12, marginBottom: 8 },
  captionsInner: { padding: 10, gap: 6 },
  assistRow: { flexDirection: 'row', gap: 10, justifyContent: 'center', marginBottom: 8 },
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 6 },
  controlsMid: { flexDirection: 'row', gap: 12 },
  holdButton: { borderRadius: 16, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
});
