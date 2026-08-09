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

### External review access

Because the GitHub repository is the source of truth, external review tools the creator
authorises can inspect the code directly from the repo and propose updates as
commits/pull requests. The GitHub repository is the integration surface for external review.

### Acknowledgement policy

The project must carry no metadata, generated-by labels, provenance tags, comments,
credits, or internal text suggesting the game was made by any particular AI product.
Legitimate third-party asset/license attribution is never removed. The eventual
human-facing acknowledgements may use the wording/concept "with help on research and
design from our Kit" for the assistant's contribution — do not add it to player-facing
credits until explicitly authorised.

## User preferences

- Build this as an accessible game application, never as a marketing website.
- Keep accessibility as a core design principle, not an optional feature.
- Keep the project modular so additional Resonance campaigns can be added later.
- Use local-first saves, with optional cloud sync possible in the future.
- The user relies on dictation/speech-to-text and finds selecting text or opening a
  preview pane inaccessible. Whenever you want the user to copy something, put that
  content directly in the chat inside a fenced code block, so the chat's built-in
  one-click copy button appears right next to it. Never use a separate web page,
  artifact, or download as the copy mechanism.
