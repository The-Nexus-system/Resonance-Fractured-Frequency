# Player Interaction Bible

This document defines every possible player interaction in Resonance, so that any contributor can build a new verb without guessing how it should look, sound, fail, or grow. It is a canonical design note: every interaction listed here is a promise the game keeps, and no interaction may exist without honouring the shared standard below.

## The interaction standard

Every interaction in Resonance is designed against the same eight facets before it is considered complete. An interaction that cannot describe all eight is not finished. The facets exist so that no verb ever depends on a single sense, and so that every verb reinforces community, accessibility, curiosity, adaptation, shared knowledge, and hope.

- Animation: the visible body movement, posture, and gesture that expresses the action, always authored so its meaning survives even when the player cannot see it.
- Audio: the acoustic identity of the action, since audio is gameplay and every sound teaches the player something about what is happening.
- Accessibility: how the interaction is made fully available regardless of sight, hearing, or mobility, treated as standard equipment rather than an optional extra.
- Failure states: what happens when the action does not succeed, remembering the canon that failure changes history rather than restarting it.
- Alternative methods: the genuinely equivalent ways to perform the same action through touch, switch, voice, haptic, braille, or AAC input, none of which is a lesser path.
- NPC reactions: how the residents of the world notice and respond, because people, not equipment, are the primary progression system.
- Story opportunities: how the interaction can carry narrative, memory, and progressive discovery without ever resolving a deliberate mystery.
- Gameplay progression: how repeated, thoughtful, or skilful use advances the player's capability, knowledge, relationships, or standing in the community.

Two pairs of verbs sit deliberately close together and are disambiguated where they appear. Inspect is a quick, mostly hands-off overview taken at a comfortable distance, while Examine is a slow, deliberate, close study of a single subject. Touch is a brief, confirming contact that answers "is it here and is it safe", while Feel is a sustained tactile exploration that reads texture, temperature, and shape over time.

## Perception and attention

These verbs govern how a player gathers information before acting. They are the foundation of an accessibility-first world, because understanding a space must never require sight.

### Inspect

Inspect is the player's quick situational read of an object, person, or area from a comfortable distance, giving an overview rather than fine detail.

- Animation: the character straightens, turns the head or torso toward the subject, and holds a brief attentive stance without reaching out.
- Audio: a soft, short focusing tone plays and the ambient mix briefly clarifies, surfacing the subject's acoustic identity above the background.
- Accessibility: the overview is delivered as speech, captions, braille, and a light haptic pulse together, so no single sense carries the summary alone.
- Failure states: an inspection at too great a distance returns an incomplete read that names what is unclear rather than inventing detail, prompting the player to move closer or examine.
- Alternative methods: inspection can be triggered by long press, an assigned switch, a voice command, or Faience on request, and the summary can be repeated instantly.
- NPC reactions: nearby residents may offer context if they notice the player studying something, and an expert may volunteer the detail their profession alone would notice.
- Story opportunities: an overview can plant a question that only a closer examination or another profession's perspective will answer later.
- Gameplay progression: frequent inspection sharpens the player's environmental awareness and unlocks faster, richer summaries as familiarity with a location grows.

### Examine

Examine is a slow, deliberate, close study of one subject, revealing the fine detail an inspection cannot, and it usually requires the player to be near and undistracted.

- Animation: the character crouches or leans in close, steadies the hands, and settles into a still, concentrated posture that reads as careful attention.
- Audio: layered detail sounds emerge, small mechanisms, material grain, and faint irregularities become audible, and the wider soundscape recedes.
- Accessibility: findings are narrated step by step with captions and refreshable braille, and shape or texture detail is offered through the authored tactile language.
- Failure states: an interrupted examination yields partial findings and remembers what was left unstudied, so the player can resume rather than begin again.
- Alternative methods: examination supports touch dwell, switch stepping through detail, voice-driven questioning, and haptic exploration of the subject's form.
- NPC reactions: specialists respect a careful examiner and may share a technique, while an impatient character might comment on the time it takes.
- Story opportunities: close study is where hidden journals, maker's marks, and small contradictions surface, feeding progressive mystery solving without ever giving the answer.
- Gameplay progression: skilled examination raises the player's investigative competence and gradually reveals detail tiers that a novice would overlook.

### Listen

Listen is the act of deliberately attending to the soundscape to locate sources, read emotion, and navigate, and it is a first-class verb because audio is the primary renderer of the world.

- Animation: the character stills, tilts the head slightly, and stops other motion to signal focused hearing.
- Audio: the mix widens and clarifies, spatialising sources so direction, distance, and movement become legible by ear.
- Accessibility: for players with no auditory input, deliberate listening is rendered as directional captions, a spatial haptic field, and visual source indicators that carry the same information.
- Failure states: listening in a masking environment returns uncertainty about a source rather than a false fix, and suggests moving to a quieter vantage.
- Alternative methods: the listen focus can be held by touch, toggled by switch, or requested by voice, and its results can be replayed on demand.
- NPC reactions: residents lower their voices around a listening player only when it is natural, and some will point out a sound the player is straining to place.
- Story opportunities: overheard fragments, distant work, and changing acoustics let the world tell its story without exposition.
- Gameplay progression: practised listening teaches the player to recognise places, people, and machines by sound before any confirmation appears.

