# Franchise Asset Bible

This design note defines every asset category in Resonance and the standards every asset receives before it is allowed into the franchise. It exists so that anything built for one game can be recognised, reused, localised, and heard consistently across every future game, and so that no asset ever ships without the accessibility metadata the universe depends on.

## The standard every asset receives

Every asset in Resonance, regardless of category, is created against the same eight standards. An asset is not finished, and may not enter the repository, until each of these standards is satisfied. The categories later in this document describe how each standard is applied in practice, but the standard itself never changes.

### Naming standards

Names are how an asset is found, cited, and reused, so naming is treated as design rather than housekeeping.

- Use descriptive, human-readable names that state what the asset is, never an opaque code alone.
- Follow a consistent order of category, subject, variant, and state, so related assets sort together.
- Reserve proper nouns for canon (Shawabti, Faience, CSV Hearth, the Vale System) and spell them exactly as canon requires.
- Never encode a mystery's answer in a name; an asset that touches a deliberate mystery is named for what the player can currently observe, not for what is hidden.
- British spelling is used in every human-readable name and description (colour, armour, fibre, catalogue, localisation).

### File organisation

Assets live in a predictable structure so that any contributor can find and extend them without guessing.

- Group assets by category first, then by subject, so a whole subject can be located, versioned, and reused together.
- Keep source files and exported files distinct, consistent with the repository convention that generated outputs belong under the artefacts folder.
- Store an asset's metadata, audio references, and accessibility descriptions alongside the asset rather than in a separate index that can drift.
- Maintain one living version of each asset; rely on repository history rather than duplicated versioned copies, as the Project Constitution requires.

### Level-of-detail rules

Level-of-detail (LOD) rules describe how an asset simplifies with distance or reduced hardware without losing the information a player needs.

- Visual LOD may reduce geometry and texture cost, but must never remove a cue that carries gameplay meaning.
- Acoustic identity is never an LOD casualty; an asset that is quieter at distance still remains recognisable by ear.
- Accessibility cues, captions, and haptic signatures are never reduced by LOD; information parity is preserved at every level.
- Each asset defines its lowest acceptable level so it remains understandable on the least capable supported device.

### Animation rules

Animation communicates identity, intent, and state, so it is authored deliberately rather than for spectacle.

- Motion must read as information, telling the player who or what is present, how it feels, and what it is doing.
- Every animated state has a non-visual equivalent through sound, caption, or haptics, so nothing depends on sight alone.
- Idle, active, transitional, warning, and failure states are defined so an asset is legible in every condition.
- Reduced-motion and stationary alternatives are authored alongside full motion, never bolted on afterwards.

### Audio references

Because audio is the primary renderer, every asset points to its place in the Audio Bible rather than inventing sound in isolation.

- Each asset references the relevant Audio Bible library (movement, vehicle, equipment, material, object, and the like) instead of restating it.
- The asset records its acoustic identity: how it is recognised, how it sounds idle, in use, and in failure.
- Silence is treated as a deliberate acoustic identity where appropriate, never as absent work.
- Assets touching the Shawabti or any culture the player has not yet met defer their acoustic identity to progressive revelation and do not fix it in advance.

### Accessibility metadata

Accessibility metadata is a first-class part of every asset and is never optional, deferred, or stripped to save space.

- Each asset carries a screen-reader description, a caption identity, a haptic signature where relevant, and a colour-independent recognition cue.
- Metadata is configured by experience rather than diagnosis, matching the language of the Accessibility Bible.
- No asset conveys required information through one sense alone; every important cue has at least one alternative channel.
- Accessibility equipment depicted by an asset is presented as ordinary standard equipment, never as special or as a reward.

### Localisation requirements

Every asset is built to be understood in any supported language and culture without being rebuilt.

- All player-facing text is externalised for translation rather than baked into the asset.
- Text length, reading direction, and caption timing allow for expansion in other languages.
- Culturally specific meaning is documented so translators and cultural reviewers can adapt it faithfully.
- Source authoring uses British spelling, and localisation treats each target language as a first-class variant rather than an afterthought.

### Future expansion rules

Assets are designed to outlive the game that first needs them, because the franchise reuses its world.

- Each asset is authored as a reusable component that a future game, chapter, or world can adopt without contradiction.
- Variants and states are extensible, so new conditions can be added without breaking existing uses.
- An asset never hard-codes a resolution to an open mystery, keeping later revelation possible.
- Deprecating an asset is a documented decision recorded in the Decision Log, never a silent deletion.

