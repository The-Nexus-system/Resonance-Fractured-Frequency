# Technical Standards

This document defines the technical standards for naming, organizing, and describing the presentation assets of Resonance: Fractured Frequency. It is written for technical artists, animators, audio designers, UI designers, gameplay programmers, localization engineers, accessibility engineers, and tools developers. Consistent naming and organization are not bureaucracy; they are how a large, accessibility-first project keeps its promises across many contributors and many Operations. These standards make assets findable, reviewable, and safe to change.

This document rests on two higher authorities and never contradicts them. The Canon Rules document is the canon authority. The Character Identity Map is the locked source for each recurring character's profession, ethnicity, gender, pronouns, and disability. Where any guidance here appears to differ from those documents, those documents govern. This file defines craft and pipeline standards; it does not invent character biography, ship history, place names, or new game systems.

## Foundational Principles of Technical Standards

The technical standards exist to serve the same pillars as the rest of the bible: audio is gameplay, accessibility is foundational, recognition emerges through observation, and representation is character-first. Every convention below is chosen to protect those pillars at scale.

### Consistency Over Cleverness

- Naming conventions favor predictability and readability over brevity or cleverness, so any contributor can guess a name correctly.
- A convention, once adopted, is applied uniformly across every asset type rather than varied per team.
- When a convention does not fit a case, the case is raised for a documented decision rather than solved with a one-off name.

### Every Visual Asset Has an Accessible Counterpart

- No visual asset is considered complete without its accessible counterparts, which include an audio equivalent where relevant and an authored description for screen reader and braille output.
- Naming and organization explicitly link a visual asset to its audio, tactile, and text-description counterparts so none can be shipped orphaned.
- Accessibility metadata travels with the asset and is never stored only in a separate document that can drift.

### Identity-Locked Naming

- Asset identifiers for recurring characters derive from the locked Character Identity Map, so a character's canonical identifier never conflicts with canon.
- The Vale System is represented as one shared body in asset naming, with member presentation expressed as a variant of the one body, never as four separate characters and never as a single Captain Mara Vale.
- Faience is named as a non-human Shawabti artificial intelligence and is never given human ethnicity or gender tokens in any identifier.

### Lowercase, Delimited, ASCII Naming

- Asset and file names use lowercase ASCII letters, digits, and defined delimiters only, avoiding spaces, uppercase, and non-ASCII characters for cross-platform safety.
- The reserved delimiters are the underscore, which separates fields within a name, and the hyphen, which joins words inside a single field.
- A numeric index, where used, is zero-padded to a fixed width so names sort correctly.

## Character Identifiers

A stable character identifier is the backbone of every naming convention in this document, because most presentation assets belong to a person. Character identifiers are defined once here and reused everywhere.

### Recurring Character Identifier Standards

- Each recurring human character has one canonical lowercase identifier derived from their name in the Character Identity Map, using a hyphen inside multi-word fields where needed.
- The recommended recurring character identifiers are mara-chen, samira-kade, rowan-ives, mira-ives, jonah-briggs, talia-rusk, and soren-qadir.
- Faience uses the identifier faience and carries no human ethnicity or gender token.
- The player's original avatar uses the reserved identifier player-avatar so it is never confused with a recurring character.

### Vale System Identifier Standards

- The Vale System uses the single body identifier vale-system for the one shared body.
- A fronting member is expressed as a member field on the shared body, using elian, naomi, gideon, or iris, for example vale-system_member-naomi, so the naming always reads as one body presenting a member.
- Assets that belong to the constant body, and not to any single member, omit the member field, for example vale-system_body.
- No naming scheme may create four independent character identifiers for the Vale System, and none may create an identifier resembling a single captain-mara-vale.

### Identifier Stability Standards

- A character identifier is stable for the life of the project so references never break, even as the character grows or ages.
- If a character's presentation changes across Operations, that change is expressed through variant fields rather than by changing the base identifier.
- Retiring or renaming an identifier requires a documented decision, because many assets depend on it.

## Asset Naming

This section defines the general asset naming pattern that all specific asset types extend. It establishes the field order and vocabulary that keep names consistent across disciplines.

### General Asset Name Structure

- An asset name is a sequence of lowercase fields separated by underscores, ordered from most general to most specific, ending with a type or variant field where useful.
- The recommended general order is domain, then subject, then category, then descriptor, then variant, then zero-padded index.
- The domain field identifies the discipline, using values such as anim for animation, port for portrait, ui for interface, and audio for sound, with tactile handled as its own domain described later.
- The subject field is a character identifier, a location identifier, or a shared identifier such as common for assets not tied to one subject.