### Feel

Feel is sustained tactile exploration, reading texture, temperature, contour, and vibration over time, and it is how a player understands a surface or object through the hands.

- Animation: the character runs the hands slowly across a surface, pausing at edges and changes, in an unhurried exploratory motion.
- Audio: quiet contact sounds track the hand, and the material's acoustic identity answers each change in pressure and surface.
- Accessibility: the authored tactile language conveys texture, temperature, and shape as distinct haptic patterns, described in parallel through speech, captions, and braille.
- Failure states: feeling through a barrier such as a glove or a cold surface returns a muted, honest reading that flags reduced tactile confidence.
- Alternative methods: exploration can be driven by finger drag, switch-stepped along a surface, or narrated on request for players who prefer description to haptics.
- NPC reactions: a tactile learner is treated as ordinary, and characters describe surfaces aloud as a natural courtesy rather than a special accommodation.
- Story opportunities: worn grooves, repaired seams, and engraved marks felt by hand become quiet evidence of who was here and what they did.
- Gameplay progression: attentive feeling builds a tactile vocabulary that lets the player identify materials and conditions faster over the course of a campaign.

### Touch

Touch is a brief, confirming contact that answers whether something is present, reachable, and safe to handle, and it is the lightweight counterpart to sustained feeling.

- Animation: the character reaches out and makes a short, decisive contact, then withdraws the hand.
- Audio: a single crisp contact sound confirms the point of touch and its material.
- Accessibility: a short confirming haptic tap accompanies a brief spoken or captioned note of what was touched and its state.
- Failure states: touching something too hot, charged, or unstable triggers a safe recoil and a clear warning rather than damage, consistent with recoverable failure.
- Alternative methods: touch can be performed by tap, switch, or voice confirmation, and its result is always announced.
- NPC reactions: residents may warn a player away from an unsafe surface before contact, showing care rather than restriction.
- Story opportunities: a confirming touch can trigger a memory cue, a recognition, or a small acknowledgement that the object matters.
- Gameplay progression: reliable touch confirmation underpins every manipulation verb and grows more informative as the player learns a location's hazards.

## Handling and moving objects

These verbs let the player act physically on the world. Each is authored so its effort, weight, and outcome are legible by ear and by hand, and each supports players who cannot supply physical force directly.

### Push

Push moves an object away from the player along a surface using applied force.

- Animation: the character sets a stance, places both hands, and leans into a steady forward effort that scales with the object's weight.
- Audio: strain in the body, friction against the floor, and the object's mass combine into a sound that communicates how heavy the effort is.
- Accessibility: effort and progress are mirrored in escalating haptics and a spoken or captioned readout of distance moved, so force is never judged by sight alone.
- Failure states: an object too heavy to move slides only slightly or not at all, and the game suggests a second pair of hands rather than blocking progress.
- Alternative methods: pushing can be a sustained press, a repeated switch input, or a held voice command, with assistive force options for players who cannot apply continuous input.
- NPC reactions: a nearby crew member may offer to help push, turning the task into a shared effort consistent with the community-as-progression canon.
- Story opportunities: shifting a blocked door or a fallen panel can open a space that was closed since the attack, revealing what was left behind.
- Gameplay progression: cooperative pushing strengthens working relationships and unlocks heavier community tasks as more crew are rescued.

### Pull

Pull draws an object toward the player using applied force, and it is the natural inverse of pushing.

- Animation: the character grips, braces the legs, and hauls backward with a rhythm that reflects the load.
- Audio: grip creak, floor drag, and breathing tempo tell the player how hard the pull is and whether it is succeeding.
- Accessibility: progress is announced and rendered as a rising haptic pull, and grip security is signalled distinctly so the player knows the hold is sound.
- Failure states: a lost grip stops the pull safely and preserves any distance already gained, letting the player reset rather than start over.
- Alternative methods: pulling supports sustained drag, switch repetition, voice command, and assistive force for players who cannot apply steady effort.
- NPC reactions: residents may steady an object or add their strength, and an engineer might suggest a better anchor point.
- Story opportunities: pulling open a jammed locker or hatch can uncover supplies, a log, or a survivor's belongings.
- Gameplay progression: reliable pulling feeds into rescue, salvage, and construction, and cooperative pulls deepen crew trust.

### Lift

Lift raises an object from a surface and holds it against gravity.

