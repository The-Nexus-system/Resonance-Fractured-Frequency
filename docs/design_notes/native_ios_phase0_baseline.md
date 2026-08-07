# Native iOS Transition — Phase 0 Baseline Record

Date: 7 August 2026
Status: PHASE 0 COMPLETE

## Purpose

This document records the validated state of the existing web application
before native iOS development begins, per the Native iOS Transition master
work order. The web application is the **validated playable reference
implementation** and must remain functional and independently playable
throughout native development.

## Framework decision (already resolved — see Decision Log)

The native client is built with **React Native + Expo, sharing a TypeScript
core with the web build** (recorded in `docs/11_Decision_Log.md` and
`docs/13_Open_Questions.md`). This produces a genuine native iOS
application — native UI components, VoiceOver via native Apple accessibility
APIs, haptics, Core Location, device motion, and Dynamic Type — not a
website in a WebView. It is the approach the development environment can
build, preview on-device (via Expo Go), and submit to the App Store.

## Validated reference build

- Repository commit: `d9f972c8` (GitHub, main branch) — includes the full
  accessibility audit + repair pass.
- Location: `artifacts/resonance` (web application).

### Validated content

Main menu; campaign selection; The First Fracture (all four puzzle nodes,
correct and incorrect paths); completion; replay; locked Echoing Chasm
boundary; Settings; About; 404 fallback; automatic progress saving; save
sanitisation (enum-validated settings, clamped node index, hostile-JSON
survival); accessibility settings; captions; synthesised audio cues
(220–550 Hz node tones, 150 Hz error buzz); keyboard pathway; focus
management after navigation; high contrast; dyslexia-friendly presentation;
XL text; large tap targets; live-region announcements; input lock during
node advance.

### Baseline results (recorded 7 August 2026)

- Typecheck: PASS
- Production build: PASS
- End-to-end browser testing: PASS (two full rounds — keyboard-only
  campaign completion, wrong/correct paths, save persistence, corrupted and
  malicious save data, settings persistence into gameplay, focus behaviour,
  live announcements, rapid-input lock, enum sanitisation fallback)
- Independent code review: PASS after two findings were fixed and
  re-verified
- Beta accessibility gate (playable slice): PASS

### Not tested (baseline, carried honestly forward)

Real hardware screen readers (VoiceOver), refreshable braille displays,
touch-specific gestures, controller input.

## Preservation rules in force

- The web build is not replaced, rewritten, or wrapped in a WebView.
- Web behaviour is not changed merely to ease native development, unless a
  shared-architecture improvement can be introduced without regression.
- Shared logic extracted for the native client (campaign data, save
  sanitisation, game-state rules) must keep the web build passing its
  baseline checks above.