### Shared Vocabulary Standards

- Category and descriptor fields draw from a shared, documented vocabulary so the same concept is always spelled the same way, for example idle, walk, run, propel, transfer, cane, sign, aac, gesture, fatigue, injury, and recovery.
- Profession descriptors, where used, draw from the eight professions using medic, scientist, engineer, maintenance, security, officer-commissioned, officer-noncommissioned, and civilian.
- State descriptors use a shared set such as calm, tense, urgent, and grief, so emotional and physical states are named consistently across domains.
- New vocabulary terms are added by documented decision rather than invented per asset.

### Variant and Index Standards

- The variant field distinguishes alternates of the same asset, such as a belonging illumination state or an Operation-specific version, using clear tokens such as belonging, prebelonging, or op-two.
- A zero-padded numeric index distinguishes members of a sequence, such as multiple takes or frames, using a fixed width across the project.
- Variants for the Vale System never split the body into separate people; member variance uses the member field, and other variance uses ordinary variant fields.

## Animation Naming

Animation naming extends the general structure with the specifics that animation pipelines need, while keeping every animation tied to its audio and, where relevant, tactile counterparts.

### Animation Clip Name Standards

- An animation clip name uses the domain anim, then the character identifier, then the movement category, then the state descriptor, then any variant, then a zero-padded index, for example anim_mara-chen_walk_calm_01.
- Movement categories use the shared locomotion and communication vocabulary, including idle, walk, run, propel, transfer, cane, sign, aac, and gesture.
- Fatigue, injury, and recovery are named as state descriptors layered on a base category, for example anim_rowan-ives_walk_fatigue_01, so state layering is legible in the name.

### Vale System Animation Naming

- Vale System animation clips use the body identifier and a member field, for example anim_vale-system_member-naomi_run_urgent_01, so the clip reads as one body presenting a member.
- Clips that belong to the constant body regardless of member omit the member field, for example anim_vale-system_body_idle_calm_01, though such shared clips are rare because presentation changes by member.
- No animation naming may create four separate character trees for the Vale System.

### Animation Companion Asset Naming

- Every animation clip that carries information has a companion audio asset whose name mirrors the clip in the audio domain, so anim_mara-chen_walk_calm_01 pairs with audio_mara-chen_walk_calm_01.
- Every animation clip that carries gameplay-relevant or safety-relevant information has a companion tactile asset in the tactile domain, so anim_soren-qadir_propel_urgent_01 pairs with tactile_soren-qadir_propel_urgent_01.
- Companion assets share the subject, category, state, variant, and index fields with the animation so the linkage is unambiguous.

### Signing and AAC Animation Naming

- Signing animation clips use the sign category and, where the specific language is defined by the writing team, a language field is appended as a documented variant rather than invented here.
- Tactile signing clips use a distinct descriptor such as sign-tactile so they are not confused with visual signing.
- AAC animation clips use the aac category for Mira Ives, paired with an audio companion carrying her authored communication voice.

## Portrait File Organization

Portrait organization keeps every character's canonical portrait, its states, and its paired audio-first description together and findable, honoring the rule that portraits represent belonging.

### Portrait Directory Structure Standards

- Portraits are organized under a portraits root, then by subject using the character identifier, so each character has a single home for their portrait assets.
- Within a character's portrait directory, files are grouped by state and variant, including belonging and pre-belonging illumination states.
- The player avatar's generated portrait is organized under the player-avatar subject so it never mixes with recurring character portraits.

### Portrait File Name Standards

- A portrait file uses the domain port, then the character identifier, then a state or context descriptor, then the illumination variant, then a zero-padded index, for example port_jonah-briggs_calm_belonging_01.
- The illumination variant uses belonging for the illuminated belonging state and prebelonging for states before a character is fully home.
- Emotional variants use the shared state vocabulary so a concerned portrait and its description are named consistently.

### Vale System Portrait Organization

- The Vale System has one portrait home under the vale-system subject, containing the one shared body, with member presentation expressed through the member field, for example port_vale-system_member-iris_calm_belonging_01.
- Constant-body reference assets omit the member field, for example port_vale-system_body_reference_01.
- No portrait organization may create four separate portrait homes for the Vale System.

### Paired Description File Standards

