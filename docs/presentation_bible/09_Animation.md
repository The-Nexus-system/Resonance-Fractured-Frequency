# Animation

This document defines the animation standards for the recurring cast of Resonance: Fractured Frequency. It is written for animators, technical animators, audio designers, gameplay programmers, and accessibility engineers. It treats movement as a language the player learns to read, the same way the player learns a voice or a professional habit. In Resonance, the player recognises people through observation rather than labels, and animation is one of the strongest signals that carries recognition. Every posture, gait, and gesture in this bible is designed so a returning player knows who is present before a single word is spoken.

This document rests on two higher authorities and never contradicts them. The Canon Rules document is the canon authority. The Character Identity Map is the locked source for each recurring character's profession, ethnicity, gender, pronouns, and disability. Where any guidance here appears to differ from those documents, those documents govern. This file defines craft standards and presentation philosophy; it does not create character biography, ship history, or new game systems.

## Foundational Principles of Animation in Resonance

Animation in Resonance serves recognition, accessibility, and character truth in that combined order. A movement that looks beautiful but does not help the player know who is present, or that cannot be perceived by a player who does not see, has failed its primary job. These principles apply to every animation described later in this document.

### Every Animation Has an Audio Equivalent

Audio is gameplay in Resonance, so no animation is complete until it has an authored audio equivalent. A movement that exists only as pixels does not exist for a large part of the audience. The audio equivalent is never an afterthought layered on at the end; it is designed alongside the motion and reviewed at the same time.

- Every animation must ship with an authored sound design pass that communicates the same information the motion communicates.
- The audio equivalent should convey what is happening, who is doing it where that is knowable through sound, and how the action feels emotionally.
- Silence may be chosen deliberately for an animation, in line with the canon rule that silence is a storytelling tool, but silence must never be the result of missing audio.
- Movement audio should respect the acoustic identity of the location it happens in, so the same footstep reads differently in a resonant corridor than in a padded medical bay.
- Audio for animation must respect the player's independent volume channels, so movement sound sits primarily in the environmental ambience channel unless it carries navigation meaning, in which case it also reaches the navigation channel.

### Every Animation Has a Tactile Equivalent Where Relevant

Because DeafBlind play is a first-class way to experience Resonance, animations that carry gameplay-relevant or safety-relevant information must also have a tactile equivalent expressed through the authored tactile language. Tactile equivalents are designed for meaning, not as a raw vibration of the soundtrack.

- Any animation that signals threat, urgency, direction, proximity, success, or failure must map to a defined tactile pattern.
- Purely decorative idle motion does not require a tactile equivalent, but any idle motion that reveals a change in a character's state, such as escalating pain or rising alarm, does.
- Tactile equivalents must be distinguishable from one another so a player can tell an approaching person from an environmental hazard.
- Tactile patterns for animation follow the tactile language defined in the Accessibility Bible and never invent a competing vocabulary.

### Recognition Through Movement

The player learns each recurring character as a moving silhouette with a signature rhythm. Animation is a recognition system first and a spectacle second.

- Each recurring character should have a distinct movement signature made of gait rhythm, posture, gesture vocabulary, and characteristic pauses.
- Recognition must be legible without the interface naming the character, honouring the canon rule that the world teaches the player who people are.
- Movement signatures must remain consistent across chapters so returning players keep their hard-won recognition, while still allowing the character to change through fatigue, injury, growth, and emotion.
- No two recurring characters should share a movement signature closely enough to be confused in normal play.

### Animation and the Vale System

The Vale System is one shared body inhabited by four members who front in turn. Animation is one of the primary ways the player recognises which member is present, because the body never transforms and only its presentation changes. This principle governs every Vale System animation in this document and is expanded in its own section below.

- The body, height, build, and accessibility equipment stay constant across all four members.
- Posture, gait rhythm, gesture vocabulary, resting stance, and breathing pattern change with whoever is fronting.
- The game almost never announces a switch, so animation must carry the change on its own, supported by voice and audio.
- The Vale System is never animated as four separate bodies and never as a single person named Captain Mara Vale.

### Dignity, Authenticity, and Non-Tokenism

Disability shapes characters without defining them, so animation portrays disability as an ordinary, competent, lived reality rather than as struggle or spectacle.