## Living beings and identities

The assets in this section represent people and other living things. They carry the heaviest identity and accessibility responsibilities, because the player recognises the world's inhabitants through observation rather than labels.

### Characters

A character asset is a complete person, never a demographic placeholder, consistent with the canon that every recurring character is a complete person.

- Naming uses the character's canonical name and never encodes private identity data; the Vale System's members are named individually while sharing one body asset.
- File organisation keeps a character's model, portrait, animation set, voice references, and accessibility descriptions together as one subject.
- LOD preserves the recognition cues (silhouette, gait, gesture) that let a player identify a character at distance.
- Animation carries speech rhythm, posture, and personal movement style so that fronting members of the Vale System read as distinct without announcement.
- Audio references point to the movement, clothing, and biological sound libraries for that character's recognisable identity.
- Accessibility metadata provides a screen-reader description, recognisable non-visual cues, and respects that disability shapes a character without defining them.
- Localisation covers the character's dialogue, name display, and any culturally specific presentation.
- Future expansion allows a character to grow, change presentation, and update pronouns naturally across chapters.

### Creatures

A creature asset represents a non-civilised living thing, from familiar fauna to lifeforms encountered on expeditions.

- Naming distinguishes a creature from a person and from a domesticated animal, and avoids naming anything the campaign has not yet revealed.
- File organisation groups a creature's forms, life stages, and behavioural states together.
- LOD keeps behavioural silhouette and movement legible at distance so a creature is identifiable before it is seen.
- Animation expresses behaviour and emotional state, with warning behaviour that is legible without sound.
- Audio references defer alien wildlife to progressive revelation while grounding familiar creatures in the animal sound library.
- Accessibility metadata describes the creature and its threat or safety state through more than one channel.
- Localisation documents any culturally specific naming or significance.
- Future expansion allows new creatures to reuse shared behavioural components.

### Species

A species asset defines a whole kind of being, its shared traits, and its cultural framework, and it is where the universe's deliberate mysteries are most carefully protected.

- Naming spells canonical species exactly, and the Shawabti are named as an ancient, mysterious people whose biology, language, and fate remain undisclosed.
- File organisation keeps a species' shared components, cultural references, and variation ranges together, referencing the Universe Bible as the owner of species canon.
- LOD preserves the traits by which a species is recognised.
- Animation defines shared movement and communication patterns while leaving room for individual variation.
- Audio references defer any unmet culture's acoustic identity to progressive revelation.
- Accessibility metadata ensures a species is understandable without sight or sound, including how its members communicate.
- Localisation records culturally specific meaning for respectful translation.
- Future expansion never resolves a species mystery in advance; revelation is recorded where the campaign reveals it.

### Animals

An animal asset represents companion, working, and agricultural animals that share daily life with the community.

- Naming separates ordinary animals from creatures and from the specialised service and guide animal categories.
- File organisation groups an animal's states, ages, and behaviours together.
- LOD keeps recognisable movement and behaviour legible at distance.
- Animation conveys daily behaviour, emotion, and warning without depending on sight.
- Audio references draw on the animal sound library for recognition cues.
- Accessibility metadata describes the animal and its state through multiple channels.
- Localisation documents any regional naming or cultural role.
- Future expansion lets new animals reuse shared behavioural components.

### Service animals

A service animal asset represents a working animal that performs disability-related tasks, and it is treated as ordinary standard equipment for its handler.

- Naming identifies the animal's working role without treating it as a novelty.
- File organisation keeps working states, rest states, and handler-interaction states together.
- LOD preserves the cues that identify a working animal on duty.
- Animation distinguishes working behaviour from off-duty behaviour clearly and respectfully.
- Audio references use the animal and movement libraries, including the handler relationship.
- Accessibility metadata presents the service animal as normal, capable assistance rather than as inspiration or spectacle.
- Localisation documents culturally specific handling conventions.
- Future expansion supports new task sets as accessibility technology in the world grows.

### Guide animals

A guide animal asset represents an animal trained for navigation assistance, closely related to service animals but specific to orientation and travel.

