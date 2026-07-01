# Decision Log

This document records approved decisions over time. Each entry captures what was decided and when, so the reasoning behind the project is preserved. GitHub provides the full version history; this log provides the human-readable summary.

## 2026-07-01

### Repository is the single source of truth

The project has moved beyond brainstorming. The GitHub repository is the single source of truth. Every approved design decision now lives in the Markdown documentation. Future decisions are made by editing the living documents rather than only discussing them.

### Documentation structure established

The living document structure was created under `docs/`, including the Project Constitution, Universe Bible, Campaign Bible, Systems Bible, Knowledge Archive Bible, AI Bible, Audio Bible, Accessibility Bible, Network and Multiplayer Bible, Code Standards, Decision Log, Glossary, and Open Questions, plus a `design_notes/` area. The repository folders `assets/`, `src/`, `tests/`, and `tools/` were also established.

### Franchise and campaign naming

The franchise is Resonance. The first campaign is Resonance: Fractured Frequency.

### Ancient civilization named the Shawabti

The ancient alien civilization is the Shawabti, inspired by Egyptian Shawabti and Ushabti figures. They built adaptive AI for deep-space exploration and valued neurological diversity.

### AI companion named Faience

The player's AI companion is Faience, named for Egyptian faience. Faience is a sincere helper, not a villain, and integration with Faience is a gradual player choice with real tradeoffs.

### Perspective system based on profession

Players choose a profession, not a class. Every profession experiences the same events differently, and replayability comes from perspective rather than alternate timelines.

### Operation One named Exodus

Operation One is Exodus, with seven chapters. Each chapter teaches one major mechanic while advancing the story.

### Mobile-first, touch-complete control philosophy

The game is mobile-first and fully playable by touch alone, with no required keyboard, controller, braille display, or screen reader. All gestures are re-bindable.

### Accessibility interview framed around experience

The initial accessibility interview asks how the player experiences and wants to interact with the world, rather than asking about diagnoses. This was chosen to be respectful and future-proof.

### Local-first data with optional sync

Saves and player memory are local-first, with optional encrypted cloud synchronization and optional cross-platform synchronization. The player's archive belongs to the player.

### Reality-integrated navigation is a core gameplay mechanic

Reality-integrated navigation is now treated as a core gameplay mechanic rather than only an accessibility feature. It is documented in the Accessibility Bible and covers real-world priority, the safety override, separate real and game world models, reality announcements that fade in and out, replayable announcements, environmental audio profiles, and accessibility learning.

### DeafBlind gameplay is a first-class supported experience

DeafBlind play is a first-class, supported way to experience Resonance. Accessibility is configured by experience rather than diagnosis, and players may freely combine output, listening, and movement methods. Selecting no auditory input automatically enables captions, enables braille support where available, removes or greatly extends single-player timed actions, and replaces spoken urgency with tactile patterns, captions, and visual indicators.

### Tactile language defined as an independent channel

Haptics are designed as an intentional, authored tactile language rather than a conversion of music into vibration. Music may influence tactile patterns, but haptics are an independent communication channel for direction, threat, distance, proximity, urgency, hazards, navigation, success, and failure.

### Accessible input methods expanded

Accessible input now explicitly includes iOS Back Tap and Android Quick Tap where available, alongside double tap, shake, custom gestures, switch devices, controller, keyboard, braille commands, and voice. No action may depend on a single mandatory gesture.

### Playtesting Bible created

A Playtesting Bible was added as document 14. Accessibility testing is a first-class development discipline, equal to programming, audio, and design, and features must be validated with the documented player groups and testing dimensions.

### Target repository structure

The target repository structure separates applications from generated artifacts. Applications will live under `apps/web`, `apps/ios`, and `apps/android`. The `artifacts/` folder is reserved for playtest builds, release builds, demonstrations, recordings, exported packages, and temporary prototype artifacts. The current web prototype will move from `artifacts/resonance` to `apps/web` once the shared architecture is established.

### Development direction: refine before expanding

The project has moved from brainstorming into pre-production. From this point, every approved decision becomes an edit to an existing Markdown document, competing documents are avoided, and the existing documentation is refined before the scope of the game is expanded.
