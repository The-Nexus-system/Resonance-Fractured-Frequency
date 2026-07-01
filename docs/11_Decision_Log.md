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

### Chapter emotional loop is a canon design rule

Every chapter introduces one major gameplay system, answers one major narrative question, and ends by asking a larger question than it answered. Gameplay progression and narrative progression must grow together, so the player becomes more capable for the same reason the story becomes more complex.

### Operation One chapter question spine

The seven chapters of Operation One follow a fixed question spine that grows from personal survival to civilization. Chapter One asks whether the player can save their home and answers no. Chapter Two asks whether the player can find their people and answers yes. Chapter Three asks whether the crew can survive together. Chapter Four asks whether they can build something worth protecting. Chapter Five asks who the Shawabti really were. Chapter Six asks why the Shawabti chose humanity. Chapter Seven asks what kind of civilization humanity will become.

### Chapter Two design note authored

The full part-by-part design for Chapter Two: Roll Call, from the Maintenance perspective, was written as a design note. Chapter Two begins continuously from Chapter One with no loading or mission-complete screen, teaches survival and rescue rather than combat, and establishes that people are progression. Its canon includes the fixed Maintenance rescue order, the reveal that the Vale System is one person, the naming of the improvised station built from escape pods and salvaged modules, and the opening of the Knowledge Archive.

### Crew progression system established as canonical, franchise-wide reference

People, not equipment, drive progression throughout Resonance. A dedicated design note now defines what permanently changes when each crew member joins: gameplay, environments, soundscape, conversations, Knowledge Archive topics, future missions, and accessibility. Canon rules were locked: a portrait illuminates only once a crew member settles and begins contributing (portraits represent belonging, not rescue); every rescue changes the soundscape so the community is heard before it is seen; and every crew member must unlock at least one of each major category. A franchise rule requires every future crew member to answer what gameplay they unlock, how they change the soundscape, and how they expand the understanding of community. The document lists per-member unlocks for Rowan Ives, Mara Chen, Samira Kade, Jonah Briggs, Talia Rusk, Soren Qadir, Mira Ives, and the Vale System.

### Primary crew members stay relevant for the whole campaign

A canon rule was added to the crew progression system: every primary crew member must remain mechanically and emotionally relevant throughout the entire campaign. No primary crew member exists only to unlock a system and then become background decoration. Every chapter should give every crew member meaningful opportunities to contribute according to their expertise, and people remain progression from the first rescue to the final chapter.
