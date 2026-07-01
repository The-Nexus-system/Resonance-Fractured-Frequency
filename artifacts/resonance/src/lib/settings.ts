export type GameSettings = {
  theme: "light" | "dark" | "system";
  textSize: "normal" | "large" | "xl";
  highContrast: boolean;
  reduceMotion: boolean;
  captions: boolean;
  sound: boolean;
  colorblindSafe: boolean;
  dyslexiaFont: boolean;
  largeTargets: boolean; /* AAC mode */
};

export const defaultSettings: GameSettings = {
  theme: "system",
  textSize: "normal",
  highContrast: false,
  reduceMotion: false,
  captions: true,
  sound: true,
  colorblindSafe: false,
  dyslexiaFont: false,
  largeTargets: false,
};

export type CampaignProgress = {
  currentNodeIndex: number;
  completed: boolean;
};

export type GameSave = {
  settings: GameSettings;
  progress: Record<string, CampaignProgress>;
};

const SAVE_KEY = "resonance_save_v1";

export function loadSave(): GameSave {
  try {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error("Failed to load save", e);
  }
  return { settings: defaultSettings, progress: {} };
}

export function saveGame(save: GameSave) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(save));
  } catch (e) {
    console.error("Failed to save game", e);
  }
}