- Naming makes the guiding role explicit and distinct from a general service animal.
- File organisation groups navigation behaviours, harness states, and travel states together.
- LOD keeps guiding posture and movement legible at distance.
- Animation depicts guiding, halting, and hazard-avoidance behaviours that read without sound.
- Audio references use the movement and animal libraries for recognisable travel cues.
- Accessibility metadata treats guided travel as an ordinary, dignified mode of movement, consistent with the Accessibility Bible's supported movement methods.
- Localisation documents regional travel and handling conventions.
- Future expansion allows new environments and terrains to reuse the guiding behaviour set.

## Craft and transport

The assets in this section move people and cargo through the world. Each has an acoustic identity a player can recognise before it comes into view, and each returns the player home, consistent with the canon that every expedition begins and ends at home.

### Vehicles

A vehicle asset represents surface, station, and short-range transport, from maintenance carts to mobility devices used as vehicles.

- Naming states the vehicle type and its role, distinguishing crewed vehicles from personal mobility devices.
- File organisation groups a vehicle's states, doors, and accessibility features together.
- LOD preserves the profile and motion by which a vehicle is recognised at distance.
- Animation covers startup, motion, doors, and failure, each legible without sound.
- Audio references point to the vehicle sound library for idle, acceleration, and accessibility announcements.
- Accessibility metadata includes boarding, passenger alerts, and announcements as standard, never optional, features.
- Localisation covers passenger and accessibility announcements.
- Future expansion allows new routes and variants to reuse the base vehicle.

### Ships

A ship asset represents a spacecraft class, from shuttles to capital ships, and includes the Hearth-class to which CSV Hearth belongs.

- Naming uses the ship class and vessel name exactly, respecting that Hearth is the accepted shorthand for CSV Hearth.
- File organisation groups a ship's systems, ambiences, and states together, referencing the Modular Architecture Bible for how interiors are assembled.
- LOD keeps the class recognisable in silhouette and in sound at distance.
- Animation covers launch, docking, power states, and hull damage legibly.
- Audio references point to the spacecraft sound library for each class and system state.
- Accessibility metadata ensures a ship's status and interior are navigable without sight.
- Localisation covers onboard announcements and signage.
- Future expansion allows new ship classes to reuse shared systems and ambiences.

### Escape pods

An escape pod asset represents emergency evacuation craft, central to Operation One and to the franchise's rhythm of rescue.

- Naming marks the pod as emergency equipment and distinguishes it from crewed shuttles.
- File organisation keeps launch, transit, and recovery states together with occupancy states.
- LOD preserves recognisable emergency signalling at distance.
- Animation depicts sealing, separation, and recovery clearly and without panic-as-spectacle.
- Audio references use the spacecraft and vehicle libraries for launch and recovery.
- Accessibility metadata ensures occupancy, status, and instructions are conveyed through multiple channels for occupants who cannot see or hear.
- Localisation covers emergency instructions and alerts.
- Future expansion supports new pod variants for future vessels and settlements.

## Places and structures

The assets in this section are the persistent locations that host the game. They continue living whether or not a player is present, and each carries its own acoustic identity and history.

### Stations

A station asset represents an orbital or fixed habitat and community, such as the community that grows aboard the Hearth.

- Naming identifies the station and its community distinctly from the ships that dock there.
- File organisation groups a station's modules, districts, and progression states together.
- LOD preserves the acoustic and structural cues by which districts are recognised.
- Animation covers construction progress and the audible growth of the community over time.
- Audio references point to the environmental sound progression and cultural sound identity libraries.
- Accessibility metadata ensures every district is navigable without sight and legible without hearing.
- Localisation covers station signage, announcements, and community naming.
- Future expansion lets a station grow new districts by reusing modular components.

### Worlds

A world asset represents a planet, moon, or shared persistent world with its own history and community.

- Naming distinguishes a world from the settlements upon it, and never names an unrevealed world's secrets.
- File organisation groups a world's biomes, weather, and persistent history together.
- LOD keeps distant terrain recognisable while preserving navigation cues.
- Animation covers weather, day cycles, and seasonal change legibly across senses.
- Audio references use the environmental and material libraries, deferring alien-world identity to progressive revelation.
- Accessibility metadata ensures terrain and hazards are conveyed through more than one channel.
- Localisation documents place names and cultural meaning.
- Future expansion supports each persistent world accumulating its own history, consistent with canon.

### Cities

A city asset represents a dense settlement and its civic life.

