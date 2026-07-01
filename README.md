# Resonance: Fractured Frequency

An accessibility-first, mobile-first web game — the foundation for a future native mobile title. Built with React + Vite + TypeScript.

Resonance is a calm puzzle game about aligning frequencies. Accessibility is a **core design principle**, not an afterthought: every puzzle is conveyed through multiple senses at once so it is playable by blind, low-vision, Deaf/hard-of-hearing, AAC, and neurodivergent players.

## Accessibility features

- **Screen-reader-first**: ARIA live regions announce every game state change; semantic headings and landmarks throughout.
- **Full keyboard navigation**: visible focus indicators, skip-to-content, no mouse required.
- **Multi-sensory redundancy**: each puzzle is presented as text **and** a labeled shape (never color alone) **and** an optional audio tone with captions.
- **AAC-friendly** large icon + text choice buttons.
- **Live, persisted settings**: text size, high contrast, reduce motion, captions, sound, colorblind-safe palette, dyslexia-friendly font, and larger touch targets. OS `prefers-reduced-motion` / `prefers-contrast` are respected.
- **Low cognitive load**: clear one-task-at-a-time flow with progress indicators.

## Architecture

- **Modular campaign registry** (`src/lib/campaigns.ts`) — new campaigns drop in without changing the screens.
- **Local-first saves** (`src/lib/settings.ts`) via `localStorage`, structured so cloud sync can be added later without touching the UI.
- **Accessibility provider** (`src/components/a11y-provider.tsx`) applies settings globally and manages announcements.

## Project structure

This is a pnpm monorepo. The game lives in `artifacts/resonance`.

```
artifacts/resonance/     # the game (React + Vite)
  src/
    App.tsx              # router
    pages/               # Menu, Campaigns, Play, Settings, About
    components/          # a11y-provider and UI
    lib/                 # settings (saves) + campaigns registry
lib/                     # shared workspace libraries
```

## Getting started

```bash
pnpm install
pnpm --filter @workspace/resonance run dev        # start the game
pnpm --filter @workspace/resonance run typecheck  # type check
pnpm --filter @workspace/resonance run build      # production build
```

## AI / ChatGPT access

The repository is the source of truth for inspection and updates. Point ChatGPT's GitHub connector (or Codex) at this public repo to review or propose changes via branches / pull requests.
