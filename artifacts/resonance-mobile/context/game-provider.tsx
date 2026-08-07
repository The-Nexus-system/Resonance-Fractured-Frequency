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
import { createAudioPlayer, type AudioPlayer } from 'expo-audio';
import baseColors from '@/constants/colors';
import {
  defaultSettings,
  loadSave,
  saveGame,
  type CampaignProgress,
  type GameSave,
  type GameSettings,
} from '@/lib/save';
import { toneUri } from '@/lib/tones';

export type ThemeColors = typeof baseColors.light;

type GameContextValue = {
  loaded: boolean;
  settings: GameSettings;
  progress: Record<string, CampaignProgress>;
  updateSettings: (patch: Partial<GameSettings>) => void;
  updateProgress: (campaignId: string, currentNodeIndex: number, completed: boolean) => void;
  announce: (message: string) => void;
  playTone: (freq: number) => void;
  playUri: (uri: string) => void;
  stopTone: () => void;
  haptic: (kind: 'success' | 'error' | 'select') => void;
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
  const playerRef = useRef<AudioPlayer | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadSave().then((save) => {
      if (cancelled) return;
      setSettings(save.settings);
      setProgress(save.progress);
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
    const save: GameSave = { settings, progress };
    void saveGame(save);
  }, [loaded, settings, progress]);

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

  const haptic = useCallback((kind: 'success' | 'error' | 'select') => {
    if (!settingsRef.current.haptics || Platform.OS === 'web') return;
    try {
      if (kind === 'success') {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else if (kind === 'error') {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } else {
        void Haptics.selectionAsync();
      }
    } catch {
      // Haptics are always optional.
    }
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