- Assistive equipment is standard equipment and is animated with the same care and confidence as any other tool, never as a burden or a symbol of pity.
- Movements that express disability should read as skilled and habitual, because these characters have lived in their bodies their whole lives.
- Animation must avoid inspiration framing, exaggerated effort, or camera emphasis that treats ordinary movement as remarkable.
- Cultural movement, especially for Native characters, is never invented or stylised casually; where a character's culture is undeveloped in canon, animation stays with universal, personal movement rather than inventing cultural gesture.

## Idle Animations

Idle animation is where recognition lives most of the time, because characters are often simply present in a space. Idle states must be readable, must loop without obvious seams, and must carry each character's signature at rest.

### Idle Layering Structure

Every idle is built from layers so it can express state without new full-body captures.

- A base idle carries the character's resting posture and breathing.
- A micro-motion layer adds small weight shifts, blinks, and settling so the character never appears frozen.
- A state layer expresses fatigue, injury, calm, or tension by biasing the base idle.
- A focus layer expresses what the character is attending to, such as a listening tilt or a downward glance toward work.

### Idle Audio Standards

- Each idle has a quiet audio bed made of breathing, small clothing and equipment movement, and any device the character carries.
- Breathing is a primary recognition cue and must be authored distinctly per character and per state.
- Idle audio must never fully vanish for a present character unless silence is a deliberate narrative choice.
- Idle audio sits in the environmental ambience channel and rises only when a state change makes it meaningful.

### Idle Tactile Standards

- A present nearby character produces a low, steady tactile presence cue so a DeafBlind player knows someone is there.
- A change in a character's idle state, such as a shift from calm to tense, produces a distinct tactile transition so the change is perceivable without sight or sound.
- Idle tactile cues remain gentle and are clearly weaker than threat or urgency patterns.

### Idle Signatures for the Recurring Cast

- Mara Chen rests with a listening orientation, head slightly turned to bring sound in, one hand often near a surface she can read by touch, her weight settled and ready to move by sound; her idle audio includes the soft cues of her engineering helmet and navigation faceplate.
- Doctor Samira Kade holds a still, observant idle that reads a room by sight and vibration, with her sleeve projector producing a soft mechanical whisper that is her signature presence sound.
- Rowan Ives favours an idle that protects his joints, shifting weight to manage chronic pain and arthritis, choosing supported stances and small position changes rather than long rigid holds.
- Mira Ives has a mobile, expressive child idle with self-regulating motion, and her neural-interface augmentative and alternative communication system is visibly and audibly present as an ordinary part of how she exists in a space.
- Chief Petty Officer Jonah Briggs holds a calm, grounded idle with an even breathing rhythm, matching the calm voice that reads out priorities.
- Security Lead Talia Rusk keeps a steady, aware idle with balanced weight over her prosthetic limb, oriented toward the people she is protecting.
- Doctor Soren Qadir rests in his repulsor-assisted chair with an attentive, forward-leaning investigator's posture, hands ready to work, the chair producing its own quiet idle hum.
- The Vale System idle changes with whoever is fronting and is detailed in the Vale System animation section.
- Faience has no body during Operation One and therefore no human idle; Faience's presence is expressed through the environment and audio, and this is covered under the special animation section.

## Walking

Walking is the most frequent locomotion in the game and the strongest ongoing recognition cue. Walk cycles are authored per character rather than shared from a single generic rig, because gait rhythm is identity.

### Walking Cadence and Signature

- Each walking character has an authored cadence, stride length, weight transfer, and arm motion that together form a recognisable rhythm.
- Cadence must remain stable enough across chapters to preserve recognition while still responding to state.
- Turning, starting, and stopping are authored transitions, not snapped changes, so the character's rhythm reads as continuous.

### Walking Audio Standards

- Footstep audio is a primary recognition channel and is authored per character, reflecting weight, footwear, pace, and any assistive device.
- Footstep audio changes with surface and with the acoustic identity of the location, so the player can learn both who is walking and where.
- The rhythm of footsteps must match the visible cadence exactly so sighted and non-sighted players receive the same information.
- Walking audio contributes to navigation when a character's approach matters, and in those cases also reaches the navigation channel.