- Naming identifies the city and separates it from its districts and buildings.
- File organisation groups districts, civic spaces, and traffic states together.
- LOD preserves the acoustic identity of a district heard from afar.
- Animation covers civic activity, crowds, and daily rhythm that read without sight.
- Audio references use the cultural sound identity and environmental libraries.
- Accessibility metadata ensures the city is navigable and legible without any single sense.
- Localisation covers civic signage, announcements, and cultural presentation.
- Future expansion allows districts to be added by reusing building and room modules.

### Buildings

A building asset represents an individual structure within a settlement.

- Naming states the building's function and location.
- File organisation groups a building's rooms, entrances, and states together, referencing the Modular Architecture Bible.
- LOD preserves recognisable structure and entry cues at distance.
- Animation covers doors, lighting, and occupancy legibly.
- Audio references use the object and environmental libraries for the building's identity.
- Accessibility metadata ensures entrances, exits, and interior routes are navigable without sight.
- Localisation covers signage and posted information.
- Future expansion lets a building be reconfigured from shared room modules.

### Rooms

A room asset is the smallest reusable spatial module and the building block of the franchise's interiors.

- Naming states the room's function so it can be reused across buildings and ships.
- File organisation keeps a room's furniture slots, states, and acoustic profile together, as the Modular Architecture Bible describes.
- LOD preserves the room's navigation and acoustic cues at every level.
- Animation covers occupancy, lighting, and equipment states legibly across senses.
- Audio references define the room's acoustic identity by reference to the relevant libraries.
- Accessibility metadata ensures the room is navigable by cane, by ear, and by screen reader.
- Localisation covers any posted text within the room.
- Future expansion lets rooms recombine into new buildings, ships, and stations.

## Objects and equipment

The assets in this section are the tools and furnishings people use. Each provides meaningful acoustic feedback so the player can confirm an action by ear, and each is introduced by a person before it becomes a player ability.

### Furniture

A furniture asset represents the everyday objects that make a space livable.

- Naming states the furniture type and its variant.
- File organisation groups a piece's states and material variants together.
- LOD preserves the shape and interaction cues that identify furniture by touch and sound.
- Animation covers use, adjustment, and rest states legibly.
- Audio references use the object and material libraries for interaction feedback.
- Accessibility metadata describes the furniture and its affordances for non-visual use.
- Localisation covers any labelled controls.
- Future expansion lets furniture be reused across homes, wards, and workspaces.

### Medical equipment

A medical equipment asset supports care, recovery, and examination, and it belongs to a discipline where information parity can be life-critical.

- Naming states the equipment's clinical function clearly.
- File organisation groups states, readouts, and alarms together.
- LOD preserves the recognisable identity of active medical devices.
- Animation covers examination, treatment, and alarm states legibly without sound.
- Audio references use the equipment and biological sound libraries.
- Accessibility metadata ensures every reading and alarm is available through caption, speech, and haptics, never sound alone.
- Localisation covers clinical labels and spoken guidance.
- Future expansion supports new diagnostics reusing shared readout components.

### Engineering equipment

An engineering equipment asset supports power, propulsion, and structural systems.

- Naming states the system the equipment serves.
- File organisation groups operating states, load states, and failure states together.
- LOD keeps recognisable operation legible at distance.
- Animation covers routing, load, and failure states that read without sight.
- Audio references use the equipment and material libraries, including hull and reactor cues.
- Accessibility metadata conveys load and hazard through more than one channel.
- Localisation covers control labels and diagnostics.
- Future expansion supports new systems reusing shared engineering components.

### Maintenance tools

A maintenance tool asset supports inspection and repair, the profession developed first in the franchise.

- Naming states the tool's task plainly.
- File organisation groups activation, use, and completion states together.
- LOD preserves recognisable use cues.
- Animation covers draw, use, and completion legibly.
- Audio references use the equipment and object libraries, including vents, panels, and ducts.
- Accessibility metadata ensures results and warnings are conveyed without sound alone.
- Localisation covers tool labels and prompts.
- Future expansion lets new tools reuse shared interaction patterns.

### Security tools

A security tool asset supports investigation and the protection of the community, emphasising responsibility rather than force.

- Naming states the protective or investigative function.
- File organisation groups ready, active, and stand-down states together.
- LOD preserves recognisable status at distance.
- Animation covers ready, use, and stand-down legibly and without glorification.
- Audio references use the equipment library with purposeful rather than exciting cues.
- Accessibility metadata conveys status and alerts across multiple channels.
- Localisation covers labels and spoken alerts.
- Future expansion supports new protective tools reusing shared components.

