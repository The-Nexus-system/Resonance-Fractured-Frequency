# First Fracture Expansion Log — Noncanonical Content Register

> **SUPERSEDED (August 2026, Nexus directive).** The demo campaign registered
> in this file (quiz cards, four resonator puzzle nodes, F/A/C/high-F tones)
> is no longer the intended First Fracture campaign. The source of truth is
> now `docs/design_notes/first_fracture_episode_one_script.md` (one-hour
> episode: lunar-station opening, interface/implant choice, week aboard
> Hearth, Attack Day branch, pod-linking, medical-station ending, earned
> F–A–C–E resonance moments, no quiz cards). This register remains as the
> historical record of the demo builds.

**Purpose.** Nexus directive: every piece of content invented to expand the
playable slice must be written down here so it can be reviewed, approved,
promoted, or removed. Nothing in this file is canon unless Nexus promotes it.

**Canon status of The First Fracture itself.** The playable campaign "The
First Fracture" (and "The Echoing Chasm" lock screen) exists only in the app
builds as technical demonstration content. It does not appear anywhere in the
canon docs. Nothing here references canon characters (no Faience, no Vale
System captains), the Shawabti, CSV Hearth locations, or timeline events.

**Playtime target (Nexus directive, August 2026).** The vertical slice
targets **45 minutes to 1 hour** for a curious first playthrough — raised
from the 25–45 minutes in the original work order. Extra time must come from
exploration and discovery, never padding.

---

## New content added in the vertical-slice expansion (Phase 4)

### Explorable fracture zone (app/explore.tsx, lib/spatial/firstFracture.ts)
A spatial "fracture zone" surrounding the beacon from the existing four
puzzle nodes. The four puzzles themselves are unchanged — same narrative
text, choices, answers, and failure feedback, used verbatim.

### Named objects (all invented, all noncanonical)
| Object | Role | Text |
| --- | --- | --- |
| the anchor resonator | Puzzle node 1 | "The anchor resonator. Its casing vibrates unevenly, like a hum trying to find its footing." / restored: "…rests at a low, even hum. The casing is still." |
| the channel resonator | Puzzle node 2 | "The channel resonator. Air moves through its open lattice in irregular gusts." / restored: "…breathes evenly now, a soft continuous draw of air." |
| the pulse resonator | Puzzle node 3 | "The pulse resonator. Its beat stutters — two rhythms fighting over the same drum." / restored: "…keeps one clean beat, patient as a heartbeat." |
| the crown resonator | Puzzle node 4 | "The crown resonator, mounted high. Its overtones splinter off in every direction." / restored: "…rings clear overhead, its overtones gathered into one voice." |
| echo fragments (×3) | Collectibles | "An echo fragment: a splinter of stored resonance…" (three variants: "still humming faintly" / "cool to the touch" / "its pattern almost legible") |
| a survey pylon | Optional inspect | "Field markings chart the fracture boundary — the damage is mapped, not mysterious." / restored: "Someone will need to update its markings: the fracture boundary has closed." |
| a calibration array | Optional inspect | "Its reference tines are meant to sound together; right now each rings alone." / restored: "Its reference tines ring together again." |
| a quiet hollow | Hidden discovery (after 2 attunements) | "The fracture noise falls away here, and what remains of the beacon sounds closer." |
| an overtone ridge | Hidden discovery (after all 4) | "A low ridge where every resonator is audible at once — the whole restored harmony in one place." |

"Echo fragment" is a new term used ONLY as a collectible name in demo
content. It is not asserted as lore. If Nexus wants collectibles to have
canonical meaning, that is a Nexus decision.

### Rewards (lib/rewards.ts, titles + descriptions all noncanonical)
Beacon Restored (milestone), Echo Fragment I–III (fragments), Quiet Hollow
and Overtone Ridge (hidden discoveries), Field Notes (inspect both survey
objects), Afterglow (return and listen to a restored resonator).

### Musical design (lib/music/)
The four resonators carry F3 (low warm drone), A3 (mellow chime), C4
(rhythmic pulse), F4 (bright shimmer); together they resolve to an F-major
harmony when the beacon is restored. Undiscovered voices sound faint and
detuned (audible beating = instability); discovery clarifies them; attunement
settles them in tune. This follows the Audio Bible principle that sound is
physical information and each object has a deliberate acoustic identity — but
the specific notes/timbres here are demo choices, not canon.

## Rules applied (from the work order + Nexus dictation)
1. Target first playthrough: 45–60 minutes (Nexus override of the order's 25–45).
2. All invented expansion content is registered in this file.
3. No canon characters, factions, places, or events appear in the slice.
4. Puzzle text/answers are verbatim from the established slice.
5. If meaningful new lore becomes necessary, STOP and ask Nexus.

## Phase 4 completion additions (August 2026, all noncanonical)

### New archive texts (unlocked by rewards — lib/rewards.ts payloads)
| Reward | Archive entry title | Text |
| --- | --- | --- |
| Echo Fragment I | Echo fragment — first playback | "…the beacon held through the first night. Whatever cracked the channel did not crack us…" (a recovered scrap of an old field recording; speaker unnamed, deliberately) |
| Echo Fragment II | Echo fragment — second playback | "…we marked the boundary and sang the reference tones until our throats gave out. The ground answered…" |
| Echo Fragment III | Echo fragment — third playback | "…if anyone finds these splinters, know the fracture was survivable. Mend it the way we could not…" |
| Field Notes | Field Notes — fracture survey | Survey summary combining both inspect objects' observations |
| Afterglow | Afterglow — listening note | "A restored resonator does not go silent; it keeps a low, even afterglow. Standing with it for a while is its own kind of maintenance." |
| Resonance Bloom | Resonance Bloom — field observation | "Post-restoration phenomenon: where a fracture heals completely, the settled harmonics can knot into a stable standing bloom. Noted for future survey teams — a healed zone is not an empty zone." |

The fragment playback texts refer to unnamed past survey workers only. They
name no canon characters, factions, dates, or places. If Nexus wants echo
fragments tied to canonical history, that is a Nexus decision.

### New post-completion object
| Object | Role | Text |
| --- | --- | --- |
| a resonance bloom (bloom-1) | Hidden discovery, appears only after all 4 resonators are attuned | "A resonance bloom — a slow flower of standing sound that only forms where a fracture has fully healed. It was never here before. It could not have been." |

"Resonance bloom" is a demo term for a post-completion phenomenon; not canon.

### Reward unlock labels (functional unlocks, no monetization)
- Restored Ambience (ambient mix): completing all four resonators changes the standing soundscape.
- Quiet Focus (field effect): the quiet hollow discovery adds a calmer listening layer.
- Overtone Crown (music layer): the overtone ridge discovery adds a fifth crown voice, root note one octave up, when the zone is fully restored.

### Environmental music stages (lib/music/environment.ts captions)
Stage captions describing restoration 0→4 (e.g. "The fractured layers settle
into one stable harmony…") are new descriptive text, not lore.

### Haptic language
The documented gameplay haptic vocabulary (discovery / approach / success /
error / attuned / restoration / reward) lives in lib/haptics.ts. Design
language only — no lore content.
