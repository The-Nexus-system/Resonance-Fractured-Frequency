/**
 * The First Fracture — explorable chapter definition (Phase 4 vertical slice).
 *
 * Builds a spatial world for the existing First Fracture campaign and links
 * each resonator object to one of the four ESTABLISHED puzzle nodes in
 * lib/campaigns.ts. Puzzle narrative, choices, and answers are used verbatim
 * and are NOT redefined here.
 *
 * All environmental text in this file is noncanonical technical-demo
 * content, recorded in docs/design_notes/first_fracture_expansion_log.md.
 * It deliberately avoids canon characters, factions, and events.
 */

import type { SpatialWorld, WorldObject } from './world';
import type { EncounterScore } from '../music/theory';

export type FfRole = 'resonator' | 'fragment' | 'inspect' | 'hidden';

export type FfObjectMeta = {
  role: FfRole;
  /** For resonators: the campaign node whose puzzle attunes it. */
  nodeId?: string;
  /** Reward granted on collect/discover/inspect, if any. */
  rewardId?: string;
  /** Plain text shown when the player inspects the object. */
  inspectText: string;
  /** Optional replacement text once the linked resonator group is restored. */
  postRestoreText?: string;
  /** Hidden objects only appear after this many resonators are attuned. */
  revealAfterAttuned?: number;
};

/** Musical score: the four resonators form an F-major harmony when restored. */
export const FIRST_FRACTURE_SCORE: EncounterScore = {
  root: 'F',
  resolvedPlain: 'a full, settled harmony — the beacon sounds whole',
  voices: [
    { objectId: 'resonator-1', note: 'F', octave: 3, timbre: 'drone', plainIdentity: 'a low, warm tone' },
    { objectId: 'resonator-2', note: 'A', octave: 3, timbre: 'chime', plainIdentity: 'a mellow, ringing tone' },
    { objectId: 'resonator-3', note: 'C', octave: 4, timbre: 'pulse', plainIdentity: 'a steady, rhythmic tone' },
    { objectId: 'resonator-4', note: 'F', octave: 4, timbre: 'shimmer', plainIdentity: 'a bright, glassy tone' },
  ],
};

export const FF_META: Record<string, FfObjectMeta> = {
  'resonator-1': {
    role: 'resonator',
    nodeId: 'node-1',
    inspectText:
      'The anchor resonator. Its casing vibrates unevenly, like a hum trying to find its footing.',
    postRestoreText: 'The anchor resonator rests at a low, even hum. The casing is still.',
  },
  'resonator-2': {
    role: 'resonator',
    nodeId: 'node-2',
    inspectText:
      'The channel resonator. Air moves through its open lattice in irregular gusts.',
    postRestoreText: 'The channel resonator breathes evenly now, a soft continuous draw of air.',
  },
  'resonator-3': {
    role: 'resonator',
    nodeId: 'node-3',
    inspectText:
      'The pulse resonator. Its beat stutters — two rhythms fighting over the same drum.',
    postRestoreText: 'The pulse resonator keeps one clean beat, patient as a heartbeat.',
  },
  'resonator-4': {
    role: 'resonator',
    nodeId: 'node-4',
    inspectText:
      'The crown resonator, mounted high. Its overtones splinter off in every direction.',
    postRestoreText: 'The crown resonator rings clear overhead, its overtones gathered into one voice.',
  },
  'fragment-a': {
    role: 'fragment',
    rewardId: 'ff-fragment-a',
    inspectText: 'An echo fragment: a splinter of stored resonance, still humming faintly.',
  },
  'fragment-b': {
    role: 'fragment',
    rewardId: 'ff-fragment-b',
    inspectText: 'An echo fragment: a splinter of stored resonance, cool to the touch.',
  },
  'fragment-c': {
    role: 'fragment',
    rewardId: 'ff-fragment-c',
    inspectText: 'An echo fragment: a splinter of stored resonance, its pattern almost legible.',
  },
  'inspect-1': {
    role: 'inspect',
    inspectText:
      'A survey pylon. Field markings chart the fracture boundary — the damage is mapped, not mysterious.',
    postRestoreText:
      'A survey pylon. Someone will need to update its markings: the fracture boundary has closed.',
  },
  'inspect-2': {
    role: 'inspect',
    inspectText:
      'A calibration array. Its reference tines are meant to sound together; right now each rings alone.',
    postRestoreText: 'A calibration array. Its reference tines ring together again.',
  },
  'hidden-1': {
    role: 'hidden',
    rewardId: 'ff-hidden-1',
    revealAfterAttuned: 2,
    inspectText:
      'A quiet hollow. The fracture noise falls away here, and what remains of the beacon sounds closer.',
  },
  'hidden-2': {
    role: 'hidden',
    rewardId: 'ff-hidden-2',
    revealAfterAttuned: 4,
    inspectText:
      'A low ridge where every resonator is audible at once — the whole restored harmony in one place.',
  },
};

