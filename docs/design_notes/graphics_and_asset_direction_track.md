# Graphics and Asset Direction Track

This document defines the production constraints for every visual asset in Resonance: Fractured Frequency. It covers meshes, materials, rigs, user interface visuals, portraits, accessibility metadata, performance targets, localisation requirements, and asset review criteria. It does not redefine the asset categories, metadata schema, or file organisation standards that the Franchise Asset Bible owns, and it does not redefine the character visual standards that the Player Identity and Character Presentation Bible owns. Where those documents govern, this one refers to them.

Every asset must connect to gameplay, audio, accessibility, and narrative. An asset that is visually complete but has no acoustic identity, no accessibility metadata, and no narrative function has not passed production. This document defines what production completion means for each asset category.

## Mesh density and polygon targets

Polygon targets are defined per asset category and per platform tier. Three platform tiers are recognised.

Tier one is high-end mobile and desktop. This tier receives the full target polygon count and the full material channel set.

Tier two is mid-range mobile. This tier receives the reduced polygon count specified below and a reduced material channel set, with no reduction in accessibility metadata or navigational clarity.

Tier three is low-end mobile and web. This tier receives the minimum polygon count and the minimum material channel set that preserves the asset's recognisability and accessibility function. An asset that cannot be recognised at minimum polygon count has failed the recognisability requirement, not the polygon budget.

### Polygon targets by category

Characters: tier one — up to 25,000 polygons for primary cast, up to 15,000 for recurring secondary characters, up to 8,000 for background crew. Tier two: 60 percent of tier one. Tier three: 35 percent of tier one.

Room modules: tier one — up to 40,000 polygons per room module as defined in the Modular Architecture Bible. Tier two: 60 percent. Tier three: 35 percent.

Interactive objects: tier one — up to 3,000 polygons. Tier two: 1,500. Tier three: 800.

Vehicles and spacecraft: tier one — up to 50,000 polygons for primary spacecraft, up to 12,000 for vehicles. Tier two: 60 percent. Tier three: 40 percent.

Props and furniture: tier one — up to 1,500 polygons. Tier two: 800. Tier three: 400.

Accessibility devices and mobility equipment receive the same polygon budget as their category class. They are not reduced below the tier three target under any circumstance, because recognisability of accessibility equipment is a gameplay and safety requirement, not a visual preference.

## Level-of-detail specifications

Every asset except user interface elements must have level-of-detail variants. The number of variants and the transition distances are defined per category.

Characters require three level-of-detail variants. The transition from level zero to level one occurs at eight metres. The transition from level one to level two occurs at twenty metres. Each transition is a cross-fade rather than a pop, lasting 0.3 seconds. At level two, the character must still satisfy the recognition requirements in the Player Identity and Character Presentation Bible: silhouette, movement pattern, and acoustic identity remain correct at level two even if surface detail is reduced.

Room modules require two level-of-detail variants. The transition occurs at fifteen metres and is a cross-fade lasting 0.5 seconds. At level one, structural wayfinding cues — doors, panels, workstation positions — must remain readable.

Interactive objects require two level-of-detail variants. The transition occurs at five metres. At level one, the object's interactive affordance — the visual signal that it can be interacted with — must remain present. Accessibility metadata is not level-of-detail dependent: it is attached to the object's interaction component, not to its mesh.

Spacecraft and vehicle exteriors require three level-of-detail variants with transitions at thirty, eighty, and two hundred metres.

## Rig standards

Every character asset that is animated requires a rig that satisfies the following minimum standard before it enters production.

The rig includes a full body hierarchy, a full facial blend shape set for expressions and speech, and the mobility device attachment points defined for that character in the Player Identity and Character Presentation Bible. Characters who use wheelchairs, prosthetics, white canes, or other mobility equipment have rig components that correctly interface with those devices' rigs.

Sign language animation requires a hand and wrist rig with 23 bones minimum per hand, and a facial rig capable of the mouth shapes that accompany signed communication. Sign language animation is reviewed by a Deaf consultant before it enters production, as defined in the Production Pipeline Bible's representation review gate.

