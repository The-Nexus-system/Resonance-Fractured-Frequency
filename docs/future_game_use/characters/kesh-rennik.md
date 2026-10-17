# Kesh Rennik — Visual wardrobe and audio-behaviour handoff

**Status:** CREATOR REVIEW — all outfit choices below are PROPOSED visual designs, not locked wardrobe canon and not proof of built/approved/licensed media.
**Master canon:** `docs/design_notes/first_fracture_episode_one_locked_rules.md`.
**Profile storage:** docs/future_game_use/characters/kesh-rennik.md. 
**Other copy:** `docs/design_notes/character_wardrobe/kesh-rennik.md`.
**Owners:** Kit — visual concepts, meshes, rigs, animation, clothing material/fastener decisions. Wren — recorded sound design, real 3D positioning, integration, access equivalents and validation.

## Canon constraints
Ensign, Engineering, Kestrel Foundry. He/him. Spastic diplegic cerebral palsy; wheelchair is his usual efficient daily mobility. Hands-on mechanic who keeps borrowed tools.

## Proposed individual wardrobe composition
**Silhouette:** Seated-cut engineering jacket: shortened front hem, close sleeve ends kept clear of moving parts, reachable tool loops and secure layers that do not snag wheels.

**Visual objects and animation:** Tool-retention rig and reachable clips. Creator-settled hybrid chair originated as powered and was modified by Kesh for manual/powered mode choice; tool stowage and detachable batteries are character equipment, not generic uniform parts.

This visual language may be reused in later Resonance levels, but specific clothing is not canon until the Nexus approves it. Treat each garment as configurable, not a one-off model.

## Clothing material/action sound notes — HANDOFF, NOT AUDIO ASSETS

1. **engineering jacket**. Material: flexible abrasion-resistant weave. Mechanism: covered zip or magnet closures. Audible behaviour: fabric rub at torso turn, actual fastener slide/click. The event is action-driven and should use an approved reusable category, not an automatic continuous character loop.

2. **tool loops / apron**. Material: woven webbing and retainers. Mechanism: clips and straps. Audible behaviour: tools contact holders when Kesh actually moves or retrieves them. The event is action-driven and should use an approved reusable category, not an automatic continuous character loop.

3. **wheelchair interface**. Material: alloy/polymer/straps, exact specification open. Mechanism: control selector, brake and battery latch. Audible behaviour: real motor/manual wheel/latch/impact events supplied by Wren, only when scripted. The event is action-driven and should use an approved reusable category, not an automatic continuous character loop.

**Audio architecture:** Wren maps each actual action and scene to reusable clothing/equipment sound modules; adds accurate source position, materials, local geometry/reflections, caption/Braille/haptic equivalents, licensing and test status. No scene action is introduced by these examples. Distinctive character recognition comes from an approved *combination* of ordinary layers, not exclusive ownership of generic sounds.

## Reuse and future-level policy
- Core garments, fasteners, fabrics, tools and animations are reusable profiles and components that can be parameterised for new characters and games.
- Character-specific choices (palette, proportions, wear, location of personal gear, combinations) remain separate configuration layers.
- Future levels refer to this profile rather than rebuilding the garment; extend variants without overwriting Gate One. Actual script event bindings belong to each level.
- Do not add unlicensed files. Any imported model, texture, SFX, animation or source is tracked ONCE in `assets/REGISTRY.json` and its licensing evidence; these notes are not an alternate registry.
- The corresponding Resonance project copy and future-use copy intentionally preserve the same description. Reconcile both on approved changes, cite Git history, and report status honestly.

## Open decisions for Nexus
Confirm colour, model and details of chair/battery mechanisms, harness, wear patterns and actual Gate One actions. Never invent battery ejection into Gate One.

## Production status
Written **visual concept + audio handoff only**. No claim of final mesh, textured outfit, animation rig, recorded Foley, or verified in-game trigger. Canon lock and production completion are separate.
