# Studio Readiness Review — Q3 2026

This document is the authoritative studio readiness review for Resonance: Fractured Frequency as of July 2026. It draws exclusively on evidence from the current repository state: every finding cites the specific file or absence of file that supports it. Its purpose is to give a future remediation pass a clear, prioritised list of fixes that can be applied in order without guesswork.

The document is structured as a set of domain reviews followed by a consolidated remediation plan. The remediation plan groups all fixes into six chunks that can be applied one at a time, from critical blockers through contributor onboarding polish.

## Executive summary

The Resonance: Fractured Frequency repository is in strong conceptual health. The design philosophy is internally consistent, the canon rules are comprehensive and well-maintained, the character and world documentation is deep, and the accessibility-first foundation is genuine rather than performative. The project has produced more than 1.5 MB of canonical design documentation across fifteen core bibles, twenty-one design notes, and fourteen presentation bible parts, and the recent British English conversion and six new franchise design bibles have meaningfully expanded the design surface.

The project is not yet production-ready.

Several critical gaps sit between the current documentation state and a team that can begin building content in parallel with code. Four production-track bridge documents that were commissioned are entirely absent. Environmental art direction does not exist in any form. The audio engine and recording pipeline are unresolved Open Questions. Seven of eight playable professions have no chapter design notes. Three core bibles that cover the primary gameplay systems — knowledge-as-progression, AI integration, and controls — are summary stubs rather than actionable references. Six of fifteen core bibles have no cross-reference section, making the document graph navigable only by someone who already knows it.

The current prototype (`artifacts/resonance`) is a React and Vite web scaffold with accessibility infrastructure and campaign data structures, but contains no audio engine, no spatial audio, no haptic layer, no game loop, and no automated tests. It is a correct and honest foundation, but it is not yet a game.

The three implementation milestones that would move the project from documentation phase to active production are: a testable Chapter One prototype validated with real accessibility players; an audio engine selection that unlocks the rest of the sound pipeline; and a shared codebase architecture decision that enables native iOS and Android development.

## Repository health assessment

### Evidence base

- Fifteen core bibles in `docs/`, ranging from 1.3 KB (Knowledge Archive Bible) to 68 KB (Decision Log).
- Twenty-one design notes in `docs/design_notes/`, ranging from 1.2 KB (Accessibility Lab stub) to 320 KB (Modular Architecture Bible).
- Fourteen parts of the Player Identity and Character Presentation Bible in `docs/presentation_bible/`, ranging from 3.8 KB (README) to 100 KB (Canonical Character Profiles).
- A working prototype in `artifacts/resonance/` built on React 18, Vite, TypeScript, Tailwind CSS, and Radix UI.
- No automated tests of any kind.
- No continuous integration configuration.
- British English conversion completed across all 52 documents.
- GitHub repository `The-Nexus-system/Resonance-Fractured-Frequency` on branch `main` is the single source of truth, pushed via Git Data API.

### Strengths

- The canon rule set (`docs/15_Canon_Rules.md`, 31 KB) is exhaustive, internally consistent, and clearly stated. Every rule has a descriptive heading and is findable by screen reader navigation.
- The Decision Log (`docs/11_Decision_Log.md`, 68 KB) provides a complete audit trail of every design decision, including its reasoning. This is unusual and valuable.
- The presentation bible is genuinely production-ready for the primary cast: canonical character profiles, recognition matrices, audio identities, animation standards, and technical naming conventions all exist and are cross-disciplinary.
- The Modular Architecture Bible (320 KB) is arguably the most complete room-design document in the repository and could be handed to an environment team today.
- The spelling conversion is clean: zero residual American `-ize`/`-yze` forms outside the protected size/prize/seize family, no broken code identifiers, no foreign-language interference.

### Weaknesses

- The prototype has no game loop, no audio engine, no spatial audio, no haptics, and no tests. Its source files outside the UI component library are `App.tsx`, `a11y-provider.tsx`, `campaigns.ts`, `settings.ts`, `utils.ts`, and page-level scaffolds — foundational scaffolding rather than game features.
- The document graph has significant one-way references: the six new design bibles cite the core bibles, but none of the core bibles cite the six new design bibles.
- The gap between the thinnest core bible (Knowledge Archive, 1.3 KB, four sections) and the thinnest design note (Accessibility Lab, 1.2 KB, also four sections) illustrates a structural problem: core bibles are supposed to be authoritative, but several are thinner than an experimental stub.

## Documentation architecture review

### Cross-reference coverage

The following core bibles have no "Relationship to other documents" section:

- `docs/03_Campaign_Bible.md` — the document a new contributor is most likely to read first.
- `docs/04_Systems_Bible.md` — explicitly defers to the Accessibility Bible and Audio Bible within its own text but provides no links.
- `docs/05_Knowledge_Archive_Bible.md` — references Faience in passing but does not link to the AI Bible.
- `docs/06_AI_Bible.md` — the central narrative theme document has no cross-references.
- `docs/08_Accessibility_Bible.md` — the foundational accessibility standard has no links to the Modular Architecture Bible, Presentation Bible, or Technical Standards.
- `docs/10_Code_Standards.md` — references the prototype and the shared-codebase goal but has no links to the Playtesting Bible or the Franchise Asset Bible.

Documents that do have a cross-reference section: `docs/02_Universe_Bible.md`, `docs/07_Audio_Bible.md`, `docs/09_Network_and_Multiplayer_Bible.md`, and all six new design bibles. The presentation bible cross-references are embedded in each part's introduction.

### Campaign Bible cross-reference gap

The Campaign Bible defines the perspective system ("replayability comes from perspective rather than from alternate timelines") but does not link to:

- `docs/design_notes/operation_one_exodus_perspective_map.md` — the canonical implementation of the perspective system.
- `docs/design_notes/operation_one_exodus_master_timeline.md` — the authoritative chronology.
- `docs/design_notes/operation_one_exodus_character_schedule.md` — the authoritative character positioning.
- `docs/design_notes/crew_progression_system.md` — the canonical crew relevance standard.
- `docs/design_notes/modular_architecture_bible.md` — the canonical spatial environment reference.

