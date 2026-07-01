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

### Canon rules consolidated into a master document

The full set of canon rules is now collected in a single authoritative living document, Canon Rules, indexed in the project README. It gathers the canon rules that were previously stated across the constitution, bibles, and design notes, each given a descriptive, screen-reader-navigable heading, and it is the place new canon rules are added as they are adopted. The document covers how chapters grow gameplay and story together, how Operation One is experienced once through many synchronized perspectives, campaign completeness across professions, mechanics being introduced by people rather than menus, accessibility as standard equipment, acoustic identity of locations, silence as a storytelling tool, failure changing rather than restarting history, knowledge always changing something, shared teaching and learning, the player never being the smartest in the room, the home always evolving, history and understanding being earned separately, every chapter leaving the home better, no primary crew member becoming obsolete, portraits representing belonging, sound and community as progression, the station growing through people, perspectives completing each other without contradiction, professions answering three questions differently, and every system reinforcing the central themes. Where a rule is elaborated in another document, that document keeps the detail while Canon Rules holds the complete set. To avoid competing sources of canon, precedence was set explicitly: Canon Rules holds precedence for the wording of a rule, restatements elsewhere are explanatory rather than a second source of truth, and only the Project Constitution has authority over Canon Rules. The Crew Progression System note now points to Canon Rules for its restated rules, and the README no longer describes the design notes folder as entirely non-canon.

### Chapter Three: Community designed from the Maintenance perspective

The full part-by-part design for Chapter Three, Community, was written as a design note. Chapter Three is the transition from survival to civilization: Chapter One taught the profession, Chapter Two taught rescue, and Chapter Three teaches how communities function. Its chapter question is whether the crew can survive together, answered yes if everyone contributes, and it ends by asking what the community is willing to build together. The chapter is built in four parts: a choice-driven first peaceful morning where visiting each crew member in any order permanently unlocks a distinct gameplay system while canon stays fixed; a first community meeting where the player helps set the station's first major priority among six equally valid options; a collaborative construction part where major projects require multiple crew members and present quick-versus-reinforced and immediate-versus-delayed-accessibility tradeoffs; and eight First Tests, one per primary crew member, that must all be completed before the chapter ends. The chapter closes with the unknown signal returning stronger, longer, and intentional, setting up Chapter Four. A section design framework was adopted alongside it and promoted to a global canon rule in the Canon Rules document, "Every Major Decision Answers Four Questions": every major player-decision section answers four questions, namely what decision the player makes, what gameplay system is learned, what philosophy or life lesson is learned, and what permanently changes as a result. Chapter Three is the first chapter authored to that rule; the chapter doc references it rather than restating it as its own governance.

### Chapter Four: Salvage designed from the Maintenance perspective

The full part-by-part design for Chapter Four, Salvage, was written as a design note across six parts. Chapter Four introduces the expedition gameplay loop that defines the remainder of Operation One: for the first time the player deliberately leaves home, not to escape Hearth but to return to it and learn from it, salvaging history as much as technology. Its primary question is whether the crew can build something worth protecting, answered yes by remembering what came before, and it ends by asking what really happened aboard Hearth before its destruction. The chapter teaches a repeatable expedition rhythm of preparing, departing, exploring, recovering, returning, reflecting, and rebuilding, through six parts: preparing for the first expedition with three pre-departure decisions; departure with route selection and advisor interaction; the first expedition with four explorable zones chosen in any order; homecoming with a community debrief and four salvage-integration decisions; living with discovery, covering return expeditions, artifact classification, and the expedition journal; and expedition consequences, completing the decision framework. The chapter climaxes when the strange signal from Chapter Three responds not to the station or the player but to something recovered from Hearth, and it closes asking what Hearth was carrying that someone still wants.

Alongside Chapter Four, two expedition rules were promoted to global canon rules in the Canon Rules document. "Every Major Expedition Begins and Ends at Home" establishes the home as the emotional, mechanical, and narrative anchor, fixes the seven-beat expedition rhythm, and requires every expedition to return with at least one meaningful contribution to the community rather than resources alone. "Every Expedition Expands Understanding" requires every expedition to answer one important question and create at least two new ones, so curiosity always outpaces certainty. The chapter's own recurring canon notes, that zones are chosen rather than completed, that no zone is ever fully completed on the first visit, and that completion should inspire curiosity, are given distinct headings within the chapter doc so they remain screen-reader navigable.

### Chapter Five: First Contact designed from the Maintenance perspective