- Animation: the character bends at the knees, secures the load, and rises with a posture that shifts under the weight.
- Audio: the moment of lift, the settling of the load, and sustained effort form a clear acoustic arc from ground to hold.
- Accessibility: weight is expressed through continuous haptic tension and a spoken or captioned weight class, and a warning precedes any load that risks a drop.
- Failure states: an overweight lift is refused before strain becomes injury, with a clear prompt to share the load or use equipment.
- Alternative methods: lifting can be triggered by hold, switch, or voice, with assistive lift for players who cannot sustain physical effort, and a lifting aid can substitute entirely.
- NPC reactions: a crew member may take the other side of a heavy item, and medical staff may caution against unsafe lifting.
- Story opportunities: lifting debris in a rescue, or raising a memorial stone, ties the plain verb to meaningful moments.
- Gameplay progression: shared lifting unlocks larger construction and salvage, reinforcing that the station grows through people working together.

### Carry

Carry keeps a held object with the player while moving, and it links lifting to travel.

- Animation: the character adjusts gait and balance to the load, moving more slowly and deliberately while carrying.
- Audio: altered footstep rhythm, the object's own sounds, and effort breathing tell listeners something is being carried and how heavy it is.
- Accessibility: the carry state is held in a persistent haptic and audio cue, and hazards ahead are announced early because the player's hands are occupied.
- Failure states: carrying too much slows the player and, past a safe limit, forces a controlled set-down rather than a punishing drop.
- Alternative methods: carrying can use a held toggle, a switch latch, or a voice-latched state, and a cart or companion can carry on the player's behalf.
- NPC reactions: residents make way for a carrying player and may open doors, and a child might ask what is being carried.
- Story opportunities: carrying a wounded survivor, a salvaged artefact, or a gift home makes travel itself part of the narrative.
- Gameplay progression: dependable carrying supports the expedition loop of recovering and returning items home, where they change the station.

### Drag

Drag moves an object across a surface while it stays in contact with the ground, and it is the option for loads too heavy to lift or carry.

- Animation: the character leans low, grips, and hauls with a slow, effortful, repeated motion.
- Audio: continuous friction, the object's mass scraping the surface, and heavy breathing make dragging one of the most acoustically distinctive verbs.
- Accessibility: the scrape is mirrored in a steady haptic drag and a captioned or spoken progress readout, and surface changes underneath are announced.
- Failure states: dragging can stall against an obstacle, and the game names the obstruction and preserves progress instead of resetting it.
- Alternative methods: dragging supports sustained input, switch repetition, voice command, and assistive force, and a companion can help drag.
- NPC reactions: crew may grab the far end, and a maintenance worker might warn that dragging could damage a floor or the load.
- Story opportunities: dragging a beam clear during a rescue, or a body to a place of rest, carries weight beyond mechanics.
- Gameplay progression: cooperative dragging teaches load-sharing and unlocks salvage that no single person could move.

### Throw

Throw releases a held object toward a target with force, and it is used for tools, signals, and emergency needs rather than spectacle.

- Animation: the character winds up, sets the aim, and releases with a follow-through that reflects the object's weight.
- Audio: the wind-up, the release, the object's flight, and its impact give a full spatial arc the player can track by ear.
- Accessibility: aim is guided by a directional audio and haptic lock, with spoken or captioned confirmation of the intended target before release.
- Failure states: a poor throw lands short or wide, and the object can be retrieved and thrown again, keeping the mistake recoverable.
- Alternative methods: throwing can be a flick, a two-step switch aim-and-release, or a voice-directed throw with assisted aiming.
- NPC reactions: a crew member may call the throw good or warn of a fragile target, and someone can catch a thrown tool.
- Story opportunities: throwing a line to a survivor or a beacon into reach turns the verb into an act of help.
- Gameplay progression: accurate throwing improves with practice and supports rescue and signalling rather than combat as its main purpose.

## Making, mending, and measuring

These verbs turn effort into repaired systems, new structures, and understood objects. Each is introduced by a person before it becomes a player ability.

### Repair

Repair restores a broken system, object, or structure to working order.

- Animation: the character works methodically with tools, testing, adjusting, and confirming each step of the fix.
- Audio: the fault's wrong sound gradually resolves into a correct one, so the player hears the repair succeed before any confirmation.
- Accessibility: each step is narrated and captioned, tool alignment is guided by haptics, and the fault-to-fixed sound change is mirrored in tactile patterns.
- Failure states: an incomplete repair leaves a documented partial fix that continues to behave imperfectly, and the system remembers what remains to be done.
- Alternative methods: repair steps support touch, switch sequencing, and voice-guided procedures, and Faience can talk a player through an unfamiliar fix.
- NPC reactions: an engineer or maintenance worker teaches the first repair of a kind, and crew acknowledge a restored system by using it.
- Story opportunities: repairing a family's quarters or a failing life-support line makes the fix personal and lasting.
- Gameplay progression: repeated repairs raise competence, and community repairs leave the home measurably better after every chapter.

### Construct

Construct assembles a new structure or installation from prepared parts, usually as a shared project.

