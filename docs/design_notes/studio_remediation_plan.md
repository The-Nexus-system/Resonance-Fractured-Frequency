# Studio Remediation Plan

This document is the actionable remediation plan for Resonance: Fractured Frequency. It records every confirmed gap in the repository, groups fixes into five prioritised chunks, and closes with the recommended execution order. Every finding is drawn from the current repository state. No canon is rewritten and no existing bible content is duplicated.

This plan is a companion to the Studio Readiness Review (Q3 2026). Where the readiness review diagnoses, this plan prescribes. Each fix entry states exactly which file to create or edit and what the change must accomplish. Fixes that touch canon must pass through the Production Pipeline Bible's review gates before being committed to main.

## Audit findings summary

### Four production-track bridge documents

All four commissioned bridge documents are confirmed absent from the repository.

- `docs/design_notes/visual_direction_track.md` — does not exist.
- `docs/design_notes/audio_production_track.md` — does not exist.
- `docs/design_notes/music_direction_track.md` — does not exist.
- `docs/design_notes/graphics_and_asset_direction_track.md` — does not exist.

No production team working on environment art, audio, music, or assets has a canonical brief to work from. This is the most urgent gap in the repository.

### Design notes README linkage

The `docs/design_notes/README.md` contents list correctly omits the four bridge documents because they do not exist. Once each document is created it must be added to the README contents list in the correct position. The README currently has no stated naming convention, which is a secondary gap.

### Audio Bible status

The Audio Bible (`docs/07_Audio_Bible.md`) is comprehensive and correct. It covers sixteen sound library categories with full detail: movement, vehicles, spacecraft, space suits, equipment, weapons as emergency tools, clothing, materials, objects, animals, biological sound, environmental sound progression, cultural sound identity, emotional sound design, and the definitive acoustic identity standard. It is the source of truth for what every sound communicates and what qualities it must have. It must not be duplicated. The audio production track and music direction track will cross-reference it as authority rather than restating its libraries.

### Cross-reference coverage

Cross-reference sections ("## Relationship to other documents") exist in three of the nine core bibles: `docs/02_Universe_Bible.md`, `docs/07_Audio_Bible.md`, and `docs/09_Network_and_Multiplayer_Bible.md`. They are absent from:

- `docs/01_Project_Constitution.md`
- `docs/03_Campaign_Bible.md`
- `docs/04_Systems_Bible.md`
- `docs/05_Knowledge_Archive_Bible.md`
- `docs/06_AI_Bible.md`
- `docs/08_Accessibility_Bible.md`
- `docs/10_Code_Standards.md`
- `docs/11_Decision_Log.md`
- `docs/12_Glossary.md`
- `docs/13_Open_Questions.md`
- `docs/14_Playtesting_Bible.md`
- `docs/15_Canon_Rules.md`

All six new design bibles have cross-reference sections. The presentation bible uses embedded cross-references in each part's introduction rather than a dedicated section.

### Naming inconsistency

In `docs/design_notes/crew_progression_system.md`, the heading and all sub-headings for the character use "Dr. Soren Qadir" (abbreviated, with full stop). Every other document in the repository uses "Doctor Soren Qadir" (spelled out). The abbreviated form appears nine times in the Crew Progression System and nowhere else.

### Duplicate canon risk

No duplicate canon was found in the existing documents. The risk lies in documents yet to be written. The audio production track and music direction track must be written as production workflow briefs that cite the Audio Bible, not as supplementary sound libraries. The graphics and asset direction track must cite the Franchise Asset Bible's existing asset-category and metadata standards rather than restating them.

### Missing cross-references from Campaign Bible

The Campaign Bible defines the perspective system but does not link to the Perspective Map, the Master Timeline, or the Character Schedule — which together constitute the canonical implementation of that system. Its "Related documents" section links only the Universe Bible and the Gameplay Progression Matrix.

---

## Chunk 1 — Critical blockers