### Walking Tactile Standards

- An approaching walking character produces a directional tactile cue whose intensity rises with proximity, following the tactile language for direction and distance.
- The tactile approach cue carries rhythm information so a practiced player can associate a cadence with a person.
- Departing footsteps produce a fading directional tactile cue so absence is perceivable.

### Walking Signatures for the Recurring Cast

- Mara Chen walks with a sure, listening gait, using sound and vibration to navigate, moving confidently through spaces she knows by ear, with her helmet and faceplate translating the environment into cues she trusts.
- Rowan Ives walks with a joint-conscious gait that manages chronic pain, pacing himself, using handholds and supports built into the ship as ordinary parts of his route.
- Talia Rusk walks with balanced, deliberate steps over her prosthetic limb, her cadence steady and protective, adjusting smoothly across terrain.
- Jonah Briggs walks with an even, unhurried cadence that matches his calm delivery, reading as steady and dependable.
- Mira Ives walks with a lighter, more variable child cadence that can shift quickly with mood and attention.
- Samira Kade walks with an observant, measured gait, her sleeve projector's soft whisper accompanying her.
- The Vale System's walking rhythm changes with the fronting member and is detailed in its own section.

## Running

Running expresses urgency and effort and appears most often in emergencies. Run cycles preserve each character's signature under stress rather than collapsing into a generic sprint.

### Running Effort and Character

- Running preserves recognisable cadence and posture so the player still knows who is present even at speed.
- Effort is expressed through posture, breathing, and recovery rather than through exaggerated strain that undermines dignity.
- Deceleration and recovery after running are authored so effort has a visible and audible aftermath.

### Running Audio Standards

- Running footsteps are faster, heavier, and more forceful than walking, and remain individually recognisable per character.
- Breathing becomes a prominent audio cue during and after running and is authored per character and per state.
- Running audio carries urgency and therefore commonly reaches both the environmental ambience and navigation channels.

### Running Tactile Standards

- A running approach produces a stronger, faster directional tactile cue than a walking approach, clearly distinguishing urgency.
- Running that signals danger maps to the tactile threat and urgency patterns so a DeafBlind player perceives the emergency.
- Post-run recovery produces a settling tactile cue as the urgency pattern resolves.

### Running Considerations for Mobility Diversity

- Not every character runs on foot; for wheelchair users, the urgent locomotion equivalent is rapid propulsion, covered under wheelchair propulsion.
- Characters with chronic pain, such as Rowan Ives, express urgency through the fastest movement their body sustains rather than an idealised sprint, and this is portrayed as capable and real.
- Talia Rusk's urgent movement over her prosthetic limb is authored as fast, controlled, and skilled.

## Wheelchair Propulsion

Doctor Soren Qadir uses a repulsor-assisted chair with a manual backup, and wheelchair propulsion is animated as a primary, dignified mode of movement equal to walking. The chair is standard equipment and is animated with the same craft as any other locomotion.

### Repulsor-Assisted Propulsion Standards

- Repulsor-assisted movement is smooth and responsive, with the chair carrying its own idle hum and movement tone.
- Soren's upper-body posture and hand positions read as an active operator of the chair, an attentive investigator, not a passive passenger.
- Turning, accelerating, and stopping are authored transitions that preserve Soren's forward-leaning working posture.

### Manual Backup Propulsion Standards

- The manual backup is animated distinctly from repulsor mode, with authored hand-rim contact, push, and recovery strokes.
- Switching between repulsor-assisted and manual modes is an ordinary, practiced action, never framed as a failure or a hardship.
- Manual propulsion effort is expressed honestly and competently, including on inclines or difficult terrain.

### Wheelchair Propulsion Audio Standards

- The repulsor chair has a signature hum that is one of Soren's primary recognition cues, changing subtly with speed and effort.
- Manual propulsion has its own authored sound of hand-rim contact and wheel motion, clearly different from the repulsor hum.
- Directional and turning movement of the chair is audible so the player can track Soren's path by ear.

### Wheelchair Propulsion Tactile Standards