- Animation: the character positions components, secures joins, and steps through a build sequence with deliberate care.
- Audio: each secured join adds a layer to an emerging acoustic identity, so the structure is heard taking shape.
- Accessibility: alignment and sequence are guided by haptics and spoken or captioned steps, and completion is confirmed across all channels.
- Failure states: a misaligned step halts safely and can be undone, and a partial build persists as an honest work in progress.
- Alternative methods: construction supports touch placement, switch stepping, and voice-guided assembly, with cooperative and assistive options for every stage.
- NPC reactions: major construction requires several crew with different expertise, so building is inherently social and celebrated when finished.
- Story opportunities: raising a school, a garden frame, or a memorial gives the community a new place to live its life.
- Gameplay progression: construction expands the home and unlocks new community activity, embodying the canon that the station grows through people working together.

### Fabricate

Fabricate creates a new component or item from raw materials at a fabricator, and it differs from construct in that it makes the parts rather than assembling the whole.

- Animation: the character loads materials, sets parameters, and monitors the fabricator through its cycle.
- Audio: the fabricator's distinctive run cycle communicates progress, and a completion tone confirms a finished item.
- Accessibility: cycle progress is spoken, captioned, and rendered as a rhythmic haptic, and any material shortfall is announced clearly.
- Failure states: insufficient or wrong materials produce a flagged imperfect item or a safe abort, never a silent waste.
- Alternative methods: fabrication is driven by touch menus, switch navigation, or voice specification, and templates can be selected without fine motor precision.
- NPC reactions: a specialist introduces the fabricator and may request specific parts, tying fabrication to others' needs.
- Story opportunities: fabricating a bespoke accessibility device or a replacement keepsake shows technology serving people.
- Gameplay progression: mastering fabrication feeds repair and construction and widens what the community can make for itself.

### Scan

Scan surveys an object, person, or area with an instrument to reveal information not available to the unaided senses.

- Animation: the character sweeps a handheld device across the subject in a steady, searching pass.
- Audio: the scan emits a sweeping tone whose texture shifts as it detects features, and a resolution tone marks a complete read.
- Accessibility: results are delivered as speech, captions, braille, and a feature-mapped haptic sweep, so a scan is never a visual-only readout.
- Failure states: interference or range limits return a partial scan that names its own gaps rather than fabricating data.
- Alternative methods: scanning can be triggered by long press, switch, or voice, and the results panel is fully navigable without sight.
- NPC reactions: a scientist or medic may interpret a difficult scan, and residents accept scanning as ordinary shipboard practice.
- Story opportunities: a scan can surface an anomaly whose meaning unfolds only across a campaign, preserving deliberate mysteries.
- Gameplay progression: skilled scanning unlocks deeper readouts over time and feeds research, medicine, and engineering.

### Research

Research investigates a question over time by combining scans, archives, conversation, and experiment into new understanding.

- Animation: the character alternates between a workstation, gathered samples, and consultation, reading as sustained study.
- Audio: a working ambience of instruments and quiet concentration marks a research session, with a distinct chime when a finding resolves.
- Accessibility: findings, hypotheses, and next steps are presented in fully navigable speech, captions, and braille, with haptic cues for state changes.
- Failure states: a dead end is recorded as a genuine result that narrows the field, honouring the canon that knowledge is corrected through discovery rather than retcon.
- Alternative methods: research is conducted through touch, switch, or voice interfaces, and Faience can co-investigate alongside the player.
- NPC reactions: specialists contribute expertise the player lacks, reinforcing that the player is never the smartest person in the room.
- Story opportunities: research advances progressive mystery solving by describing how understanding grows, never by revealing a mystery's answer.
- Gameplay progression: completed research changes at least one system, dialogue, or capability, because knowledge must always change something.

## Teaching and learning

These verbs carry the canon that everyone teaches and everyone keeps learning. They make knowledge a shared, social act rather than a menu, because every mechanic is introduced by a person before it becomes a player ability.

### Teach

Teach passes a skill or piece of knowledge from the player to another person, and it is how expertise spreads through the community.

- Animation: the character demonstrates, guides a learner's attempt, and confirms understanding with patient, attentive gestures.
- Audio: the exchange has a distinct rhythm of demonstration, attempt, and correction, and a small acknowledging tone marks a lesson landing.
- Accessibility: teaching is delivered through speech, sign, AAC, captions, braille, and haptic guidance together, so a lesson never depends on one sense for teacher or learner.
- Failure states: a lesson that does not land is repeated in a different way rather than failed, and the relationship remembers the effort to teach.
- Alternative methods: the player can teach by demonstration, spoken explanation, sign, AAC, or a guided hands-on attempt, each equally valid.
- NPC reactions: learners respond as individuals with their own pace, and a taught crew member later uses and passes on the skill.
- Story opportunities: teaching a rescued survivor a role in the community marks their transition from guest to belonging.
- Gameplay progression: teaching spreads capability through the crew and strengthens the relationships that are the primary progression system.

### Learn

Learn receives a skill or piece of knowledge from another person, and it is the player's route to new abilities, since the player is never the smartest person in the room.