These are the issues that block all downstream production work. Nothing in Chunks 2 through 5 unblocks production teams as much as resolving these.

### Fix 1.1 — Create visual_direction_track.md

- File to create: `docs/design_notes/visual_direction_track.md`
- What it must cover: visual ambition for a sound-first game without requiring sight; colour palette for ship interiors and open space; lighting philosophy and key-light language per environment type; material palette for hull surfaces, Shawabti structures, and alien materials; the visual language that distinguishes Shawabti spaces from human spaces; how the information layer (spatial audio indicators, waypoints, interaction prompts) is visually designed to be legible without ever being required; atmospheric and particle direction for deep space; the non-visual equivalence requirement — every visual signal that carries meaning must have a non-visual counterpart defined before the signal ships.
- What it must not do: invent acoustic identities (Audio Bible owns those); duplicate character visual standards (Presentation Bible Part III owns those); invent new canon about the Shawabti.
- Cross-references to include: Modular Architecture Bible (spatial reference for every room type), Accessibility Bible (non-visual equivalence requirement), Franchise Asset Bible (asset standards), Production Pipeline Bible (review gates), Presentation Bible Part III (character visual standards it works alongside).

### Fix 1.2 — Create audio_production_track.md

- File to create: `docs/design_notes/audio_production_track.md`
- What it must cover: the recording pipeline from brief to delivery; middleware requirements (what an audio engine must support: spatial audio on iOS, Android, desktop, and web; per-profession mix routing without content duplication; haptic event coupling; braille event hooks); file structure and delivery format conventions beyond what Technical Standards already provides; mix session structure and naming; how perspective audio is authored — the same event heard differently by eight professions without duplicating content eight times; how assets pass through the Production Pipeline's audio review gate; how audio assets are tested with accessibility players.
- What it must not do: restate the Audio Bible's sound libraries; define what sounds communicate (the Audio Bible owns that); invent new acoustic identities.
- Cross-references to include: Audio Bible (the source of truth for every sound in the franchise; this document supplements its production workflow, never its content); Accessibility Bible (tactile and haptic audio requirements); Technical Standards in the Presentation Bible (naming conventions); Production Pipeline Bible (audio review gate); Playtesting Bible (accessibility testing with audio-dependent features).

### Fix 1.3 — Create music_direction_track.md

- File to create: `docs/design_notes/music_direction_track.md`
- What it must cover: the adaptive score architecture; motif construction method and leitmotif assignments for each recurring character and faction; the compositional role of silence (the canon rule that silence is a deliberate storytelling tool governs the score, not only ambient sound); how Shawabti musical culture is withheld — no Shawabti motifs are defined here, consistent with preserving the deliberate mystery; cultural music that distinguishes human community traditions from each other; how musical information is expressed through haptics and vibration for players who cannot hear; no-audio equivalents for every musical beat (a player who turns off all audio must receive the emotional and informational content music carries through other channels).
- What it must not do: resolve any mystery about Shawabti culture; restate the Audio Bible's adaptive music philosophy section; define acoustic identity for spaces or characters (the Audio Bible owns that).
- Cross-references to include: Audio Bible (adaptive music section as the philosophical foundation; this document is the compositional brief, not a replacement); Accessibility Bible (tactile language and haptic requirements); Universe Bible (human cultural context; Shawabti cultural context is deliberately withheld); Canon Rules (silence as storytelling tool rule; acoustic identity rule); Production Pipeline Bible (audio review gate).

### Fix 1.4 — Create graphics_and_asset_direction_track.md