Its "Related documents" section links only the Universe Bible and the Gameplay Progression Matrix.

### Design-notes index gap

`docs/design_notes/README.md` does not state a naming convention for new design notes. Future contributors have no guidance that new notes should follow the lowercase-underscore, no-number-prefix pattern established by every existing note.

### Missing documents

The following four canonical documents were commissioned but do not exist in the repository:

- `docs/design_notes/visual_direction_track.md`
- `docs/design_notes/audio_production_track.md`
- `docs/design_notes/music_direction_track.md`
- `docs/design_notes/graphics_and_asset_direction_track.md`

Their absence is the highest-severity documentation gap.

## Canon consistency review

### Naming inconsistency: "Dr." versus "Doctor"

In `docs/design_notes/crew_progression_system.md`, the heading and all sub-headings for the character read `## Dr. Soren Qadir`. Every other document in the repository uses the spelled-out form: `Doctor Soren Qadir` appears 140 times across the Canonical Character Profiles, Character Identity Map, Recognition Matrix, Modular Architecture Bible, and Decision Log. The abbreviated form with a full stop appears only in the Crew Progression System.

### Profession chapter design imbalance

All seven chapter design documents cover the Maintenance perspective only:

- `operation_one_exodus_maintenance_chapter_one.md` through `_chapter_seven.md`

The seven remaining professions — Medic, Scientist, Engineer, Security, Commissioned Officer, Non-Commissioned Officer, and Civilian — have no chapter design notes. The canon rule states that a campaign is not complete until every primary profession has been fully implemented. This is a known and declared gap, not a hidden inconsistency, but it must be flagged at the canon level because it is the largest single body of missing design content.

### Perspective Map not linked from Campaign Bible

The Campaign Bible establishes the perspective system as the franchise's primary replayability mechanism. The Perspective Map (`operation_one_exodus_perspective_map.md`) is the canonical implementation of that system. The two documents do not cite each other. Any contributor reading the Campaign Bible has no path to the document that actually realises its central promise.

### Playtesting Bible authority versus depth mismatch

The Production Pipeline Bible names the Playtesting Bible as the authority for its Testing and Regression Testing gates. The Playtesting Bible (`docs/14_Playtesting_Bible.md`, 1.4 KB, five sections) provides player group lists and testing dimensions but no methodology, session structure, acceptance criteria, or issue escalation process. The pipeline defers to a document that does not yet have the depth to serve as an authority.

### Open Questions with no design ownership

The following open questions in `docs/13_Open_Questions.md` have no interim design guidance anywhere in the repository:

- Audio engine and spatial-audio approach across native and web targets.
- Perspective audio authoring without content duplication.
- Braille display protocols and hardware to support first.
- Tactile music pattern definition and authoring.
- Netcode, matchmaking, and session-tier implementation.
- Timer fairness when some players have removed action timers.

Each of these blocks a production decision that affects multiple other systems.

## Accessibility review

### Strengths

The accessibility foundation is genuinely deep. The canon rule "Accessibility Is Standard Equipment" is reflected throughout the Modular Architecture Bible, the Presentation Bible, the Animation standards, the Technical Standards, and every new design bible. The principle that every visual signal requires a non-visual equivalent is built into the Visual Design Standards as a design acceptance criterion, not an afterthought. The Community Simulation Bible, Discovery Bible, and Player Interaction Bible all address accessibility at the design-pattern level. This is unusually thorough for a project at this stage.

### Gaps

- Tactile music has no canonical design. It is listed in the Accessibility Lab as an area to prototype, listed in Open Questions as unresolved, and referenced in the Audio Bible's "Adaptive music" section as something that should exist. No document defines what a tactile music pattern is, how it is authored, how it communicates the information music carries, or how it relates to haptic output on specific hardware.

- Braille display support is in the same state: named in the Accessibility Lab, named in Open Questions, not defined anywhere.

- The Accessibility Lab (`docs/design_notes/accessibility_lab.md`, 1.2 KB) has had no documented graduations since it was created. None of the ideas it lists — braille display, tactile music, wearable haptics, smart cane integration, switch devices — have moved into the Accessibility Bible or Systems Bible.

- DeafBlind gameplay is defined in the Accessibility Bible in five bullet points. It is not elaborated in any design note, and there is no section in the Player Interaction Bible that specifically addresses how interactions are designed for a player who has neither vision nor hearing.

### Accessibility Lab graduation

The Accessibility Lab's stated process is: prototype, evaluate, write into the Accessibility Bible or Systems Bible, record in the Decision Log, remove or update the lab note. This process has not been followed for any item. The lab note should either be progressed or it should record why each area is still pre-prototype.

## Audio review

### Strengths

The Audio Bible (`docs/07_Audio_Bible.md`, 17 KB) is one of the strongest core documents. It covers sixteen sound library categories, cultural sound identity, emotional sound design, and the definitive acoustic identity canon rule. The Presentation Bible Part IV (Audio Identity, 35 KB) is production-ready for the recurring cast. The canon rule "Everything Has an Acoustic Identity" is specific, enforced, and consistently referenced.

### Critical gaps

- There is no audio production workflow document. The Audio Bible defines what every sound must communicate and what qualities it must have. It does not define how any sound is made, recorded, named (beyond the naming conventions in Technical Standards), integrated into a game engine, mixed, or iterated. There is no brief for a recording engineer, no middleware specification, no integration pipeline, and no mix session structure.

- The audio engine is an Open Question with no interim design guidance. Audio is the primary renderer. Every other system is downstream of the audio engine selection: spatial audio, perspective audio, haptics tied to audio events, braille events triggered by audio cues, and tactile music all depend on the engine choice. There is no document that narrows the options or states the technical requirements an engine must satisfy.

- Perspective audio authoring is unsolved. The Campaign Bible and Audio Bible both confirm that the same event must be experienced differently per profession. The Open Questions document lists this as unresolved. No document addresses how to author one audio event that mixes differently across eight professions without duplicating content eight times.