- Soren's approaching chair produces a distinct directional tactile cue keyed to his signature, different from footstep-based approaches.
- Speed and urgency of propulsion scale the tactile cue in line with the tactile language for distance and urgency.
- A switch to rapid propulsion in an emergency maps to the urgency pattern so it is perceivable without sight or sound.

## Transfers

Transfers are the movements a character makes between the chair and another surface, and between other seated or supported positions. They are animated as competent, everyday actions.

### Transfer Movement Standards

- Transfers for Soren Qadir are authored as skilled, self-directed sequences that respect real technique and never read as helpless.
- Transfers are given enough animation frames to look controlled and safe rather than rushed.
- Where a transfer is assisted by another crew member, the assistance is collaborative and respectful, reflecting a community that adapts to people.

### Transfer Audio Standards

- Transfers have authored sound for contact, weight shift, and equipment movement so the action is legible by ear.
- The audio communicates a successful, controlled transfer, and a strained or interrupted transfer sounds distinctly different.

### Transfer Tactile Standards

- A completed transfer maps to the tactile success cue so a DeafBlind player perceives that the action resolved safely.
- An interrupted or unstable transfer maps to a distinct tactile cue that does not read as ordinary success.

## Cane Travel

Mara Chen navigates by sound, vibration, and touch, using an engineering helmet whose navigation faceplate turns visual data into audio and tactile cues. Where cane travel is depicted for Mara or any character who uses a white cane, it is animated as expert orientation and mobility, not tentative groping.

### Cane Technique Standards

- Cane travel is animated with authored, technique-accurate sweeps, contacts, and shorelining that read as skilled orientation.
- The character's overall posture during cane travel is confident and upright, consistent with an experienced traveller.
- For Mara, cane use, where shown, works together with her helmet and faceplate as complementary tools rather than competing ones.

### Cane Travel Audio Standards

- Cane contact with surfaces produces authored audio that reveals surface, distance, and the presence of obstacles, consistent with how the character actually gathers information.
- Cane audio integrates with the acoustic identity of the location so the same technique reveals different spaces.
- Cane travel audio is meaningful navigation information and reaches the navigation channel when appropriate.

### Cane Travel Tactile Standards

- Cane contact maps to tactile cues for surface, obstacle, and drop-off detection following the tactile language for navigation and proximity.
- Obstacle detection through the cane produces a clearly distinct tactile cue from open, clear travel.

## Signing

Doctor Samira Kade is Deaf and communicates through a sleeve projector that shows sign or live text, and signing appears across the cast as an ordinary, equally valid way to communicate. Signing animation is treated as language, with the precision that language requires.

### Sign Language Animation Standards

- Signing must be animated with linguistic accuracy in handshape, movement, location, orientation, and the facial expression and body movement that carry grammar.
- Signing is never reduced to vague hand-waving; facial grammar and non-manual markers are essential and are animated deliberately.
- Signing sequences are developed with fluent signing consultants so the language is real rather than decorative.
- The specific sign language or languages used by characters are set in coordination with the writing team and are not invented casually in animation.

### Tactile Signing Animation Standards

- Tactile signing, where one person signs into another's hands, is animated as a real, respectful mode of communication for DeafBlind interaction.
- Tactile signing is portrayed as an ordinary competent exchange between people, consistent with the canon that communication diversity is ordinary.

### Signing Audio and Text Standards

- Because signing is visual language, its accessible equivalent for non-signing and non-sighted players is authored text and, where appropriate, spoken interpretation, delivered through the game's captioning and speech output.
- Samira's sleeve projector is a canonical presentation element that shows sign or live text, and its soft mechanical whisper is a recognition cue that accompanies her communication.
- Signed dialogue must be fully available as text and speech so no player is excluded from the conversation.

### Signing Tactile Standards

- The onset of signed communication directed at the player maps to a tactile attention cue so a DeafBlind player knows a conversation has begun.
- Turn-taking in signed conversation is supported by tactile cues so the flow of exchange is perceivable.

## AAC Use

Mira Ives communicates through a visible neural-interface augmentative and alternative communication system, and augmentative and alternative communication is portrayed as a full, ordinary, expressive way of speaking. AAC animation covers both the visible device interaction and the character's accompanying body language.

### AAC Interaction Standards