function obj(
  id: string,
  label: string,
  kind: WorldObject['kind'],
  x: number,
  y: number,
  z: number,
  options: Partial<Pick<WorldObject, 'discovered' | 'interactable' | 'interactRange' | 'state'>> = {},
): WorldObject {
  return {
    id,
    kind,
    label,
    position: { x, y, z },
    state: options.state ?? 'dormant',
    discovered: options.discovered ?? false,
    interactable: options.interactable ?? true,
    interactRange: options.interactRange ?? 3,
  };
}

/**
 * Fresh chapter world. Positions (metres, x east / y north) are spread so a
 * first playthrough must genuinely explore: only the anchor resonator is
 * known at the start.
 */
export function createFirstFractureWorld(): SpatialWorld {
  return {
    player: { position: { x: 0, y: 0, z: 0 }, headingDeg: 0 },
    objects: [
      obj('resonator-1', 'the anchor resonator', 'pillar', 0, 6, 0, { discovered: true, state: 'resonating' }),
      obj('resonator-2', 'the channel resonator', 'pillar', 12, 4, 0, { state: 'resonating' }),
      obj('resonator-3', 'the pulse resonator', 'pillar', 7, -13, 0, { state: 'resonating' }),
      obj('resonator-4', 'the crown resonator', 'pillar', -14, -3, 2.5, { state: 'resonating' }),
      obj('fragment-a', 'an echo fragment', 'signal', 17, 12, 0, { interactRange: 2.5 }),
      obj('fragment-b', 'an echo fragment', 'signal', -8, 15, 0, { interactRange: 2.5 }),
      obj('fragment-c', 'an echo fragment', 'signal', -18, -14, 0, { interactRange: 2.5 }),
      obj('inspect-1', 'a survey pylon', 'landmark', 4, 2, 0),
      obj('inspect-2', 'a calibration array', 'landmark', -5, -5, 0),
      obj('hidden-1', 'a quiet hollow', 'fracture', 19, -6, 0, { interactRange: 3.5 }),
      obj('hidden-2', 'an overtone ridge', 'fracture', -3, 20, 1.5, { interactRange: 3.5 }),
    ],
  };
}

/** Node order used to map saved attunement back onto campaign progress. */
export const FF_RESONATOR_IDS = ['resonator-1', 'resonator-2', 'resonator-3', 'resonator-4'] as const;

export const FF_INSPECT_IDS = ['inspect-1', 'inspect-2'] as const;
export const FF_FRAGMENT_IDS = ['fragment-a', 'fragment-b', 'fragment-c'] as const;

/**
 * Whitelist a persisted explore state against the chapter's real object IDs.
 * Unknown IDs are dropped, and hidden visits without their attunement
 * prerequisite are rejected, so a corrupt or hand-edited save can never
 * bypass progression or reveal gated content.
 */
export function sanitizeFirstFractureExplore(raw: {
  attuned: string[];
  collected: string[];
  inspected: string[];
  visitedHidden: string[];
}): { attuned: string[]; collected: string[]; inspected: string[]; visitedHidden: string[] } {
  const attuned = FF_RESONATOR_IDS.filter((id) => raw.attuned.includes(id));
  const collected = FF_FRAGMENT_IDS.filter((id) => raw.collected.includes(id));
  const inspected = FF_INSPECT_IDS.filter((id) => raw.inspected.includes(id));
  const visitedHidden = Object.entries(FF_META)
    .filter(
      ([id, meta]) =>
        meta.role === 'hidden' &&
        raw.visitedHidden.includes(id) &&
        attuned.length >= (meta.revealAfterAttuned ?? 0),
    )
    .map(([id]) => id);
  return { attuned: [...attuned], collected: [...collected], inspected: [...inspected], visitedHidden };
}
