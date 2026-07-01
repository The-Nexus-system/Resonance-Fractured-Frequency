# Resonance Fractured Frequency

## Overview

Resonance Fractured Frequency is a mobile-first, accessibility-first web game built with
React + Vite. It is the foundation for a future native mobile game — it is intentionally
built as a real, playable accessible game application, not a marketing website.

Players tune into and align fractured "resonant frequencies" to repair a broken signal and
uncover a story. The game is designed so that no puzzle ever depends on a single sense:
every state is conveyed redundantly in text, visually, and (optional) audio.

## Accessibility (core principle, not optional)

Accessibility is a hard requirement and a core design principle:

- Screen reader support from the ground up (accessible names/roles/states, ARIA live regions).
- Full keyboard navigation with a visible focus ring and skip-to-content link.
- Clear heading structure and semantic landmark navigation.
- Designed for blind, low-vision, Deaf/Hard-of-Hearing, AAC, and neurodivergent players.
- Redundant multi-sensory feedback; captions for audio; text alternatives for visuals;
  never color alone.
- Simple, consistent, low-cognitive-load interface with no time pressure.
- Live-applied, persisted accessibility settings (text size, high contrast, reduce motion,
  captions, sound, colorblind-safe palette, dyslexia-friendly font, large/AAC targets).

## Architecture

- `artifacts/resonance/` — the React + Vite web app (served at `/`).
  - Campaigns are data-driven modules in a registry so new Resonance campaigns can be added
    later without rewriting screens.
  - Persistence is local-first (localStorage) behind a small storage module, so an optional
    cloud-sync layer can be added later without touching the UI.
- `artifacts/api-server/` — shared Express API server (not yet used by the game).
- `lib/` — shared workspace libraries (API spec/client, db) for future backend work.

This is a pnpm monorepo. See the workspace layout under `artifacts/` and `lib/`.

## Development

- The app runs via a Replit workflow (not `pnpm dev` at the root).
- Typecheck a package: `pnpm --filter @workspace/resonance run typecheck`.

## GitHub

The project is connected to the GitHub repository
`The-Nexus-system/Resonance-Fractured-Frequency` and the initial project is committed there.

### ChatGPT / external AI access

Because the GitHub repository is the source of truth, ChatGPT (via its GitHub connector,
Codex, or Deep Research) can inspect and review the code directly from the repo, and can
propose updates as commits/pull requests. There is no separate first-party "ChatGPT"
Replit integration; the GitHub repository is the integration surface for external AI review.

## User preferences

- Build this as an accessible game application, never as a marketing website.
- Keep accessibility as a core design principle, not an optional feature.
- Keep the project modular so additional Resonance campaigns can be added later.
- Use local-first saves, with optional cloud sync possible in the future.