- Animation: the character watches closely, attempts under guidance, and refines the action across repeated tries.
- Audio: the sounds of the skill being learned sharpen from clumsy to competent, so progress is heard as much as measured.
- Accessibility: instruction is received through speech, sign, AAC, captions, braille, and haptic guidance, and the learner sets the pace they need.
- Failure states: an early attempt that goes wrong is expected and recoverable, and each attempt narrows the gap rather than ending the lesson.
- Alternative methods: learning supports watching, listening, tactile guidance, switch-paced repetition, and voice-led coaching, with no timed pressure in single-player.
- NPC reactions: teachers adapt to how the player learns, and the crew treat every member's continued learning as ordinary.
- Story opportunities: learning a skill from a specific character binds that ability to a relationship and a memory of who taught it.
- Gameplay progression: learned skills unlock new interactions and reinforce that the player's strength is bringing others' expertise together.

## Sustenance and cultivation

These verbs feed and grow the community. They make daily life audible and give the world reasons to continue while the player is away.

### Cook

Cook prepares food from ingredients, turning provisions into meals the community shares.

- Animation: the character measures, combines, and tends cooking with a rhythm of practised steps.
- Audio: sizzling, boiling, and timers form a rich kitchen soundscape whose cues signal each stage and readiness.
- Accessibility: stages, temperatures, and timers are spoken, captioned, and delivered as timed haptics, so cooking never depends on watching a pot.
- Failure states: a mistimed dish is edible but imperfect and can be improved next time, keeping failure gentle and instructive.
- Alternative methods: cooking supports touch, switch stepping, and voice-guided recipes, with adjustable timing for players who need it.
- NPC reactions: crew gather at mealtimes, comment on favourites, and a cook becomes known for particular dishes.
- Story opportunities: a shared meal marks recoveries, festivals, and reconciliations, anchoring community life.
- Gameplay progression: cooking strengthens relationships and morale and expands as new ingredients and rescued cooks arrive.

### Garden

Garden tends growing plants over time in hydroponics or planted spaces.

- Animation: the character waters, prunes, and inspects plants with slow, attentive care.
- Audio: water, rustling growth, and the maturing hum of a planted space communicate a garden's health and its progress toward abundance.
- Accessibility: plant health and growth stage are spoken, captioned, and rendered as tactile cues, and beds are laid out for navigation by cane and by hand.
- Failure states: neglect slows growth or wilts a plant, but the garden recovers with care rather than being permanently lost.
- Alternative methods: gardening tasks support touch, switch, and voice, and raised, reachable beds support seated and standing gardeners alike.
- NPC reactions: residents visit the garden, trade cuttings, and a botanist may teach a technique.
- Story opportunities: a garden grown from salvaged seeds becomes a living record of a community rebuilding after loss.
- Gameplay progression: gardens mature audibly over chapters and while the player is away, feeding cooking and the community's sense of home.

### Harvest

Harvest gathers mature produce from the garden or the field, completing the growing cycle.

- Animation: the character selects ripe produce and gathers it with a careful, judging touch.
- Audio: the sound of picking and the changing fullness of a bed confirm what has been taken and what remains.
- Accessibility: ripeness is conveyed through spoken description, captions, and tactile ripeness cues, so harvesting never requires sight of colour.
- Failure states: harvesting too early yields less and is noted, but the plant continues and can be harvested properly later.
- Alternative methods: harvesting supports touch, switch selection, and voice, with reachable layouts for seated harvesters.
- NPC reactions: the community celebrates a good harvest, and produce is shared through food distribution.
- Story opportunities: a first harvest aboard the rebuilt home is a milestone the whole community can hear and taste.
- Gameplay progression: harvests supply cooking and trade and mark the community's growing self-sufficiency across a campaign.

## Care, rescue, and movement of people

These verbs place people at the centre of gameplay. They are the emotional core of the franchise and are written with dignity rather than as mechanics alone.

### Comfort

Comfort offers reassurance and presence to a distressed person.

- Animation: the character slows, faces the person, and offers open, attentive body language or a steadying contact.
- Audio: the voice softens, breathing steadies, and the surrounding mix calms to reflect a moment of care.
- Accessibility: comforting intent is carried in captioned and signed dialogue, gentle haptics, and described body language, so the gesture reads without sound or sight.
- Failure states: a misjudged comfort is received coolly rather than punished, and the relationship remembers the attempt and allows another.
- Alternative methods: comfort can be offered through spoken lines, sign, AAC, or a chosen gesture, each equally valid.
- NPC reactions: the comforted person responds according to who they are and their history, never as a generic gratitude prompt.
- Story opportunities: comforting a grieving survivor deepens a relationship and can open a private story only trust unlocks.
- Gameplay progression: consistent care builds trust that changes future dialogue, cooperation, and community standing.

### Rescue

Rescue reaches a person in danger and brings them to safety.