### Research tools

A research tool asset supports scanning, analysis, and discovery, where knowledge must always change something.

- Naming states what the tool investigates.
- File organisation groups scan, analyse, and record states together.
- LOD preserves recognisable operation cues.
- Animation covers scanning and analysis legibly across senses.
- Audio references use the equipment library for activation and completion.
- Accessibility metadata ensures findings are delivered through caption, speech, and haptics.
- Localisation covers readouts and recorded findings.
- Future expansion supports new instruments reusing shared analysis components.

### Weapons

A weapon asset is an emergency tool, and it is authored for responsibility over spectacle, consistent with the franchise's tone.

- Naming frames the item as rescue, defence, or industrial equipment rather than as a trophy.
- File organisation groups draw, ready, safety, discharge, and failure states together.
- LOD preserves recognisable purposeful cues without dramatising them.
- Animation is restrained and purposeful, with failure and cooling states that read without sound.
- Audio references use the weapon sound library, which emphasises purpose over excitement.
- Accessibility metadata conveys state and safety through more than one channel.
- Localisation covers safety labels and warnings.
- Future expansion supports new emergency tools that maintain the responsible tone.

## Worn and grown things

The assets in this section are worn on the body or grown in the world. Clothing supports recognition, and living things such as plants make the world's growth audible and visible over time.

### Clothing

A clothing asset supports recognition and comfort in daily life.

- Naming states the garment type and its wearer context.
- File organisation groups garment states, sizes, and material variants together.
- LOD preserves the recognisable clothing sounds and silhouettes that identify a person.
- Animation covers movement and adjustment legibly.
- Audio references use the clothing sound library for recognition cues.
- Accessibility metadata describes garments and any attached mobility equipment for non-visual recognition.
- Localisation covers culturally specific dress with respect and accuracy.
- Future expansion lets garments be reused and restyled across chapters.

### Uniforms

A uniform asset conveys role, department, and rank, and it carries recognition responsibilities for command and crew.

- Naming states the department and rank the uniform conveys.
- File organisation groups department variants, rank insignia, and name-tape states together.
- LOD preserves insignia and silhouette recognition at distance.
- Animation covers movement and the automatic update of a name tape when a Vale System member fronts, treated as ordinary ship operation.
- Audio references use the clothing library, including identification badges.
- Accessibility metadata ensures rank, department, and current name are available without sight, tying to the smart name tape and digital identity badge.
- Localisation covers rank titles and departmental naming.
- Future expansion supports new departments and ranks reusing shared insignia components.

### Food

A food asset supports meals, hospitality, and community life, where food distribution is part of the world continuing around the player.

- Naming states the dish or ingredient and its cultural origin where relevant.
- File organisation groups preparation, serving, and storage states together.
- LOD preserves recognisable serving cues.
- Animation covers preparation and serving legibly.
- Audio references use the object and kitchen equipment libraries.
- Accessibility metadata describes food for non-visual recognition and dietary clarity.
- Localisation covers culturally specific cuisine with accuracy and respect.
- Future expansion supports new dishes reusing shared preparation components.

### Plants

A plant asset supports gardens, hydroponics, and the audible maturing of growing spaces.

- Naming states the plant type and its growth context.
- File organisation groups growth stages and seasonal states together.
- LOD preserves recognisable growth cues at distance.
- Animation covers growth, harvest, and seasonal change legibly.
- Audio references use the environmental sound progression library, so gardens can be heard maturing.
- Accessibility metadata conveys growth stage and readiness for harvest without relying on sight.
- Localisation covers regional plant naming.
- Future expansion supports new species reusing shared growth stages.

### Trees

A tree asset supports larger flora, landmarks, and the long, slow evidence of a settlement's age.

- Naming states the tree type and its landmark role where relevant.
- File organisation groups growth stages, seasonal states, and landmark variants together.
- LOD preserves recognisable canopy and trunk cues at distance for navigation.
- Animation covers seasonal change and weather response legibly.
- Audio references use the environmental and material libraries.
- Accessibility metadata treats trees as navigation landmarks legible by cane and by ear.
- Localisation covers regional naming and cultural meaning.
- Future expansion supports new species reusing shared growth stages.

## Synthetic beings and effects

The assets in this section are constructed or intangible: artificial beings, projected images, and the visual and material effects that dress the world. Artificial intelligence in particular is a character, never a menu.

