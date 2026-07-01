# Open Questions

This document tracks decisions that have not yet been made. When a question is resolved, move the decision into the relevant living document and record it in the Decision Log, then remove or mark the question here. This keeps uncertainty visible without letting it block the documented canon.

## Technology and architecture

- What technology will the long-term shared codebase use to deliver true native mobile applications alongside desktop and web from one source? The current web prototype uses React, Vite, and TypeScript, but the shared-codebase choice is not yet decided.
- When will the web prototype move from `artifacts/resonance` to `apps/web`, and what specifically counts as "the shared architecture is established"? The target layout (`apps/web`, `apps/ios`, `apps/android`, with `artifacts/` reserved for generated outputs) is decided, but the migration timing and steps are not.

## Multiplayer and networking

- What specific netcode, matchmaking, and session-tier implementation will realise the authoritative, world-centred network model defined in the Network and Multiplayer Bible?
- How are timers handled fairly when some players have removed action timers for accessibility?

## Audio

- What audio engine and spatial-audio approach will be used across native and web targets?
- How is perspective audio authored and maintained so the same event can be mixed differently per profession without duplicating content?

## Accessibility

- What braille display protocols and hardware will be supported first?
- How will tactile music patterns be defined and authored?

## Story and content

- What are the detailed beats of chapters two through seven of Operation Exodus?
- Which professions are prioritised first for full content, and which ship later?

## Data and privacy

- What is the encryption and privacy model for optional cloud synchronisation?
- How is a player's archive exported, transferred, or deleted on request?

## Items awaiting more input

The team has indicated more design material is coming. New open questions will be added here as that material arrives.