- Mira's use of her neural-interface system is animated as fluent and personal, expressing her own voice, humour, and urgency rather than reading as mechanical or slow.
- The device is visibly present and is treated as an ordinary part of who Mira is, never hidden or framed as a limitation.
- Body language and expression accompany AAC use so Mira's whole body participates in communicating, consistent with an expressive child.

### AAC Audio Standards

- AAC output has an authored voice presentation that is consistent and recognisable as Mira's communication, delivered through the dialogue channel.
- The act of composing and sending AAC communication has subtle authored audio so the interaction is legible, without turning ordinary speech into spectacle.

### AAC Tactile Standards

- The arrival of AAC communication directed at the player maps to a tactile attention cue so a DeafBlind player knows Mira is speaking to them.
- Urgent AAC communication maps to the urgency pattern so Mira, who is often the first to hear when something is wrong, can raise an alarm perceptibly.

## Emotional Gestures

Emotional gesture is a core recognition and storytelling channel. Each recurring character has a personal gesture vocabulary that expresses feeling in a way consistent with their personality, and emotion is legible through sound and touch as well as sight.

### Emotional Gesture Vocabulary Standards

- Each character has a defined set of characteristic emotional gestures for states such as calm, joy, concern, frustration, grief, focus, and reassurance.
- Emotional gestures are personal and are not shared generically, so an expression of concern from one character reads differently than from another.
- Cultural gesture is never invented for characters whose culture is undeveloped in canon; emotional expression for such characters stays personal and universal rather than culturally specific.

### Emotional Gesture Audio Standards

- Emotional state is carried in breathing, vocal texture, and the sound of movement, so emotion is perceivable even when a gesture cannot be seen.
- A shift in emotional state produces an audible change in a character's movement and breathing bed.

### Emotional Gesture Tactile Standards

- Emotional cues directed at the player, such as a reassuring approach, map to gentle tactile presence cues distinct from urgency.
- A sharp change in a nearby character's emotional state, such as sudden alarm, maps to a distinct tactile cue so the change is perceivable without sight or sound.

### Emotional Expression and the Vale System

- Emotional expression, sense of humour, and gesture vocabulary change with whoever is fronting in the Vale System, and are among the strongest signals of which member is present.
- The four members' emotional gesture sets are distinct from one another, so the player reads the current member partly through how the shared body expresses feeling.

## Professional Movements

Every profession answers what it notices and what it is responsible for differently, and professional movement makes that visible. Professional movements are the habitual, skilled actions a character performs in their work, and they are strong recognition cues tied to the eight professions.

### Professional Movement Standards

- Each character has authored professional movements drawn from their profession, performed with the fluency of long practice.
- Professional habits and daily routines are a canonical recognition channel, so these movements are consistent and characterful.
- Professional movement adapts to each character's body and equipment, so the same task looks different for different people and all versions read as expert.

### Professional Movement Audio Standards

- Professional tools, devices, and actions have authored audio that reveals the work being done, contributing to both recognition and the acoustic identity of workspaces.
- The sound of a character's professional routine is often enough to identify them in their own environment.

### Professional Movement Tactile Standards

- Professional actions that carry gameplay-relevant results map to tactile success and failure cues so outcomes are perceivable without sight or sound.
- Hazardous professional actions, such as certain engineering or security tasks, map to tactile hazard cues.

### Professional Movement by Profession and Character

- Medic movements for Samira Kade include assessment, treatment, and bay routines, performed while reading the room by sight and vibration and communicating through her sleeve projector.
- Scientist movements for Soren Qadir include investigation, sampling, and analysis, performed from his chair with an attentive, persistent working posture.
- Engineer movements for Mara Chen include diagnosing and repairing systems by sound and touch, describing systems as sounds, guided by her helmet and faceplate.
- Maintenance movements for Rowan Ives include the physical work of the ship's hidden body, redesigned around his condition to protect his joints while remaining fully competent.
- Security movements for Talia Rusk include awareness, positioning, and protective action, steady under threat and oriented toward keeping others safe.
- Commissioned Officer movements belong to the Vale System and change by fronting member, as detailed in the Vale System section.
- Non-Commissioned Officer movements for Jonah Briggs include logistics, coordination, and the calm delivery of priorities.
- Civilian movements for Mira Ives include the everyday life of the habitation deck and her attentive noticing of when something aboard is wrong.