- Every portrait file has a paired audio-first description file whose name mirrors the portrait exactly in a description domain, so port_jonah-briggs_calm_belonging_01 pairs with desc_jonah-briggs_calm_belonging_01.
- The description file is stored alongside the portrait so the two never drift apart, and a portrait without a matching description fails review.
- Aged portraits from future Operations carry an Operation variant and each has its own paired description, so the visual and the description age together.

## Audio Naming

Audio naming reflects that audio is gameplay, so audio assets are first-class and are organized with the same rigor as visual assets, and they route to the correct independent volume channels.

### Audio Asset Name Standards

- An audio asset name uses the domain audio, then the subject, then the category, then the state descriptor, then any variant, then a zero-padded index, for example audio_talia-rusk_walk_tense_01.
- Character movement, professional action, breathing, and equipment sounds all use the shared category vocabulary so they align with their animation counterparts.
- Location ambience uses a location subject and an acoustic-identity descriptor so the acoustic identity of each major location is named consistently.

### Audio Channel Metadata Standards

- Every audio asset carries channel metadata naming its primary independent volume channel from the set Faience, navigation, dialogue, combat, music, environmental ambience, accessibility prompts, and reality announcements.
- Movement audio defaults to the environmental ambience channel and additionally carries navigation routing when the movement conveys navigation meaning.
- Dialogue and AAC communication route to the dialogue channel, and urgency cues route so they reach the player through the appropriate channel without depending on sight.

### Vale System and Faience Audio Naming

- Vale System voice and movement audio use the body identifier with a member field, for example audio_vale-system_member-gideon_idle_calm_01, because voice and cadence change by member on one body.
- Faience audio uses the faience subject and never carries human ethnicity or gender tokens, and its Operation One silence is represented by deliberate absence rather than by missing files.
- Silence used as a storytelling tool is documented as an intentional design choice tied to a scene rather than left as an unfilled audio slot.

### Tactile Asset Naming Standards

- Tactile assets use the domain tactile and mirror the subject, category, state, variant, and index of the animation or event they accompany, for example tactile_soren-qadir_propel_urgent_01.
- Tactile assets reference the defined tactile language meanings, such as direction, threat, distance, proximity, urgency, navigation, success, and failure, through a documented descriptor rather than an ad hoc term.
- Tactile assets are never generated as raw conversions of music, and their names reflect authored meaning consistent with the Accessibility Bible.

## Accessibility Metadata

Accessibility metadata is the structured information that makes every asset usable by every player. It is a required part of an asset, not an optional annotation, and it is what enforces the pairing of visual assets with accessible counterparts.

### Required Accessibility Metadata Standards

- Every visual asset carries metadata linking it to its audio equivalent where relevant, its tactile equivalent where relevant, and its authored text description.
- Every audio asset carries metadata naming its channel and any captioning or text-description linkage so its meaning is available without sound.
- Every asset that conveys state, such as belonging, fatigue, injury, urgency, or emotion, carries metadata naming that state so it can be surfaced through any output method.

### Description Metadata Standards

- Text descriptions are authored for screen reader and braille output, are written as complete blind-friendly descriptions, and are stored in the paired description asset rather than as a terse stub.
- Description metadata identifies the subject using the character identifier and honors the Character Identity Map, so a description never contradicts canon.
- Vale System descriptions describe one body presenting the current member, and Faience descriptions never assign human ethnicity or gender.

### Recognition and Non-Label Metadata Standards

- Metadata supports recognition through observation and never forces the interface to label a recurring character, consistent with the canon that the world teaches who people are.
- Where the interface must reference a character for accessibility, it does so in a way that reinforces observation rather than replacing it, and it respects each character's current pronouns from the Character Identity Map.
- Pronoun metadata reflects current presentation and is updated for characters whose presentation changes, including the open development of Mira Ives, without treating the change as unusual.

### Seizure-Safe and Sensory Metadata Standards

- Visual assets carry metadata confirming seizure-safe presentation consistent with the ship's standard seizure-safe lighting, flagging any flashing or rapid change for review.
- Assets carry metadata for any strong sensory content so players can manage their experience through the independent settings described in the Accessibility Bible.
- No asset relies on a single sensory channel for critical information, and metadata records which channels carry each critical cue.

## Localization Support

Localization support ensures the game's language and communication can adapt across cultures and communication styles, consistent with the canon that communication diversity is ordinary and that no identity is the default.

### Localizable Content Separation Standards