- `docs/design_notes/audio_production_track.md` does not exist.

- `docs/design_notes/music_direction_track.md` does not exist. The Audio Bible's "Adaptive music" section covers the philosophy in seven paragraphs. It does not address motif construction, leitmotif assignments per character or faction, the compositional role of silence, cultural music traditions that distinguish human music from what Shawabti music might eventually reveal, or how musical information is expressed through haptics for players who cannot hear.

## Visual and art direction review

### Strengths

Character visual direction is well-documented. The Presentation Bible Part III (Visual Design Standards, 37 KB) covers face standards, hair standards, body and silhouette standards, clothing and equipment standards, and non-visual equivalence requirements for every visual signal. Part IX (Animation, 37 KB) and Part X (Portraits and Avatars, 21 KB) are production-ready references.

### Critical gap: no environmental art direction exists

This is the largest single gap in the entire repository. There is no document — and no section in any existing document — that covers:

- Colour palette for ship interiors, alien sites, or open space.
- Lighting mood language or key-light philosophy for any environment.
- Shader approach or material palette for hull surfaces, Shawabti structures, organic alien materials, or space.
- The visual language that distinguishes a Shawabti space from a human space.
- Atmosphere, fog, and particle direction for deep space or planetary surfaces.
- Level-of-detail transitions and their visual character.
- The visual grammar of the information layer (the heads-up display, spatial audio indicators, and waypoint system) and how it remains legible while never being required.

The Modular Architecture Bible defines the layout and function of every room in extraordinary detail. It contains no visual art direction. A concept artist or environment artist given the Modular Architecture Bible alone would know exactly where every door and workstation is, and nothing about what the room looks like.

`docs/design_notes/visual_direction_track.md` does not exist.
`docs/design_notes/graphics_and_asset_direction_track.md` does not exist.

## Gameplay systems review

### Strengths

The Player Interaction Bible (49 KB) defines every interaction category in depth, with eight required facets per interaction. The Discovery Bible covers the philosophy and mechanics of environmental storytelling, hidden content, and how discovery changes gameplay. The Community Simulation Bible defines the gameplay of daily community life. The Gameplay Progression Matrix unifies all progression systems across all seven chapters.

### Critical gaps in core systems

The Systems Bible (`docs/04_Systems_Bible.md`, 4 KB) covers the three primary gameplay systems as follows:

- Combat: seven bullet points describing simultaneous location cues (spatial audio, weapon reports, footsteps, radio chatter, Faience callouts, ship vibration, environmental echoes) plus one note about haptics. No flow, no encounter design, no enemy design, no cover mechanic, no escalation structure.

- Flight: six bullet points listing what Faience announces during flight (bearing, velocity, incoming fire, target lock, friendly ships, obstacles, proximity). No flight-model description, no manoeuvre vocabulary, no pod-versus-fighter-versus-capital-ship differentiation.

- Boarding and exploration: four sentences. No boarding sequence, no airlock mechanic, no breach encounter design.

None of these systems have design notes that elaborate them. The Player Interaction Bible covers interactions in the community and station environment in depth; it does not cover combat interactions, flight interactions, or boarding interactions.

### Knowledge Archive Bible depth

The Knowledge Archive Bible (`docs/05_Knowledge_Archive_Bible.md`, 1.3 KB) defines knowledge as the primary progression system in approximately 250 words. It does not address:

- How the Knowledge Archive is structured or navigated.
- How entries are discovered versus how they are earned by research.
- How knowledge entries reference each other to form chains of understanding.
- How knowledge changes across chapters (the Gameplay Progression Matrix covers this from the chapter side but the Archive side has no corresponding depth).
- How the archive is designed to be navigable by a blind player.

## Narrative review

### Strengths

The Narrative Style Guide (31 KB) is comprehensive and production-ready for writers. It covers dialogue craft, professional and community voices, representation, translation and sign languages, interior and documentary text, and discovery-over-exposition at the level of sentence-by-sentence craft guidance. The chapter question spine in the Campaign Bible is coherent and emotionally well-structured. All seven maintenance chapter designs are thorough and internally consistent.

### Gaps

- Seven professions have no chapter design notes. The Perspective Map establishes their vantage points and perspective dimensions but provides no scene-by-scene narrative beats. A writer assigned to the Medic perspective has the Perspective Map for structural guidance and nothing else for narrative content.

- The AI Bible's narrative depth is thin relative to the importance of the Faience relationship to the story. "The central question of the AI relationship is not 'Is AI good?' The central question is 'What are you willing to become in order to survive?'" — this is stated in two sentences in the AI Bible and not elaborated further. The ethical stakes, the integration cost, and the trust mechanics are the emotional spine of the franchise. They deserve their own dedicated design note.

- Talia Rusk's cultural specifics are correctly left undeveloped pending Indigenous cultural consultation. No document records when that consultation is intended to occur, who is responsible for initiating it, or what format its outcomes would take. This is not a design gap but a process gap that affects a character who already appears across every chapter design.

## Multiplayer and network review

### Strengths

The Network and Multiplayer Bible (`docs/09_Network_and_Multiplayer_Bible.md`, 19 KB) is thorough at the design principle level. World persistence, protected personal spaces, safe logout priority, community redistribution, and the safe-return summary are all canonically defined and cross-promoted to the Canon Rules document. The authoritative world-as-host model is clearly stated and consistent with the canon rule set.

### Gaps

- The network implementation is entirely undefined. The open question reads: "What specific netcode, matchmaking, and session-tier implementation will realise the authoritative, world-centred network model?" No interim technical direction exists. The world-host architecture has significant implications for latency, entity authority, and client prediction that must be addressed before multiplayer development begins.

- The timer fairness open question (how timers work fairly when some players have removed them for accessibility) has no interim guidance despite the Accessibility Bible stating that timed actions are removed or greatly extended in single-player. The multiplayer interaction of this rule has no design.

