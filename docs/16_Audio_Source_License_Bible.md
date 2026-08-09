# Resonance Audio Source and License Bible

**Status: PROTECTED.** This document is the single source of truth for where
Resonance audio may come from, under which licenses, and how provenance is
recorded. It applies to BOTH clients — the web game at the /resonance address
and the native iOS app — with platform-appropriate rendering. It authorises
audio sourcing only; it never authorises narrative content, and nothing in it
unlocks Medical or any gate beyond Gate One's locked endpoint.

Wording here follows the Canon Rules precedence model: where another document
restates a rule from this Bible, the statement here governs.

---

## 1. Core principles

1. **Sound communicates gameplay information first** (the Miriani-Next
   principle), and Resonance must exceed that reference: coherent 3D/binaural
   positioning, distance attenuation, verticality, occlusion/room acoustics
   where feasible, movement-relative sources, surface/material variation, and
   full integration with the protected world model. Every sound is anchored
   to the SAME world coordinates used by movement and accessibility.
2. **Variation pools, not repetition.** Doors, footsteps, carts, machinery,
   and notifications draw from pools of variants (typically several per
   identity) so no repeated action sounds identical twice in a row.
3. **Every imported asset gets a provenance record** (Section 4). No
   provenance record, no shipping the sound.
4. **Copyleft and attribution licenses are welcome.** GPL/GNU, CC-BY,
   CC-BY-SA, and similar packs are NOT rejected for being copyleft. They are
   used with their attribution, license text, provenance, and any share-alike
   or source obligations preserved. Open source is a feature, and we document
   it.
5. **Never rip assets from commercial games.** A Blind Legend, The Last of
   Us, Halo, Zombies Run, and similar titles are implementation and mixing
   REFERENCES ONLY, unless a separately licensed reusable asset is
   positively identified.
6. **No raw redistribution, no AI/ML training** for sources whose licenses
   forbid it (SONNISS, ZapSplat): their sounds ship only inside the game,
   never as a re-shareable library, and are never fed to AI/ML training.

---

## 2. Approved sources, in priority order

### Priority 1 — SONNISS #GameAudioGDC bundles (2026 and archive)
- **License:** Royalty-free, commercially usable in games/media, no
  attribution required, lifetime/unlimited-project license.
- **Use for:** the PRIMARY high-fidelity layer — ship machinery, mechanical
  systems, doors, impacts, ambience, foley, movement, environmental layers,
  cinematic texture.
- **Obligations:** preserve license/provenance records; do NOT redistribute
  the raw library separately; do NOT use for AI/ML training.

### Priority 2 — Kenney Sci-Fi Sounds (kenney.nl)
- **License:** CC0 (public domain dedication). 70 sci-fi sounds.
- **Use for:** engines, sci-fi mechanisms, interface/system layers, alarms,
  prototyping, and final layering where the quality fits.
- **Obligations:** none required; provenance still recorded.

### Priority 3 — OpenGameArt mirror of Kenney Sci-Fi Sounds
- **License:** CC0. Same use category as Priority 2.
- **Rule:** avoid duplicate ingestion if already sourced from Kenney
  directly; the manifest records which origin was used.

### Priority 4 — OpenGameArt: OwlishMedia Sound Effects Pack
- **License:** CC0.
- **Use for:** footsteps, cloth/fabric movement, human foley, metal/ceramic/
  dull impacts, paper, UI, synth/sci-fi, technology, water layers.

### Priority 5 — OpenGameArt: rubberduck 60 CC0 Sci-Fi SFX
- **License:** CC0. 60 effects with variants.
- **Use for:** terminals, high-tech systems, ambient sci-fi layers, and
  especially VARIATION POOLS instead of repetitive single samples.

### Priority 6 — OpenGameArt: SoundFX Library CC0 collection
- **License:** individual CC0 packs (metal/wood, breaking/falling/hits,
  sci-fi, loops, water, and other gaps).
- **Rule:** verify the selected item's DISPLAYED CC0 license per asset and
  record provenance per pack.

### Priority 7 — ZapSplat (Standard License, current terms)
- **License:** permitted for commercial games/apps. BASIC downloads require
  ZapSplat credit; PREMIUM downloads need no attribution and remain licensed
  for the project after the subscription ends.
- **Use for:** gap-filler for specific REAL-WORLD foley not adequately
  covered above — transport, crowds, doors, mechanical ambience,
  wheelchairs/carts, HVAC, environmental recordings.
- **Obligations:** record Basic vs Premium terms per asset; keep required
  credits in the game's credits surface; no raw redistribution; no AI/ML
  training.

### Priority 8 — Open/free game sound packs (including copyleft)
- **License:** GNU/GPL, CC-BY, CC-BY-SA, and similar are EXPLICITLY ALLOWED
  when the pack/license demonstrably covers the actual audio assets.
- **Rule:** never reject material merely for being copyleft. Preserve
  attribution, the license text, provenance, and any share-alike/source
  obligations.
- **Worked example — CC-Sounds / CDDA soundpack:** the project identifies its
  SFX as CC0 or CC-BY with per-file attribution, with the pack as
  CC-BY-SA-4.0. Usable where asset-level licensing and attribution are
  preserved; the manifest records per-file license and attribution.

### Priority 9 — Miriani-Next
- **Primary role:** the blind-first AUDIO DESIGN REFERENCE — its principle of
  informative, variant-rich, accessible sound design is the floor Resonance
  builds above.
