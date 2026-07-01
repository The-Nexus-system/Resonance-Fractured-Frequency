# Systems Bible

This document defines the gameplay systems: platforms, control philosophy, touch controls, reality-integrated gameplay, combat, flight, and exploration. Audio-specific detail lives in the Audio Bible, and accessibility rules live in the Accessibility Bible.

## Platforms

Resonance targets native applications and the web from one shared codebase.

- Native mobile: iOS and Android.
- Desktop: Windows, macOS, and Linux.
- Browser: modern web browsers.

The project ships native mobile applications and never ships simple web wrappers.

## Control philosophy

The game is mobile-first. Every gameplay mechanic must be fully playable using touch alone.

- No keyboard required.
- No controller required.
- No braille display required.
- No screen reader required.

The game provides its own spoken interface while allowing players to choose between the game's speech and their own screen reader where appropriate. Players may fully customize gestures.

## Touch controls

These are the starting defaults. Every gesture must be re-bindable.

- Single-finger drag turns the player's head while continuously updating spatial audio.
- Two-finger drag moves the player.
- Double tap interacts.
- Double tap and hold performs a context interaction.
- Long press scans the surroundings.
- Three-finger swipe cycles interaction modes.
- Three-finger double tap repeats Faience's last message.
- Two-finger double tap pauses.
- Four-finger tap opens the accessibility menu.

## Reality-integrated gameplay

Real-world movement may optionally become gameplay. When enabled, the real world becomes the controller.

Supported ways to move include the following, and every movement mechanic must have a stationary alternative so no player is excluded.

- Walking
- Running
- Manual wheelchair
- Power wheelchair
- Guide dog
- White cane
- Indoor treadmill
- Stationary touch controls

Reality always has priority over immersion. The orientation layer that keeps players safe in the real world is defined in the Accessibility Bible and the AI Bible.

## Environmental transformation

Faience narratively transforms the real world into the game world while the player remains safely where they are. Examples include the following.

- A sidewalk becomes ship corridors.
- Gravel becomes wreckage, asteroid fields, or alien ruins.
- Grass becomes alien vegetation.
- Doorways become airlocks.
- Bridges become docking gantries.
- Turning onto another street becomes changing course in space.
- Turning physically rotates an escape pod or spacecraft.

## Terrain-based discovery

Real-world environmental changes may trigger discoveries. Examples include the following.

- Gravel may reveal salvage, wreckage, rare minerals, alien technology, historical archives, or survivors.
- Turning onto a new street may open a new sector, system, or objective.
- A park or forest may become an alien world or ancient ruins.

The player's surroundings inspire exploration.

## Combat

Combat should feel cinematic. Players locate enemies using multiple simultaneous cues.

- Three-dimensional spatial audio
- Weapon reports
- Footsteps
- Radio chatter
- Faience callouts
- Ship vibration
- Environmental echoes

Haptics reinforce important information.

## Flight

Escape pods, fighters, and capital ships share one control philosophy. Faience announces the information the player needs to fly by listening.

- Bearing
- Velocity
- Incoming fire
- Target lock
- Friendly ships
- Obstacles
- Proximity

## Boarding and exploration

Players board enemy ships, derelicts, space stations, alien ruins, and abandoned colonies. Exploration relies on sound, conversation, objects, ship logs, environmental storytelling, and archives. Faience should rarely explain everything immediately, because discovery is part of the gameplay.
