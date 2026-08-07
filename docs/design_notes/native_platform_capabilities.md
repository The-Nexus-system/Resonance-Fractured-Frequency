# Native Platform Capabilities — Honest Status (Phase 4 Completion)

**Scope.** This document states exactly which Apple-platform capabilities the
Resonance mobile client uses today, which it cannot use in the current
build environment, and precisely where each native upgrade plugs in later.
Nothing here is aspirational hand-waving: every "future" item names the
architecture seam that already exists in the code.

**Build environment constraint (the honest part).** This workspace produces
an Expo (SDK 54) JavaScript bundle that runs in Expo Go / a web preview. It
cannot compile custom native modules or produce an Xcode development build,
and no physical iOS hardware is attached. Anything that requires a native
module or a dev build is therefore *designed for*, not *shipped*, and is
listed under NOT TESTED / NOT POSSIBLE HERE below.

## 1. World-anchored AR (ARKit / RealityKit)

**Today.** The optional "Camera view" is a camera passthrough with a
heading-based overlay: object markers are positioned from the SEMANTIC world
model (bearing + distance from the player pose) over the live camera image.
It is honest sensor-based AR-style presentation, but it is **not**
world-anchored AR — there is no plane detection, no persistent anchors, no
occlusion. If the device turns, markers move by compass heading, not by
visual-inertial tracking.

**Why not more.** ARKit is not exposed by Expo Go. True anchoring needs
`expo-dev-client` + a native module (e.g. a RealityKit view bridged to React
Native) and a physical device with an A12+ chip.

**The seam.** The renderer consumes `SceneEntity` views from
`lib/scene/entities.ts` — pure derivations of the semantic world. An ARKit
implementation consumes the *same* entities: semantic position (metres,
east/north/up) maps to ARKit world coordinates after a one-time origin +
heading alignment. No gameplay state moves; the AR layer is presentation
only, exactly like the 3-D view.

**Steps to ship it (dev build required):**
1. `npx expo install expo-dev-client`; add a native module wrapping
   `ARView`/RealityKit (or use a maintained community ARKit module).
2. Anchor the world origin at session start (player position = device
   position; semantic north aligned by `CLHeading`).
3. Feed `sceneState()` entities into anchored `Entity` instances; taps hit-test
   to an entity id and call the same semantic action dispatcher.
4. Respect the same accessibility contract: AR is optional; the text and
   button interface remains complete.

**Status: NOT POSSIBLE IN THIS WORKSPACE — architecture seam implemented and
documented; camera overlay honestly labelled "optional" in the UI.**

## 2. Native 3-D spatial audio (AVAudioEnvironmentNode / PHASE)

**Today.** Audio spatialisation is implemented in the app's own synthesis
layer: per-object stereo pan from relative bearing, gain from distance,
timbral filtering ("presence") from discovery state. Coordinates come from
the same semantic world the renderer uses — one coordinate system for eyes,
ears and text. This is real spatial information, but it is stereo panning,
not binaural HRTF rendering.

**Why not more.** `expo-audio` does not expose `AVAudioEnvironmentNode`,
`AVAudioEngine` graphs, or Apple's PHASE engine. Head-tracked binaural audio
additionally requires AirPods with dynamic head tracking and a dev build.

**The seam.** Every sound is rendered from a *voice description* (frequency,
timbre, presence, pan, proximity) computed from semantic coordinates in
`lib/music/` + `panFor()`. A native backend replaces only the final render
step: voice descriptions become `AVAudioPlayerNode`s positioned in an
`AVAudioEnvironmentNode` at the same east/north/up coordinates. Nothing
upstream changes.

**Status: NOT POSSIBLE IN THIS WORKSPACE — distance/bearing-aware stereo is
the shipped implementation; the native upgrade path is a swap of the final
audio-render stage only.**

## 3. Action Button and Back Tap

**Today (legitimate, supported route).** iOS exposes the Action Button and
Back Tap to users via Shortcuts, and Expo apps can be targets of Shortcuts
through deep links. The explore screen handles
`resonance-mobile://explore?action=interact`: opening that URL performs the
current contextual semantic action — the *same* dispatcher as the on-screen
button, VoiceOver custom actions, 3-D tap, and shake.

**User setup (documented, one-time):**
1. Shortcuts app → new shortcut → "Open URL" →
   `resonance-mobile://explore?action=interact`.
2. Settings → Action Button → Shortcut → choose it (iPhone 15 Pro and later),
   **or** Settings → Accessibility → Touch → Back Tap → Double Tap → choose it.

There is no App Intents integration (that requires a dev build with native
code); the Shortcut-URL route is the honest, fully supported mechanism
available to an Expo app, and the game never requires it — the stationary
on-screen interface is always sufficient.

**Status: SHIPPED (deep-link route) / App Intents variant NOT POSSIBLE IN
THIS WORKSPACE.**

## 4. What ships and works in this build

- One semantic action system under every input (button, 3-D tap, VoiceOver
  custom actions, Shortcut deep link, optional shake — shake OFF by default).
- Reusable 3-D renderer (`components/world3d/`) over `lib/scene/entities.ts`
  derived views — no second state store, quality tiers that never affect
  gameplay, Reduce Motion static alternatives.
- Spatialised synthesized audio + environmental music evolution, one
  coordinate system with the renderer and text interface.
- Haptic vocabulary (`lib/haptics.ts`) on expo-haptics, split into interface
  and gameplay channels.

## 5. NOT TESTED on real hardware (web-preview workspace)

Real-device behaviour of: haptic patterns, VoiceOver custom actions and
announcement timing, Back Tap/Action Button Shortcut execution, camera
overlay heading accuracy, expo-gl renderer performance tiers on-device,
audio latency and mixing under the device audio session, shake detection
thresholds. Each of these has a web-preview or unit-level verification only.
