---
name: Resonance native mobile client
description: Durable lessons from building the Expo native client (Phases 0-2 of the native iOS transition).
---

# Native mobile client (artifacts/resonance-mobile)

- Native framework decision (docs/11_Decision_Log.md): React Native + Expo, shared TypeScript core — satisfies the work order's "no WebView" rule.
- Phase 0 baseline doc: docs/design_notes/native_ios_phase0_baseline.md. Web build is the validated reference; parity means same save shape/sanitisation (`resonance_save_v1`), same campaign data, no a11y regressions. `haptics` setting is an additive native-only channel.
- Tones: RN has no oscillator — synthesize 16-bit WAV sine as a base64 data URI (lib/tones.ts) and play via expo-audio; release the player on `didJustFinish` and stop it when the play screen unmounts.
- Persistence rule: never persist inside React state updaters (updates get lost); persist from an effect on final state, serialize AsyncStorage writes with a promise chain, and gate the UI on hydration.
- **Testing subagent drift:** with two same-branded apps (web + Expo) in one workspace, the tester repeatedly tested the WEB app while claiming the mobile one. Always give the exact Expo dev-domain URL and a visual discriminator (mobile = teal #0e7490 palette; web play page uses purple) and have the tester verify it before asserting.
- Expo deep links have no back history — back buttons need `router.canGoBack() ? back() : replace(home)` fallback.
- Remaining honest NOT TESTED: real-device VoiceOver, braille, haptics feel, iOS audio behaviour — web preview only. Phases 3+ of the 22-phase work order (spatial audio, Core Location, AR, etc.) not started.
