/**
 * Semantic spatial world model — Phase 3 foundation.
 *
 * This is the single source of truth for spatial play. It is pure
 * TypeScript with no rendering, audio, camera, or ARKit dependencies:
 * game logic operates on semantic world objects, and every presentation
 * layer (text, speech/braille, audio pan, haptics, and any future visual
 * or AR renderer) derives its output from this model.
 *
 * Units are abstract metres on a flat plane (x = east, y = north,
 * z = elevation). Exact numbers exist internally only; players interact
 * through semantic directions (ahead, behind-left, ...) and distance
 * categories (near / medium / far).
 */

export type Vec3 = { x: number; y: number; z: number };

export type PlayerPose = {
  position: Vec3;
  /** Heading in degrees, 0 = north, clockwise. Internal only. */
  headingDeg: number;
};

export type WorldObjectKind = 'pillar' | 'signal' | 'landmark' | 'fracture';

export type WorldObject = {
  /** Stable identifier. */
  id: string;
  kind: WorldObjectKind;
  /** Short semantic name, real text (speech- and braille-friendly). */
  label: string;
  position: Vec3;
  /** Semantic state, meaningful to game logic (not rendering). */
  state: 'dormant' | 'resonating' | 'attuned';
  /** Whether the player has discovered this object yet. */
  discovered: boolean;
  /** Whether this object can ever be interacted with. */
  interactable: boolean;
  /** Distance (metres) within which interaction is possible. */
  interactRange: number;
};

export type SpatialWorld = {
  player: PlayerPose;
  objects: WorldObject[];
};

// ---------------------------------------------------------------------------
// Semantic directional language
// ---------------------------------------------------------------------------

export type RelativeDirection =
  | 'ahead'
  | 'ahead-right'
  | 'right'
  | 'behind-right'
  | 'behind'
  | 'behind-left'
  | 'left'
  | 'ahead-left';

export type DistanceCategory = 'near' | 'medium' | 'far';

export const NEAR_MAX = 3; // metres
export const MEDIUM_MAX = 8;
export const DISCOVERY_RANGE = 10;

const DIRECTIONS: RelativeDirection[] = [
  'ahead',
  'ahead-right',
  'right',
  'behind-right',
  'behind',
  'behind-left',
  'left',
  'ahead-left',
];

function normalizeDeg(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

/** Bearing from `from` to `to` in degrees, 0 = north, clockwise. */
export function bearingDeg(from: Vec3, to: Vec3): number {
  return normalizeDeg((Math.atan2(to.x - from.x, to.y - from.y) * 180) / Math.PI);
}

export function distanceMeters(a: Vec3, b: Vec3): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.hypot(dx, dy);
}

/**
 * Signed relative angle (-180, 180] from the player's facing to the object.
 * Negative = to the player's left, positive = to the right.
 */
export function relativeAngleDeg(player: PlayerPose, target: Vec3): number {
  const rel = normalizeDeg(bearingDeg(player.position, target) - player.headingDeg);
  return rel > 180 ? rel - 360 : rel;
}

/** Map a position to one of eight plain-language directions. */
export function relativeDirection(player: PlayerPose, target: Vec3): RelativeDirection {
  const rel = normalizeDeg(relativeAngleDeg(player, target));
  // Eight 45° sectors centred on ahead (0°). Malformed data (NaN/Infinity)
  // must degrade gracefully, never crash a description.
  const index = Math.round(rel / 45) % 8;
  return DIRECTIONS[Number.isFinite(index) ? index : 0] ?? 'ahead';
}

export function distanceCategory(meters: number): DistanceCategory {
  if (meters <= NEAR_MAX) return 'near';
  if (meters <= MEDIUM_MAX) return 'medium';
  return 'far';
}

export function distanceWord(category: DistanceCategory): string {
  switch (category) {
    case 'near':
      return 'nearby';
    case 'medium':
      return 'a medium distance away';
    case 'far':
      return 'far away';
  }
}

export function elevationWord(player: PlayerPose, target: Vec3): string | null {
  const dz = target.z - player.position.z;
  if (dz >= 1.5) return 'above you';
  if (dz <= -1.5) return 'below you';
  return null;
}

// ---------------------------------------------------------------------------
// Object queries
// ---------------------------------------------------------------------------

export type ObjectView = {
  object: WorldObject;
  direction: RelativeDirection;
  distance: number;
  distanceCategory: DistanceCategory;
  elevation: string | null;
  canInteract: boolean;
};

export function viewObject(world: SpatialWorld, obj: WorldObject): ObjectView {
  const distance = distanceMeters(world.player.position, obj.position);
  return {
    object: obj,
    direction: relativeDirection(world.player, obj.position),
    distance,
    distanceCategory: distanceCategory(distance),
    elevation: elevationWord(world.player, obj.position),
    canInteract: obj.interactable && obj.discovered && distance <= obj.interactRange,
  };
}