Secondary characters who appear only in the background require a reduced rig sufficient for the animation set their role requires. They do not require a facial blend shape set unless they speak directly to the player.

All rigs are exported with the animation set they are intended to drive. A rig without a corresponding animation brief does not proceed to rigging.

## Material channel requirements

### Minimum channel set for tier one

Every mesh asset requires the following material channels at tier one: base colour, roughness, metallic, normal, and emissive. The emissive channel is used only where the design brief specifies a self-illuminating surface and is never used to carry critical information that is not also carried by another channel.

Characters require an additional subsurface scattering map for skin surfaces and a detail normal for fabric and worn surfaces at tier one.

### Reduced channel set for tier two and tier three

Tier two assets use base colour, a combined roughness-metallic channel, and normal. Tier three assets use base colour and a simplified normal baked from the tier one asset.

All tiers retain correct handling of the emissive channel where the design brief requires it.

### No colour-only information

No material channel may carry information that is communicated by colour alone. Any colour-coded material state — damage, contamination, Shawabti site condition — pairs its colour with a surface change, a texture pattern, or an overlay that is distinguishable without colour vision. The visual direction track governs the colour philosophy; this section governs the material implementation of it.

## User interface visual style

User interface assets in Resonance are functional, legible, and consistent across the franchise. They carry no information through colour alone. They are designed at the minimum platform text size and checked at that size before passing to implementation.

Every interactive element has a default state, a focused state, a selected state, a disabled state, and an error state. Each state is visually distinguishable from every other state through at least two signals: colour change and shape or texture change. Focus states always include a visible focus indicator that satisfies the contrast requirements of the web content accessibility guidelines at its most current version.

Motion in the user interface is meaningful and dismissible. Every animated interface element can be set to static by the player in settings. The information the motion communicates is also communicated in the static state.

Interface text follows the typography standards in the Player Identity and Character Presentation Bible's Technical Standards section. Minimum body text size is 16 points at standard display density. Minimum label text size is 14 points. No interface text is smaller than 14 points.

Icons are accompanied by text labels. An icon that relies on cultural familiarity without a label fails the accessibility review gate.

## Portrait production standards

Portrait production follows the visual standards in the Player Identity and Character Presentation Bible Part X. This section adds the production pipeline requirements for delivering those standards.

Every portrait is rendered from the character's tier one mesh and rig with a production lighting rig. The lighting rig is consistent across all portraits of the same character to ensure that the same person is recognisable across different portrait contexts.

Portrait resolution is 512 by 512 pixels minimum for use within the game and 2048 by 2048 pixels for the master file. The master file is stored in the repository and used to generate all in-game sizes.

Every portrait has an alt-text description authored according to the alt-text standard below. The alt-text is stored alongside the portrait asset in the asset package.

## Accessibility metadata requirements

Every shipped asset carries the following metadata before it is integrated.

A short description of 120 characters or fewer states what the asset is, what it does in the context of the game, and any accessibility-relevant characteristics. This description is used by screen readers and braille displays when the player inspects or encounters the asset.

A navigation tag states whether the asset is a waypoint, an interactable, a hazard, a character, or background. This tag drives the spatial audio indicator system and the screen reader navigation hierarchy.

A category tag matches the asset's category as defined in the Franchise Asset Bible. This tag is used by the asset pipeline's review and retrieval systems.

An acoustic identity reference links the asset to the relevant entry in the Audio Bible or the asset's production audio package. Every asset with an acoustic identity has this reference populated before integration.

A localisation flag states whether the asset contains text, culturally specific imagery, or other content that requires localisation review. Assets with this flag set are not shipped until localisation review is complete.

## Alt-text and audio-description authoring

Alt-text is a plain-language description of what an image contains, written for a player who cannot see it. Audio description is a narrated description of visual content in a scene, delivered through the game's audio channel when the player's settings require it.

