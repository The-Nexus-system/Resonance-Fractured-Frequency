# Beta Readiness Plan

Canon status: canon. Adopted in the Decision Log on 2026-08-07.

The project now pivots from broad lore expansion to beta readiness for the existing playable web prototype. The beta target is one complete playable slice, not the entire game.

## The beta slice standard

A tester should be able to:

- Launch the game.
- Complete first-run accessibility setup before gameplay.
- Begin Operation One.
- Understand where they are.
- Navigate without requiring sight.
- Identify relevant characters and interactables.
- Complete at least one meaningful objective.
- Receive clear success and failure feedback.
- Reach a checkpoint.
- Recover from mistakes.
- Exit and resume safely where supported.

## Priority chunks

Each chunk is finished and tested before the next begins. After each chunk, a report records changed areas, tests run, passes, failures, remaining blockers, and whether it is safe to continue.

### Chunk One — Build health

- Confirm install, startup, typecheck, build, and automated tests.
- Fix broken routes, runtime errors, missing assets, dead startup paths, and critical environment problems.

### Chunk Two — Core playable loop

- Ensure the selected beta slice can be completed without developer knowledge.
- Remove traps, dead ends, unclear objectives, and unrecoverable states.

### Chunk Three — Accessibility gate

Verify keyboard-only play, screen-reader labelling, focus order, audio-first pathways, braille-compatible text structure, captions and text alternatives, non-audio alternatives where audio conveys required information, and that no required information depends only on vision, colour, hearing, timing, or pointer precision.

### Chunk Four — Audio and navigation gate

Verify orientation cues, interactable cues, environmental identity, character-recognition cues, danger and emergency cues, volume and mix behaviour, and accessible alternatives for required audio information.

### Chunk Five — Beta UX

Add or verify first-run instructions, accessibility setup before gameplay, pause and help, restart and recovery, save and resume where supported, a bug-report path, a version or build identifier, and clear action success and failure feedback.

### Chunk Six — Performance and resilience

Check load time, memory behaviour, audio asset loading, slow-network behaviour, reload and reconnect recovery, and degraded-device behaviour.

## Beta release gate

- Typecheck, build, and tests pass.
- No known blocker prevents completion of the selected beta slice.
- No known accessibility blocker makes the slice impossible through a supported nonvisual pathway.
- Critical crashes and data-loss bugs are resolved.
- Tester onboarding and feedback paths work.
- Known issues are documented.

## Relationship to other documents

- The Accessibility Bible defines the standards Chunk Three verifies.
- The Audio Bible defines the cues Chunk Four verifies, and its Audio technology and engine section records the engine decision.
- The Playtesting Bible defines how testers are recruited and how feedback is gathered.
- The Studio Readiness Review and Studio Remediation Plan record the assessment this plan follows on from.
- The Decision Log records the adoption of this pivot.