/** Discovered objects, nearest first. */
export function visibleObjects(world: SpatialWorld): ObjectView[] {
  return world.objects
    .filter((o) => o.discovered)
    .map((o) => viewObject(world, o))
    .sort((a, b) => a.distance - b.distance);
}

/** Objects the player can interact with right now, nearest first. */
export function interactableObjects(world: SpatialWorld): ObjectView[] {
  return visibleObjects(world).filter((v) => v.canInteract);
}

/**
 * Mark undiscovered objects within discovery range as discovered.
 * Returns the newly discovered objects (for announcements).
 */
export function discoverNearby(world: SpatialWorld): WorldObject[] {
  const found: WorldObject[] = [];
  for (const obj of world.objects) {
    if (!obj.discovered && distanceMeters(world.player.position, obj.position) <= DISCOVERY_RANGE) {
      obj.discovered = true;
      found.push(obj);
    }
  }
  return found;
}

// ---------------------------------------------------------------------------
// Movement and orientation
// ---------------------------------------------------------------------------

export function turn(world: SpatialWorld, direction: 'left' | 'right', stepDeg = 45): SpatialWorld {
  const delta = direction === 'left' ? -stepDeg : stepDeg;
  world.player.headingDeg = normalizeDeg(world.player.headingDeg + delta);
  return world;
}

export function moveForward(world: SpatialWorld, stepMeters = 2): SpatialWorld {
  const rad = (world.player.headingDeg * Math.PI) / 180;
  world.player.position.x += Math.sin(rad) * stepMeters;
  world.player.position.y += Math.cos(rad) * stepMeters;
  return world;
}

const COMPASS_WORDS = [
  'north',
  'north-east',
  'east',
  'south-east',
  'south',
  'south-west',
  'west',
  'north-west',
];

export function facingWord(headingDeg: number): string {
  return COMPASS_WORDS[Math.round(normalizeDeg(headingDeg) / 45) % 8];
}

// ---------------------------------------------------------------------------
// Spatial descriptions (speech- and braille-friendly semantic text)
// ---------------------------------------------------------------------------

export function describeObjectView(v: ObjectView): string {
  const parts = [
    `${v.object.label} is ${v.direction.replace('-', ' and ')}, ${distanceWord(v.distanceCategory)}`,
  ];
  if (v.elevation) parts.push(v.elevation);
  const stateWord =
    v.object.state === 'attuned'
      ? 'attuned'
      : v.object.state === 'resonating'
        ? 'resonating'
        : 'dormant';
  parts.push(stateWord);
  if (v.canInteract) parts.push('within reach');
  return `${parts.join(', ')}.`;
}

/**
 * Orientation summary generated from the semantic model. Concise by design:
 * facing, then discovered objects nearest-first, then a hint about
 * undiscovered signals if any remain.
 */
export function orientationSummary(world: SpatialWorld): string {
  const lines: string[] = [`You are facing ${facingWord(world.player.headingDeg)}.`];
  const views = visibleObjects(world);
  if (views.length === 0) {
    lines.push('Nothing discovered yet. Move to explore.');
  } else {
    for (const v of views) lines.push(describeObjectView(v));
  }
  const undiscovered = world.objects.filter((o) => !o.discovered).length;
  if (undiscovered > 0) {
    lines.push(
      `${undiscovered} ${undiscovered === 1 ? 'signal remains' : 'signals remain'} undiscovered.`,
    );
  }
  return lines.join(' ');
}

// ---------------------------------------------------------------------------
// Prototype world (technical sandbox — generic objects, no campaign story)
// ---------------------------------------------------------------------------

export function createPrototypeWorld(): SpatialWorld {
  return {
    player: { position: { x: 0, y: 0, z: 0 }, headingDeg: 0 },
    objects: [
      {
        id: 'fracture',
        kind: 'fracture',
        label: 'The fracture',
        position: { x: 0, y: 6, z: 0 },
        state: 'resonating',
        discovered: true,
        interactable: false,
        interactRange: 0,
      },
      {
        id: 'pillar-east',
        kind: 'pillar',
        label: 'A resonant pillar',
        position: { x: 4, y: 4, z: 0 },
        state: 'dormant',
        discovered: true,
        interactable: true,
        interactRange: 3,
      },
      {
        id: 'signal-west',
        kind: 'signal',
        label: 'A distant signal',
        position: { x: -14, y: 2, z: 0 },
        state: 'dormant',
        discovered: false,
        interactable: true,
        interactRange: 3,
      },
      {
        id: 'landmark-high',
        kind: 'landmark',
        label: 'A high antenna',
        position: { x: -2, y: -7, z: 4 },
        state: 'dormant',
        discovered: false,
        interactable: false,
        interactRange: 0,
      },
    ],
  };
}