- Testing requirements in the Network Bible include a list of test scenarios but no protocol for running them against real players with different accessibility setups. The Playtesting Bible does not address multiplayer accessibility testing specifically.

## Implementation readiness review

### Current prototype state

The prototype at `artifacts/resonance/` is a React 18, Vite 5, TypeScript, Tailwind CSS, and Radix UI application. Its non-UI source files are:

- `App.tsx` — application shell and routing.
- `a11y-provider.tsx` — accessibility context provider.
- `campaigns.ts` — campaign data structures.
- `settings.ts` — settings data structures.
- `lib/utils.ts` — utility functions.
- Six page-level components: home, campaigns, play, settings, about, not-found.

There is no audio engine, no spatial audio implementation, no haptic layer, no game loop, no save system, and no camera or spatial-movement model. There are no automated tests of any kind. There is no continuous integration configuration.

The prototype demonstrates that the toolchain is correctly configured (PORT enforcement, TypeScript strict mode, Vite build pipeline) and that the accessibility provider pattern is in place. It is a correct and honest scaffold, not a game.

### Shared codebase architecture

The target codebase layout (`apps/web`, `apps/ios`, `apps/android`, with `artifacts/` for generated outputs) is decided and recorded. The migration timing, the technology choice for native mobile, and the criteria that define "the shared architecture is established" are all Open Questions. Until this decision is made, native iOS and Android development, platform-specific haptics, braille device integration, and the full touch control set are all blocked.

### Testing gaps

There are zero automated tests in the repository. The Code Standards document states that testing is an acceptance criterion and references the Playtesting Bible for accessibility testing. No test framework is configured, no unit tests exist, no integration tests exist, and no accessibility testing harness is in place.

## Production roadmap

The three implementation milestones that convert this documentation project into a production project are listed below in priority order. None of them require completing all documentation first. All three can begin in parallel with the remediation chunks below.

### Milestone A — Testable Chapter One with real accessibility players

The documentation for Maintenance Chapter One is complete and internally consistent. The Master Timeline, Character Schedule, Modular Architecture Bible, Crew Progression System, and seven chapter design notes together constitute a full production brief for Chapter One from the Maintenance perspective. Building a playable Chapter One prototype and testing it with the Playtesting Bible's player groups — blind, low-vision, DeafBlind, Deaf, wheelchair users, and touch-only players — is the first concrete milestone that turns documentation into evidence.

### Milestone B — Audio engine selection and production pipeline

The audio engine choice and middleware selection must precede all audio-dependent production work. The milestone output is a recorded decision in the Decision Log, a completed audio production track document, and a working audio integration pipeline that demonstrates spatial audio, perspective audio (different mix per profession), and haptic event coupling on at least one target platform.

### Milestone C — Shared codebase architecture decision and migration path

The output of this milestone is a recorded technology decision covering the shared-codebase framework for iOS, Android, desktop, and web; the migration path from the current `artifacts/resonance` prototype; the criteria that mark migration complete; and a skeleton of the target `apps/` structure that future chapters and features can build on.

---

## Remediation plan

Each chunk below is designed to be applied as a single pass. Chunks are ordered by urgency. Later chunks do not depend on earlier ones being complete, but completing earlier chunks first removes blockers for later work.

The issue entries below use the following severity scale.

- Critical: blocks production or contradicts canon.
- High: degrades navigability, discoverability, or production readiness significantly.
- Medium: reduces quality, completeness, or consistency in a way that will accumulate cost if left unaddressed.
- Low: polish, minor inconsistencies, or contributor experience improvements.

---

### Chunk 1 — Critical blockers

These four issues must be resolved before any production team can begin working. All four are missing documents.

#### Issue 1.1 — Visual direction track does not exist

- Severity: Critical.
- Affected area: art direction, environment art, concept art.
- Why it matters: no concept artist, environment artist, lighting artist, or shader artist has any canonical visual brief to work from. The Modular Architecture Bible defines spatial layout in precise detail but contains no visual art direction. A team can produce environments that are spatially correct and visually incoherent.
- Desired end state: `docs/design_notes/visual_direction_track.md` exists as a canonical design note covering visual ambition, colour palette, lighting philosophy, material palette, shader language, the visual grammar of Shawabti versus human spaces, how the information layer reads without being required, and the non-visual equivalence requirement for every visual decision.
- Recommended fix: create `docs/design_notes/visual_direction_track.md`. Cross-reference the Modular Architecture Bible (spatial reference), the Accessibility Bible (non-visual equivalence), the Franchise Asset Bible (asset standards), and the Production Pipeline Bible (review gates). Add it to `docs/design_notes/README.md`.

#### Issue 1.2 — Audio production track does not exist

- Severity: Critical.
- Affected area: audio production, sound design, music production, audio engineering.
- Why it matters: the Audio Bible defines what every sound must communicate. No document defines how any sound is recorded, edited, named beyond the Technical Standards convention, integrated into a game engine, mixed, tested, or iterated. A sound designer has no production brief.
- Desired end state: `docs/design_notes/audio_production_track.md` exists as a canonical design note covering the recording pipeline, middleware requirements, file structure and naming beyond what Technical Standards provides, mix session structure, how perspective audio is authored without content duplication, testing with accessibility players, and how audio assets pass through the Production Pipeline review gates.
- Recommended fix: create `docs/design_notes/audio_production_track.md`. This document must resolve or narrow the audio engine Open Question (at minimum state the technical requirements an engine must satisfy). Cross-reference the Audio Bible, Accessibility Bible, Technical Standards, and Production Pipeline Bible. Add to `docs/design_notes/README.md`.

#### Issue 1.3 — Music direction track does not exist

