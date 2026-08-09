/**
 * Game provider — owns settings, campaign progress, announcements, tones,
 * and haptics. One conceptual game state, shared with the web reference
 * build's save shape and sanitisation rules.
 */
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AccessibilityInfo, Platform, useColorScheme } from 'react-native';
import * as Haptics from 'expo-haptics';
import {
  GAMEPLAY_HAPTIC_PATTERNS,
  type GameplayHaptic,
  type HapticStep,
} from '@/lib/haptics';

/** Semantic gameplay haptics plus the legacy simple kinds. */
export type HapticKind = GameplayHaptic | 'select';
import { createAudioPlayer, type AudioPlayer } from 'expo-audio';
import baseColors from '@/constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  defaultGateOne,
  defaultSettings,
  emptyExploreState,
  loadSave,
  saveGame,
  type CampaignProgress,
  type ExploreState,
  type GameSave,
  type GameSettings,
  type GateOneProgress,
} from '@/lib/save';
import { toneUri } from '@/lib/tones';
import {
  REWARDS_STORAGE_KEY,
  earnReward,
  emptyRewardState,
  FIRST_FRACTURE_REWARDS,
  reconcileRewardState,
  rewardDef,
  sanitizeRewardState,
  type RewardState,
} from '@/lib/rewards';

export type ThemeColors = typeof baseColors.light;

