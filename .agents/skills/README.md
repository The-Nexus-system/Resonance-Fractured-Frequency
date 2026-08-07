# Installed third-party skills — Replit usage notes

Sources (installed Aug 2026, native tooling preparation pass):
- `expo-dev-client`, `expo-module`, `expo-native-ui`, `expo-upgrade` — from github.com/expo/skills (official Expo skills).
- `axiom-accessibility`, `axiom-audit-accessibility`, `axiom-media`, `axiom-graphics`, `axiom-games` — from github.com/charleswiltgen/axiom (iOS/Swift specialist skills: VoiceOver, Core Haptics, AVFoundation, RealityKit/ARKit/USDZ, game controls).
- `sound-engineer` — from github.com/curiositech/some_claude_skills (audio design/mixing expertise).

## CRITICAL Replit constraints (these override anything the skills above say)
- NEVER run EAS CLI or `npx expo` commands. iOS builds/App Store submission go through Replit's **Expo Launch** (the Publish pane). The expo-dev-client and expo-upgrade skills reference EAS CLI workflows — use them as conceptual knowledge only.
- `app.json` must stay **static** — no app.config.ts/js.
- Development preview runs in **Expo Go** via the workflow `artifacts/resonance-mobile: expo`; native modules (`modules/resonance-native`) cannot be compiled or tested in this workspace. Native Swift code is validated only through a real device build (Expo Launch / dev build outside Replit).
- Use these skills for architecture, API knowledge (RealityKit, PHASE, AVAudioEngine, Core Haptics, VoiceOver), and code authoring — not for running their suggested shell/build commands.