### Robots

A robot asset represents physical automation, from service robots to construction machinery.

- Naming states the robot's role and distinguishes it from artificial-intelligence characters.
- File organisation groups task states, movement states, and failure states together.
- LOD preserves recognisable form and behaviour at distance.
- Animation covers task, movement, and failure legibly across senses.
- Audio references use the equipment, vehicle, and movement libraries.
- Accessibility metadata conveys a robot's state and intent through more than one channel.
- Localisation covers any spoken prompts.
- Future expansion supports new robot roles reusing shared behavioural components.

### AI

An AI asset represents an artificial-intelligence character, above all Faience, who is a character and a companion rather than an interface.

- Naming capitalises Faience and never conflates the character with the lowercase ceramic material she is named for.
- File organisation groups voice references, communication states, and presentation states together, referencing the AI Bible as the owner of Faience's canon.
- LOD preserves Faience's recognisable presence and communication regardless of device.
- Animation, where Faience has a visible presence, conveys attention and intent legibly, with non-visual equivalents.
- Audio references use the relevant libraries while never fixing anything that touches Faience's deliberate mysteries.
- Accessibility metadata ensures Faience communicates through speech, captions, and braille as the player prefers, configured by experience.
- Localisation treats Faience's dialogue as first-class translated content.
- Future expansion never resolves an AI mystery in advance; revelation stays with the campaign.

### Holograms

A hologram asset represents projected imagery used for communication, guidance, and display.

- Naming states the hologram's function and source.
- File organisation groups projection states and content variants together.
- LOD preserves recognisable projection cues at distance.
- Animation covers appearance, update, and dismissal legibly.
- Audio references pair the projection with an audible identity so it is never sight-only.
- Accessibility metadata guarantees any holographic information also exists as speech, caption, or haptics.
- Localisation covers all projected text and speech.
- Future expansion supports new holographic content reusing shared projection components.

### Particles

A particle asset represents effects such as smoke, sparks, dust, and atmosphere.

- Naming states the effect and the event it accompanies.
- File organisation groups intensity states and variants together.
- LOD may reduce particle density but never removes a cue that carries meaning.
- Animation ties particle behaviour to legible events with non-visual equivalents.
- Audio references pair each meaningful effect with a sound identity so hazards are never silent.
- Accessibility metadata ensures any hazard implied by particles is also captioned or haptic.
- Localisation is generally not required, though any embedded text is externalised.
- Future expansion supports new effects reusing shared particle components.

### Lighting

A lighting asset shapes mood and legibility, and it is authored so that no information depends on light alone.

- Naming states the lighting purpose and its state.
- File organisation groups mood states, alarm states, and time-of-day variants together.
- LOD preserves the cues that lighting contributes to navigation and recognition.
- Animation covers transitions, alarms, and day cycles legibly.
- Audio references pair critical lighting changes, such as alarms, with sound and haptics.
- Accessibility metadata guarantees any meaning carried by light is also carried by sound, caption, or haptics, and supports high-contrast and colour-independent needs.
- Localisation is generally not required beyond any embedded text.
- Future expansion supports new lighting states reusing shared components.

### Materials

A material asset defines how a surface looks, sounds, and responds to interaction.

- Naming states the material clearly, using British spelling such as fibre and aluminium, and spelling canonical materials such as Shawabti materials exactly.
- File organisation groups a material's surface, interaction, and wear states together.
- LOD preserves the acoustic and tactile identity that distinguishes one material from another.
- Animation covers wear and interaction response legibly.
- Audio references use the material library so the same action reads differently on steel than on fabric.
- Accessibility metadata records the non-visual recognition cues a material provides.
- Localisation is generally not required beyond documentation.
- Future expansion defers alien and Shawabti materials to progressive revelation.

## Interface and presentation assets

The assets in this section present the game to the player. They must expose correct semantics to assistive technology, and accessibility assets among them are first-class, never optional.

### UI assets

A UI asset represents interface elements the player reads and operates.

- Naming states the element's role and state.
- File organisation groups states, variants, and text references together.
- LOD keeps interface elements legible at every supported resolution.
- Animation covers focus, activation, and state change legibly, with reduced-motion alternatives.
- Audio references pair meaningful interface events with sound where helpful.
- Accessibility metadata exposes correct semantics, focus order, and announcements to assistive technology, as the Code Standards require.
- Localisation externalises all interface text and allows for expansion.
- Future expansion supports new interface elements reusing shared semantic components.

