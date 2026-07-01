# Resonance

Resonance is a science-fiction game franchise whose primary rendering engine is sound. It is designed so that blind, low-vision, and sighted players can all enjoy it equally. Accessibility is the foundation of the universe, not a feature added at the end.

This repository is the single source of truth for the project. Every approved design decision lives in the Markdown documents inside `docs/`, not only in chat. Future decisions are made by editing these living documents rather than starting a new conversation.

## Campaign One

The first campaign is Resonance: Fractured Frequency.

## What Resonance is

Resonance is not "an audio game." It is a AAA science-fiction experience whose world is rendered primarily through sound. Visuals enhance the experience but are never required. The game must be equally enjoyable for blind, low-vision, and sighted players.

## Core philosophy

- Audio is gameplay.
- Story teaches mechanics.
- Accessibility is foundational.
- Perspective creates replayability.
- Knowledge is progression.
- The AI is a character.
- Technology exists to serve people.
- Curiosity is always rewarded.
- Every meaningful decision gains something while sacrificing something.
- Players should feel remembered.

## Documentation

The living documents are stored in `docs/`. Read them in order for a full picture, or jump to the area you need.

- [Project Constitution](docs/01_Project_Constitution.md) — how this project is governed and documented.
- [Universe Bible](docs/02_Universe_Bible.md) — the Shawabti, Faience, and story canon.
- [Campaign Bible](docs/03_Campaign_Bible.md) — the franchise, campaign one, and Operation Exodus.
- [Systems Bible](docs/04_Systems_Bible.md) — controls, movement, combat, flight, and reality integration.
- [Knowledge Archive Bible](docs/05_Knowledge_Archive_Bible.md) — how learning becomes progression.
- [AI Bible](docs/06_AI_Bible.md) — Faience as a character and AI integration.
- [Audio Bible](docs/07_Audio_Bible.md) — sound as the primary renderer of the world.
- [Accessibility Bible](docs/08_Accessibility_Bible.md) — the accessibility foundation and player interview.
- [Network and Multiplayer Bible](docs/09_Network_and_Multiplayer_Bible.md) — cooperation, sync, and shared play.
- [Code Standards](docs/10_Code_Standards.md) — engineering standards and platform targets.
- [Decision Log](docs/11_Decision_Log.md) — approved decisions over time.
- [Glossary](docs/12_Glossary.md) — shared vocabulary.
- [Open Questions](docs/13_Open_Questions.md) — decisions still to be made.
- [Playtesting Bible](docs/14_Playtesting_Bible.md) — accessibility testing as a first-class discipline.
- [Canon Rules](docs/15_Canon_Rules.md) — the consolidated master list of canon rules the game must honor.
- [Design Notes](docs/design_notes/) — approved canonical notes and experimental notes; each states which it is.

## Repository layout

- `docs/` — living design documents, the single source of truth.
- `docs/design_notes/` — a mix of approved canonical design notes and experimental notes; each note states which it is.
- `assets/` — art, audio, and other media assets.
- `src/` — application source code.
- `tests/` — automated tests.
- `tools/` — developer tooling and scripts.

The planned application layout is `apps/web`, `apps/ios`, and `apps/android`, with `artifacts/` reserved for generated outputs such as playtest builds, release builds, demonstrations, recordings, and exported packages.

The current playable web prototype lives in the pnpm monorepo under `artifacts/resonance` and will move to `apps/web` once the shared architecture is established. See [Code Standards](docs/10_Code_Standards.md) for how the prototype relates to the shared-codebase goal.

## Running the current web prototype

```bash
pnpm install
pnpm --filter @workspace/resonance run dev
pnpm --filter @workspace/resonance run typecheck
pnpm --filter @workspace/resonance run build
```

## Documentation rules

- Every document uses proper Markdown headings.
- Every document must be navigable by screen readers.
- Never use bold text in place of a heading.
- Avoid unnecessary tables.
- Maintain one living document per file. Never create competing versions.
- GitHub provides the version history.
