# Reusable wardrobe visual system — cross-game design contract

Status: **proposed design architecture**, not a claim of completed software.

Separate these layers:

1. **Shared garment part:** jacket, tunic, sleeve, cuff, harness, strap, pocket, pouch, fastener, rank mount, tactile identifier. Independent of any named character.
2. **Material and finish:** fabric family, stiffness, thickness, texture, colour/contrast, wear, licence/provenance, clipping and collision expectations; also physical SFX *reference category* but no fabricated file.
3. **Action and animation:** open/close closure, arm flex, reach into pocket, shrug, rotate in a chair, mount/retrieve AAC, sign, remove equipment, swap layer; each action has stable hooks for Wren's actual audio events and accessibility equivalents.
4. **Body/device fit:** accessible dimensions and actual rig interfaces; chair user garment lengths and straps must not snag wheels, sign users need free arm/hand articulation, carry loads should work across varied bodies.
5. **Actor composition:** per-person outfit selections, device placements, recognisable routine, wear pattern, rank and identity marks. This produces distinct characters *from reused base parts*.
6. **Scene/level binding:** only the approved scene script chooses where and when someone touches a fastener, walks, taps, signs or removes an item.

For visual authoring, keep neutral editable masters and quality/detail variants. A simple model prototype is not the final authored outfit or a rig.

For audio handoff, each action records: material and construction; when actual motion begins/ends; physical source location; expected sound category; level-specific event; 3D geometry and reflection effects; non-audio access twin; final asset/license ID; in-game test evidence. Wren produces and wires the audio, not Kit.

**Generalisation:** A single low-force buckle can be configured for different garments, people and future games. **Individualisation:** Kesh's reachable tool-loop arrangement or Sanaa's AAC carrier remains tied to a character's actual chosen outfit, while using those same reusable parts.

Never fix unapproved clothing as character canon, invent a gate event just to demonstrate a sound, or copy an asset with an uncertain licence. Respect existing `docs/design_notes/franchise_asset_bible.md`, `docs/presentation_bible/03_Visual_Design_Standards.md`, and `assets/REGISTRY_SCHEMA.md`.