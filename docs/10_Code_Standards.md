# Code Standards

This document defines engineering standards for Resonance. It connects the design in the other documents to how the software is built.

## One shared codebase

Resonance is built from one shared codebase that produces native applications and a web build.

- Native mobile: iOS and Android.
- Desktop: Windows, macOS, and Linux.
- Browser: modern web browsers.

The project ships native mobile applications. It never ships simple web wrappers. A web build is acceptable as a target, but the mobile experience must be a true native application.

## Accessibility is an acceptance criterion

Accessibility is not optional work. A feature is not complete until it meets the Accessibility Bible.

- Every gameplay mechanic must be playable through multiple input and output methods.
- Important information must never depend on sound alone.
- Every important action must support multiple activation methods.
- Every gesture and binding must be customizable.
- Every movement mechanic must have a stationary alternative.

## Screen-reader and semantic standards

- User interfaces must expose correct semantics to assistive technology.
- The game provides its own spoken interface and must also cooperate with the player's own screen reader where appropriate.
- State changes that matter to the player must be announced.
- Focus order must be logical and every interactive element must be reachable without a pointer.

## Documentation standards

Code documentation follows the same rules as design documentation.

- Use proper Markdown headings, never bold text in place of headings.
- Keep documents navigable by screen readers.
- Avoid unnecessary tables.
- Maintain one living document per topic. Never create competing versions.

## Testing expectations

- Automated tests live in `tests/`.
- Accessibility behaviour should be tested, not assumed.
- Prefer tests that verify a mechanic is reachable and operable through more than one input method.

## Playtesting discipline

Accessibility testing is a first-class development discipline, equal to programming, audio, and design. Every significant feature must be validated against the player groups and testing dimensions defined in the Playtesting Bible before it is considered complete.

## Current prototype

The current playable web prototype is a React, Vite, and TypeScript application in the pnpm monorepo under `artifacts/resonance`. It demonstrates accessibility-first patterns, local-first saves, and a modular campaign registry. It is a foundation and a reference, not the final shared codebase. Decisions about the long-term shared-codebase technology are tracked in Open Questions until they are made and recorded in the Decision Log.

## Repository structure

The repository separates applications from generated artifacts.

The target application layout, adopted once the shared architecture is established, is the following.

- `apps/web` — the web application.
- `apps/ios` — the native iOS application.
- `apps/android` — the native Android application.

The `artifacts/` folder is reserved for generated outputs rather than source applications.

- Playtest builds
- Release builds
- Demonstrations
- Recordings
- Exported packages
- Temporary prototype artifacts

The current playable web prototype still lives under `artifacts/resonance` and will move to `apps/web` once the shared architecture is established. Until then it remains the working reference. The migration is tracked in Open Questions.

## Repository conventions

- `docs/` holds living design documents.
- `docs/design_notes/` holds early ideas not yet promoted to canon.
- `assets/` holds art, audio, and media.
- `src/` holds shared application source code.
- `tests/` holds automated tests.
- `tools/` holds developer tooling and scripts.