- File to create: `docs/design_notes/graphics_and_asset_direction_track.md`
- What it must cover: mesh density targets and polygon budgets per asset category and per platform tier (high-end mobile, mid-range mobile, desktop); rig standards and required rig components per character category; material channel requirements (albedo, roughness, normal, emissive minimum; additional channels per asset type); UI visual style — the visual grammar of interactive elements, how they signal state without colour alone, how they remain legible at small sizes; portrait standards for production (lighting setup, render resolution, file format) as a production companion to the Presentation Bible's portrait design standards; level-of-detail variant counts, approximate polygon targets per level, and transition method; accessibility metadata that every shipped asset must carry; alt-text and audio-description authoring standards for visual assets; performance budgets per platform tier for draw calls, texture memory, and audio voice count; localisation requirements for assets containing text or culturally specific imagery; the asset review gate criteria that determine whether a completed asset passes into the repository.
- What it must not do: restate asset category definitions or metadata schema from the Franchise Asset Bible; restate naming conventions from Technical Standards in the Presentation Bible; invent new character appearance facts.
- Cross-references to include: Franchise Asset Bible (asset categories and metadata schema that this document adds production constraints to); Modular Architecture Bible (spatial context for environment assets); Technical Standards in the Presentation Bible (naming conventions for character assets); Accessibility Bible (accessibility metadata requirements); Production Pipeline Bible (technical review gate).

---

## Chunk 2 — Missing production-track bridge documents

This chunk and Chunk 1 are the same body of work. They are listed separately here to make explicit that the four bridge documents are the entirety of Chunk 2 and that no other work in Chunk 2 is needed beyond what Chunk 1 specifies. Once all four bridge documents exist and have been added to the design notes README, Chunk 2 is complete.

The confirmation:

- `visual_direction_track.md` — does not exist. Fix: Issue 1.1.
- `audio_production_track.md` — does not exist. Fix: Issue 1.2.
- `music_direction_track.md` — does not exist. Fix: Issue 1.3.
- `graphics_and_asset_direction_track.md` — does not exist. Fix: Issue 1.4.

No other documents are missing from the bridge-document category.

---

## Chunk 3 — Documentation architecture review

These fixes address the navigability and authority of the existing document graph. None of them introduces new canon. All of them are targeted edits to existing documents.

### Fix 3.1 — Add cross-reference sections to core bibles that lack them

Priority order within this fix: Campaign Bible first (most likely entry point for new contributors), then Systems Bible, AI Bible, Accessibility Bible, Knowledge Archive Bible, Code Standards. The remaining core bibles (Constitution, Decision Log, Glossary, Open Questions, Canon Rules, Playtesting Bible) are reference documents whose cross-references are less urgent but should follow.

For the Campaign Bible, the cross-reference section must link: the Perspective Map, the Master Timeline, the Character Schedule, the Crew Progression System, the Modular Architecture Bible, the Gameplay Progression Matrix, the Narrative Style Guide, the Player Interaction Bible, and the Community Simulation Bible.

For the Systems Bible, the cross-reference section must link: the Accessibility Bible (the Systems Bible explicitly defers to it), the Audio Bible (likewise), the Modular Architecture Bible, and the Player Interaction Bible.

For the AI Bible, the cross-reference section must link: the Universe Bible's Faience section, the Knowledge Archive Bible, the Accessibility Bible, and the Canonical Character Profiles.

For the Accessibility Bible, the cross-reference section must link: the Modular Architecture Bible, all fourteen parts of the Presentation Bible (by linking the Presentation Bible README rather than each part individually), the Network and Multiplayer Bible, and the Playtesting Bible.

For the Knowledge Archive Bible, the cross-reference section must link: the AI Bible, the Campaign Bible, the Discovery Bible, and the Gameplay Progression Matrix.

For Code Standards, the cross-reference section must link: the Playtesting Bible, the Franchise Asset Bible, the Production Pipeline Bible, and the Technical Standards part of the Presentation Bible.

### Fix 3.2 — Correct naming inconsistency in Crew Progression System

In `docs/design_notes/crew_progression_system.md`, replace all nine instances of "Dr. Soren Qadir" with "Doctor Soren Qadir" to match the form used in every other document in the repository.

### Fix 3.3 — Expand Playtesting Bible to match its assigned authority