- All player-facing text, including audio-first descriptions and captions, is stored as localizable content keyed by a stable identifier rather than embedded in assets, so translation never requires rebuilding art or audio.
- Localization keys derive from the asset name so a description key clearly maps to its portrait or animation, for example a key based on desc_jonah-briggs_calm_belonging_01.
- Non-localizable technical identifiers, such as character identifiers and asset names, remain in stable ASCII form and are never translated.

### Multilingual and Sign Language Support Standards

- Localization accommodates multilingual communication and sign language as first-class content, and signed content is referenced by stable keys with the specific language defined by the writing team rather than invented here.
- Captions and text descriptions are localizable for every supported language, and speech output is provided so no player depends on reading alone.
- Braille output is supported for localized text so braille readers receive the same content as other players.

### Cultural Sensitivity in Localization Standards

- Localization respects cultural specificity and never flattens characters into stereotypes, consistent with representation being character-first and never tokenistic.
- Content for characters whose culture is undeveloped in canon, such as Talia Rusk, is not given invented cultural or linguistic detail through localization, and such development waits for appropriate cultural consultation.
- Pronoun and gender language is localized carefully so each character's current identity is expressed respectfully in every language.

### Localization Metadata Standards

- Each localizable string carries metadata for its context, its speaker or subject where relevant, and any constraints such as length limits for captions.
- Localization metadata records which output methods a string serves, including speech, captions, and braille, so no method is missed.
- Localization metadata references the Character Identity Map for speaker identity so translators have accurate, canon-aligned context.

## Modding Considerations

Modding considerations describe how community-created content can extend Resonance without breaking canon, accessibility, or recognition. These are forward-looking guidance for a potential modding capability and do not assert that a specific modding system exists.

### Mod Content Boundary Standards

- Mods may add original content such as new player-avatar options, original characters, locations, and cosmetic assets, and must not alter the existence, history, identity, relationships, or appearance of any recurring canonical character.
- Mods must not replace a recurring character, must not present the Vale System as four separate people or as a single Captain Mara Vale, and must not assign human ethnicity or gender to Faience.
- Mod-added original characters follow the same character-first, non-tokenistic representation standards as canon content.

### Mod Namespace Standards

- Mod assets use a reserved namespace prefix so they never collide with canonical asset names, for example a mod field preceding the general asset name.
- Mod character identifiers live in the mod namespace and can never shadow a canonical character identifier such as mara-chen or vale-system.
- The player-avatar identifier and canonical identifiers are protected from being overridden by mods.

### Mod Accessibility Compliance Standards

- Mod-added visual content is expected to provide the same accessible counterparts as canonical content, including audio equivalents where relevant, tactile equivalents for gameplay-relevant cues, and authored text descriptions.
- Mod audio declares its channel so it integrates with the independent volume channels rather than overriding a player's settings.
- Mod content honors seizure-safe presentation and never makes critical information depend on a single sensory channel.

### Mod Review and Safety Standards

- Mod content is expected to pass a representation and accessibility review analogous to the review used before canonizing content, so community content upholds the project's promises.
- Mods never bypass a player's individual accessibility settings, and in shared play one player's mod content must not alter another player's experience, consistent with the multiplayer accessibility rule.
- Cultural content in mods follows the same care as canon, and content touching undeveloped areas such as Talia Rusk's culture is held to the standard of respectful, consulted development rather than casual invention.

## Technical Standards Review and Acceptance

Every asset is checked against these technical standards before acceptance, so consistency, accessibility, and canon alignment are verified rather than assumed. This review complements the animation, portrait, and representation review standards elsewhere in this bible.

### Naming Compliance Criteria

- The asset name follows the general structure, uses only approved delimiters and lowercase ASCII, and draws its fields from the shared vocabulary.
- The subject field uses a canonical identifier that honors the Character Identity Map, and Vale System assets read as one body presenting a member.
- Any new vocabulary term used in the name has been added by documented decision rather than invented ad hoc.

### Accessibility Compliance Criteria

- The asset carries required accessibility metadata and is linked to its audio, tactile, and description counterparts as relevant.
- No critical information depends on a single sensory channel, and seizure-safe presentation is confirmed.
- Descriptions are complete, blind-friendly, and consistent with the visual and audio content they accompany.

### Canon and Consistency Criteria

- The asset does not contradict the Canon Rules or the Character Identity Map, and it preserves recognition without forcing interface labels.
- Undeveloped cultural and gender content is kept open rather than invented, consistent with the open development items in the Character Identity Map.
- Localizable content is separated from assets with stable keys, and mod content, where present, respects the mod namespace and content boundaries.