type GameContextValue = {
  loaded: boolean;
  settings: GameSettings;
  progress: Record<string, CampaignProgress>;
  updateSettings: (patch: Partial<GameSettings>) => void;
  updateProgress: (campaignId: string, currentNodeIndex: number, completed: boolean) => void;
  explore: Record<string, ExploreState>;
  updateExplore: (campaignId: string, patch: Partial<ExploreState>) => void;
  gateOne: GateOneProgress;
  updateGateOne: (patch: Partial<GateOneProgress>) => void;
  rewards: RewardState;
  /** Grants a reward once (duplicate-protected). Returns true when newly earned. */
  grantReward: (rewardId: string) => boolean;
  announce: (message: string) => void;
  playTone: (freq: number) => void;
  playUri: (uri: string) => void;
  stopTone: () => void;
  haptic: (kind: HapticKind, channel?: 'ui' | 'gameplay') => void;
  colors: ThemeColors;
  resolvedTheme: 'light' | 'dark';
  fontScale: number;
  bodyLineHeight: (fontSize: number) => number;
  letterSpacing: number;
  minTargetHeight: number;
};

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [loaded, setLoaded] = useState(false);
  const [settings, setSettings] = useState<GameSettings>({ ...defaultSettings });
  const [progress, setProgress] = useState<Record<string, CampaignProgress>>({});
  const [explore, setExplore] = useState<Record<string, ExploreState>>({});
  const [gateOne, setGateOne] = useState<GateOneProgress>({ ...defaultGateOne });
  const [rewards, setRewards] = useState<RewardState>(emptyRewardState());
  const playerRef = useRef<AudioPlayer | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      loadSave(),
      AsyncStorage.getItem(REWARDS_STORAGE_KEY).catch(() => null),
    ]).then(([save, rawRewards]) => {
      if (cancelled) return;
      setSettings(save.settings);
      setProgress(save.progress);
      setExplore(save.explore ?? {});
      setGateOne(save.gateOne ?? { ...defaultGateOne });
      let loadedRewards = emptyRewardState();
      try {
        loadedRewards = rawRewards ? sanitizeRewardState(JSON.parse(rawRewards)) : emptyRewardState();
      } catch {
        loadedRewards = emptyRewardState();
      }
      // Anti-forgery: only keep earned rewards whose declarative condition
      // is actually supported by the sanitized exploration save.
      const exploreState = save.explore ?? {};
      loadedRewards = reconcileRewardState(FIRST_FRACTURE_REWARDS, loadedRewards, (campaignId) => {
        const c = exploreState[campaignId];
        if (!c) return null;
        return {
          campaignId,
          collected: c.collected,
          visited: c.visitedHidden,
          inspected: c.inspected,
          attunedCount: c.attuned.length,
          listenedAtRestRoles: c.listenedAtRest,
        };
      });
      rewardsRef.current = loadedRewards;
      setRewards(loadedRewards);
      setLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Persist whenever state changes after the initial load. Persisting from an
  // effect (not inside state updaters) guarantees the final merged state is
  // what gets written, with no lost updates.
  useEffect(() => {
    if (!loaded) return;
    const save: GameSave = { settings, progress, explore, gateOne };
    void saveGame(save);
  }, [loaded, settings, progress, explore, gateOne]);

  // Rewards persist under their own key so the shared save shape is untouched.
  // Writes are serialized so an older snapshot can never finish last and
  // clobber a newer one.
  const rewardsWriteChain = useRef<Promise<void>>(Promise.resolve());
  useEffect(() => {
    if (!loaded) return;
    const payload = JSON.stringify(rewards);
    rewardsWriteChain.current = rewardsWriteChain.current.then(() =>
      AsyncStorage.setItem(REWARDS_STORAGE_KEY, payload).catch((e) =>
        console.error('Failed to save rewards', e),
      ),
    );
  }, [loaded, rewards]);

  // Release the audio player when the provider unmounts.
  useEffect(() => {
    return () => {
      if (playerRef.current) {
        playerRef.current.remove();
        playerRef.current = null;
      }
    };
  }, []);

  const updateSettings = useCallback((patch: Partial<GameSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  const updateProgress = useCallback(
    (campaignId: string, currentNodeIndex: number, completed: boolean) => {
      setProgress((prev) => ({ ...prev, [campaignId]: { currentNodeIndex, completed } }));
    },
    [],
  );

  const updateExplore = useCallback((campaignId: string, patch: Partial<ExploreState>) => {
    setExplore((prev) => ({
      ...prev,
      [campaignId]: { ...(prev[campaignId] ?? emptyExploreState()), ...patch },
    }));
  }, []);

  const updateGateOne = useCallback((patch: Partial<GateOneProgress>) => {
    setGateOne((prev) => ({ ...prev, ...patch }));
  }, []);

  // rewardsRef is the synchronous source of truth for grants: it is updated
  // inside grantReward itself, so back-to-back grants in one tick can never
  // read the same stale snapshot and lose an earn.
  const rewardsRef = useRef(rewards);

  const grantReward = useCallback((rewardId: string): boolean => {
    const def = rewardDef(rewardId);
    if (!def) return false;
    const result = earnReward(rewardsRef.current, def, Date.now());
    if (result.newlyEarned) rewardsRef.current = result.state;
    if (result.newlyEarned) setRewards(result.state);
    return result.newlyEarned;
  }, []);

  const announce = useCallback((message: string) => {
    AccessibilityInfo.announceForAccessibility(message);
  }, []);

  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  const stopTone = useCallback(() => {
    if (playerRef.current) {
      try {
        playerRef.current.remove();
      } catch {
        // Already released.
      }
      playerRef.current = null;
    }
  }, []);

  const playUri = useCallback(
    (uri: string) => {
      if (!settingsRef.current.sound) return;
      try {
        stopTone();
        const player = createAudioPlayer({ uri });
        playerRef.current = player;
        // Release the native player as soon as the tone finishes so a
        // completed tone never stays allocated.
        const sub = player.addListener('playbackStatusUpdate', (status) => {
          if (status.didJustFinish) {
            sub.remove();
            if (playerRef.current === player) {
              playerRef.current = null;
            }
            try {
              player.remove();
            } catch {
              // Already released.
            }
          }
        });
        player.play();
      } catch (err) {
        console.warn('Audio playback failed', err);
      }
    },
    [stopTone],
  );

  const playTone = useCallback((freq: number) => playUri(toneUri(freq)), [playUri]);

  const haptic = useCallback((kind: HapticKind, channel: 'ui' | 'gameplay' = 'ui') => {
    if (Platform.OS === 'web') return;
    const s = settingsRef.current;
    const enabled = channel === 'gameplay' ? s.hapticsGameplay : s.hapticsInterface;
    if (!enabled) return;
    // Semantic gameplay patterns come from the documented haptic language;
    // legacy simple kinds map onto it so existing screens keep working.
    const pattern: HapticStep[] =
      kind in GAMEPLAY_HAPTIC_PATTERNS
        ? GAMEPLAY_HAPTIC_PATTERNS[kind as GameplayHaptic]
        : kind === 'select'
          ? [{ kind: 'select' }]
          : []; // exhaustive above; keeps TS happy
    void (async () => {
      try {
        for (const step of pattern) {
          if (step.kind === 'wait') {
            await new Promise((r) => setTimeout(r, step.ms));
          } else if (step.kind === 'impact') {
            const style =
              step.strength === 'heavy'
                ? Haptics.ImpactFeedbackStyle.Heavy
                : step.strength === 'medium'
                  ? Haptics.ImpactFeedbackStyle.Medium
                  : Haptics.ImpactFeedbackStyle.Light;
            await Haptics.impactAsync(style);
          } else if (step.kind === 'notify') {
            const tone =
              step.tone === 'error'
                ? Haptics.NotificationFeedbackType.Error
                : step.tone === 'warning'
                  ? Haptics.NotificationFeedbackType.Warning
                  : Haptics.NotificationFeedbackType.Success;
            await Haptics.notificationAsync(tone);
          } else {
            await Haptics.selectionAsync();
          }
        }
      } catch {
        // Haptics are always optional.
      }
    })();
  }, []);

  const resolvedTheme: 'light' | 'dark' =
    settings.theme === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : settings.theme;

  const colors = useMemo<ThemeColors>(() => {
    const base = resolvedTheme === 'dark' ? baseColors.dark : baseColors.light;
    if (!settings.highContrast) return base;
    // High contrast: push foreground/background/borders to maximum contrast.
    return resolvedTheme === 'dark'
      ? {
          ...base,
          background: '#000000',
          foreground: '#ffffff',
          text: '#ffffff',
          card: '#0a0a0a',
          cardForeground: '#ffffff',
          mutedForeground: '#d4d4d4',
          border: '#ffffff',
          input: '#ffffff',
        }
      : {
          ...base,
          background: '#ffffff',
          foreground: '#000000',
          text: '#000000',
          card: '#ffffff',
          cardForeground: '#000000',
          mutedForeground: '#262626',
          border: '#000000',
          input: '#000000',
        };
  }, [resolvedTheme, settings.highContrast]);

  const fontScale = settings.textSize === 'xl' ? 1.3 : settings.textSize === 'large' ? 1.15 : 1;
  const letterSpacing = settings.dyslexiaFont ? 0.5 : 0;
  const lineHeightMultiplier = settings.dyslexiaFont ? 1.6 : 1.4;
  const minTargetHeight = settings.largeTargets ? 64 : 52;

  const bodyLineHeight = useCallback(
    (fontSize: number) => Math.round(fontSize * lineHeightMultiplier),
    [lineHeightMultiplier],
  );

  const value = useMemo<GameContextValue>(
    () => ({
      loaded,
      settings,
      progress,
      updateSettings,
      updateProgress,
      explore,
      updateExplore,
      gateOne,
      updateGateOne,
      rewards,
      grantReward,
      announce,
      playTone,
      playUri,
      stopTone,
      haptic,
      colors,
      resolvedTheme,
      fontScale,
      bodyLineHeight,
      letterSpacing,
      minTargetHeight,
    }),
    [
      loaded,
      settings,
      progress,
      updateSettings,
      updateProgress,
      explore,
      updateExplore,
      gateOne,
      updateGateOne,
      rewards,
      grantReward,
      announce,
      playTone,
      playUri,
      stopTone,
      haptic,
      colors,
      resolvedTheme,
      fontScale,
      bodyLineHeight,
      letterSpacing,
      minTargetHeight,
    ],
  );

  // Do not render the app until the save has hydrated, so a setting changed
  // during startup can never be overwritten by late hydration.
  if (!loaded) return null;

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