- Animation: the character moves with urgency, clears obstacles, secures the person, and guides or carries them out.
- Audio: distress cues, the environment's hazards, and the person's changing breathing track the rescue moment by moment.
- Accessibility: the route to safety, the hazards, and the survivor's state are announced, captioned, and given directional haptics throughout.
- Failure states: a difficult rescue can go partly wrong and change what follows, but the canon of recoverable failure keeps a path forward open.
- Alternative methods: rescue actions support touch, switch, and voice, and cooperative rescue lets crew share the effort.
- NPC reactions: a rescued person becomes a potential member of the community, and existing crew rally to assist.
- Story opportunities: every rescue can begin a new relationship and add a voice to the home, echoing the campaign's rebuilding of a crew.
- Gameplay progression: rescues are people progression, permanently changing the station's soundscape and its capabilities.

### Evacuate

Evacuate moves one or many people away from a threatened area in an orderly way.

- Animation: the character directs, gathers, and shepherds people toward an exit with clear, guiding motion.
- Audio: evacuation announcements, moving crowds, and hazard sounds combine into an urgent but legible soundscape.
- Accessibility: routes and instructions are spoken, captioned, signed, and given as directional haptics, and no evacuee is left dependent on a single sense.
- Failure states: a slow or partial evacuation changes the outcome for those involved without ending the game, and consequences persist in the story.
- Alternative methods: directing an evacuation supports touch, switch, and voice, and Faience can coordinate the movement on request.
- NPC reactions: residents follow guidance according to their needs, and crew take charge of groups to help.
- Story opportunities: an evacuation tests who the community has become and is remembered in its history.
- Gameplay progression: successful evacuations build leadership standing and prepare the crew for larger crises.

### Transfer

Transfer safely moves a person between positions or supports, such as from a bed to a wheelchair or into medical transport.

- Animation: the character coordinates a careful, supported move with attention to the person's comfort and safety.
- Audio: the sounds of equipment, adjustment, and the person's settling confirm a safe transfer step by step.
- Accessibility: each stage is announced and captioned, guided by haptics, and paced to the person being moved, treating assistive equipment as ordinary.
- Failure states: an unsafe transfer is prevented before harm, with a prompt to adjust technique or seek a second helper.
- Alternative methods: transfers support touch, switch, and voice, and cooperative transfer with crew or equipment is always available.
- NPC reactions: medical staff teach safe transfer and value it, and the person being moved is treated with dignity throughout.
- Story opportunities: assisting a long-term patient's daily transfer builds a quiet, ongoing relationship of trust.
- Gameplay progression: skilled transfer supports medicine and rescue and reflects a community that cares for all its members.

## Communication

These verbs let the player exchange meaning with the world. No communication method is treated as lesser, and information never depends on one channel alone.

### Sign

Sign is communication through a signed language, a full and equal language rather than a substitute for speech.

- Animation: the character's hands, face, and body form clear, grammatical signing rendered with care.
- Audio: for those using sound, a spoken interpretation can accompany signing, but the signing itself is the primary utterance.
- Accessibility: signing is rendered visually, described in text captions, and voiced where wanted, so signed conversation reaches sighted, blind, hearing, and Deaf players alike.
- Failure states: a misunderstood sign prompts a natural request for repetition rather than a failure penalty.
- Alternative methods: the player can respond in sign, speech, AAC, or text, and switch to any of these mid-conversation.
- NPC reactions: Deaf and signing characters converse in sign as an ordinary part of the community, and others sign or interpret naturally.
- Story opportunities: a private signed exchange across a noisy room can carry meaning no spoken line could.
- Gameplay progression: fluency in reading and using sign broadens who the player can fully understand and work with.

### Speak

Speak is spoken conversation, the most common but never the only way to communicate.

- Animation: the character faces the listener with expression and gesture that support the words.
- Audio: voice, accent, rhythm, and tone carry both content and identity, so the player recognises who is speaking.
- Accessibility: all speech is captioned and available in braille, and important spoken information is duplicated in text and haptics so it never depends on hearing.
- Failure states: a poorly chosen line lands badly and is remembered, but conversations remain recoverable and relationships can heal.
- Alternative methods: the player may reply through speech, sign, AAC, or text, each fully supported.
- NPC reactions: characters respond in their own distinct voices and according to their history with the player.
- Story opportunities: dialogue reveals character and plants questions, while environmental sound often carries what speech leaves unsaid.
- Gameplay progression: attentive conversation builds relationships and unlocks knowledge that only trust and rapport reveal.

### AAC

AAC is augmentative and alternative communication, a full voice for characters and players who communicate through symbols, text, or a speech-generating device.