The full part-by-part design for Chapter Five, First Contact, was written as a design note across six parts. Chapter Five is the player's first encounter with an unmistakably non-human civilization: the player does not meet living Shawabti but their preserved legacy, and the chapter introduces archaeology, translation, environmental interpretation, and ethical exploration, teaching that exploration is stewardship rather than ownership. Its primary question is what the Shawabti left behind, answered as something intentionally preserved, and it ends by asking why it was preserved for us. The six parts are the signal, which resolves the Chapter Four mystery into an intentional, waiting transmission and sends the crew to a single perfectly intact structure; the threshold, where the structure opens not because a puzzle was solved but because the player observed before acting; the first archive, where collaborative observation projects the first living reconstruction of the Shawabti, seen but not understood; echoes, where the player walks through a preserved moment of Shawabti society as an observer who cannot change or collect anything; resonance, where the structure reveals it was evaluating how the player explored, offers a preservation-versus-recovery artifact decision with no morally correct answer, and ends with the damaged helmet quietly speaking a single Shawabti word; and learning resonance, which introduces Resonance as the central gameplay system of the franchise with permanent unlocks. The chapter is consistent with established canon that Faience is the player's AI companion tied to the damaged helmet whose heads-up display was lost during the escape, and it closes on the hook that Faience knows a language nobody has translated, asking who or what Faience is becoming, which becomes the foundation of Chapter Six. The chapter title First Contact was previously unlocked and is now set. The chapter's in-chapter canon notes, that no ending choice is morally correct, that every Resonance interaction supports multiple methods, and that no Resonance interaction requires one ability, are given distinct headings so they remain screen-reader navigable.

A design adjustment was applied to the accessibility reveal at the user's direction. The player should not learn in a single reveal that Shawabti civilization was built around accessibility; that understanding is meant to unfold gradually across Chapters Five, Six, and Seven. In Chapter Five the player should simply notice that the structure seems to work for everyone without yet understanding why, preserving the mystery. Accordingly, the explicit accessibility-conclusion statements in the source material for Part Three and Part Six were softened to defer the "why" while keeping the principle that the game never directly explains this conclusion and that players arrive at it naturally through repeated experience.

### Expedition Success Evaluation adopted as a global canon rule

A new franchise-wide rule was promoted to the Canon Rules document, "Every Expedition Records How the Player Approached Discovery." Every major expedition records the player's approach to discovery as philosophy rather than morality, and never as a numerical score. Possible expedition philosophies include curiosity, preparation, preservation, collaboration, leadership, scientific investigation, engineering, compassion, historical preservation, and accessibility. These quietly influence crew dialogue, Knowledge Archive entries, Resonance responses, future advisor recommendations, environmental storytelling, optional missions, and historical interpretation. The player is never told they played correctly; the world simply remembers how they chose to build civilization, so the player becomes known for how they think rather than becoming good or bad. Chapter Five documents this system in its final part, building directly on the resonance chamber's evaluation of the player's approach so that the structure's judgment becomes the first entry in a record that continues across every future expedition.

### Chapter Six: The Living Archive designed from the Maintenance perspective

The full part-by-part design for Chapter Six, The Living Archive, was written as a design note across six parts. Chapter Six transforms the Knowledge Archive from a library into an active participant: the player stops studying isolated discoveries and begins assembling an entire civilization from fragments, learning that preserving knowledge also preserves values, relationships, and ways of thinking. Its primary question is what the Shawabti were trying to preserve, answered as more than knowledge, and it ends by asking why Faience understands them. For the first time the destination is not primarily physical; the player explores the Living Archive itself, which is established as a preserved civilization communicating through Resonance rather than a database, a search engine, or artificial intelligence. The six parts are awakening, where the damaged helmet activates on its own and Faience says it remembers; conversations across time, which teaches that understanding grows through conversation and progressive translation rather than information retrieval; reconstructing a civilization, which teaches historical synthesis by connecting relationships rather than isolated events and introduces the Investigation Board; humanity in the archive, which reveals the Shawabti deliberately observed early humanity without interfering; the keeper, which concludes the narrative arc by revealing the Archive was preserving a relationship and frames Faience as the first bridge between two civilizations; and carrying the archive forward, which makes the Living Archive a permanent part of the station and completes the chapter's systems. The chapter maintains established canon that Faience is the player's AI companion tied to the damaged helmet, and it deepens the gradual awakening arc so that Faience increasingly appears to remember the Shawabti rather than merely translate them. It closes on Faience's first original, untranslated question and a distant Shawabti structure beginning to transmit, and it poses the question that sets up the conclusion of Operation One: what kind of civilization will humanity choose to become. The chapter title The Living Archive is now set.

Alongside Chapter Six, one rule was promoted to a global canon rule in the Canon Rules document. "Knowledge Must Always Produce Action" requires every major historical discovery to eventually change at least one of dialogue, exploration, engineering, medicine, leadership, accessibility, research, or community life, and states that if knowledge changes nothing it should not exist. The chapter documents this rule within its final part under a distinct heading. The chapter's two concluding beats, the narrative climax in the fifth part and the systems-and-epilogue climax in the sixth part, are given distinct headings so the two climaxes and their end-state summaries remain unambiguous and screen-reader navigable, and only the final part closes the chapter.
