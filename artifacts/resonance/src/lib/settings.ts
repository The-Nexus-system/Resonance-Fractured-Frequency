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

export type GateOneProgress = {
  characterId: string | null;
  x: number;
  y: number;
  heading: number;
  hatchOpen: boolean;
  firedEvents: string[];
  complete: boolean;
};

export const defaultGateOne: GateOneProgress = {
  characterId: null,
  x: 0,
  y: 2,
  heading: 0,
  hatchOpen: false,
  firedEvents: [],
  complete: false,
};

export type GameSave = {
  settings: GameSettings;
  progress: Record<string, CampaignProgress>;
  gateOne?: GateOneProgress;
};

const SAVE_KEY = "resonance_save_v1";

function sanitizeSave(raw: unknown): GameSave {
  const fallback: GameSave = { settings: { ...defaultSettings }, progress: {} };
  if (!raw || typeof raw !== "object") return fallback;
  const obj = raw as Partial<GameSave>;

  // Merge settings over defaults so missing/unknown keys never break gameplay.
  const allowedValues: { [K in keyof GameSettings]?: readonly string[] } = {
    theme: ["light", "dark", "system"],
    textSize: ["normal", "large", "xl"],
  };
  const settings: GameSettings = { ...defaultSettings };
  if (obj.settings && typeof obj.settings === "object") {
    for (const key of Object.keys(defaultSettings) as (keyof GameSettings)[]) {
      const value = (obj.settings as Record<string, unknown>)[key];
      const allowed = allowedValues[key];
      if (allowed) {
        if (typeof value === "string" && allowed.includes(value)) {
          (settings as Record<string, unknown>)[key] = value;
        }
      } else if (typeof value === "boolean") {
        (settings as Record<string, unknown>)[key] = value;
      }
    }
  }

  // Sanitize progress: node index must be a non-negative integer, completed a boolean.
  const progress: Record<string, CampaignProgress> = {};
  if (obj.progress && typeof obj.progress === "object") {
    for (const [id, p] of Object.entries(obj.progress as Record<string, unknown>)) {
      if (!p || typeof p !== "object") continue;
      const entry = p as Partial<CampaignProgress>;
      const idx =
        typeof entry.currentNodeIndex === "number" &&
        Number.isFinite(entry.currentNodeIndex) &&
        entry.currentNodeIndex >= 0
          ? Math.floor(entry.currentNodeIndex)
          : 0;
      progress[id] = { currentNodeIndex: idx, completed: entry.completed === true };
    }
  }

  // Sanitize Gate One progress.
  let gateOne: GateOneProgress | undefined;
  if (obj.gateOne && typeof obj.gateOne === "object") {
    const g = obj.gateOne as Partial<GateOneProgress>;
    const num = (v: unknown, fallback: number) =>
      typeof v === "number" && Number.isFinite(v) ? v : fallback;
    gateOne = {
      characterId: typeof g.characterId === "string" ? g.characterId : null,
      x: num(g.x, defaultGateOne.x),
      y: num(g.y, defaultGateOne.y),
      heading: num(g.heading, defaultGateOne.heading),
      hatchOpen: g.hatchOpen === true,
      firedEvents: Array.isArray(g.firedEvents)
        ? g.firedEvents.filter((e): e is string => typeof e === "string")
        : [],
      complete: g.complete === true,
    };
  }

  return { settings, progress, gateOne };
}

export function loadSave(): GameSave {
  try {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      return sanitizeSave(JSON.parse(saved));
    }
  } catch (e) {
    console.error("Failed to load save", e);
  }
  return { settings: { ...defaultSettings }, progress: {} };
}

export function saveGame(save: GameSave) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(save));
  } catch (e) {
    console.error("Failed to save game", e);
  }
}
