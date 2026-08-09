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

## 4. The Audio Asset Ledger (mandatory)

The human-readable AUDIO ASSET LEDGER is the project's provenance manifest.
Location: `assets/audio/LEDGER.md` (one entry per imported sound/music asset
or coherent pack subset; created with the ledger template and grown with
every import).

Each entry records ALL of:

- **Source/library** (e.g. SONNISS GameAudioGDC 2026, Kenney Sci-Fi Sounds)
- **Original asset/track name** (as published)
- **Creator** where applicable
- **Source URL/reference**
- **License** (exact: CC0 / CC-BY 3.0 / CC-BY-SA-4.0 / SONNISS RF / ZapSplat
  Standard-Basic / ZapSplat Standard-Premium / Incompetech CC-BY /
  Incompetech Standard / GPL…)
- **Commercial-use status** (permitted / permitted-with-credit / excluded)
- **Attribution text** if required (verbatim, ready for the credits surface)
- **Whether modification is allowed** (and any ND-style limits)
- **Date acquired**
- **Whether a paid license/subscription was used**, the **cost**, and the
  **proof/receipt or license-snapshot location** for any purchase or grant
- **Modifications/derived layers** (edits, EQ, layering, renaming)
- **Where used in Resonance** (identity number(s) from Section 3, client(s))
- **For ZapSplat:** whether obtained under Basic or Premium terms

Rules:
- An asset without a complete entry must not ship.
- Share-alike obligations (e.g. CC-BY-SA) are tracked in the entry and
  honoured for the derived sound files as the license requires.
- License texts for attribution/copyleft sources are stored alongside the
  ledger under `assets/audio/licenses/`.
- **In-game Audio Credits are GENERATED from this ledger** into a single
  consolidated credits section shown by both clients, so attribution-heavy
  sources are operationally easy rather than avoided.

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

---

## 7. Expanded source tiers and licensing decision policy

This section extends Section 2 with the full decision policy based on
current official source terms. Where Section 2 and this section describe the
same source, they are one rule read together, not competing rules.

### 7.1 Paid and subscription sources — when money is worth it

- **SONNISS GameAudioGDC archive (incl. 2026)** stays the preferred
  high-quality SFX pool: commercial, royalty-free, no attribution, unlimited
  projects; raw files never redistributed as a standalone library; never
  used for AI/ML training.
- **Purchased SONNISS libraries** are also acceptable under their commercial
  royalty-free media-production license when a specific full library is
  worth buying.
- **Spending rule:** prefer free-with-attribution over paying solely to
  avoid a reasonable credit requirement. Recommend a purchase only when it
  materially improves fidelity, WAV quality, download access, rights
  certainty, or production efficiency.

### 7.2 ZapSplat — Basic is explicitly acceptable

- **Basic (free):** commercial use is allowed perpetually; clear ZapSplat
  credit is REQUIRED. A useful asset is never rejected merely because it
  needs credit — the attribution goes into the ledger and the generated
  Audio Credits.
- **Premium (paid):** optional, when WAV access, unlimited downloads, or
  attribution-free use makes the cost worthwhile. Sounds downloaded while
  Premium is active retain attribution-free project rights after the
  subscription ends.
- Record Basic vs Premium per asset. No raw redistribution; no AI/ML
  training.

### 7.3 Freesound — asset-by-asset

- Prefer **CC0**. **CC BY** is acceptable with creator attribution recorded
  and credited. **CC BY-NC is EXCLUDED** from a commercial Resonance release
  unless separate commercial permission is obtained and archived.

### 7.4 Music sources

- **Incompetech:** acceptable. The Creative Commons route is free with the
  generated attribution preserved verbatim; the paid Standard License is an
  option when attribution is unwanted or impossible.
- **Free Music Archive:** usable only after checking EACH track's license.
  CC BY is viable with attribution; **NC licenses are not suitable** for a
  commercial release without separate permission; **ND material must not be
  used** where synchronization/editing would create a prohibited derivative.
- **Mixkit:** considered only after verifying the applicable item-specific
  license for the exact music/SFX item being downloaded.

### 7.5 YouTube — the critical distinction