The Production Pipeline Bible names the Playtesting Bible as the authority for its Testing and Regression Testing gates. At its current depth the Playtesting Bible cannot serve that role. Expand `docs/14_Playtesting_Bible.md` to include: session structure for each player group; a test plan format that maps player groups to testing dimensions; an issue classification system (critical accessibility failure, significant usability regression, minor inconsistency, design question); an escalation path for critical failures; acceptance criteria for each pipeline gate the Playtesting Bible governs; and specific guidance for multiplayer accessibility testing. The Playtesting Bible must not restate the Accessibility Bible's standards — it must cite them as the criteria being tested against.

### Fix 3.4 — Note the Audio Bible's authority in any new audio-adjacent document

The Audio Bible is comprehensive and must remain the source of truth. Any document that touches audio — the audio production track, the music direction track, the graphics and asset direction track's audio metadata section — must open with an explicit statement that the Audio Bible owns the content of every sound in the franchise and that the new document supplements the production workflow, never the creative content. This prevents future contributors from inadvertently treating a production brief as a creative override.

---

## Chunk 4 — Design notes index cleanup

These fixes bring the design notes README and the broader index into an accurate state. They are small and should be applied immediately after each bridge document in Chunk 1 is created.

### Fix 4.1 — Add four bridge documents to design notes README as they are created

When each bridge document is created (Issues 1.1 through 1.4), add it to `docs/design_notes/README.md` under the Contents heading as a canonical entry. Suggested entry format follows the existing convention: filename link, the word "canon", and a one-sentence description. Place the four new entries after the Production Pipeline Bible entry and before the Studio Readiness Review entry, since they are production-track documents that logically precede the readiness assessment.

### Fix 4.2 — Add naming convention statement to design notes README

Add a short paragraph to the introduction of `docs/design_notes/README.md` — after the existing three-paragraph introduction and before the Contents heading — stating the naming convention for new design notes: all lowercase, words separated by underscores, no number prefix, `.md` extension. This is the convention already followed by every existing design note.

### Fix 4.3 — Update Glossary for six new design bibles

The Glossary covers 21 terms, all from the earliest phase of the project. The six new design bibles introduce vocabulary that contributors working in those areas will encounter immediately. Add glossary entries for at minimum the following terms: interaction facet, community simulation, discovery philosophy, asset pipeline, production gate, narrative style, expedition philosophy, belonging state, fronting, perspective dimension, everyday carry. Each entry should match the format and length of the existing glossary entries. Entries must not restate full definitions from the bibles they summarise — they should give the term's meaning in two to four sentences and note which document elaborates it.

---

## Chunk 5 — Implementation readiness

These fixes address the gap between the documentation and the working prototype. They are appropriate for a developer or technical lead, not a designer or writer. They do not change any canon.

### Fix 5.1 — Add automated tests to the prototype

The prototype at `artifacts/resonance/` has no automated tests of any kind. Add Vitest (compatible with the current Vite and TypeScript configuration) to the prototype. Write a baseline test suite covering: `src/components/a11y-provider.tsx` (accessibility provider initialises, exposes its context correctly, and does not error on render); `src/lib/campaigns.ts` (campaign data structures are valid and complete); `src/lib/settings.ts` (settings data structures are valid and have correct defaults). Update `docs/10_Code_Standards.md` to state the minimum test coverage requirement for new features added to the prototype.

### Fix 5.2 — Resolve the audio engine open question

Record a time-boxed decision sprint in the Decision Log. The sprint output is an audio engine and middleware selection, recorded as a Decision Log entry, that resolves the Open Questions item. The decision must address: spatial audio delivery on iOS, Android, desktop, and web from one codebase; per-profession mix routing without content duplication; haptic event coupling; and braille device event hooks. Once resolved, close the open question and add the engine name and version to `docs/10_Code_Standards.md` as part of the platform standards.

### Fix 5.3 — Resolve the shared codebase architecture open question