- Animation: the character operates a communication device or board with intent, and the moment of composing a message is shown as ordinary.
- Audio: the device's synthesised voice and selection sounds are a recognisable, respected acoustic identity, not a novelty.
- Accessibility: AAC output is spoken, captioned, and available in braille, and AAC input methods include touch, switch, and gaze-style dwell.
- Failure states: a mistaken selection is easily corrected before sending, and communication is never rushed by a timer in single-player.
- Alternative methods: AAC users can compose by symbol, prediction, or spelling, and can be given the time and quiet they need.
- NPC reactions: crew wait naturally for an AAC message and respond to its content, never treating the method as an obstacle.
- Story opportunities: an AAC user's carefully composed line can hold particular weight in a pivotal moment.
- Gameplay progression: comfort with AAC widens the range of characters the player communicates with as full partners.

### Braille reading

Braille reading is the tactile reading of text through a refreshable braille display or embossed surface.

- Animation: the character's fingers move across a reading surface in a steady, practised line.
- Audio: quiet page and display sounds accompany reading, and the content itself can be voiced in parallel when wanted.
- Accessibility: braille is a primary reading channel, kept fully in step with speech and captions so the same text reaches every reader.
- Failure states: a damaged or partial braille source is reported honestly, and the reader is offered an alternative copy rather than a dead end.
- Alternative methods: any braille text is also available as speech and on-screen text, and navigation of long documents works by touch, switch, or voice.
- NPC reactions: braille signage and documents are an ordinary part of the world, and characters produce braille copies as a matter of course.
- Story opportunities: a braille journal or label found on an expedition can be a discovery in its own right.
- Gameplay progression: fluent braille reading opens archives, logs, and labels that enrich research and navigation.

## Accessibility mobility interactions

These verbs cover mobility equipment as ordinary, first-class interaction. Every movement mechanic has a stationary and an assisted alternative, and no player is excluded because of disability.

### White cane interaction

White cane interaction is navigation and inspection of the environment using a white cane, whether the player is moving in reality-integrated navigation or playing stationary.

- Animation: the cane sweeps ahead in a steady arc, contacting surfaces and edges as the character advances.
- Audio: cane taps and the differing responses of surfaces build a precise acoustic map of the path ahead.
- Accessibility: cane contact is rendered in detailed haptics and spoken or captioned descriptions of surfaces, edges, and obstacles, so the technique informs even players who use it stationary.
- Failure states: an unexpected obstacle is detected and announced in time to stop safely, turning a hazard into information rather than harm.
- Alternative methods: cane use is available through real-world movement, a stationary cane control, switch stepping, and voice queries about what lies ahead.
- NPC reactions: the world treats cane travel as completely ordinary, and residents describe surroundings helpfully without condescension.
- Story opportunities: reading a space by cane can reveal changes, damage, or a hidden route that sighted travel would miss.
- Gameplay progression: skilled cane use makes the player faster and more confident at mapping unfamiliar spaces by touch and sound.

### Wheelchair interaction

Wheelchair interaction is movement and environmental interaction using a manual or power wheelchair, supported everywhere the game asks the player to move.

- Animation: the chair propels, turns, and manoeuvres with motion that reflects the surface and the effort.
- Audio: wheel sound, motor tone, and surface response communicate speed, terrain, and the chair's condition.
- Accessibility: routes are designed to be traversable by wheelchair, and reachability, ramps, and clearances are announced, captioned, and given as haptic cues.
- Failure states: an impassable route is flagged before the player is stuck, and an accessible alternative path is always offered.
- Alternative methods: wheelchair travel is available in reality-integrated navigation and as stationary controls, with switch and voice steering supported.
- NPC reactions: the world is built to include wheelchair users, and crew treat accessible design as the normal state of the ship.
- Story opportunities: a route only opened by community construction shows the home becoming more accessible over time.
- Gameplay progression: mastery of wheelchair movement, and the community's accessibility upgrades, together expand where the player can go.

## Professional procedures

These verbs are profession-specific procedures. Each is introduced by an expert, each reveals knowledge unique to its perspective, and each records its findings so knowledge can change something.

### Medical examination

Medical examination assesses a person's health through observation, instruments, and conversation.

- Animation: the medic works through a calm, structured sequence of checks with attentive care for the patient.
- Audio: heartbeat, respiration, and instrument tones form a diagnostic soundscape a medic learns to read by ear.
- Accessibility: readings and findings are spoken, captioned, and given in braille and haptics, so a blind medic examines as capably as any other.
- Failure states: a missed sign leads to an incomplete assessment that can be revisited, and the record notes what still needs checking.
- Alternative methods: examination steps support touch, switch, and voice, and instruments present their data through every channel.
- NPC reactions: patients respond as individuals with histories, and colleagues consult on difficult cases.
- Story opportunities: an examination can quietly reveal a patient's untold story or a consequence of earlier events.
- Gameplay progression: examination skill deepens the medic's readings over time and feeds treatment, rescue, and research documentation.

### Engineering diagnostics

Engineering diagnostics locate and characterise faults in ship and station systems before repair begins.