- Ordinary YouTube search results ("rainstorm ambience", "no copyright
  music") are **NOT** automatically reusable or downloadable game assets.
  **Never rip audio from standard-license YouTube videos.**
- **YouTube's own Audio Library** is a legitimate discovery/source pool for
  YouTube productions: some tracks require Creative Commons attribution,
  others do not. YouTube itself warns that off-platform licensing is not
  guaranteed — so before embedding an Audio Library track in the distributed
  game, VERIFY that the exact track's license grants off-platform game
  synchronization/redistribution rights, or obtain permission.
- A normal YouTube video may be an asset source ONLY if the uploader owns
  the material AND provides a clear license (e.g. CC BY) or explicit written
  permission covering commercial game use. Save the evidence of that license
  in the ledger's proof location.
- Titles or descriptions saying "no copyright" are never sufficient on
  their own.

### 7.6 Open/copyleft and reference sources (restated)

- OpenGameArt / open-source / copyleft audio is acceptable when the actual
  asset license permits the intended game distribution; honour CC BY
  attribution, CC BY-SA/share-alike, GPL/copyleft, and source/notice
  obligations rather than rejecting material for being copyleft.
- Miriani-Next remains the blind-first sound-information architecture
  reference; any of its actual assets are used only where their individual
  or pack licenses are verified to permit Resonance distribution.

### 7.7 Gate One sourcing emphasis

For Gate One, prioritise SONNISS GDC, CC0 material (Kenney, OpenGameArt,
Freesound CC0), and credited ZapSplat recordings for: transport vibration
and braking, restraints, station HVAC, crowds, cargo, wheelchair and
mobility-device movement, footsteps, spatial voices/AAC, memorial acoustics,
docking machinery, airlock/bridge resonance, hull transmission, maintenance
carts, and Hearth interior room tone. Layer and modify licensed sounds
rather than expecting one sample to carry a scene, and maintain multiple
variants for every repeated sound (Section 3's pools).

This policy expands audio sourcing only. It changes no Gate One narrative
and expands no implementation scope beyond Gate One.

---

## 8. Expanded sourcing research policy (adopted later on 2026-08-09)

This section extends Sections 2 and 7; together they are one policy.

### 8.1 Research posture

Actively check YouTube-related creator resources and other legitimate
free/reusable sources when selecting audio — but ALWAYS verify the actual
license for use inside a commercial game rather than assuming a YouTube
upload is reusable. The candidate pool includes, beyond the Section 2 tiers:
**Pixabay music/SFX**, **Mixkit** (item license verified per download),
**itch.io audio packs** whose individual licenses permit commercial game
use, **public-domain/CC0 field recordings**, **creators who explicitly
grant commercial game reuse** (with the grant archived), and other
reputable libraries discovered during research.

### 8.2 YouTube Audio Library — two different jobs

- ON-PLATFORM: the Audio Library is a STRONG source for the project's own
  YouTube videos, trailers, devlogs, and promotional material, with
  attribution handled per track.
- IN-GAME: YouTube does not guarantee off-platform rights. An Audio Library
  asset goes inside the distributed game ONLY when its underlying license
  independently permits that use.
- **Creator Music licenses are NOT game-asset licenses.** Current Creator
  Music terms are generally tied to particular YouTube long-form videos and
  are not transferable to other platforms. Never treat one as clearance for
  the game.

### 8.3 Attribution and money (restated as one rule)

Attribution-required assets are WELCOME — a good free asset is never
rejected just because it requires credit; the credit goes in the ledger and
the generated Audio Credits. Paid licenses/subscriptions are allowed
candidates, but every purchase is FLAGGED to the creator before buying,
stating exactly what the purchase buys and whether a free/attribution route
exists.

### 8.4 License-family rules (restated)

- CC-BY-SA / GPL / copyleft: document and comply with the actual
  obligations; never reject material merely for being open source.
- NC material: excluded from a commercial release unless separate
  permission is obtained and archived.
- ND material: treated cautiously wherever editing, syncing, or embedding
  would create a derivative use.

### 8.5 Provenance hygiene and acknowledgements

- The game and repository carry NO metadata, generated-by labels,
  provenance tags, comments, credits, or internal project text suggesting
  the game was made by any particular AI product.
- Legitimate third-party asset and license attribution is NEVER erased —
  this hygiene rule and the attribution rules point in the same direction:
  credits describe the work truthfully.
- The eventual human-facing acknowledgements may use the wording/concept
  "with help on research and design from our Kit" for the assistant's
  contribution. It is NOT added to player-facing credits until explicitly
  authorised.

### 8.6 Scope guard

This sourcing research supports Gate One production only. Nothing in this
section unlocks later gates or changes any narrative content.

---

## 9. Crediting policy — LOCKED (adopted later on 2026-08-09)

### 9.1 Original creative audio is credited to Fractured Flow

For original music, original Suno-generated music, atmosphere, vocal
material, sound design, and other creative audio produced by the project
creators, the credited artist/creator identity is **Fractured Flow** — not
Suno and not any other production tool. Suno is an APPROVED production
tool/source for original, commercially licensed generations, but it is
never presented as the artist or creative author in player-facing credits
or embedded creative metadata.

### 9.2 Tools are not artists

No GPT/ChatGPT/OpenAI metadata and no tool-credit metadata is added to the
game, assets, credits, descriptions, or player-facing materials merely
because AI tools assisted production. The intended acknowledgement for
Kit's contribution remains human-facing language along the lines of
"With help on research and design from our Kit" (Section 8.5; not
player-facing until explicitly authorised).

### 9.3 Legal obligations override the creative-credit rule

Where an external asset's license requires creator, library, or platform
attribution, that attribution is preserved EXACTLY as required. Legal
license obligations always override the general creative-credit rule —
Fractured Flow is the credit for OUR original work, never a replacement
for someone else's mandatory credit.

### 9.4 The ledger stays internal

The Audio Asset Ledger (Section 4) continues to document tools and
acquisition sources — including Suno generations — for compliance and
provenance. Being in the ledger does not make a tool a creative artist
credit; the ledger is the internal record, the credits are the
human-facing story, and both must stay truthful in their own register.

### 9.5 Scope

This policy applies to all future audio sourcing and credits. It changes
nothing in Gate One's authorised narrative scope.

---

## 10. Master Asset Registry (adopted later on 2026-08-09)

The Audio Asset Ledger of Section 4 has been integrated into a project-wide
MASTER ASSET REGISTRY covering audio, music, voices, graphics, textures, 3D
models, animations, fonts, video, and other imported/generated assets, so
provenance survives any future migration off the current host:

- Registry: `assets/REGISTRY.json` (machine-readable, one source of truth)
- Schema and import workflow: `assets/REGISTRY_SCHEMA.md` (portable; no
  host-specific knowledge required)
- Tooling: `node scripts/assets/registry.mjs validate | credits`
- Credits are GENERATED from the registry into `assets/generated/` and into
  both clients, so player-facing credits cannot drift from the record.

The import workflow is mandatory: check the registry before searching
externally; register every asset before use; never silently import an
untracked asset; keep license evidence in the repository but never commit
huge raw third-party libraries — record reacquisition instructions and
commit only approved game-ready derivatives/masters. Every rule of this
Bible (Sections 1–9) applies unchanged; where Section 4 says "ledger", read
"registry". This is repository infrastructure only and does not alter
narrative or gameplay scope.

---

## 11. Source & Pack Catalog (adopted later on 2026-08-09)

The repository stores reusable PACK/SOURCE CATALOGS in addition to
individual asset records, so future builders never re-research the same
libraries:

- Machine-readable: `assets/CATALOG.json` (stable `SRC-AUD-*` / `SRC-GFX-*`
  ids; statuses approved / approved-per-file / reference-only /
  needs-license-check).
- Human-readable: `assets/generated/CATALOG.md`, GENERATED via
  `node scripts/assets/registry.mjs catalog`.
- Integration: registry entries reference their source via `sourcePackId`;
  the validator rejects unknown ids and blocks imports from reference-only
  sources until a verified license flips them.

The catalog is seeded with every source already researched or approved in
this Bible (Sections 2, 7, 8): SONNISS, Kenney audio, the OpenGameArt
mirror, OwlishMedia, rubberduck, the OGA SoundFX collection, Freesound,
ZapSplat, Pixabay, Mixkit, Free Music Archive, Incompetech, itch.io audio
packs, CC-Sounds/CDDA, Miriani-Next (reference-only), Fractured Flow
originals (including Suno generations under a qualifying commercial
subscription), and YouTube Audio Library/Creator Music (reference-only for
in-game use) — plus a graphics section: Kenney graphics, Poly Haven,
ambientCG, Quaternius, OpenGameArt graphics, itch.io art packs, and
OFL/Apache fonts. Raw source packs are not committed by default; small
packs may be mirrored only when their license permits redistribution and it
is technically reasonable. All crediting, hygiene, and scope rules of
Sections 1–10 apply unchanged.
