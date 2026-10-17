# Nia Viaraxen — Visual wardrobe and audio-behaviour handoff

**Status:** CREATOR REVIEW — all outfit choices below are PROPOSED visual designs, not locked wardrobe canon and not proof of built/approved/licensed media.
**Master canon:** `docs/design_notes/first_fracture_episode_one_locked_rules.md`.
**Profile storage:** docs/design_notes/character_wardrobe/nia-viaraxen.md. 
**Other copy:** `docs/future_game_use/characters/nia-viaraxen.md`.
**Owners:** Kit — visual concepts, meshes, rigs, animation, clothing material/fastener decisions. Wren — recorded sound design, real 3D positioning, integration, access equivalents and validation.

## Canon constraints
Lieutenant, Medical, Aster Vale Station. Deaf; they/them; integrated signing, visual, textual and haptic communication. Warm with patients and dry with colleagues.

## Proposed individual wardrobe composition
**Silhouette:** Tailored medical-duty tunic with full freedom at shoulders and wrists, a short clean front, washable layered sleeves and conspicuous readable medical identification.

**Visual objects and animation:** Textured cuff, accessible quick-open medical pouch, optional paired behind-ear hearing/communication patches with touch response and visible indicator. Patch design is a Nexus proposal, not final hardware.

This visual language may be reused in later Resonance levels, but specific clothing is not canon until the Nexus approves it. Treat each garment as configurable, not a one-off model.

## Clothing material/action sound notes — HANDOFF, NOT AUDIO ASSETS

1. **medical duty layer**. Material: soft durable washable cloth. Mechanism: magnetic or low-force closure. Audible behaviour: cuff rub when reaching; front fastener at actual close/open. The event is action-driven and should use an approved reusable category, not an automatic continuous character loop.

2. **medical pouch**. Material: cleanable textile and structured pocket. Mechanism: tactile tab. Audible behaviour: tab and pouch movement at actual retrieval. The event is action-driven and should use an approved reusable category, not an automatic continuous character loop.

3. **behind-ear interface (open visual concept)**. Material: flexible skin-contact patch. Mechanism: tap control proposed. Audible behaviour: physical finger contact only when tapped; any feedback handled by Wren. The event is action-driven and should use an approved reusable category, not an automatic continuous character loop.

**Audio architecture:** Wren maps each actual action and scene to reusable clothing/equipment sound modules; adds accurate source position, materials, local geometry/reflections, caption/Braille/haptic equivalents, licensing and test status. No scene action is introduced by these examples. Distinctive character recognition comes from an approved *combination* of ordinary layers, not exclusive ownership of generic sounds.

## Reuse and future-level policy
- Core garments, fasteners, fabrics, tools and animations are reusable profiles and components that can be parameterised for new characters and games.
- Character-specific choices (palette, proportions, wear, location of personal gear, combinations) remain separate configuration layers.
- Future levels refer to this profile rather than rebuilding the garment; extend variants without overwriting Gate One. Actual script event bindings belong to each level.
- Do not add unlicensed files. Any imported model, texture, SFX, animation or source is tracked ONCE in `assets/REGISTRY.json` and its licensing evidence; these notes are not an alternate registry.
- The corresponding Resonance project copy and future-use copy intentionally preserve the same description. Reconcile both on approved changes, cite Git history, and report status honestly.

## Open decisions for Nexus
Confirm palette, fabric, closure, presence/operation of patches, and precise sign-language performance with an appropriate reviewer.

## Production status
Written **visual concept + audio handoff only**. No claim of final mesh, textured outfit, animation rig, recorded Foley, or verified in-game trigger. Canon lock and production completion are separate.