- Animation: the engineer probes systems, watches gauges, and traces connections with methodical attention.
- Audio: the healthy and unhealthy sounds of power, load, heat, and pressure let an engineer hear a fault's nature and location.
- Accessibility: diagnostic readouts are spoken, captioned, given in braille, and mapped to haptics, so diagnostics never require reading a screen by sight.
- Failure states: a misdiagnosis wastes effort and is recorded, but the system's behaviour keeps pointing toward the true fault.
- Alternative methods: diagnostics support touch, switch, and voice interrogation of systems, and Faience can assist with interpretation.
- NPC reactions: an engineer teaches the first diagnostic of a kind, and crew rely on a sound diagnosis before committing to a repair.
- Story opportunities: a diagnostic can uncover deliberate sabotage, age, or a mystery whose meaning unfolds across the campaign without being resolved early.
- Gameplay progression: diagnostic skill speeds fault-finding and directly enables more ambitious repairs and construction.

### Maintenance inspection

Maintenance inspection is the routine, systematic checking of spaces and equipment to catch problems before they grow, and it differs from engineering diagnostics by being preventive and continuous rather than fault-driven.

- Animation: the character follows a walking route, opening panels, checking fittings, and logging condition as they go.
- Audio: the subtle right and wrong sounds of vents, ducts, panels, and backup systems reward a careful, listening inspector.
- Accessibility: checklist items, findings, and locations are spoken, captioned, and given in braille and haptics, and routes are navigable by cane and by chair.
- Failure states: a skipped inspection lets a small fault develop into a larger one later, a consequence that becomes part of the ongoing story.
- Alternative methods: inspection is performed through touch, switch, and voice logging, and can be shared across a maintenance team.
- NPC reactions: the crew depend on maintenance quietly keeping the home safe, and residents notice when a space is well kept.
- Story opportunities: an inspection can be where the ordinary week aboard Hearth is grounded, and where an early warning sign is first noticed.
- Gameplay progression: thorough inspection prevents crises, keeps the home better after every chapter, and builds the player's map of the station.

### Security investigation

Security investigation gathers and interprets evidence to understand an incident, always framed as protection and responsibility rather than spectacle.

- Animation: the character surveys a scene, collects evidence, and reconstructs events with deliberate, careful movement.
- Audio: the acoustic details of a scene, disturbed materials, lingering traces, and witness accounts, become clues to be read.
- Accessibility: evidence, scene layout, and deductions are spoken, captioned, given in braille, and mapped to haptics, so investigation is fully accessible.
- Failure states: a rushed investigation reaches an uncertain conclusion that later evidence can correct, honouring knowledge corrected through discovery.
- Alternative methods: gathering and reviewing evidence supports touch, switch, and voice, and findings are navigable without sight.
- NPC reactions: witnesses respond as individuals, and specialists contribute expertise the investigator lacks.
- Story opportunities: an investigation can reveal how a community protects and repairs trust, and can surface a longer mystery told across perspectives.
- Gameplay progression: investigative skill improves how thoroughly evidence is read and feeds leadership and community outcomes.

### Research documentation

Research documentation records findings into the Knowledge Archive and Resonance Logs so that discovery is preserved and can change the world.

- Animation: the character composes and files an entry at a terminal or archive with focused, deliberate care.
- Audio: the archive has its own quiet, purposeful acoustic identity, and a distinct tone confirms an entry is preserved.
- Accessibility: documentation is authored and read through speech, captions, braille, and haptics, and every archive entry is fully navigable by any sense.
- Failure states: an incomplete or mistaken entry can be revised and corrected, and the archive keeps history rather than overwriting it silently.
- Alternative methods: entries can be dictated, typed, composed by AAC, or navigated by switch, with no single required method.
- NPC reactions: colleagues read, build upon, and cite entries, so documentation becomes part of the community's shared knowledge.
- Story opportunities: an archived entry is where progressive discoveries are recorded as the campaign reveals them, always describing what was learned without resolving a deliberate mystery.
- Gameplay progression: documented knowledge must change at least one system, dialogue, or capability, so filing an entry is genuine progression rather than collectible lore.

## Relationship to other documents

This design note defines the standard every player interaction must meet, and it defers to the documents that own each underlying rule rather than restating them.

- The Project Constitution is the governing authority over this document, and this note follows its core philosophy that audio is gameplay, that accessibility is foundational, and that technology exists to serve people.
- The Canon Rules document holds the master rules this note applies, including that people introduce mechanics, that accessibility is standard equipment, that failure changes history, and that knowledge must always change something.
- The Systems Bible defines the control philosophy, touch controls, reality-integrated gameplay, combat, flight, and exploration that these interactions are built upon.
- The Accessibility Bible defines the tactile language, accessible input, independent volume channels, and reality-integrated navigation that every accessibility and alternative-method facet here relies on.
- The Audio Bible defines the acoustic identities and sound libraries that give every interaction its audio facet.
- The Player Identity and Character Presentation Bible defines the recognition cues, movement and clothing sound, and identification technology that shape how NPCs are perceived and how they react.
- The Decision Log records when this design note and its interaction standard were adopted or amended.
