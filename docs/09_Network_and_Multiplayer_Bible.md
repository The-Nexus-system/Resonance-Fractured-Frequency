# Network and Multiplayer Bible

This document defines how players play together, how the world persists around them, and how their data synchronizes across devices. Multiplayer in Resonance is built on cooperation and difference, and on a world that keeps living whether or not any one player is present.

## Cooperative design

Different professions cooperate. Different knowledge matters. Players succeed because they think differently, not because they play identically. A team benefits from combining perspectives, because each profession perceives the same events through a different lens.

## Accessibility is individual

Accessibility preferences remain individual to each player. One player's accessibility settings must never alter another player's experience. Two players in the same session may experience the same moment through entirely different output methods, and both experiences are equally valid.

## Timers and fairness

Action timers are removed for a player who selects no auditory input, unless a timer is genuinely required by multiplayer. Multiplayer timing must be designed so that accessibility accommodations do not create an unfair disadvantage.

## Synchronization

The player's archive belongs to the player. Data is handled in a local-first way.

- Local-first saves are the default.
- Optional encrypted cloud synchronization is available.
- Optional cross-platform synchronization is available.

Cloud and cross-platform synchronization are always opt-in. Privacy is one of the themes the project explores, and the sync design must reflect that respect for the player's data.

## World persistence

The world never pauses because a player disconnects or logs out. A returning player comes back to a living civilization rather than a frozen save state. While a player is away, construction and community projects continue, research continues and may conclude, gardens grow, maintenance and medical care carry on, children attend school, community meetings happen, and other residents live their ordinary days.

The world, not the player, hosts the game. The persistent entities are the stations, settlements, expeditions, communities, research missions, and recovery efforts, and they continue existing when any individual player leaves. A player who enters a world joins an existing civilization rather than opening a lobby or creating one, so residents already know one another, projects are already underway, and research is already progressing.

Every persistent world accumulates its own history, infrastructure, community Knowledge Archive, rescued crew, community projects, accessibility improvements, engineering upgrades, memorials, and culture. Players contribute to that history and leave it richer, but never own it. This community Knowledge Archive is the world's shared record and is distinct from a player's personal archive, which remains the player's own as described under synchronization.

## Protected personal spaces

Certain locations are designated Protected Personal Spaces, including crew quarters, family apartments, assigned private cabins, long-term patient recovery rooms, and other creator-designated personal spaces.

When a player logs out from a Protected Personal Space, the character is considered safely off duty. The world continues normally around them, time passes, other residents continue living, and projects continue progressing, while the absent character is never harmed, moved, injured, assigned new duties, or placed into danger. The character is treated as resting, sleeping, or otherwise unavailable.

## Unsafe logouts

If a player disconnects outside a Protected Personal Space, the game acts to protect the character while preserving player agency and world continuity. It follows a clear order of priority.

- Reach a nearby Protected Personal Space.
- Escort the character to safety.
- Transfer responsibility for the character to trusted characters in the world.
- If immediate evacuation is impossible, place the character into an artificial-intelligence-controlled emergency safety routine.

## Safe return

When a player returns, the game gives them a summary of the meaningful events that occurred during their absence, so that returning feels like rejoining a community that missed them rather than reopening a paused game. Such a summary may include crew rescued, research completed, construction finished, medical recoveries, community meetings, station announcements, Knowledge Archive updates, mission invitations, and messages left for them by other members of the community.

## Community responsibility

No player is ever punished for logging out. Communities naturally adapt when members are unavailable, so other members temporarily redistribute responsibilities, other players may assist, and work continues in the meantime. The returning player always has meaningful ways to contribute rather than feeling left behind.

## Logging out during an emergency

If a player logs out during an active emergency, the game makes every reasonable effort to preserve both narrative continuity and the character's safety. Whenever possible, trusted characters escort the character to safety, the character withdraws from immediate danger, and the character is considered unavailable until the player returns.

Only when absolutely necessary should the game record that the character took part in emergency actions while offline, and any such actions are limited to realistic defensive or evacuation behavior rather than major story decisions. A player's absence must never become the cause of catastrophic failure for the community.

## Future work

Detailed netcode, matchmaking, session structure, and server architecture are not yet decided. Open questions related to multiplayer are tracked in Open Questions until they are resolved and recorded here.
