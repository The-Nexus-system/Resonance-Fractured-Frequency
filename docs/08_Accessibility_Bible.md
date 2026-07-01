# Accessibility Bible

This document is the foundation of Resonance. Accessibility is not a feature; it is the ground the game is built on. No design in any other document may violate this one.

## Accessibility first

Accessibility is the foundation of Resonance. Every gameplay mechanic must be playable through multiple input and output methods. No player should ever be locked out of the game because of disability.

Accessibility options are independent. Players may combine any options they wish. One option never disables another.

## Configuration by experience, not diagnosis

Accessibility is configured based on experience rather than diagnosis. The game never asks whether a player has a condition; it asks how they want to interact with the world. This keeps the setup respectful and future-proof, because a player might wear hearing aids one day, cochlear implant processors another day, or use no auditory input at all.

## Initial accessibility interview

Faience begins by learning how the player experiences the world. The player may change any of these choices at any time. Faience learns preferences over time but never locks the player into a profile.

### How would you like me to communicate with you?

- Speech
- Captions
- Braille
- Speech and Captions
- Speech and Braille
- Captions and Braille
- Speech, Captions, and Braille

### How do you hear the world today?

- Hearing aids
- Cochlear implants
- Open-ear headphones
- Bone-conduction headphones
- Earbuds
- Speakers
- No auditory input
- Other

### How do you move?

- Walking
- Running
- Manual wheelchair
- Power wheelchair
- White cane
- Guide dog
- Mixed mobility
- Stationary play
- Other

## DeafBlind gameplay

DeafBlind play is a first-class, supported way to experience Resonance, configured by experience rather than diagnosis. Players may freely combine any output method, any listening method, and any movement method from the initial accessibility interview.

If the player selects no auditory input, the game immediately does the following.

- Captions are automatically enabled.
- Braille display support is enabled if available.
- Timed actions are removed or greatly extended in single-player.
- Spoken urgency is replaced with tactile patterns, captions, and visual indicators.

Important information must never depend on sound alone.

## Accessible input

Every important action must support multiple activation methods. Examples include the following.

- Double tap
- Shake device
- iOS Back Tap
- Android Quick Tap, when available
- Custom gesture
- External switch device
- Game controller
- Keyboard
- Braille display commands
- Voice commands, where appropriate

Players may bind any gameplay action to any supported input. Examples of bindable actions include the following.

- Fire
- Interact
- Retrieve object
- Scan
- Reload
- Repeat Faience
- Pause
- Accessibility menu

No action should ever depend upon one mandatory gesture.

## Tactile language

Haptics are an intentional, authored communication channel. Do not simply convert music into vibration. Instead, design a deliberate tactile language that communicates specific meaning.

The tactile language communicates information such as the following.

- Direction
- Threat
- Distance
- Object proximity
- AI urgency
- Environmental hazards
- Navigation
- Success
- Failure

Music may influence tactile patterns, but haptics are designed as an independent communication channel, not a byproduct of the soundtrack.

## Reality-integrated navigation

Reality-integrated navigation is a core gameplay mechanic, not merely an accessibility feature. It lets the player move through the real world safely while the game world is rendered around them.

The mechanic includes the following elements.

- Real-world orientation always overrides immersion.
- Faience maintains two separate models: the real world and the game world.
- Environmental transformation turns real surroundings into the game world, for example a sidewalk into a corridor, gravel into wreckage, a park into an alien forest, or a doorway into an airlock. The full catalogue lives in the Systems Bible.
- Terrain-based discovery lets real-world changes trigger in-game discoveries. The full catalogue lives in the Systems Bible.
- Reality announcements smoothly fade in and out, lowering game volume when navigation matters and letting immersion return afterward.
- Navigation announcements are replayable instantly through any assigned input.
- Environmental audio profiles remember preferred settings for real-world environments such as home, a busy city, a quiet neighbourhood, a museum, a forest, an airport, a hospital, a convention, public transport, and night travel.
- Accessibility learning lets Faience adapt to the player's preferences over time without ever locking them into a fixed profile.
- A safety override always prioritises the player's real-world safety over immersion.
- Real-world movement is optional and always has a stationary alternative.

Supported movement methods include walking, running, manual wheelchair, power wheelchair, white cane, guide dog, mixed mobility, stationary play, and other. Every movement mechanic must have a stationary alternative so no player is excluded because of disability. Faience's orientation layer, which drives these announcements, is described in the AI Bible.

## Independent volume channels

The player controls separate volume levels for each of the following.

- Faience
- Navigation
- Dialogue
- Combat
- Music
- Environmental ambience
- Accessibility prompts
- Reality announcements

For the definitive rules on sound, music, and acoustic identity, see the Audio Bible in docs/07_Audio_Bible.md.

## Accessibility in multiplayer

Accessibility preferences remain individual to each player. One player's accessibility settings must never alter another player's experience. See the Network and Multiplayer Bible for details.