## Fatigue

Fatigue is a state layer applied across idle, walking, running, propulsion, and professional movement. It expresses accumulated effort and time without replacing a character's underlying signature.

### Fatigue State Standards

- Fatigue biases posture, slows cadence, reduces gesture amplitude, and lengthens recovery, while keeping each character recognisable.
- Fatigue is expressed truthfully and without pity, as an ordinary consequence of hard work.
- Characters with chronic conditions, such as Rowan Ives with chronic pain and arthritis, express fatigue in ways specific to their bodies, and this is portrayed as lived experience rather than tragedy.

### Fatigue Audio Standards

- Fatigue deepens and slows breathing, softens or slows movement audio, and adds authored effort sounds appropriate to each character.
- The audio of fatigue is distinct from the audio of injury so the two states are not confused.

### Fatigue Tactile Standards

- A meaningful onset of fatigue in the player's own character maps to a gentle, slow tactile cue distinct from injury or threat.
- Fatigue tactile cues remain low intensity so they are not mistaken for urgency.

## Injury

Injury is a state that alters movement to reflect harm, always within the bounds of dignity and the canon rule that failure changes history rather than restarting it. Injury animation communicates a changed condition clearly through all three channels.

### Injury State Standards

- Injury adjusts gait, posture, and the use of affected limbs or systems, and is layered over the character's signature so identity is preserved.
- Injury is depicted with restraint and respect, focused on communicating state rather than dwelling on suffering.
- Injury to assistive equipment, such as damage to Soren's chair or Mara's helmet, is depicted as a serious, meaningful event and is animated with the same seriousness as bodily injury.

### Injury Audio Standards

- Injury produces authored audio cues in breathing, movement, and effort that clearly distinguish it from fatigue.
- Sudden injury produces a distinct audio event so the moment of harm is legible by ear.

### Injury Tactile Standards

- Injury to the player's own character maps to a clear tactile cue distinct from fatigue, following the tactile language for failure and hazard.
- The severity of injury scales the tactile cue so the player can perceive how serious the condition is.

## Recovery

Recovery is the return from fatigue or injury toward a character's baseline, and it honours the canon that players recover from mistakes whenever narratively reasonable and that consequences become part of the continuing story. Recovery is animated as a real process rather than an instant reset.

### Recovery Process Standards

- Recovery is a gradual transition through animation state layers from injured or fatigued back toward baseline, and it may leave lasting traces where the story calls for them.
- Recovery involving other crew members reflects the community that adapts to people and shares expertise.
- Recovery of assistive equipment is depicted with the same care as bodily recovery, and equipment restored to function is a meaningful positive beat.

### Recovery Audio Standards

- Recovery is audible as breathing settles, movement steadies, and effort sounds subside, returning the character's signature audio to baseline.
- The audio arc of recovery is clearly the reverse of the injury or fatigue arc so improvement is legible by ear.

### Recovery Tactile Standards

- Meaningful recovery maps to the tactile success and resolution cues so a DeafBlind player perceives that a condition has improved.
- The tactile resolution of recovery is distinct from the tactile onset of injury or fatigue so the direction of change is unambiguous.

## Vale System Animation

The Vale System is one shared body inhabited by four members who front in turn, and animation is central to how the player recognises which member is present. This section governs every Vale System animation and always takes precedence over any general guidance above where the two meet.

### Constant Body Standards for the Vale System

- The shared body, its height and build, its face, hair, eye colour, and skin tone, its scars and medical history, its accessibility equipment, its uniform design and rank insignia, its department, and its command authority never change between members.
- The rig, proportions, and equipment are identical across all four members, because the body never transforms.
- Personal identifiers such as name tape, badge, wrist display, communicator profile, terminal displays, and command login update automatically as ordinary ship operations when a member fronts, and any depiction of these updates is treated as routine rather than ceremony.

### Changing Presentation Standards for the Vale System

- Posture, resting stance, standing stance, gait rhythm, and preferred stance change with the fronting member and are authored distinctly for each.
- Breathing pattern, facial expression, eye focus, head position, hand placement, and gesture vocabulary change with the fronting member.
- Leadership philosophy, decision-making style, professional priorities, emotional expression, and sense of humour change with the fronting member and are reflected in how the body moves and holds itself.