- Severity: Critical.
- Affected area: music composition, adaptive score, sound design.
- Why it matters: music is one of the primary gameplay systems (the Audio Bible establishes adaptive music and the Knowledge Archive Bible's rule that sound is progression). No composer has a usable brief. The adaptive score architecture, leitmotif assignments, cultural music traditions, silence as a compositional tool, and tactile/haptic music equivalents are all undocumented.
- Desired end state: `docs/design_notes/music_direction_track.md` exists as a canonical design note covering the adaptive score architecture, motif construction and leitmotif assignments for each recurring character and faction, the compositional role of silence, cultural music that distinguishes human communities from what the franchise may eventually reveal of Shawabti culture, how musical information is expressed through haptics for players who cannot hear, and no-audio equivalents for every musical beat.
- Recommended fix: create `docs/design_notes/music_direction_track.md`. Cross-reference the Audio Bible, Accessibility Bible, Universe Bible (cultural context), and Production Pipeline Bible. Add to `docs/design_notes/README.md`.

#### Issue 1.4 — Graphics and asset direction track does not exist

- Severity: Critical.
- Affected area: 3D art, rigging, materials, UI art, portrait art, performance, localisation, asset review.
- Why it matters: the Franchise Asset Bible defines asset categories and metadata standards. The Technical Standards part of the Presentation Bible defines naming conventions for character assets. Neither provides the visual and technical production brief that a 3D artist, rigger, materials artist, or UI artist needs: mesh density targets, rig standards, material channel requirements, performance budgets per platform, UI visual style, portrait lighting standards, level-of-detail specifications, localisation considerations, and the asset review criteria that determine whether a completed asset passes.
- Desired end state: `docs/design_notes/graphics_and_asset_direction_track.md` exists as a canonical design note covering models, materials, UI visuals, portraits, rigs, accessibility metadata requirements for every shipped asset, alt-text and audio-description standards, performance budgets per platform tier, localisation requirements, and the asset review gate criteria that gate assets from production into the repository.
- Recommended fix: create `docs/design_notes/graphics_and_asset_direction_track.md`. Cross-reference the Franchise Asset Bible, Modular Architecture Bible, Technical Standards, Accessibility Bible, and Production Pipeline Bible. Add to `docs/design_notes/README.md`.

---

### Chunk 2 — Canon and cross-reference cleanup

These issues do not block production but degrade the navigability and authority of the document graph. Each fix is a targeted edit to an existing document.

#### Issue 2.1 — Six core bibles missing cross-reference sections

- Severity: High.
- Affected area: Campaign Bible, Systems Bible, AI Bible, Knowledge Archive Bible, Accessibility Bible, Code Standards.
- Why it matters: the document graph has no path from these six bibles to the design notes and presentation bible parts that elaborate them. A new contributor reading the Systems Bible has no route to the Modular Architecture Bible, the Accessibility Bible, or the Player Interaction Bible. A new contributor reading the AI Bible has no route to the Universe Bible's Faience section or the character profiles.
- Desired end state: each of the six bibles has a "## Relationship to other documents" section consistent with the format used in the Universe Bible, Audio Bible, and all six new design bibles.
- Recommended fix: add a cross-reference section to each of the six bibles. Suggested targets per bible:
  - Campaign Bible: link the Perspective Map, Master Timeline, Character Schedule, Modular Architecture Bible, Crew Progression System, Gameplay Progression Matrix, and the six new design bibles as relevant.
  - Systems Bible: link the Accessibility Bible, Audio Bible, Modular Architecture Bible, Player Interaction Bible.
  - AI Bible: link the Universe Bible (Faience section), Knowledge Archive Bible, Accessibility Bible.
  - Knowledge Archive Bible: link the AI Bible, Campaign Bible, Discovery Bible, Gameplay Progression Matrix.
  - Accessibility Bible: link the Modular Architecture Bible, Presentation Bible (all parts), Network Bible, Playtesting Bible.
  - Code Standards: link the Playtesting Bible, Franchise Asset Bible, Production Pipeline Bible.

#### Issue 2.2 — Campaign Bible cross-references are insufficient for its role

- Severity: High.
- Affected area: Campaign Bible.
- Why it matters: the Campaign Bible is the most likely entry point for new contributors. Its "Related documents" section links only the Universe Bible and the Gameplay Progression Matrix. The Perspective Map, Master Timeline, and Character Schedule — which are the canonical implementation of the Campaign Bible's core promises — are not linked.
- Desired end state: the Campaign Bible's "Related documents" section links all primary companion documents.
- Recommended fix: expand the Campaign Bible's "Related documents" section to include the Perspective Map, Master Timeline, Character Schedule, Crew Progression System, Modular Architecture Bible, Narrative Style Guide, and Player Interaction Bible as primary companions.

#### Issue 2.3 — Naming inconsistency: "Dr." versus "Doctor" for Soren Qadir

- Severity: Medium.
- Affected area: `docs/design_notes/crew_progression_system.md`.
- Why it matters: the Character Identity Map, Canonical Character Profiles, Recognition Matrix, Modular Architecture Bible, and Decision Log all use "Doctor Soren Qadir". The Crew Progression System is the only document using "Dr. Soren Qadir" in headings. The abbreviated form is not incorrect, but inconsistency in a heading that appears across nine sub-headings increases the cost of future search-and-reference work.
- Desired end state: the Crew Progression System uses the same form as every other document: "Doctor Soren Qadir".
- Recommended fix: replace all instances of "Dr. Soren Qadir" in `docs/design_notes/crew_progression_system.md` with "Doctor Soren Qadir".

#### Issue 2.4 — Playtesting Bible must be expanded to match the authority the Production Pipeline Bible assigns it

- Severity: High.
- Affected area: `docs/14_Playtesting_Bible.md`.
- Why it matters: the Production Pipeline Bible names the Playtesting Bible as the authority for its Testing and Regression Testing gates. At 1.4 KB the Playtesting Bible provides player group lists but no methodology, session structure, issue severity classification, escalation path, or acceptance criteria. It cannot currently serve as the authority it is cited as.
- Desired end state: the Playtesting Bible is expanded to include session structure, test plan format, issue classification (critical accessibility failure versus minor inconsistency versus design question), escalation process, acceptance criteria for each pipeline gate it governs, and specific guidance for multiplayer accessibility testing.
- Recommended fix: expand `docs/14_Playtesting_Bible.md` substantially. The document should defer to the Accessibility Bible for which accessibility features must be tested, to the Production Pipeline Bible for when testing gates occur, and to the Network and Multiplayer Bible for multiplayer-specific scenarios.

#### Issue 2.5 — Glossary not updated for six new design bibles

- Severity: Medium.
- Affected area: `docs/12_Glossary.md`.
- Why it matters: the Glossary has 21 terms, all from the earliest phase of the project. The six new design bibles introduce a significant vocabulary — player interaction facets, community simulation rhythm, discovery philosophy, production pipeline stages — none of which is glossarised.
- Desired end state: the Glossary includes terms introduced by the Narrative Style Guide, Player Interaction Bible, Community Simulation Bible, Discovery Bible, Franchise Asset Bible, and Production Pipeline Bible.
- Recommended fix: add glossary entries for at minimum: interaction facet, community simulation, discovery philosophy, asset pipeline, production gate, narrative style, expedition philosophy, belonging state.

#### Issue 2.6 — Design-notes README has no naming convention statement

- Severity: Low.
- Affected area: `docs/design_notes/README.md`.
- Why it matters: future contributors have no guidance that new design notes should follow the lowercase-underscore, no-number-prefix naming pattern.
- Desired end state: the README states the naming convention clearly.
- Recommended fix: add a short paragraph after the introductory section of `docs/design_notes/README.md` stating the file naming convention and the canon/experimental distinction.

---

### Chunk 3 — Accessibility and audio production readiness

These issues define the accessibility and audio systems in more depth. They do not block the documentation phase but will block production if left unaddressed beyond Chapter One prototype testing.

#### Issue 3.1 — Tactile music has no canonical definition

- Severity: High.
- Affected area: accessibility, audio, music.
- Why it matters: the Accessibility Bible, Audio Bible, and Accessibility Lab all reference tactile music as a feature that must exist. Open Questions lists it as unresolved. Until tactile music is defined — what it communicates, how it is authored, how it relates to haptic output on specific hardware — it cannot be designed, implemented, or tested.
- Desired end state: tactile music is defined in the music direction track document (Issue 1.3) and any canonical rules are promoted to the Canon Rules document. The Accessibility Lab entry for tactile music is either graduated into the Accessibility Bible or retained with a note that the definition lives in the music direction track.
- Recommended fix: address as part of Issue 1.3 (music direction track). Once the track document exists, review whether any resulting rules should be promoted to Canon Rules.

#### Issue 3.2 — Braille display protocols have no canonical definition

- Severity: High.
- Affected area: accessibility, code.
- Why it matters: braille display support is listed as a goal in the Accessibility Lab and as an open question in Open Questions. The Accessibility Bible names braille literacy as one of the communication methods the world treats as ordinary. Until braille display protocols are defined — which APIs, which device families, which content categories, how navigation mode works — this accessibility commitment has no implementation path.
- Desired end state: a section in the Accessibility Bible or a graduated Accessibility Lab entry defines braille display support at the level of which interaction categories produce braille output, which device protocols are targeted, and how braille content is authored and tested.
- Recommended fix: graduate the braille display entry from the Accessibility Lab into the Accessibility Bible. Add a companion open question narrowing the hardware scope to a specific first target.

#### Issue 3.3 — Accessibility Lab has no documented graduations

- Severity: Medium.
- Affected area: `docs/design_notes/accessibility_lab.md`.
- Why it matters: the lab's stated purpose is to incubate ideas that graduate into the Accessibility Bible or Systems Bible. Since its creation, nothing has graduated. The lab lists six areas to prototype; none has moved. Either the lab process is stalled or the areas have been developed elsewhere in a form that should be referenced.
- Desired end state: each area in the lab either has a note recording where it graduated to, a note recording why it is still pre-prototype, or a note recording that it has been deprioritised. The lab is never a permanent home for ideas.
- Recommended fix: review each of the six areas in the Accessibility Lab and add a one-line status note per area. Areas that are addressed in the new design bibles (tactile music in the music direction track, for example) should link to those documents.

#### Issue 3.4 — DeafBlind gameplay definition is too thin

- Severity: Medium.
- Affected area: Accessibility Bible.
- Why it matters: the Accessibility Bible covers DeafBlind gameplay in five bullet points. The Player Interaction Bible defines every interaction with eight required facets, including accessibility alternatives. The Animation standards require tactile equivalents for every animation. But there is no section that specifically addresses how a player who has neither vision nor hearing experiences any particular gameplay moment. The five bullet points in the Accessibility Bible are the only synthesised treatment of this player experience.
- Desired end state: a dedicated design note or a significantly expanded Accessibility Bible section defines the DeafBlind gameplay experience holistically — what information channels are available, how they are combined, how Chapter One specifically is designed to be fully playable by a DeafBlind player.
- Recommended fix: expand the Accessibility Bible's "DeafBlind gameplay" section substantially, or create a graduated design note in `docs/design_notes/` that synthesises the DeafBlind experience across the Player Interaction Bible, Animation standards, Community Simulation Bible, and Discovery Bible.

#### Issue 3.5 — Perspective audio authoring is an unsolved design problem

- Severity: High.
- Affected area: audio, Campaign Bible, Systems Bible.
- Why it matters: the perspective system is the franchise's primary replayability mechanic and one of its most distinctive creative promises. The same event heard differently by eight professions is central to this. The audio engine open question partly blocks this, but the design problem — how do you author one event that sounds meaningfully different per profession without duplicating content eight times — must be solved at the design level before the audio production track document can be completed.
- Desired end state: the audio production track document (Issue 1.2) includes a section defining the perspective audio authoring model: whether professions mix from shared stems, use different mix templates, receive different parameter-driven processing, or use some other model.
- Recommended fix: address as part of Issue 1.2. A decision on approach should be recorded in the Decision Log.

---

### Chunk 4 — Art, graphics, and asset readiness

These issues define the visual and asset production side of the project. Issues 1.1 and 1.4 in Chunk 1 address the missing documents. This chunk addresses the gaps that remain after those documents are created.

#### Issue 4.1 — No concept art brief or art-bible kick-off process

- Severity: High.
- Affected area: art direction, concept art, environment art.
- Why it matters: even once `visual_direction_track.md` exists, a team starting concept art needs to know what the first deliverables are, what medium and format is expected, how concepts are reviewed and approved, and how approved concepts become reference for 3D production. The Production Pipeline Bible defines the review gates for new content in general but does not address concept art as a distinct phase.
- Desired end state: the Production Pipeline Bible includes a concept art phase before implementation, or a companion note describes the concept-to-production path for environmental assets.
- Recommended fix: add a concept art phase to the Production Pipeline Bible, positioned between Review and Implementation, covering what a concept art deliverable must include, how it is reviewed, and how approved concepts enter the asset pipeline described in `graphics_and_asset_direction_track.md`.

#### Issue 4.2 — Performance budgets are undefined

- Severity: High.
- Affected area: `docs/design_notes/graphics_and_asset_direction_track.md` (to be created).
- Why it matters: the Systems Bible lists target platforms (native iOS, native Android, desktop Windows/macOS/Linux, modern web browsers). No document states performance targets: polygon budgets per asset category, texture memory limits per platform tier, draw call targets, frame rate floors, audio voice limits, or haptic event frequency limits. Artists have no way to make correct production choices without these constraints.
- Desired end state: `graphics_and_asset_direction_track.md` includes explicit per-platform performance budgets for at least three tiers: high-end mobile, mid-range mobile, and desktop.
- Recommended fix: address as part of Issue 1.4, informed by the architecture decision in Implementation Milestone C.

#### Issue 4.3 — Level-of-detail rules in Franchise Asset Bible lack visual specifications

- Severity: Medium.
- Affected area: `docs/design_notes/franchise_asset_bible.md`.
- Why it matters: the Franchise Asset Bible's "Level-of-detail rules" section exists and defines that every asset must have level-of-detail variants. It does not specify what those variants look like, how many levels are required, what the trigger distances are, or how the transition between levels is handled visually. This is an organisational rule without the visual direction that makes it actionable.
- Desired end state: the level-of-detail rules section of the Franchise Asset Bible, or the graphics and asset direction track, specifies the number of levels required per asset category, approximate polygon counts per level, transition method, and any specific requirements for accessibility assets (which must remain readable at all levels).
- Recommended fix: add visual specifications to the existing level-of-detail rules section of the Franchise Asset Bible, or defer them to the graphics and asset direction track with a forward reference.

---

### Chunk 5 — Implementation readiness

These issues address the gap between documentation and the working prototype. They are appropriate for a developer or technical director, not a designer or writer.

#### Issue 5.1 — No automated tests exist

- Severity: Critical.
- Affected area: `artifacts/resonance/`.
- Why it matters: the Code Standards document states that testing is an acceptance criterion. The prototype has no unit tests, no integration tests, no accessibility test harness, and no end-to-end tests. Every feature added without tests increases the regression risk of subsequent features. For an accessibility-first game this is especially significant: an untested accessibility provider could silently fail and produce a game that appears to work for sighted players and fails for the players the project is built for.
- Desired end state: a test framework is configured, a baseline suite of unit tests covers the accessibility provider and campaign data structures, and the Code Standards document is updated to state the minimum test coverage requirement for new features.
- Recommended fix: add Vitest (compatible with the current Vite setup) to the prototype. Write baseline tests for `a11y-provider.tsx`, `campaigns.ts`, and `settings.ts`. Add a test-coverage requirement to `docs/10_Code_Standards.md`.

#### Issue 5.2 — Shared codebase architecture decision is unresolved

- Severity: Critical.
- Affected area: `docs/13_Open_Questions.md`, `docs/10_Code_Standards.md`, `artifacts/resonance/`.
- Why it matters: native iOS and Android development, platform-specific haptics, braille device integration, and the full touch control set all depend on the shared codebase technology choice. Every sprint of development on the current web-only prototype is work that may need to be re-approached when the architecture is decided.
- Desired end state: the technology is decided and recorded in the Decision Log. The open question is closed. The target `apps/` structure exists as a skeleton. The migration path from `artifacts/resonance` to `apps/web` is defined.
- Recommended fix: make this a time-boxed technical decision sprint. The output is a Decision Log entry covering the chosen framework, the migration plan, and the criteria that define migration complete. The open question is removed or replaced with a specific remaining sub-question.

#### Issue 5.3 — Audio engine and middleware are unresolved

- Severity: Critical.
- Affected area: `docs/13_Open_Questions.md`, prototype.
- Why it matters: all audio-dependent features are blocked. Audio is the primary renderer. The open question must be resolved before the audio production track can be completed or any audio feature can be built.
- Desired end state: the audio engine and middleware are selected and recorded in the Decision Log. The audio production track document (Issue 1.2) is updated to reflect the chosen stack.
- Recommended fix: produce a requirements document (a short design note or a Decision Log pre-entry) stating what an audio engine must support: spatial audio on all four platform families, per-profession mix routing without content duplication, haptic event coupling, braille event hooks, and web delivery. Use these requirements to evaluate and select the engine.

#### Issue 5.4 — Prototype has no game loop, spatial model, or audio integration

- Severity: High.
- Affected area: `artifacts/resonance/src/`.
- Why it matters: the prototype demonstrates correct toolchain configuration and accessibility provider scaffolding. It does not yet demonstrate any game mechanic. Chapter One requires a spatial model (the player is in a place), an audio layer (the place has a soundscape), and a basic interaction model (the player can examine objects and encounter people). None of these exist.
- Desired end state: the Chapter One prototype milestone (Implementation Milestone A) produces a prototype with at minimum a spatial model of one room from the Modular Architecture Bible, a room soundscape drawn from the Audio Bible, and one interaction from the Player Interaction Bible.
- Recommended fix: define the Chapter One prototype scope as a separate implementation brief — potentially as a design note or as a section of the visual direction track. The scope should be the narrowest functional demonstration that can be meaningfully tested with accessibility players.

#### Issue 5.5 — No continuous integration configuration

- Severity: Medium.
- Affected area: repository root.
- Why it matters: without CI, the typecheck, build, and test scripts described in the Code Standards are run only by contributors who remember to run them. Regressions accumulate undetected.
- Desired end state: a CI configuration runs `pnpm typecheck` and `pnpm test` on every push to main. Failures block the push.
- Recommended fix: add a CI configuration (GitHub Actions workflow) that runs the typecheck and test scripts. Add a CI badge to `README.md`. Record the CI requirement in `docs/10_Code_Standards.md`.

---

### Chunk 6 — Polish and contributor onboarding

These are low-severity issues that accumulate into friction for contributors joining the project after the core team. Each fix is small and can be batched.

#### Issue 6.1 — Systems, AI, and Knowledge Archive Bibles need expansion

- Severity: High.
- Affected area: `docs/04_Systems_Bible.md`, `docs/06_AI_Bible.md`, `docs/05_Knowledge_Archive_Bible.md`.
- Why it matters: these three bibles cover the three most distinctive gameplay systems and together total approximately 8 KB. A designer assigned to combat, a writer building the Faience integration arc, or a programmer implementing the Knowledge Archive has very little canonical guidance to work from. The Player Interaction Bible, Discovery Bible, and AI character profiles add depth from their perspectives, but the core bibles should be the authoritative starting point.
- Desired end state: each of the three bibles is expanded with at minimum one design note or significant inline expansion that provides actionable guidance. The Systems Bible should address combat flow, flight encounter philosophy, and boarding sequence structure. The AI Bible should elaborate the integration cost model and the ethical stakes. The Knowledge Archive Bible should address how entries are structured, navigated, and connected to each other.
- Recommended fix: create dedicated design notes for combat and flight systems (`combat_and_flight_design.md`), expand the AI Bible's ethics and integration cost sections significantly, and expand the Knowledge Archive Bible with an entry structure and navigation model.

#### Issue 6.2 — Talia Rusk Indigenous consultation has no process documentation

- Severity: Medium.
- Affected area: `docs/presentation_bible/00_Character_Identity_Map.md`, `08_Cultural_Presentation.md`, `12_Future_Expansion.md`.
- Why it matters: the cultural specifics of Talia Rusk are correctly left undeveloped. However, the character already appears in seven chapter designs and the character schedule. The longer consultation is undocumented, the more design decisions accumulate around a character whose foundation is incomplete.
- Desired end state: a document or an Open Questions entry records who is responsible for initiating consultation, what format the consultation will take, and what the minimum output of consultation must be before cultural specifics can be developed.
- Recommended fix: add an entry to `docs/13_Open_Questions.md` specifically for Talia Rusk's consultation process, distinct from the general representation open items, with a named responsible party and a target timeline.

#### Issue 6.3 — Accessibility Lab process is stalled

- Severity: Medium.
- Affected area: `docs/design_notes/accessibility_lab.md`.
- Why it matters: the lab has six areas to prototype and no documented progress on any of them. Two are now addressed in the new design bibles (tactile music in the music direction track, braille display in the expanded Accessibility Bible). Without a status update the lab is misleading — it implies these areas are pre-prototype when some have been defined.
- Desired end state: each lab area has a status note (graduated, in progress, blocked by open question, deprioritised).
- Recommended fix: update `docs/design_notes/accessibility_lab.md` with a status note per area. Link to the documents that cover each graduated area.

#### Issue 6.4 — Design-notes README has no naming convention

- Severity: Low.
- Affected area: `docs/design_notes/README.md`.
- Why it matters: future contributors have no guidance that new design notes should follow the lowercase-underscore, no-number-prefix pattern.
- Desired end state: the README states the naming convention and the distinction between canonical and experimental notes in the opening section.
- Recommended fix: add two or three sentences to the `docs/design_notes/README.md` introduction describing the naming convention and how to classify a new note as experimental or canonical.

#### Issue 6.5 — Glossary not updated for the six new design bibles

- Severity: Medium.
- Affected area: `docs/12_Glossary.md`.
- Why it matters: the Glossary's 21 terms cover only the earliest vocabulary. New contributors reading the Narrative Style Guide, Player Interaction Bible, or Community Simulation Bible encounter terms with no canonical definition in the Glossary.
- Desired end state: the Glossary covers the primary vocabulary of all thirteen design notes and all fifteen core bibles.
- Recommended fix: add entries for at minimum: interaction facet, community simulation, discovery philosophy, asset pipeline, production gate, narrative style, expedition philosophy, belonging state, fronting, perspective dimension, acoustic identity (if not already present), everyday carry.

#### Issue 6.6 — Prototype README and running instructions do not reflect the current state

- Severity: Low.
- Affected area: `README.md`.
- Why it matters: the root README describes running instructions but does not note that the prototype is a scaffold without game features. A new contributor who runs the prototype expecting to see a game will see a UI skeleton and have no context for what they are looking at.
- Desired end state: the root README includes a brief honest description of the prototype's current state — what it demonstrates and what it does not yet include — alongside the running instructions.
- Recommended fix: add three to four sentences below the running instructions in `README.md` describing the prototype's current scope and its relationship to the Chapter One milestone.

## Relationship to other documents

This review draws evidence from every document in the repository and does not introduce new canon. Where it identifies a gap or inconsistency, the resolution is made by editing the relevant living document and recording the decision in the Decision Log. This document itself is a point-in-time assessment; it should be archived after the remediation pass is complete rather than maintained as a living standard.

- The Project Constitution is the governing authority over the project.
- The Canon Rules document is the master rule list.
- The Decision Log records when remediation decisions are made.
- The Production Pipeline Bible governs how new content created during remediation enters the repository.
- The Open Questions document is the home for any question this review raises that cannot yet be answered.
