import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { GameSettings, loadSave, saveGame, defaultSettings } from "@/lib/settings";

type A11yContextType = {
  settings: GameSettings;
  updateSettings: (updates: Partial<GameSettings>) => void;
  announce: (message: string) => void;
};

const A11yContext = createContext<A11yContextType | null>(null);

export function A11yProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<GameSettings>(defaultSettings);
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    const save = loadSave();
    setSettings(save.settings);
  }, []);

  const updateSettings = useCallback((updates: Partial<GameSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...updates };
      const save = loadSave();
      save.settings = next;
      saveGame(save);
      return next;
    });
  }, []);

  const announce = useCallback((message: string) => {
    setAnnouncement("");
    // small delay to force re-announcement if same string
    setTimeout(() => setAnnouncement(message), 50);
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    
    // Theme
    const isDark = settings.theme === "dark" || (settings.theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    html.classList.toggle("dark", isDark);
    
    // High Contrast
    html.classList.toggle("high-contrast", settings.highContrast);
    
    // Dyslexia Font
    html.classList.toggle("dyslexia-font", settings.dyslexiaFont);
    
    // Reduce Motion
    html.classList.toggle("reduce-motion", settings.reduceMotion);
    
    // Text Size
    html.classList.remove("text-size-normal", "text-size-large", "text-size-xl");
    html.classList.add(`text-size-${settings.textSize}`);

    // Colorblind Safe
    html.classList.toggle("colorblind-safe", settings.colorblindSafe);
    
    // Large Targets (AAC)
    html.classList.toggle("large-targets", settings.largeTargets);

  }, [settings]);

  return (
    <A11yContext.Provider value={{ settings, updateSettings, announce }}>
      {/* Live Region for announcements */}
      <div 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
        data-testid="live-announcer"
      >
        {announcement}
      </div>
      {children}
    </A11yContext.Provider>
  );
}

export function useA11y() {
  const ctx = useContext(A11yContext);
  if (!ctx) throw new Error("useA11y must be used within A11yProvider");
  return ctx;
}
