# Audio Production Track

This document is the audio production workflow brief for Resonance: Fractured Frequency. It covers how audio assets are recorded, edited, named, integrated, tested, and reviewed. It does not define what sounds communicate, what acoustic identities exist, or what any sound library contains: those are the authority of the Audio Bible, which every contributor to audio production must read before using this document.

The Audio Bible is the source of truth for every sound in the franchise. This document supplements its workflow. It does not restate its libraries.

## Authority and source documents

Before beginning any audio production work, contributors must read the following in order.

- The Audio Bible defines every sound category, every acoustic identity rule, and the non-auditory paths that accessibility-equivalent audio must satisfy. No sound enters production unless it is consistent with the Audio Bible.
- The Accessibility Bible defines the tactile language, haptic channels, caption requirements, and braille output paths that accompany every audio asset.
- The Production Pipeline Bible defines the review gates that every audio asset must pass before entering the repository.
- The Playtesting Bible defines how audio assets are tested with real players, including players who use no audio at all.

## Recording pipeline

### Pre-production brief

Every audio asset begins with a brief. The brief records the following before recording begins.

- The asset's category and identity as defined in the Audio Bible.
- The profession or professions whose perspective mix includes this asset.
- The emotional storytelling purpose the asset must serve.
- The non-auditory equivalent the Accessibility Bible requires for this asset.
- The review gate the asset must pass.

Briefs are produced by the audio lead and approved before session booking. No recording session proceeds without an approved brief.

### Session recording

Recording sessions follow the brief without deviation unless a director-level decision is made during the session. Any deviation from the brief is recorded in the session notes and reviewed against the Audio Bible before the asset advances.

Every session produces a session log recording: the date, the brief identifier, the engineer and director present, the equipment used, the takes recorded, the selected take, and any notes affecting post-production.

Assets that involve characters with disabilities, accessibility devices, or cultural specificity require a cultural or accessibility consultant present at or reviewing the session, as described in the Production Pipeline Bible's representation review gate.

### Editing and delivery

Edited assets are delivered in the format specified by the audio engine integration standard (recorded in the Decision Log when the engine selection is made). Until the engine is selected, masters are delivered as 24-bit 48 kHz WAV files with no noise floor below the project reference level.

Naming follows the conventions in Technical Standards in the Player Identity and Character Presentation Bible for character audio, and the category conventions below for all other assets. No audio file ships without a name that satisfies both the naming standard and the brief identifier.

## File naming conventions

Names follow the pattern: category, subcategory, descriptor, variant, and extension. All components are lowercase, separated by underscores. No spaces, no special characters beyond underscores, no version suffixes in the shipped name (version history is in GitHub).

Category codes follow the Audio Bible's library organisation: `mv` for movement, `vc` for vehicle, `sc` for spacecraft, `su` for space suit, `eq` for equipment, `wp` for weapon or emergency tool, `cl` for clothing, `mt` for material, `ob` for object, `an` for animal, `bi` for biological, `en` for environmental, `mu` for music, `ui` for interface audio. Character audio follows the naming convention in Technical Standards.

Assets that serve a specific profession's perspective mix include a profession code as a suffix before the extension: `_md` for medic, `_en` for engineer, `_sc` for scientist, `_se` for security, `_of` for officer, `_ma` for maintenance, `_ci` for civilian.

## Perspective audio authoring

Every profession hears the same event differently, as the Audio Bible's perspective audio section defines. The authoring model for this must not duplicate content eight times.

The approved approach is stem-based perspective routing. Each event is recorded as a set of shared stems — the raw acoustic reality of the event — and a set of profession-specific processing templates. The templates define what each profession attends to, what the mix emphasises, and what Faience says or does not say. The stems are the single source of recorded content. The profession templates are parameters applied at mix time.

Any change to a stem affects all professions. Any change to a profession template affects only that profession. Both types of change require the audio lead's review before integration.

Professions whose vocabulary changes the content of what is heard — a medic hears clinical language where a civilian hears fear — record only the vocabulary-specific dialogue as a separate layer. The acoustic environment, the spatial mix, and the emotional texture are shared stems. This keeps content volume manageable and ensures that two professions hearing the same event in the same room receive the same acoustic reality with different attentional layers.

## Accessibility equivalents

Every audio asset that carries information the player needs has a defined accessibility equivalent before it enters integration. The Accessibility Bible is the authority for what equivalents are required and how they are authored. This section records the production process for those equivalents.

The audio lead and the accessibility lead review every brief together. The brief is not approved until both agree that the accessibility equivalent for the asset is defined. The equivalent may be a haptic pattern, a caption, a screen reader event, a braille display output, or an environmental narration. In all cases, the equivalent is authored and tested before the audio asset ships.

Haptic patterns are authored by the accessibility team, not derived automatically from audio waveforms. The Accessibility Bible defines the tactile language. The audio team provides the emotional intent and the timing reference; the accessibility team authors the haptic response that communicates that intent through touch.

Captions follow the caption authoring standard in the Accessibility Bible: they describe what is heard, not only what is said. An explosion caption describes the explosion; a footstep caption in a thriller-context scene conveys urgency, not only the fact of footsteps.

## Mix session structure

Each mix session corresponds to a production scope: a room, a chapter event, a character interaction set, or a profession perspective template. Mix sessions are not open-ended. The session scope is defined before the session begins and recorded in the session log.

Mix sessions require the following roles to be present or to have approved the session brief: audio lead, accessibility lead (for review of the non-auditory path), and a player perspective representative for each profession perspective being mixed in the session.

Master mixes are versioned by date and scope identifier. Only the approved master for each scope is integrated. Rejected mixes are retained for reference but not integrated.

## Integration handoff

Audio assets are handed to the integration team with the following package.

- The approved master file or stem set.
- The session log.
- The brief identifier.
- The profession perspective template, if applicable.
- The accessibility equivalent authoring record from the accessibility lead.
- The naming confirmation that the file satisfies the naming convention.

Integration does not begin until this package is complete. Missing items are returned to the audio team rather than resolved during integration.

## Testing with accessibility players

Audio assets are tested with the Playtesting Bible's player groups before the chapter that contains them is locked. Testing includes players who use no audio (to confirm that the accessibility equivalents carry the information independently) and players who use audio with screen readers, hearing aids, or cochlear implants (to confirm that audio assets do not interfere with those devices).

Failures in accessibility testing block audio lock. They are classified and escalated according to the Playtesting Bible's issue classification system.

## Production Pipeline review gate

Audio assets pass through the Production Pipeline Bible's audio review gate. That gate checks for: consistency with the Audio Bible's acoustic identity standards; presence of an approved accessibility equivalent; correct naming; approved session log; and successful integration test. Assets that fail any check are returned to the stage that produced the failure.

## Relationship to other documents

This document defines the audio production workflow. It does not define the content of any sound.

- The Audio Bible is the source of truth for every sound category, every acoustic identity, and every non-auditory path this workflow must satisfy. Read it before producing any asset.
- The Accessibility Bible defines the tactile language, haptic authoring standards, caption standards, and braille output requirements that this workflow's accessibility equivalent process must satisfy.
- The Player Identity and Character Presentation Bible's Technical Standards section defines the naming conventions for character audio assets.
- The Production Pipeline Bible defines the review gates this workflow feeds into.
- The Playtesting Bible defines the testing process that validates audio assets before chapter lock.
- The Decision Log records the audio engine and middleware selection that governs the integration format standard.