### Fronting Recognition Through Animation

- A change in fronting is almost never announced, so animation must carry it through a shift in posture, gait, gesture, and stance, supported by voice and audio.
- The transition between members is authored so the player perceives a change in the person without the body transforming, and recognition emerges through observation rather than exposition.
- The four members' movement signatures must be distinct enough that a practiced player recognises the current member before they speak.

### Member Movement Signatures for the Vale System

- Elian meets ordinary mornings and community leadership and should move with an approachable, community-facing ease, in keeping with genderfluid presentation whose specifics follow Elian's current identity.
- Naomi meets emergencies, operations, and coordination and should move with decisive, efficient, operational energy.
- Gideon meets strategy, navigation, and failing systems and should move with a measured, analytical, reading-the-situation stillness and precision.
- Iris meets civilian planning and diplomacy and should move with a steadying, attentive, people-centred warmth.

### Vale System Audio and Tactile Standards

- Voice, accent, vocabulary, breathing, and speech rhythm change with the fronting member and are among the strongest audio recognition cues, delivered through the dialogue channel.
- Movement audio such as footstep cadence follows the fronting member's gait, so the body sounds different depending on who is present, while remaining one body.
- Tactile approach cues for the Vale System carry the fronting member's cadence and energy so a practiced DeafBlind player can begin to recognise the current member through movement rhythm.

## Special Animation Cases

Some presentation needs fall outside ordinary human locomotion and gesture and are handled here so they are not forced into inappropriate standards.

### Animation for Faience

- Faience is a Shawabti artificial intelligence and has no human body during Operation One, so Faience has no human idle, gait, or gesture set in that period.
- Faience is silent through Operation One and first stirs, wordless, in a damaged pod on Attack Day, and any animation of that first stirring is authored as minimal, non-verbal motion rather than human performance.
- Faience stands outside human concepts of race, ethnicity, and gender, so no human gender presentation is expressed through Faience's animation.
- Presence and expression for Faience are carried primarily through environment, light, and authored audio and tactile cues rather than through a humanoid performance, and any future embodiment is defined in coordination with the writing team rather than assumed here.

### Animation for Mira Ives and Gender Expression

- Mira Ives is a genderfluid child using she and they, and her gender expression is treated with a light, respectful, non-fixed touch that leaves room for development as the character grows.
- Mira's animation should express her as a whole child, defined first by personality, curiosity, and her attentive ear for the ship, with gender expression as one natural aspect rather than the focus of her movement.

### Animation and Cultural Specificity for Talia Rusk

- Talia Rusk is the Two-Spirit character, and her nation, culture, and community are deliberately undeveloped and to be developed with Indigenous cultural consultation.
- Until that development happens, Talia's animation uses personal, universal movement and never invents culturally specific gesture, dance, ceremony, or posture.
- Talia's prosthetic limb is animated as fully integrated into her skilled, protective movement, as standard equipment rather than a limitation.

## Animation Review and Acceptance

Every animation is reviewed against the same criteria before it is accepted, so that recognition, accessibility, and character truth are verified rather than assumed. This review complements the technical and representation review standards found elsewhere in this bible.

### Animation Acceptance Criteria

- The animation preserves the character's movement signature and supports recognition without interface labels.
- The animation ships with an authored audio equivalent that carries the same information as the motion.
- The animation ships with a tactile equivalent wherever it carries gameplay-relevant or safety-relevant information.
- The animation portrays disability, gender, and culture in line with the Canon Rules and the Character Identity Map, with dignity and without tokenism.
- Vale System animations keep the body constant while changing presentation, and never depict four separate people or a single Captain Mara Vale.

### Animation Consistency Checks

- The animation matches the character's established cadence, posture, and gesture vocabulary from prior chapters, allowing for authored change through fatigue, injury, recovery, and growth.
- The audio and visual timing match exactly so all players receive the same information at the same moment.
- The tactile cue uses the established tactile language and does not introduce a competing vocabulary.
- Any cultural or gender content that is undeveloped in canon has been kept open rather than invented, consistent with the open development items in the Character Identity Map.