- **Import rule:** investigate the actual pack/asset licensing BEFORE
  importing any audio. A public repository does not, by itself, relicense
  every bundled third-party recording. If the pack or a specific subset is
  demonstrably covered by a reusable open/free license, it is explicitly
  approved for import under that license with documentation. If individual
  files carry different upstream licenses, follow those per-file licenses
  rather than discarding the whole concept.

---

## 3. Gate One sound identity plan (sourcing map)

Each identity below lists its intended primary source (by priority number)
and fallback. All identities use variation pools where marked (VP). This plan
covers Gate One ONLY — Earth transport through "Medical intake first." /
Deck Three — and does not authorise later gates.

| # | Identity | Content | Primary | Fallback | VP |
|---|----------|---------|---------|----------|----|
| 1 | Earth transport interior bed | low engine rumble, hull tone, cabin pressure | 1 (SONNISS machinery/ambience) | 2/5 sci-fi beds | — |
| 2 | Braking event | engine pitch drop, seat-frame vibration layer, restraint clicks | 1 (mechanical + impacts) | 7 (real-world restraint/transport) | VP (clicks) |
| 3 | Cabin fellow passengers | cloth movement, small human foley, reading page turns | 4 (OwlishMedia foley/paper) | 7 | VP |
| 4 | Transfer hatch / airlock | seal release, heavy door travel, lock engage | 1 (doors/mechanisms) | 2/5 mechanisms | VP (≥3 door variants) |
| 5 | Lunar concourse crowd | walla at distance, passing footsteps, mixed gaits | 7 (crowds) layered over 1 | 4 (individual footsteps) | VP (footsteps by surface) |
| 6 | Cargo and carts | cart wheel rhythm, load shifts, maintenance cart motor | 7 (wheelchairs/carts explicitly) | 1 | VP |
| 7 | Concourse HVAC / hall tone | broad ventilation, big-room reflections | 1 (environmental layers) | 6 (loops) | — |
| 8 | Badge and interface | routing chirps, confirmation, scan tones | 2 (interface/alarms) | 5 (terminals) | VP (no identical repeats) |
| 9 | Spatial AAC and speech positioning | positional voice-band cue at speaker location | synthesized in-engine (both clients) + 5 | — | VP |
| 10 | Memorial alcove (optional zone) | near-silence bed, faint air, cloth of a still visitor | 1 (quiet environmental) | 4 | — |
| 11 | Hearth exterior reveal | berth viewport low resonance, distant dock machinery | 1 | 5 ambient sci-fi | — |
| 12 | Boarding bridge traversal | boot-on-bridge surface change, structural flex, wind-in-structure | 1 (impacts/movement) | 6 (metal) | VP (surface variants) |
| 13 | Docking mechanisms | clamps, collar engage, pressurisation | 1 | 2/5 | VP |
| 14 | Hull/bridge resonance | body-of-ship tone rising as you approach | 1 | 5 | — |
| 15 | Hearth interior transition | IMMEDIATE acoustic change on physically crossing aboard: different ventilation voice, tighter reflections, working-ship texture | 1 (two distinct room beds) | 6 loops | — |
| 16 | Player movement | footsteps per surface (cabin deck, concourse stone, bridge grating, Hearth deck), mobility-device users in crowd | 4 primary | 7 for device foley | VP (≥4 per surface) |

Rendering: the web client positions these via its Web Audio HRTF/stereo path;
the native client via the native spatial engine. Identities, coordinates, and
variation pools are shared; the renderer is platform-specific by design.

---

## 4. Provenance manifest (mandatory)

Manifest location: `assets/audio/PROVENANCE.md` (created with the first
imported asset; one entry per asset or coherent pack subset).

Each entry records ALL of:

- **Source/library** (e.g. SONNISS GameAudioGDC 2026, Kenney Sci-Fi Sounds)
- **Original asset or pack name** (as published)
- **Creator** where supplied
- **Source URL/reference**
- **License** (exact: CC0 / CC-BY 3.0 / CC-BY-SA-4.0 / SONNISS RF / ZapSplat
  Standard-Basic / ZapSplat Standard-Premium / GPL…)
- **Attribution text** if required (verbatim, ready for the credits surface)
- **Date acquired**
- **Modifications/derived layers** (edits, EQ, layering, renaming)
- **Where used in Resonance** (identity number(s) from Section 3, client(s))
- **For ZapSplat:** whether obtained under Basic or Premium terms

Rules:
- An asset without a complete entry must not ship.
- Share-alike obligations (e.g. CC-BY-SA) are tracked in the entry and
  honoured for the derived sound files as the license requires.
- License texts for attribution/copyleft sources are stored alongside the
  manifest under `assets/audio/licenses/`.

---

## 5. Prohibitions (restated as hard rules)

1. No ripping from commercial games, ever.
2. No redistribution of raw SONNISS or ZapSplat libraries or files.
3. No use of license-restricted sources for AI/ML training.
4. No assuming a repository's presence relicenses bundled recordings
   (Miriani-Next rule).
5. No dropping attribution/share-alike obligations to "simplify".
6. This Bible authorises SOUNDS, not story: no narrative gate beyond Gate
   One's locked endpoint is opened by any work performed under it.

## 6. Relationship to other documents

- The **Audio Bible (07)** elaborates acoustic identity, silence, and sound
  as progression; this document governs SOURCING and LICENSING.
- The **Canon Rules (15)** hold the one-line canonical statement of the
  sourcing rule; this document is its elaboration.
- The **Decision Log (11)** records the adoption of this Bible.
- The two-client architecture (web game client at /resonance + native iOS
  client) is unchanged by this document and applies to how these sounds are
  rendered.