### Audio assets

An audio asset is a sound built directly against the Audio Bible, the definitive reference for every sound in the franchise.

- Naming states the sound's subject, state, and library.
- File organisation groups a sound's variants and states together and cites its Audio Bible library.
- LOD preserves recognisability even when a sound is quieter or simplified at distance.
- Animation is coupled to the events an audio asset accompanies so sound and event stay synchronised.
- Audio references are the asset itself, and each sound carries a defined purpose rather than decoration.
- Accessibility metadata defines the caption identity and, where relevant, the haptic equivalent, so no sound is information-only.
- Localisation covers spoken content and captions.
- Future expansion supports new sounds reusing shared library conventions.

### Animations

An animation asset is a reusable motion clip or set shared across subjects.

- Naming states the motion, the subject type, and the state.
- File organisation groups related clips and their transitions together.
- LOD may simplify motion but never removes a state that carries meaning.
- Animation authoring provides reduced-motion and stationary alternatives as standard.
- Audio references synchronise motion with its sound identity.
- Accessibility metadata ensures each animated state has a non-visual equivalent.
- Localisation is generally not required beyond any embedded text.
- Future expansion supports new subjects reusing shared motion sets.

### Portraits

A portrait asset represents a character's likeness and, in gameplay, their sense of belonging, since a portrait illuminates only once a crew member is truly home.

- Naming uses the character's canonical name and portrait state.
- File organisation groups a character's portrait states, including the unlit and illuminated states, together.
- LOD keeps a portrait recognisable at every display size.
- Animation covers the transition to an illuminated portrait as an earned, legible moment.
- Audio references pair portrait changes with the community's audible growth.
- Accessibility metadata provides a screen-reader description and a non-visual signal of belonging, so portraits are never sight-only progression.
- Localisation covers any accompanying name or caption text.
- Future expansion supports new characters reusing the shared portrait framework.

### Icons

An icon asset is a compact symbol used for recognition in the interface.

- Naming states the concept the icon represents and its state.
- File organisation groups icon states and size variants together.
- LOD keeps an icon legible at its smallest supported size.
- Animation, where present, is subtle and offers a reduced-motion alternative.
- Audio references pair critical iconography with sound cues where appropriate.
- Accessibility metadata pairs every icon with a text label and never relies on colour or shape alone.
- Localisation externalises the icon's label text.
- Future expansion supports new icons reusing shared symbol conventions.

### Accessibility assets

An accessibility asset delivers a non-visual or non-auditory channel, and it is treated as first-class equipment that other assets depend on, never as an optional extra.

- Naming states the channel the asset serves, such as caption, braille, or haptic pattern.
- File organisation keeps accessibility assets alongside the assets they support so they never drift apart.
- LOD never reduces an accessibility asset; information parity is preserved at every level and on every device.
- Animation, where relevant, provides tactile or visual patterns that carry authored meaning, consistent with the tactile language.
- Audio references connect spoken and captioned channels to the Audio Bible without duplicating it.
- Accessibility metadata is intrinsic here: these assets are the metadata other assets rely on, configured by experience rather than diagnosis.
- Localisation treats captions, spoken output, and braille as first-class translated content.
- Future expansion allows new channels to be added as accessibility technology in the world grows, without ever making an existing channel optional.

## Relationship to other documents

This design note applies the governing standards of the franchise to every asset category. It defers to the documents that own each topic rather than restating or overriding them.

- The Project Constitution is the governing authority over this document and every asset standard within it.
- The Canon Rules document holds the master list of rules these standards uphold, including that weapons are emergency tools and that accessibility is standard equipment.
- The Code Standards document defines the engineering, repository, and semantic requirements that asset naming, file organisation, and interface metadata follow.
- The Audio Bible is the definitive reference every audio reference in this document points to, and it owns each sound library named here.
- The Accessibility Bible defines the tactile language, captions, braille, and other non-auditory paths that every accessibility metadata requirement here depends on.
- The Player Identity and Character Presentation Bible defines the recognition cues, portraits, uniforms, and identification technology that character, uniform, and portrait assets rely on.
- The Universe Bible is the definitive reference for the species, civilisations, materials, and identification technology whose assets are catalogued here, and it records the deliberate mysteries that asset naming and audio references must never resolve.
- The Decision Log records when these asset standards were adopted or amended and when any asset is deprecated.