Record a time-boxed decision sprint in the Decision Log. The sprint output is a technology choice for the shared codebase, a migration plan from `artifacts/resonance` to `apps/web`, a skeleton of the target `apps/` directory structure, and the criteria that mark migration complete. Once resolved, close the open question and update `docs/10_Code_Standards.md` with the chosen technology.

### Fix 5.4 — Scope the Chapter One vertical slice

Produce a brief design note or a section within an existing document defining the minimum viable scope for a Chapter One prototype that can be tested with real accessibility players. The scope must cover: which room from the Modular Architecture Bible is the starting environment; which three to five interactions from the Player Interaction Bible are demonstrated; what the room soundscape demonstrates from the Audio Bible; and which Playtesting Bible player groups are involved in the first test session. This is not a new chapter design — it is a production scope note that derives from the existing Maintenance Chapter One design and constrains the first sprint.

### Fix 5.5 — Add CI configuration

Add a GitHub Actions workflow file to the repository root that runs `pnpm typecheck` and the test suite on every push to main. Add a CI status note to `README.md`. Update `docs/10_Code_Standards.md` to record CI as a requirement rather than an aspiration.

---

## Prioritised remediation order

The following sequence is recommended for a single remediation pass. Steps that do not depend on each other may be done in parallel.

### Step 1 — Create the four bridge documents (Chunk 1 and Chunk 2)

These are the most urgent deliverables. A studio cannot produce environment art, audio, music, or assets without them. Create all four in parallel if possible. Each must be reviewed against the Production Pipeline Bible's canon check, representation review, accessibility review, audio review, and documentation gate before being merged.

Order within this step: audio production track and music direction track first (both feed into the vertical slice scoping in Step 4); visual direction track and graphics and asset direction track concurrently.

### Step 2 — Update the design notes index (Chunk 4, fixes 4.1 and 4.2)

Add each bridge document to the README as it is created. Add the naming convention statement at the same time. This step runs alongside Step 1, not after it.

### Step 3 — Cross-reference cleanup (Chunk 3, fixes 3.1 through 3.4)

Add cross-reference sections to the six core bibles that lack them, correct the Soren Qadir naming inconsistency, expand the Playtesting Bible, and add the Audio Bible authority note to any new audio-adjacent document. This step can run in parallel with Steps 1 and 2. It does not depend on the bridge documents being complete.

### Step 4 — Vertical slice planning (Chunk 5, fix 5.4)

Once the audio production track and music direction track exist (Step 1), produce the Chapter One vertical slice scope note. The scope note draws on the Maintenance Chapter One design, the Modular Architecture Bible, the Player Interaction Bible, and the new audio production track to define the first sprint.

### Step 5 — Audio engine and architecture decisions (Chunk 5, fixes 5.2 and 5.3)

These are decision sprints rather than documentation tasks. They can run in parallel with Steps 1 through 4 since they are time-boxed. Their outputs update the Decision Log and the Code Standards.

### Step 6 — Prototype work (Chunk 5, fixes 5.1 and 5.5)

Add tests and CI configuration once the vertical slice scope is defined and the technology decisions are made. Building tests before the architecture decision is final risks writing tests that need to be rewritten when the architecture changes.

### Step 7 — Glossary and index polish (Chunk 4, fix 4.3)

Update the Glossary after Steps 1 through 3 are complete, so that the new entries can draw on the bridge documents' own vocabulary.

## Relationship to other documents

This remediation plan draws its evidence from the repository as it exists and does not introduce canon. Where a fix introduces new design content, that content passes through the Production Pipeline Bible's review gates before being committed to main. The Decision Log records each resolved decision. The Studio Readiness Review (Q3 2026) in this same folder is the companion diagnostic document.

- The Project Constitution is the governing authority over all content created during this remediation.
- The Canon Rules document governs any fix that touches rules.
- The Decision Log records the resolution of every open question addressed here.
- The Production Pipeline Bible governs how new documents and changes to existing documents are reviewed and approved.
- The Playtesting Bible governs how any prototype feature is validated with real players.
