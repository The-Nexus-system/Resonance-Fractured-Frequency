/**
 * Save format — shares the web build's save shape and sanitisation rules
 * (one conceptual game state across clients). Persistence uses AsyncStorage.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

export type GameSettings = {
  theme: 'light' | 'dark' | 'system';
  textSize: 'normal' | 'large' | 'xl';
  highContrast: boolean;
  reduceMotion: boolean;
  captions: boolean;
  sound: boolean;
  colorblindSafe: boolean;
  dyslexiaFont: boolean;
  largeTargets: boolean;
  haptics: boolean; // legacy master switch, kept for backwards compatibility
  hapticsInterface: boolean; // small feedback for ordinary controls
  hapticsGameplay: boolean; // tactile feedback for world events
  shakeToInteract: boolean; // OFF by default; never the only way to interact
};

export const defaultSettings: GameSettings = {
  theme: 'system',
  textSize: 'normal',
  highContrast: false,
  reduceMotion: false,
  captions: true,
  sound: true,
  colorblindSafe: false,
  dyslexiaFont: false,
  largeTargets: false,
  haptics: true,
  hapticsInterface: true,
  hapticsGameplay: true,
  shakeToInteract: false,
};

export type CampaignProgress = {
  currentNodeIndex: number;
  completed: boolean;
};

/** Additive exploration state per campaign (Phase 4). */
export type ExploreState = {
  attuned: string[];
  collected: string[];
  inspected: string[];
  visitedHidden: string[];
};

export type GameSave = {
  settings: GameSettings;
  progress: Record<string, CampaignProgress>;
  explore?: Record<string, ExploreState>;
};

export function emptyExploreState(): ExploreState {
  return { attuned: [], collected: [], inspected: [], visitedHidden: [] };
}

function sanitizeIdList(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const out: string[] = [];
  for (const v of raw) {
    if (typeof v === 'string' && v.length > 0 && v.length <= 128 && !out.includes(v)) {
      out.push(v);
      if (out.length >= 200) break;
    }
  }
  return out;
}

const SAVE_KEY = 'resonance_save_v1';

export function sanitizeSave(raw: unknown): GameSave {
  const fallback: GameSave = { settings: { ...defaultSettings }, progress: {} };
  if (!raw || typeof raw !== 'object') return fallback;
  const obj = raw as Partial<GameSave>;

  const allowedValues: { [K in keyof GameSettings]?: readonly string[] } = {
    theme: ['light', 'dark', 'system'],
    textSize: ['normal', 'large', 'xl'],
  };
  const settings: GameSettings = { ...defaultSettings };
  if (obj.settings && typeof obj.settings === 'object') {
    for (const key of Object.keys(defaultSettings) as (keyof GameSettings)[]) {
      const value = (obj.settings as Record<string, unknown>)[key];
      const allowed = allowedValues[key];
      if (allowed) {
        if (typeof value === 'string' && allowed.includes(value)) {
          (settings as Record<string, unknown>)[key] = value;
        }
      } else if (typeof value === 'boolean') {
        (settings as Record<string, unknown>)[key] = value;
      }
    }
  }

  const progress: Record<string, CampaignProgress> = {};
  if (obj.progress && typeof obj.progress === 'object') {
    for (const [id, p] of Object.entries(obj.progress as Record<string, unknown>)) {
      if (!p || typeof p !== 'object') continue;
      const entry = p as Partial<CampaignProgress>;
      const idx =
        typeof entry.currentNodeIndex === 'number' &&
        Number.isFinite(entry.currentNodeIndex) &&
        entry.currentNodeIndex >= 0
          ? Math.floor(entry.currentNodeIndex)
          : 0;
      progress[id] = { currentNodeIndex: idx, completed: entry.completed === true };
    }
  }

  // Migration: saves from before the haptics split seed both channels from
  // the legacy master switch (additive — the old field is preserved).
  if (obj.settings && typeof obj.settings === 'object') {
    const s = obj.settings as Record<string, unknown>;
    if (typeof s.hapticsInterface !== 'boolean' && typeof s.haptics === 'boolean') {
      settings.hapticsInterface = s.haptics;
    }
    if (typeof s.hapticsGameplay !== 'boolean' && typeof s.haptics === 'boolean') {
      settings.hapticsGameplay = s.haptics;
    }
  }

  const explore: Record<string, ExploreState> = {};
  const rawExplore = (obj as { explore?: unknown }).explore;
  if (rawExplore && typeof rawExplore === 'object') {
    for (const [id, e] of Object.entries(rawExplore as Record<string, unknown>)) {
      if (!e || typeof e !== 'object') continue;
      const entry = e as Partial<ExploreState>;
      explore[id] = {
        attuned: sanitizeIdList(entry.attuned),
        collected: sanitizeIdList(entry.collected),
        inspected: sanitizeIdList(entry.inspected),
        visitedHidden: sanitizeIdList(entry.visitedHidden),
      };
    }
  }

  return { settings, progress, explore };
}

export async function loadSave(): Promise<GameSave> {
  try {
    const saved = await AsyncStorage.getItem(SAVE_KEY);
    if (saved) {
      return sanitizeSave(JSON.parse(saved));
    }
  } catch (e) {
    console.error('Failed to load save', e);
  }
  return { settings: { ...defaultSettings }, progress: {} };
}

// Serialize writes so a slow older setItem can never complete after (and
// clobber) a newer one — the newest snapshot always wins.
let writeChain: Promise<void> = Promise.resolve();

export function saveGame(save: GameSave): Promise<void> {
  const payload = JSON.stringify(save);
  writeChain = writeChain.then(async () => {
    try {
      await AsyncStorage.setItem(SAVE_KEY, payload);
    } catch (e) {
      console.error('Failed to save game', e);
    }
  });
  return writeChain;
}
