---
name: Resonance beta readiness pivot
description: The project has pivoted from lore expansion to beta readiness; work proceeds in ordered chunks.
---

As of Aug 2026 the creator's handoff directs: stop broad lore expansion and work the beta readiness chunks in order (build health → core loop → accessibility gate → audio/navigation gate → beta UX → performance), finishing and testing one chunk before the next. Canon lives in `docs/design_notes/beta_readiness_plan.md`.

**Why:** the 2026 Q3 master handoff (Package M) made this the explicit priority; new lore requests should be merged into canon docs but implementation effort goes to the beta slice.

**How to apply:** for build-work requests, check which chunk is current before scoping; report per chunk (changed areas, tests, passes, failures, blockers). Chunk One (build health) verified 2026-08-07: typecheck clean, app boots. Resolved decisions: Web Audio API + abstraction layer now, FMOD Studio for native later; React Native + Expo as the native framework.