Alt-text for static assets follows the form: the asset's primary subject, its context in the game, and any information the visual carries that would otherwise be inaccessible. It does not begin with the words "image of" or "picture of." It does not describe the visual style unless the style carries meaning. Maximum length is 120 characters.

Audio description for scenes follows the Accessibility Bible's standards. This section adds the production requirement: every scene with significant visual content has an audio description script delivered alongside the scene's audio assets as part of the integration package. Audio description scripts are written by the narrative team and reviewed by the accessibility lead before delivery.

## Performance budgets

Performance budgets are defined per platform tier. Budgets apply to real-time rendering in a populated room module. Cutscenes and non-interactive sequences may exceed these budgets with the approval of the technical lead.

### Tier one: high-end mobile and desktop

Draw calls per frame: 300 maximum for opaque geometry, 100 maximum for transparent geometry. Texture memory: 1.5 gigabytes maximum for the active scene. Audio voices: 64 simultaneous. Haptic event frequency: 120 events per second maximum.

### Tier two: mid-range mobile

Draw calls per frame: 150 opaque, 50 transparent. Texture memory: 512 megabytes for the active scene. Audio voices: 32 simultaneous. Haptic event frequency: 60 events per second.

### Tier three: low-end mobile and web

Draw calls per frame: 80 opaque, 20 transparent. Texture memory: 256 megabytes for the active scene. Audio voices: 16 simultaneous. Haptic event frequency: 30 events per second.

Assets that cause the active scene to exceed its tier's budget on any metric must be optimised before integration. Optimisation results are recorded in the session log for that asset.

## Localisation requirements

Assets that contain text in any form — interface labels, signage within environments, documents within the game world — must deliver a localisation-ready version alongside the default language version. The localisation-ready version separates all text content from the asset geometry so that text can be translated and reinserted without rebuilding the asset.

Assets that contain culturally specific imagery — flags, symbols, religious or philosophical markers, iconography with real-world cultural meaning — are flagged for cultural review before any localised version is produced. The review follows the Production Pipeline Bible's representation review gate.

Assets that are entirely non-textual and non-culturally specific do not require localisation review. Their metadata, including alt-text, is translated as part of the text localisation pass, not the asset localisation pass.

## Asset review gate criteria

An asset passes the production review gate when all of the following are confirmed.

- The mesh satisfies the polygon target for its tier and category.
- All required level-of-detail variants exist and transition correctly.
- The rig, if required, satisfies the minimum rig standard for the character category.
- All required material channels are present and correctly authored.
- No information is carried by colour alone.
- All accessibility metadata fields are populated.
- Alt-text has been authored and reviewed.
- An acoustic identity reference has been populated.
- Performance has been tested against the tier target in a populated scene.
- Localisation flags have been set correctly and any required localisation review has been completed.
- Representation review has been completed for any asset involving characters, cultural content, or accessibility devices.

Assets that fail any criterion are returned to the stage that produced the failure. Failure reasons are recorded in the asset's session log.

## Relationship to other documents

This document defines production constraints for visual assets. It does not define visual content.

- The Franchise Asset Bible is the source of truth for asset categories, metadata schema, file organisation, and the level-of-detail rule that this document adds constraints to. Read it before reading this document.
- The Player Identity and Character Presentation Bible defines the visual standards, recognition requirements, portrait standards, and naming conventions for every character asset. Character asset production begins there, not here.
- The Modular Architecture Bible defines the spatial layout, function, and design intent of every room module. Environment asset production begins there, not here.
- The visual direction track defines the visual ambition, colour philosophy, lighting philosophy, material language, and non-visual equivalence requirement that the assets produced against this document must satisfy.
- The Accessibility Bible defines the accessibility metadata, alt-text standards, audio-description standards, and screen reader requirements that every asset's metadata must satisfy.
- The Audio Bible is the source of truth for the acoustic identity reference that every asset's metadata must include.
- The Production Pipeline Bible defines the review gates this document's asset review criteria feed into.
